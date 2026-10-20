// Image notes: each image in a chat is described once, in words, so drafts,
// briefs and the trip assistant can use every image in the history, not only
// the few newest ones that are attached to a request. No database access here;
// see image-note-store.ts for saving and reusing notes.
import OpenAI from "openai";

export const IMAGE_NOTE_VERSION = "n1";

const NOTE_INSTRUCTIONS = `Describe ONE image from an Instagram chat between a traveller and ChinaPal, a small Shanghai team that plans China trips. A teammate who cannot see the image will rely on your note, so capture everything useful for helping this traveller.

Start with what it is, e.g. "Screenshot of a Trip.com hotel booking", "Xiaohongshu post", "Google Maps place card", "Photo of a waterfall with a dragon statue", "Price table".
Then copy the useful details exactly as shown: place, shop, hotel and restaurant names (keep both English and Chinese when both appear), addresses, dates, times, flight and train numbers, stations, prices and totals, booking status, cancellation terms, ratings, menu items, captions and other on-screen text. For tables and itineraries, keep each row or day short but complete.
For photos without text, say what and where it seems to be, marking guesses ("looks like…").
Never copy passport or ID numbers, card numbers, phone numbers, email addresses, booking PINs or QR code contents: write [hidden]. Do not guess beyond what is visible.
Plain text, no preamble. Usually under 120 words; up to 220 for long lists, tables or itineraries.`;

export type NoteInput = {
  bytes: Buffer;
  type: string;
  sender: "customer" | "team";
  caption?: string; // text sent with or just before the image, for context
};

export async function describeImage(client: OpenAI, input: NoteInput, model = process.env.INBOX_AI_MODEL || "gpt-6.1-sol") {
  const context = `Sent by ${input.sender === "customer" ? "the traveller" : "ChinaPal"}.${
    input.caption?.trim() ? ` Message with it: "${input.caption.trim().slice(0, 300)}"` : ""
  }`;
  const result = await client.responses.create({
    model,
    reasoning: { effort: "low" },
    store: false,
    max_output_tokens: 2500,
    instructions: NOTE_INSTRUCTIONS,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: context },
          { type: "input_image", image_url: `data:${input.type};base64,${input.bytes.toString("base64")}`, detail: "high" },
        ],
      },
    ],
  });
  const note = result.output_text.replace(/\s+\n/g, "\n").trim();
  if (result.status !== "completed" || !note) throw new Error("No image note");
  return { note: note.slice(0, 2000), model: result.model, usage: result.usage };
}
