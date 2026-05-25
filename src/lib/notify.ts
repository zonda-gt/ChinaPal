import "server-only";
import crypto from "node:crypto";

/**
 * Ping the team when something important happens (e.g. a payment) — the actual
 * "a customer paid" delivery trigger.
 *
 * Channel priority: DingTalk custom robot → Slack → console log. Everything is
 * env-gated, so a missing channel never breaks the payment flow.
 */
export async function notifyTeam(text: string): Promise<void> {
  const ding = process.env.DINGTALK_WEBHOOK_URL;
  if (ding) {
    await sendDingTalk(ding, process.env.DINGTALK_SECRET, text);
    return;
  }
  const slack = process.env.SLACK_WEBHOOK_URL;
  if (slack) {
    await sendSlack(slack, text);
    return;
  }
  console.log("[notifyTeam] (no channel configured) →", text);
}

/**
 * Post to a DingTalk custom robot (钉钉自定义机器人).
 * If the robot uses 加签 (signature) security, set DINGTALK_SECRET and we sign
 * each request. If it uses a 自定义关键词 (keyword) instead, ensure the keyword
 * appears in `text` (our payment message includes "ChinaPal").
 */
async function sendDingTalk(
  webhookUrl: string,
  secret: string | undefined,
  content: string,
): Promise<void> {
  let target = webhookUrl;
  if (secret) {
    const ts = Date.now();
    const sign = crypto
      .createHmac("sha256", secret)
      .update(`${ts}\n${secret}`)
      .digest("base64");
    const sep = target.includes("?") ? "&" : "?";
    target += `${sep}timestamp=${ts}&sign=${encodeURIComponent(sign)}`;
  }
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msgtype: "text", text: { content } }),
    });
    // DingTalk always returns 200; the real status is in the body's errcode.
    const json = (await res.json().catch(() => ({}))) as {
      errcode?: number;
      errmsg?: string;
    };
    if (json.errcode && json.errcode !== 0) {
      console.error("[notifyTeam] DingTalk error:", json.errcode, json.errmsg);
    }
  } catch (e) {
    console.error("[notifyTeam] DingTalk request failed:", e);
  }
}

async function sendSlack(url: string, text: string): Promise<void> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) console.error("[notifyTeam] Slack returned", res.status);
  } catch (e) {
    console.error("[notifyTeam] Slack failed:", e);
  }
}
