import test from "node:test";
import assert from "node:assert/strict";
import { commentEvents, matches, pickRule, sendable, STUCK_MS, type CommentRule } from "./comment-data";
import type { InstagramDelivery } from "@/lib/instagram/webhook";

const ACCOUNT = "17841434818373119";

test("matches finds the keyword as a word, whatever the case, emoji or punctuation", () => {
  for (const text of ["CHINA", "china!!", "China 🇨🇳", "I want the China itinerary please", "中国 china"]) assert.equal(matches(text, "China"), true, text);
  for (const text of ["Chinatown", "chin a", "", "🇨🇳"]) assert.equal(matches(text, "china"), false, text);
  assert.equal(matches("send me the great wall guide", "great wall"), true);
  assert.equal(matches("GREAT-WALL", "great wall"), true);
  assert.equal(matches("anything", "!!"), false, "a keyword with no letters never matches");
  assert.equal(matches("想要中国行程", "中国行程"), true);
});

test("commentEvents reads comment changes and skips our own comments and malformed ones", () => {
  const change = (id: string, from: string, text = "China") => ({
    field: "comments",
    value: { id, text, from: { id: from, username: `user${from}` }, media: { id: "1790000000001" } },
  });
  const delivery: InstagramDelivery = {
    delivery_hash: "h",
    account_id: ACCOUNT,
    payload: {
      object: "instagram",
      entry: [
        {
          id: ACCOUNT,
          time: 1793000000,
          changes: [change("18000000000000001", "555"), change("18000000000000002", ACCOUNT), change("not-a-number", "556"), { field: "mentions", value: {} }],
        },
        { id: ACCOUNT, messaging: [{ message: { mid: "m" } }] },
      ],
    },
  };
  const events = commentEvents(delivery);
  assert.equal(events.length, 1);
  assert.deepEqual(events[0], {
    id: "18000000000000001",
    mediaId: "1790000000001",
    from: "555",
    username: "user555",
    text: "China",
    at: new Date(1793000000 * 1000).toISOString(),
  });
});

test("pickRule prefers the post's own active rule, then the one for every post", () => {
  const rule = (id: string, media_id: string | null, keyword: string, active = true): CommentRule => ({
    id,
    media_id,
    keyword,
    message: id,
    public_reply: "",
    active,
    updated_by: "steven",
    updated_at: "",
  });
  const rules = [rule("all", null, "china"), rule("liziba", "111", "china"), rule("off", "222", "china", false), rule("spa", null, "spa")];
  assert.equal(pickRule(rules, "111", "China!")?.id, "liziba");
  assert.equal(pickRule(rules, "222", "China!")?.id, "all", "a turned-off post rule falls back to every post");
  assert.equal(pickRule(rules, "333", "spa please")?.id, "spa");
  assert.equal(pickRule(rules, "333", "nice video"), null);
});

test("sendable retries a send that was cut off, never one in progress or finished", () => {
  const now = Date.parse("2026-10-30T12:00:00Z");
  const ago = (ms: number) => new Date(now - ms).toISOString();
  assert.equal(sendable({ status: "pending", updated_at: ago(0) }, now), true);
  assert.equal(sendable({ status: "sending", updated_at: ago(60_000) }, now), false);
  assert.equal(sendable({ status: "sending", updated_at: ago(STUCK_MS + 1) }, now), true);
  for (const status of ["sent", "failed", "skipped"] as const) assert.equal(sendable({ status, updated_at: ago(STUCK_MS * 10) }, now), false);
});
