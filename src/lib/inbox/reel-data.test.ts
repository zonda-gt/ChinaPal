import test from "node:test";
import assert from "node:assert/strict";
import { MAX_ATTEMPTS, needsWork, reelCode, reelLine, type ReelNote } from "./reel-data";

test("reelCode takes the shortcode from Instagram post and reel links only", () => {
  assert.equal(reelCode("https://www.instagram.com/reel/DeYM7LqP60b/?igsh=abc"), "DeYM7LqP60b");
  assert.equal(reelCode("https://www.instagram.com/p/DdBRn-BpR4X/"), "DdBRn-BpR4X");
  assert.equal(reelCode("https://instagram.com/reels/C_agTY7RPw2"), "C_agTY7RPw2");
  assert.equal(reelCode("https://evil.com/reel/DeYM7LqP60b/"), "");
  assert.equal(reelCode("https://www.instagram.com/stories/someone/123/"), "");
  assert.equal(reelCode("http://www.instagram.com/reel/DeYM7LqP60b/"), "");
  assert.equal(reelCode(undefined), "");
});

test("needsWork retries failures and stuck reels a few times, never finished ones", () => {
  const now = Date.parse("2026-10-29T12:00:00Z");
  const at = (minutesAgo: number) => new Date(now - minutesAgo * 60000).toISOString();
  assert.equal(needsWork({ status: "pending", attempts: 0, updated_at: at(0) }, now), true);
  assert.equal(needsWork({ status: "done", attempts: 1, updated_at: at(60) }, now), false);
  assert.equal(needsWork({ status: "failed", attempts: 1, updated_at: at(0) }, now), true);
  assert.equal(needsWork({ status: "failed", attempts: MAX_ATTEMPTS, updated_at: at(0) }, now), false);
  assert.equal(needsWork({ status: "working", attempts: 1, updated_at: at(2) }, now), false);
  assert.equal(needsWork({ status: "working", attempts: 1, updated_at: at(30) }, now), true);
});

test("reelLine gives the drafter the short line, or the caption while waiting", () => {
  const note = { short: "Liziba Station, Chongqing: the monorail runs through a building." } as ReelNote;
  assert.equal(reelLine({ status: "done", note, caption: "x" }), "[Shared reel: Liziba Station, Chongqing: the monorail runs through a building.]");
  assert.equal(reelLine({ status: "pending", note: null, caption: "Train  through\na building" }), '[Shared reel, not read yet. Caption: "Train through a building"]');
  assert.equal(reelLine({ status: "failed", note: null, caption: "" }), "[Shared reel, not read yet]");
});
