export default async function teardown() {
  try {
    await fetch("http://127.0.0.1:4180/__test/shutdown", {
      method: "POST",
      headers: { "x-test-key": process.env.E2E_TEST_KEY },
    });
  } catch {}
}
