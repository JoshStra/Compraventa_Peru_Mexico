import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function createObjectStorage(config) {
  if (config.storageDriver === "s3") {
    const client = new S3Client({
      endpoint: config.s3.endpoint,
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
      forcePathStyle: true,
    });
    return {
      async put(key, buffer) {
        await client.send(
          new PutObjectCommand({
            Bucket: config.s3.bucket,
            Key: key,
            Body: buffer,
            ContentType: "image/webp",
          }),
        );
      },
      async remove(key) {
        await client.send(
          new DeleteObjectCommand({ Bucket: config.s3.bucket, Key: key }),
        );
      },
      async location(key) {
        return {
          url: await getSignedUrl(
            client,
            new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }),
            { expiresIn: 300 },
          ),
        };
      },
    };
  }
  function filename(key) {
    if (!/^[a-f0-9-]+\.webp$/.test(key)) throw new Error("INVALID_OBJECT_KEY");
    return path.join(config.storagePath, key);
  }
  return {
    async put(key, buffer) {
      await mkdir(config.storagePath, { recursive: true });
      await writeFile(filename(key), buffer, { flag: "wx" });
    },
    async remove(key) {
      await unlink(filename(key)).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      });
    },
    async location(key) {
      return { file: filename(key) };
    },
  };
}
