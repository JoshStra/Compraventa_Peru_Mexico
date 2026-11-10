import fs from "node:fs";
import { parseEnv } from "node:util";
import { execFileSync } from "node:child_process";

// Read-only, bounded source inventory. Findings contain locations, never values.
const git = (args, options = {}) =>
  execFileSync("git", args, { maxBuffer: 20_000_000, ...options });
const known = [];
const privateFiles = [
  ".env",
  "backend/.env",
  "backend/.data/deployment/production.env",
  "backend/.data/deployment/neon-production.env",
];
const configuration = [];
for (const file of privateFiles) {
  if (!fs.existsSync(file)) continue;
  const values = parseEnv(fs.readFileSync(file, "utf8"));
  const metadata = { file, keys: Object.keys(values).sort() };
  if (values.DATABASE_URL) {
    try {
      const url = new URL(values.DATABASE_URL);
      metadata.database = {
        role: url.username,
        local: ["127.0.0.1", "localhost"].includes(url.hostname),
        sslmode: url.searchParams.get("sslmode"),
        channelBinding: url.searchParams.get("channel_binding"),
      };
      if (url.password.length >= 16)
        known.push({
          key: "DATABASE_PASSWORD",
          value: decodeURIComponent(url.password),
        });
    } catch {
      metadata.database = { parseError: true };
    }
  }
  if (values.S3_ENDPOINT)
    metadata.s3HTTPS = values.S3_ENDPOINT.startsWith("https://");
  configuration.push(metadata);
  for (const [key, value] of Object.entries(values))
    if (
      /SECRET|PASSWORD|ACCESS_KEY|DATABASE_URL/.test(key) &&
      value.length >= 16
    )
      known.push({ key, value });
}
const patterns = [
  ["private_key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  [
    "github_token",
    /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{70,})\b/,
  ],
  ["aws_key", /\bAKIA[A-Z0-9]{16}\b/],
  ["neon_password", /\bnpg_[A-Za-z0-9]{12,}\b/],
  ["resend_key", /\bre_[A-Za-z0-9_]{24,}\b/],
];
const matches = [];
function scan(buffer, location) {
  if (buffer.includes(0) || buffer.length > 3_000_000) return false;
  const source = buffer.toString();
  for (const { key, value } of known)
    if (source.includes(value)) matches.push({ ...location, key });
  for (const [key, pattern] of patterns)
    if (pattern.test(source)) matches.push({ ...location, key });
  return true;
}
const files = git([
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
  "-z",
])
  .toString()
  .split("\0")
  .filter(Boolean);
let textFiles = 0;
for (const file of files)
  if (scan(fs.readFileSync(file), { file })) textFiles++;
const currentMatches = matches.splice(0);
let bundledTextFiles = 0;
function scanBundle(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) scanBundle(file);
    else if (scan(fs.readFileSync(file), { file })) bundledTextFiles++;
  }
}
scanBundle("frontend/dist");
const bundleMatches = matches.splice(0);
const revisions = git(["rev-list", "--objects", "--all"]).toString().trim();
const objects = revisions
  ? revisions
      .split("\n")
      .map((line) => ({ oid: line.slice(0, 40), path: line.slice(41) }))
  : [];
const metadata = objects.length
  ? git(
      ["cat-file", "--batch-check=%(objectname) %(objecttype) %(objectsize)"],
      { input: objects.map((o) => o.oid).join("\n") + "\n" },
    )
      .toString()
      .trim()
      .split("\n")
  : [];
let historyTextBlobs = 0;
let batchObjects = [],
  batchBytes = 0;
function scanHistoryBatch() {
  if (!batchObjects.length) return;
  const batch = git(["cat-file", "--batch"], {
    input: batchObjects.map((o) => o.oid).join("\n") + "\n",
  });
  let offset = 0;
  for (const object of batchObjects) {
    const end = batch.indexOf(10, offset);
    if (end < 0) throw new Error("INVALID_GIT_BATCH");
    const [oid, type, size] = batch.toString("ascii", offset, end).split(" ");
    if (oid !== object.oid || type !== "blob" || Number(size) !== object.size)
      throw new Error("INVALID_GIT_BATCH");
    offset = end + 1;
    if (scan(batch.subarray(offset, offset + object.size), object))
      historyTextBlobs++;
    offset += object.size + 1;
  }
  if (offset !== batch.length) throw new Error("INVALID_GIT_BATCH");
  batchObjects = [];
  batchBytes = 0;
}
for (let i = 0; i < objects.length; i++) {
  const [oid, type, size] = metadata[i].split(" ");
  if (type !== "blob" || Number(size) > 3_000_000) continue;
  if (batchBytes + Number(size) > 16_000_000) scanHistoryBatch();
  batchObjects.push({ ...objects[i], oid, size: Number(size) });
  batchBytes += Number(size);
}
scanHistoryBatch();
console.log(
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      scope:
        "Tracked and unignored working-tree text plus reachable local Git refs; binary and >3 MB blobs excluded. Not a complete secret-detection engine.",
      configuration,
      workingTreeFiles: files.length,
      textFiles,
      currentMatches,
      bundledTextFiles,
      bundleMatches,
      historyTextBlobs,
      historicalMatches: matches,
    },
    null,
    2,
  ),
);
if (currentMatches.length || bundleMatches.length || matches.length)
  process.exitCode = 1;
