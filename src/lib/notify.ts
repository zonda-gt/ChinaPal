import "server-only";

/**
 * Ping the team channel (the actual "a customer paid" delivery trigger).
 * Posts to a Slack incoming webhook. If SLACK_WEBHOOK_URL is unset it no-ops
 * (just logs), so the payment flow never breaks on a missing alert channel.
 *
 * To switch to Telegram later: swap the fetch body/URL here only.
 */
export async function notifyTeam(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.log("[notifyTeam] (SLACK_WEBHOOK_URL unset) →", text);
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) console.error("[notifyTeam] Slack returned", res.status);
  } catch (e) {
    console.error("[notifyTeam] failed:", e);
  }
}
