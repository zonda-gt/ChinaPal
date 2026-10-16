// Read-only API probe. No database writes, message sends, or read receipts.
// Prints response shapes, not tokens, IDs, names, text, or attachment URLs.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";

if (process.argv.includes("--help")) {
  console.log("Run: node scripts/instagram-inspect.mjs");
  console.log("Reads .env.local and inspects one Instagram conversation using GET requests only.");
  process.exit(0);
}

const env = dotenv.parse(readFileSync(fileURLToPath(new URL("../.env.local", import.meta.url))));
const token = env.INSTAGRAM_ACCESS_TOKEN;
const accountId = env.INSTAGRAM_ACCOUNT_ID;
if (!token || !/^\d+$/.test(accountId ?? "")) {
  console.error("Missing Instagram token or numeric account ID in .env.local.");
  process.exit(1);
}
// Keep credentials in curl's stdin, outside command arguments and shell history.
if (!/^[A-Za-z0-9_.-]+$/.test(token)) {
  console.error("Unexpected characters in token; check the saved value.");
  process.exit(1);
}

function shape(value, depth = 0) {
  if (value === null) return "null";
  if (depth > 7) return Array.isArray(value) ? "array" : typeof value;
  if (Array.isArray(value)) return value.length ? [shape(value[0], depth + 1)] : [];
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => key !== "paging")
      .map(([key, child]) => [key, shape(child, depth + 1)]));
  }
  return typeof value;
}

function get(label, path, params = {}) {
  const url = new URL(`https://graph.instagram.com/v25.0/${path}`);
  url.search = new URLSearchParams(params).toString();
  console.log(`\n${label}...`);
  const result = spawnSync("curl", [
    "--silent", "--show-error", "--connect-timeout", "10", "--max-time", "20",
    "--config", "-", "--write-out", "\n%{http_code}",
  ], {
    input: `url = "${url.href}"\nheader = "Authorization: Bearer ${token}"\n`,
    encoding: "utf8",
    maxBuffer: 2 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    console.error(`No API response (curl exit ${result.status ?? "unavailable"}).`);
    console.error("This does not establish whether the token or permissions are valid.");
    process.exit(1);
  }
  const separator = result.stdout.lastIndexOf("\n");
  const status = Number(result.stdout.slice(separator + 1));
  console.log(`HTTP ${status}`);
  let data;
  try {
    data = JSON.parse(result.stdout.slice(0, separator));
  } catch {
    console.error("Non-JSON response; contents hidden.");
    process.exit(1);
  }
  if (status >= 400 || data.error) {
    console.error(JSON.stringify({
      code: data.error?.code,
      subcode: data.error?.error_subcode,
      type: data.error?.type,
    }));
    console.error("Stopped. Error message and response values hidden for privacy.");
    process.exit(1);
  }
  console.log(JSON.stringify(shape(data), null, 2));
  return data;
}

const account = get("1. Account identity", "me", { fields: "user_id,username" });
if (String(account.user_id) !== accountId) {
  console.error("The API account ID does not match .env.local. Stopped.");
  process.exit(1);
}
console.log("Account matches the configured Instagram account.");

let conversations = get("2. Existing conversations, page 1", `${accountId}/conversations`, {
  platform: "instagram", limit: "10",
});
const cursors = new Set();
for (let page = 2; page <= 5 && !conversations.data?.length; page++) {
  const next = conversations.paging?.next;
  if (!next) break;
  const nextUrl = new URL(next);
  // Never follow an arbitrary host or expose next-page links (which may carry
  // a token). Rebuild the same read-only endpoint using only the cursor.
  if (nextUrl.origin !== "https://graph.instagram.com") break;
  const after = nextUrl.searchParams.get("after");
  if (!after || cursors.has(after)) break;
  cursors.add(after);
  conversations = get(`2. Existing conversations, page ${page}`, `${accountId}/conversations`, {
    platform: "instagram", limit: "10", after,
  });
}
console.log(`Returned conversations on final page: ${conversations.data?.length ?? 0}`);
console.log(`Has another page: ${Boolean(conversations.paging?.next)}`);
const conversationId = conversations.data?.[0]?.id;
if (!conversationId) {
  console.log("No accessible conversations returned. This does not prove the Instagram inbox is empty.");
  process.exit(0);
}

const conversation = get("3. Recent messages in one conversation", encodeURIComponent(conversationId), {
  fields: "messages.limit(3){id,created_time}",
});
for (const [index, message] of (conversation.messages?.data ?? []).slice(0, 3).entries()) {
  get(`4.${index + 1}. Message detail structure`, encodeURIComponent(message.id), {
    fields: "id,created_time,from,to,message,attachments",
  });
}
console.log("\nRead-only inspection finished. No messages sent or database changes made.");
