// Word-level comparison of a draft with what the team actually sent.
const words = (t: string) => t.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

function lcs(a: string[], b: string[]) {
  const row = new Array(b.length + 1).fill(0);
  for (const x of a) {
    let diagonal = 0;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = x === b[j - 1] ? diagonal + 1 : Math.max(row[j], row[j - 1]);
      diagonal = above;
    }
  }
  return row[b.length];
}

/**
 * kept: share of the draft's words that survive, in order, in what was sent.
 * fromDraft: share of the sent words that came from the draft.
 * closeness: their harmonic mean (1 = sent exactly as drafted).
 */
export function compareWithSent(draft: string[], sent: string[]) {
  const a = words(draft.join(" "));
  const b = words(sent.join(" "));
  const common = lcs(a, b);
  const kept = a.length ? common / a.length : 0;
  const fromDraft = b.length ? common / b.length : 0;
  return { kept, fromDraft, closeness: kept + fromDraft ? (2 * kept * fromDraft) / (kept + fromDraft) : 0 };
}

export const questionCount = (messages: string[]) => (messages.join("\n").match(/[?？]/g) ?? []).length;
export const charCount = (messages: string[]) => messages.join("").length;
