import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { receiveInstagramWebhook, verifyInstagramWebhook, type InstagramDelivery } from "./webhook";

const appSecret = "test-secret-not-a-real-credential";
const accountId = "17841434818373119";
const base = "http://localhost/api/webhooks/instagram";
const payload = {
  object: "instagram",
  entry: [{ id: accountId, messaging: [{
    sender: { id: "customer-id" }, recipient: { id: accountId },
    message: { mid: "message-id", text: "你好!", attachments: [{
      type: "image", payload: { url: "https://example.invalid/image.jpg" },
    }] },
  }] }],
};

function signed(body: string, secret = appSecret) {
  return new Request(base, {
    method: "POST", body,
    headers: { "x-hub-signature-256": `sha256=${createHmac("sha256", secret).update(body).digest("hex")}` },
  });
}

test("verification returns the exact plain-text challenge only with matching token and mode", async () => {
  const response = verifyInstagramWebhook(new Request(`${base}?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=001234`), "test-token");
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "001234");
  assert.match(response.headers.get("content-type")!, /text\/plain/);
  for (const query of [
    "hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=123",
    "hub.mode=other&hub.verify_token=test-token&hub.challenge=123",
    "hub.mode=subscribe&hub.verify_token=test-token",
  ]) {
    assert.equal(verifyInstagramWebhook(new Request(`${base}?${query}`), "test-token").status, 403);
  }
  assert.equal(verifyInstagramWebhook(new Request(base)).status, 503);
});

test("unsigned, forged and malformed signatures cannot write customer data", async () => {
  let calls = 0;
  const options = { appSecret, accountId, save: async () => { calls++; } };
  for (const request of [
    new Request(base, { method: "POST", body: JSON.stringify(payload) }),
    signed(JSON.stringify(payload), "wrong-secret"),
    new Request(base, { method: "POST", body: "{}", headers: { "x-hub-signature-256": "sha256=zz" } }),
  ]) {
    assert.equal((await receiveInstagramWebhook(request, options)).status, 401);
  }
  assert.equal(calls, 0);
});

test("signed delivery preserves text and image metadata, filters other accounts, and awaits storage", async () => {
  const mixed = { ...payload, entry: [...payload.entry, { id: "other-account", messaging: [] }] };
  const rows: InstagramDelivery[] = [];
  let finish!: () => void;
  const pending = new Promise<void>((resolve) => { finish = resolve; });
  let saving!: () => void;
  const started = new Promise<void>((resolve) => { saving = resolve; });
  let responded = false;
  const response = receiveInstagramWebhook(signed(JSON.stringify(mixed, null, 2)), {
    appSecret, accountId, save: async (row) => { rows.push(row); saving(); await pending; },
  }).then((value) => { responded = true; return value; });
  await started;
  assert.equal(responded, false);
  finish();
  assert.equal((await response).status, 200);
  assert.deepEqual(rows[0].payload, payload);
  assert.equal(rows[0].account_id, accountId);
  assert.match(rows[0].delivery_hash, /^[a-f0-9]{64}$/);
});

test("storage failure asks Meta to retry instead of acknowledging a lost delivery", async () => {
  const response = await receiveInstagramWebhook(signed(JSON.stringify(payload)), {
    appSecret, accountId, save: async () => { throw new Error("database unavailable"); },
  });
  assert.equal(response.status, 503);
});

test("exact delivery retries produce the same deduplication key", async () => {
  const keys: string[] = [];
  for (let i = 0; i < 2; i++) {
    await receiveInstagramWebhook(signed(JSON.stringify(payload)), {
      appSecret, accountId, save: async (row) => { keys.push(row.delivery_hash); },
    });
  }
  assert.equal(keys[0], keys[1]);
});

test("invalid signed payloads and unconfigured receivers never save", async () => {
  let calls = 0;
  const options = { appSecret, accountId, save: async () => { calls++; } };
  for (const body of ["{", "null", '{"object":"instagram","entry":[null]}']) {
    assert.equal((await receiveInstagramWebhook(signed(body), options)).status, 400);
  }
  assert.equal((await receiveInstagramWebhook(signed(JSON.stringify(payload)), { ...options, appSecret: undefined })).status, 503);
  assert.equal((await receiveInstagramWebhook(signed(JSON.stringify(payload)), { ...options, accountId: undefined })).status, 503);
  assert.equal((await receiveInstagramWebhook(signed('{"object":"instagram","entry":[{"id":"other-account"}]}'), options)).status, 200);
  assert.equal((await receiveInstagramWebhook(signed('{"object":"page","entry":[]}'), options)).status, 200);
  assert.equal(calls, 0);
});
