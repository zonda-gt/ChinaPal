// Draft generation without database access. The inbox route loads the
// conversation and saves the result; the offline evaluation calls this directly
// with frozen test cases, so both run exactly the same request.
import OpenAI from "openai";
import type { ResponseInputContent } from "openai/resources/responses/responses";
import {
  DRAFT_SCHEMA,
  INBOX_INSTRUCTIONS,
  PROMPT_VERSION,
  buildPromptText,
  fitMessages,
  wordCount,
  type PromptContext,
} from "./prompt";
import { InboxError } from "./types";

export type LoadImage = (url: string) => Promise<{ bytes: Buffer; type: string }>;
export type DraftOptions = {
  model?: string;
  reasoning?: "low" | "medium" | "high";
  // Evaluation only: try alternative instructions against the same request.
  instructions?: string;
};
export type DraftResult = {
  messages: string[];
  warnings: string[];
  promptVersion: string;
  model: string;
  reasoning: string;
  usage: { input_tokens: number; cached_input_tokens: number; output_tokens: number };
  latencyMs: number;
};

const MAX_IMAGES = 6;
const IMAGE_WINDOW = 20;

/** Recent images, in conversation order, labelled with their message number. */
export async function imageContent(ctx: Pick<PromptContext, "messages">, offset: number, load: LoadImage) {
  const warnings: string[] = [];
  const recent = ctx.messages.slice(-IMAGE_WINDOW);
  const start = ctx.messages.length - recent.length;
  const images = recent.flatMap((m, i) =>
    m.deleted
      ? []
      : m.attachments
          .filter((a) => a.type === "image" && a.url)
          .map((a) => ({ url: a.url!, n: start + i + 1, m })),
  );
  if (images.length > MAX_IMAGES)
    warnings.push("Only the six most recent images were included. Review older attachments manually.");
  const loaded = await Promise.all(
    images.slice(-MAX_IMAGES).map(async (image) => {
      try {
        return { image, media: await load(image.url) };
      } catch {
        warnings.push("An image could not be read. Review it in Instagram or refresh the conversation.");
        return null;
      }
    }),
  );
  const content: ResponseInputContent[] = [];
  for (const item of loaded) {
    if (!item || item.image.n <= offset) continue;
    const who = item.image.m.direction === "inbound" ? "customer" : "ChinaPal";
    content.push(
      { type: "input_text", text: `Image attached to message #${item.image.n} (${who}):` },
      {
        type: "input_image",
        image_url: `data:${item.media.type};base64,${item.media.bytes.toString("base64")}`,
        detail: "high",
      },
    );
  }
  return { content, warnings };
}

export async function runDraft(
  client: OpenAI,
  ctx: PromptContext,
  load: LoadImage,
  options: DraftOptions = {},
): Promise<DraftResult> {
  const model = options.model || process.env.INBOX_AI_MODEL || "gpt-6.1-sol";
  const reasoning =
    options.reasoning ||
    (process.env.INBOX_AI_REASONING as DraftOptions["reasoning"]) ||
    "medium";
  const prompt = buildPromptText(ctx);
  const images = await imageContent(ctx, prompt.offset, load);
  const started = Date.now();
  let result;
  try {
    result = await client.responses.create({
      model,
      reasoning: { effort: reasoning },
      max_output_tokens: 8000,
      store: false,
      instructions: options.instructions ?? INBOX_INSTRUCTIONS,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: prompt.text }, ...images.content],
        },
      ],
      text: {
        format: { type: "json_schema", name: "concierge_draft", strict: true, schema: DRAFT_SCHEMA },
      },
    });
  } catch (error) {
    throw openAIError(error);
  }
  if (result.status !== "completed")
    throw new InboxError("AI did not finish this draft. Please try again.", 502);
  let parsed: { messages?: unknown; warnings?: unknown };
  try {
    parsed = JSON.parse(result.output_text);
  } catch {
    throw new InboxError("AI returned an incomplete draft. Please try generating again.", 502);
  }
  const texts = Array.isArray(parsed.messages)
    ? parsed.messages.filter((m): m is string => typeof m === "string")
    : [];
  const messages = fitMessages(texts);
  if (!messages.length) throw new InboxError("AI returned an empty draft. Please try again.", 502);
  const warnings = [
    ...images.warnings,
    ...(Array.isArray(parsed.warnings)
      ? parsed.warnings.filter((w): w is string => typeof w === "string" && !!w.trim()).slice(0, 8)
      : []),
  ];
  if (messages.length > 3)
    warnings.push("The AI wrote more than three messages; only the first three were kept.");
  if (messages.slice(0, 3).some((m) => wordCount(m) > 100))
    warnings.push("A message is over 100 words. Consider shortening it before sending.");
  return {
    messages: messages.slice(0, 3),
    warnings,
    promptVersion: PROMPT_VERSION,
    model: result.model,
    reasoning,
    usage: {
      input_tokens: result.usage?.input_tokens ?? 0,
      cached_input_tokens: result.usage?.input_tokens_details?.cached_tokens ?? 0,
      output_tokens: result.usage?.output_tokens ?? 0,
    },
    latencyMs: Date.now() - started,
  };
}

function openAIError(error: unknown) {
  if (!(error instanceof OpenAI.APIError)) return error;
  console.error("[inbox-ai]", error.status, error.code);
  if (error.status === 401)
    return new InboxError("OpenAI authentication failed. Check OPENAI_API_KEY on the server.", 503);
  if (error.status === 429)
    return new InboxError(
      "OpenAI is rate limited or has no available API credits. Check your OpenAI billing and retry.",
      503,
    );
  if (error.status === 404)
    return new InboxError(
      "The configured GPT model is unavailable to this OpenAI project. Check INBOX_AI_MODEL.",
      503,
    );
  return new InboxError("OpenAI could not generate this draft. Your existing reply is preserved.", 502);
}
