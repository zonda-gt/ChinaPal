import "./lib/env";
import Anthropic from "@anthropic-ai/sdk";

async function main() {
  const client = new Anthropic();
  const r = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 50,
    messages: [{ role: "user", content: "Reply with exactly: OK Sonnet 4.6 reachable." }],
  });
  const text = r.content.find((b) => b.type === "text")?.text ?? "(no text)";
  console.log("response:", text);
  console.log("usage:", JSON.stringify(r.usage));
}
main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
