import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type JsonObject = Record<string, unknown>;

export type InstagramDelivery = {
  delivery_hash: string;
  account_id: string;
  payload: { object: "instagram"; entry: JsonObject[] };
};

type WebhookOptions = {
  appSecret?: string;
  accountId?: string;
  save: (delivery: InstagramDelivery) => Promise<void>;
};

export function text(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function equalStrings(left: string, right: string) {
  return timingSafeEqual(
    createHash("sha256").update(left).digest(),
    createHash("sha256").update(right).digest(),
  );
}

export function verifyInstagramWebhook(request: Request, verifyToken?: string) {
  if (!verifyToken) return text("Webhook not configured", 503);

  const params = new URL(request.url).searchParams;
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  if (
    params.get("hub.mode") !== "subscribe" ||
    !token || !challenge || !equalStrings(token, verifyToken)
  ) {
    return text("Forbidden", 403);
  }
  return text(challenge);
}

export function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Meta signs webhook bodies with the app secret. Returns the parsed JSON object
// and raw bytes, or the response to send when the delivery is not genuine.
export async function readSignedJson(
  request: Request,
  appSecret: string,
): Promise<Response | { raw: Buffer; payload: JsonObject }> {
  const signature = request.headers.get("x-hub-signature-256");
  if (!signature || !/^sha256=[a-fA-F0-9]{64}$/.test(signature)) {
    return text("Invalid signature", 401);
  }

  // Check the exact bytes Meta signed, before decoding or parsing the JSON.
  if (Number(request.headers.get("content-length") || 0) > 1024 * 1024) return text("Payload too large", 413);
  const raw = Buffer.from(await request.arrayBuffer());
  if (raw.length > 1024 * 1024) return text("Payload too large", 413);
  const expected = createHmac("sha256", appSecret).update(raw).digest();
  if (!timingSafeEqual(expected, Buffer.from(signature.slice(7), "hex"))) {
    return text("Invalid signature", 401);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw.toString("utf8"));
  } catch {
    return text("Invalid JSON", 400);
  }
  if (!isObject(payload)) return text("Invalid payload", 400);
  return { raw, payload };
}

export async function receiveInstagramWebhook(request: Request, options: WebhookOptions) {
  const { appSecret, accountId, save } = options;
  if (!appSecret || !accountId) return text("Webhook not configured", 503);
  const body = await readSignedJson(request, appSecret);
  if (body instanceof Response) return body;
  const { raw, payload } = body;
  if (payload.object !== "instagram") return text("EVENT_RECEIVED");
  if (!Array.isArray(payload.entry) || !payload.entry.every(isObject)) {
    return text("Invalid entries", 400);
  }

  // Only retain events for the configured business account. IDs stay strings
  // because Instagram IDs can exceed JavaScript's safe integer range.
  const entries = payload.entry.filter((entry) => entry.id === accountId);
  if (entries.length === 0) return text("EVENT_RECEIVED");

  try {
    await save({
      delivery_hash: createHash("sha256").update(raw).digest("hex"),
      account_id: accountId,
      payload: { object: "instagram", entry: entries },
    });
  } catch {
    // Do not acknowledge a delivery that was not saved. Do not log message
    // bodies, attachment URLs, credentials, or upstream error objects.
    console.error("[instagram-webhook] Delivery could not be persisted");
    return text("Please retry", 503);
  }

  return text("EVENT_RECEIVED");
}
