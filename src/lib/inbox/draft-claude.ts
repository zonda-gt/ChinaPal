// Claude version of runDraft, for comparing models on the same request: same
// instructions, prompt text, images and output shape. Not used by the inbox yet.
import Anthropic from "@anthropic-ai/sdk";
import { imageContent, type DraftOptions, type DraftResult, type LoadImage } from "./draft-core";
import { DRAFT_SCHEMA, INBOX_INSTRUCTIONS, PROMPT_VERSION, buildPromptText, fitMessages, type PromptContext } from "./prompt";
import { InboxError } from "./types";

// Claude's structured output does not take string length limits; fitMessages
// splits anything over 1000 characters instead.
const SCHEMA = {
  ...DRAFT_SCHEMA,
  properties: { ...DRAFT_SCHEMA.properties, messages: { type: "array", items: { type: "string" } } },
};
// Claude takes up to 5 MB per image after base64; larger images are left out with a warning.
const MAX_IMAGE_BYTES = 3_700_000;

/** Claude checks the declared type against the bytes, and Instagram often labels PNGs as JPEG. */
function claudeImage(dataUrl: string) {
  const [, data] = dataUrl.match(/^data:[^;]+;base64,(.*)$/) ?? [];
  if (!data) return null;
  const bytes = Buffer.from(data, "base64");
  if (bytes.length > MAX_IMAGE_BYTES) return null;
  const hex = bytes.subarray(0, 12).toString("hex");
  const media_type = hex.startsWith("ffd8ff")
    ? "image/jpeg"
    : hex.startsWith("89504e47")
      ? "image/png"
      : hex.startsWith("47494638")
        ? "image/gif"
        : hex.startsWith("52494646") && hex.slice(16) === "57454250"
          ? "image/webp"
          : null;
  return media_type ? ({ media_type, data: bytes.toString("base64") } as const) : null;
}

export async function runClaudeDraft(
  client: Anthropic,
  ctx: PromptContext,
  load: LoadImage,
  options: DraftOptions & { effort?: "low" | "medium" | "high" | "xhigh" } = {},
): Promise<DraftResult> {
  const model = options.model || "claude-sonnet-5-5";
  const effort = options.effort || options.reasoning || "medium";
  const prompt = buildPromptText(ctx);
  const images = await imageContent(ctx, prompt.offset, load);
  const content: Anthropic.ContentBlockParam[] = [{ type: "text", text: prompt.text }];
  for (const part of images.content) {
    if (part.type === "input_text") content.push({ type: "text", text: part.text });
    if (part.type !== "input_image" || !part.image_url) continue;
    const image = claudeImage(part.image_url);
    if (image) content.push({ type: "image", source: { type: "base64", ...image } });
    else images.warnings.push("An image could not be read. Review it in Instagram or refresh the conversation.");
  }
  const started = Date.now();
  let result;
  try {
    result = await client.messages
      .stream({
        model,
        max_tokens: 32000,
        thinking: { type: "adaptive" },
        output_config: { effort, format: { type: "json_schema", schema: SCHEMA } },
        system: options.instructions ?? INBOX_INSTRUCTIONS,
        messages: [{ role: "user", content }],
      })
      .finalMessage();
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error("[inbox-ai]", error.status, error.message);
    throw new InboxError("Claude could not generate this draft. Your existing reply is preserved.", 502);
  }
  if (result.stop_reason === "refusal") throw new InboxError("Claude declined to draft this reply.", 502);
  if (result.stop_reason === "max_tokens")
    throw new InboxError("AI did not finish this draft. Please try again.", 502);
  const text = result.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  let parsed: { messages?: unknown; warnings?: unknown };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new InboxError("AI returned an incomplete draft. Please try generating again.", 502);
  }
  const messages = fitMessages(
    Array.isArray(parsed.messages) ? parsed.messages.filter((m): m is string => typeof m === "string") : [],
  );
  if (!messages.length) throw new InboxError("AI returned an empty draft. Please try again.", 502);
  const warnings = [
    ...images.warnings,
    ...(Array.isArray(parsed.warnings)
      ? parsed.warnings.filter((w): w is string => typeof w === "string" && !!w.trim()).slice(0, 8)
      : []),
  ];
  if (messages.length > 3)
    warnings.push("The AI wrote more than three messages; only the first three were kept.");
  return {
    messages: messages.slice(0, 3),
    warnings,
    promptVersion: PROMPT_VERSION,
    model: result.model,
    reasoning: effort,
    usage: {
      input_tokens: result.usage.input_tokens,
      cached_input_tokens: result.usage.cache_read_input_tokens ?? 0,
      output_tokens: result.usage.output_tokens,
    },
    latencyMs: Date.now() - started,
  };
}
