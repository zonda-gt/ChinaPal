import test from "node:test";
import assert from "node:assert/strict";
import { parseProfile, selectProfileHistory } from "./profile-data";
import type { Message } from "./types";
const message = (
  text: string,
  direction: Message["direction"] = "inbound",
  deleted = false,
): Message => ({
  id: text,
  peer_id: "1",
  direction,
  text,
  deleted,
  attachments: [],
  unavailable: false,
  sent_at: "2026-10-16T10:00:00Z",
});
const unknown = { value: "Not mentioned", status: "unknown", sources: [] };
const raw = (fact: unknown) =>
  JSON.stringify({
    summary: fact,
    arrival: unknown,
    departure: unknown,
    party: unknown,
    cities: [],
    interests: [],
    preferences: [],
    logistics: [],
    questions: [],
  });
test("unsupported facts become unknown rather than invented profile details", () => {
  assert.equal(
    parseProfile(
      raw({
        value: "Arrives in Beijing tomorrow",
        status: "confirmed",
        sources: [],
      }),
      [message("Hi")],
    ).summary.value,
    "Not mentioned",
  );
});
test("team proposals cannot become confirmed customer plans", () => {
  const summary = parseProfile(
    raw({ value: "Visit Shanghai", status: "confirmed", sources: [1] }),
    [message("You could visit Shanghai", "outbound")],
  ).summary;
  assert.equal(summary.status, "suggested");
  assert.equal(summary.sources[0].text, "You could visit Shanghai");
});
test("invalid or deleted sources fail validation", () => {
  for (const sources of [[2], [0], [1.2]])
    assert.throws(() =>
      parseProfile(raw({ value: "A trip", status: "inferred", sources }), [
        message("Hi"),
      ]),
    );
  assert.throws(() =>
    parseProfile(raw({ value: "A trip", status: "inferred", sources: [1] }), [
      message("Hi", "inbound", true),
    ]),
  );
});
test("coverage excludes unsent text and discloses partial history and attachments", () => {
  const photo = {
    ...message(""),
    attachments: [{ type: "image" as const, url: "https://example.com/photo" }],
  };
  const result = selectProfileHistory(
    [message("deleted", "inbound", true), message("Two travelers"), photo],
    false,
  );
  assert.equal(result.messages.length, 1);
  assert.equal(result.coverage.partial, true);
  assert.equal(result.coverage.attachments, true);
});
test("large histories keep the newest text within the budget and disclose truncation", () => {
  const result = selectProfileHistory(
    [message("a".repeat(80000)), message("b".repeat(80000))],
    true,
  );
  assert.equal(result.messages.length, 1);
  assert.equal(result.messages[0].text[0], "b");
  assert.equal(result.coverage.partial, true);
});
