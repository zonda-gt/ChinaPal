import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { receiveWhatsAppWebhook, whatsAppMessages, type WhatsAppMessage } from "./webhook";

const appSecret = "test-secret-not-a-real-credential";
const phoneNumberId = "106540352242922";
const base = "http://localhost/api/webhooks/whatsapp";
const value = (extra: object) => ({
  messaging_product: "whatsapp",
  metadata: { display_phone_number: "15550000000", phone_number_id: phoneNumberId },
  ...extra,
});
const payload = (extra: object, id = phoneNumberId) => ({
  object: "whatsapp_business_account",
  entry: [{ id: "waba", changes: [{ field: "messages", value: { ...value(extra), metadata: { phone_number_id: id } } }] }],
});

function signed(body: string, secret = appSecret) {
  return new Request(base, {
    method: "POST", body,
    headers: { "x-hub-signature-256": `sha256=${createHmac("sha256", secret).update(body).digest("hex")}` },
  });
}

test("customer text, captions and phone-typed replies become inbox messages", () => {
  const messages = whatsAppMessages(payload({
    messages: [
      { from: "447700900123", id: "wamid.1", timestamp: "1761700000", type: "text", text: { body: "Hi from WhatsApp" } },
      { from: "447700900123", id: "wamid.2", timestamp: "1761700010", type: "image", image: { id: "media", caption: "Our hotel" } },
      { from: "447700900123", id: "wamid.3", timestamp: "1761700020", type: "location", location: { latitude: 31.2 } },
      { from: "447700900123", id: "wamid.4", timestamp: "1761700030", type: "reaction", reaction: { emoji: "👍" } },
    ],
    message_echoes: [
      { from: "15550000000", to: "447700900123", id: "wamid.5", timestamp: "1761700040", type: "text", text: { body: "Sent from the phone" } },
    ],
  }), phoneNumberId);
  assert.deepEqual(messages.map((m) => [m.id, m.direction, m.text, m.unavailable]), [
    ["wamid.1", "inbound", "Hi from WhatsApp", false],
    ["wamid.2", "inbound", "Our hotel", true],
    ["wamid.3", "inbound", "", true],
    ["wamid.5", "outbound", "Sent from the phone", false],
  ]);
  assert.equal(messages[0].wa_id, "447700900123");
  assert.equal(messages[0].sent_at, new Date(1761700000 * 1000).toISOString());
});

test("receipts, other numbers and other products are ignored", () => {
  assert.deepEqual(whatsAppMessages(payload({ statuses: [{ id: "wamid.1", status: "read" }] }), phoneNumberId), []);
  assert.deepEqual(whatsAppMessages(payload({
    messages: [{ from: "447700900123", id: "wamid.1", type: "text", text: { body: "x" } }],
  }, "999"), phoneNumberId), []);
  assert.deepEqual(whatsAppMessages({ ...payload({}), object: "instagram" }, phoneNumberId), []);
  assert.deepEqual(whatsAppMessages(payload({
    messages: [{ from: "+44 7700", id: "wamid.1", type: "text", text: { body: "x" } }],
  }), phoneNumberId), []);
});

test("only signed deliveries are stored, and storage failures ask Meta to retry", async () => {
  const body = JSON.stringify(payload({
    messages: [{ from: "447700900123", id: "wamid.1", timestamp: "1761700000", type: "text", text: { body: "Hello" } }],
  }));
  const saved: WhatsAppMessage[][] = [];
  const options = { appSecret, phoneNumberId, save: async (m: WhatsAppMessage[]) => { saved.push(m); } };
  assert.equal((await receiveWhatsAppWebhook(signed(body, "wrong-secret"), options)).status, 401);
  assert.equal((await receiveWhatsAppWebhook(new Request(base, { method: "POST", body }), options)).status, 401);
  assert.equal(saved.length, 0);
  const ok = await receiveWhatsAppWebhook(signed(body), options);
  assert.equal(ok.status, 200);
  assert.equal(await ok.text(), "EVENT_RECEIVED");
  assert.equal(saved[0][0].text, "Hello");
  const failed = await receiveWhatsAppWebhook(signed(body), { ...options, save: async () => { throw Error("db down"); } });
  assert.equal(failed.status, 503);
  assert.equal((await receiveWhatsAppWebhook(signed(body), { ...options, appSecret: undefined })).status, 503);
});
