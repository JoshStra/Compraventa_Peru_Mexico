import { test } from "node:test";
import assert from "node:assert/strict";
import { fork } from "node:child_process";
import { once } from "node:events";
import { testContext, createTestUser, registration } from "./helpers.js";

test(
  "publicación y sesión sobreviven al reinicio real del proceso Node",
  { timeout: 30000 },
  async () => {
    const context = await testContext();
    let child;
    async function start() {
      child = fork(
        new URL("./fixtures/persistence-server.js", import.meta.url),
        [],
        {
          env: {
            ...process.env,
            CT_PROBE_CONFIG: JSON.stringify({
              ...context.config,
              databaseUrl: context.databaseUrl,
            }),
          },
          stdio: ["ignore", "ignore", "ignore", "ipc"],
        },
      );
      const [{ port }] = await once(child, "message", {
        signal: AbortSignal.timeout(10000),
      });
      return `http://127.0.0.1:${port}/api/v1`;
    }
    async function stop() {
      if (!child || child.exitCode !== null) return;
      const done = once(child, "exit");
      child.send({ type: "shutdown" });
      await done;
    }
    try {
      await createTestUser(context, "restart");
      const input = registration("restart");
      let base = await start();
      const firstPid = child.pid;
      const login = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: context.config.origins[0],
        },
        body: JSON.stringify({ email: input.email, password: input.password }),
      });
      assert.equal(login.status, 200);
      const session = await login.json();
      const cookie = login.headers.get("set-cookie").split(";")[0];
      const catalog = await (await fetch(`${base}/catalog`)).json();
      const created = await fetch(`${base}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: context.config.origins[0],
          Cookie: cookie,
          "X-CSRF-Token": session.csrfToken,
        },
        body: JSON.stringify({
          title: "Publicación entre procesos",
          description:
            "Artículo que conserva su contenido después del reinicio.",
          location: "Biblioteca del campus",
          career: input.career,
          categoryId: catalog.categories[0].id,
          modality: "sale",
          condition: "good",
          price: 123.45,
          imageIds: [],
        }),
      });
      assert.equal(created.status, 201);
      const { item } = await created.json();
      await stop();
      base = await start();
      assert.notEqual(child.pid, firstPid);
      const persisted = await (
        await fetch(`${base}/listings/${item.id}`)
      ).json();
      assert.equal(persisted.item.title, item.title);
      assert.equal(persisted.item.price, 123.45);
      const restored = await (
        await fetch(`${base}/auth/session`, { headers: { Cookie: cookie } })
      ).json();
      assert.equal(restored.user.id, session.user.id);
    } finally {
      try {
        await stop();
      } finally {
        if (child?.exitCode === null) child.kill();
        await context.close();
      }
    }
  },
);
