import test from "node:test";
import assert from "node:assert/strict";
import {
  assertSameOrigin,
  replyWindowOpen,
  safeMediaUrl,
  validateReply,
} from "./policy";

test("attachment previews reject private hosts, lookalike domains, credentials and non-HTTPS URLs", () => {
  for (const url of [
    "http://cdninstagram.com/a",
    "https://127.0.0.1/a",
    "https://fbcdn.net.evil.test/a",
    "https://evilfbcdn.net/a",
    "https://user:password@fbcdn.net/a",
    "https://fbcdn.net:8080/a",
    "file:///etc/passwd",
  ])
    assert.equal(safeMediaUrl(url), null);
  assert.equal(
    safeMediaUrl("https://scontent.cdninstagram.com/image.jpg"),
    "https://scontent.cdninstagram.com/image.jpg",
  );
});
test("reply window excludes future, invalid and exactly 24-hour-old messages", () => {
  const now = Date.parse("2026-10-16T12:00:00Z");
  for (const value of [
    null,
    "invalid",
    "2026-10-17T12:00:00Z",
    "2026-10-15T12:00:00Z",
  ])
    assert.equal(replyWindowOpen(value, now), false);
  assert.equal(replyWindowOpen("2026-10-16T11:59:00Z", now), true);
});
test("reply length counts Unicode characters and rejects empty content", () => {
  assert.equal(validateReply("🙂".repeat(1000)).length, 2000);
  assert.throws(() => validateReply("🙂".repeat(1001)));
  assert.throws(() => validateReply("   "));
});
test("mutations require the same Origin including scheme and port", () => {
  const url = "https://www.chinapal.co/api/inbox/send";
  for (const origin of [
    "",
    "https://evil.test",
    "http://www.chinapal.co",
    "https://www.chinapal.co:444",
  ])
    assert.throws(() =>
      assertSameOrigin(new Request(url, { headers: { origin } })),
    );
  assert.doesNotThrow(() =>
    assertSameOrigin(
      new Request(url, { headers: { origin: "https://www.chinapal.co" } }),
    ),
  );
});
