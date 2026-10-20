"use client";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Copy, Loader2, Quote, Reply } from "lucide-react";
import type { ProfileSource } from "@/lib/inbox/profile-data";
import v from "./v2.module.css";

type Turn = { role: "team" | "assistant"; text: string; sources?: Record<string, ProfileSource> };
type Props = { peer: string; onUse: (text: string) => void; onShowSource: (source: ProfileSource) => void };

/** **bold** and (#12) message references inside one line of an answer. */
function inline(text: string, cite: (n: string) => ReactNode) {
  return text.split(/(\*\*[^*]+\*\*|#\d+)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^#\d+$/.test(part)) return <Fragment key={i}>{cite(part.slice(1))}</Fragment>;
    return part;
  });
}
/** A small, safe Markdown subset: paragraphs, "-" bullets, **bold** and #n references. */
function Answer({ text, cite }: { text: string; cite: (n: string) => ReactNode }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length)
      blocks.push(
        <ul key={blocks.length}>
          {list.map((item, i) => (
            <li key={i}>{inline(item, cite)}</li>
          ))}
        </ul>,
      );
    list = [];
  };
  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) list.push(bullet[1]);
    else {
      flush();
      if (line.trim()) blocks.push(<p key={blocks.length}>{inline(line.replace(/^#+\s*/, ""), cite)}</p>);
    }
  }
  flush();
  return <>{blocks}</>;
}

/** Team-only chat about one traveller's trip. Kept in this browser tab only. */
export default function TripAsk({ peer, onUse, onShowSource }: Props) {
  const [turns, setTurns] = useState<Turn[]>([]),
    [question, setQuestion] = useState(""),
    [asking, setAsking] = useState(false),
    [error, setError] = useState(""),
    [copied, setCopied] = useState<number | null>(null),
    [quote, setQuote] = useState<{ turn: number; n: string } | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [turns.length, asking]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || asking) return;
    setAsking(true);
    setError("");
    setQuestion("");
    setTurns((t) => [...t, { role: "team", text: q }]);
    try {
      // Recent turns only, trimmed so the request stays small.
      const history = turns.slice(-8).map((t) => ({ role: t.role, text: t.text.slice(0, 2500) }));
      const response = await fetch(`/api/inbox/conversations/${peer}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant could not answer.");
      setTurns((t) => [...t, { role: "assistant", text: data.answer, sources: data.sources }]);
    } catch (e) {
      setError((e as Error).message);
      setTurns((t) => t.slice(0, -1));
      setQuestion(q);
    } finally {
      setAsking(false);
    }
  }

  return (
    <section className={v.ask} aria-label="Trip assistant">
      {turns.length > 0 && (
        <div className={v.askTurns}>
          {turns.map((t, i) => {
            if (t.role === "team")
              return (
                <p key={i} className={v.askQ}>
                  {t.text}
                </p>
              );
            const shown = quote?.turn === i ? t.sources?.[quote.n] : undefined;
            const cite = (n: string) =>
              t.sources?.[n] ? (
                <button
                  className={`${v.cite} ${quote?.turn === i && quote.n === n ? v.citeOn : ""}`}
                  onClick={() => setQuote(quote?.turn === i && quote.n === n ? null : { turn: i, n })}
                  title="Show their message"
                >
                  #{n}
                </button>
              ) : (
                `#${n}`
              );
            return (
              <div key={i} className={v.askA}>
                <Answer text={t.text} cite={cite} />
                {shown && (
                  <blockquote className={v.askQuote}>
                    <small>
                      <Quote size={11} /> #{quote!.n} · {shown.role === "customer" ? "Traveller" : "ChinaPal"} ·{" "}
                      {new Date(shown.time).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </small>
                    <span>{shown.text}</span>
                    <button onClick={() => onShowSource(shown)}>Show in chat</button>
                  </blockquote>
                )}
                <span className={v.askActions}>
                  <button
                    onClick={() => {
                      void navigator.clipboard?.writeText(t.text.replace(/\*\*/g, ""));
                      setCopied(i);
                      setTimeout(() => setCopied((c) => (c === i ? null : c)), 1500);
                    }}
                  >
                    <Copy size={11} /> {copied === i ? "Copied" : "Copy"}
                  </button>
                  <button onClick={() => onUse(t.text.replace(/\*\*/g, "").replace(/\s*\(#\d+(?:,\s*#\d+)*\)/g, ""))} title="Add this to the reply draft">
                    <Reply size={11} /> Add to reply
                  </button>
                </span>
              </div>
            );
          })}
          {asking && (
            <p className={v.askThinking}>
              <Loader2 size={13} className={v.spin} /> Reading the chat…
            </p>
          )}
          <div ref={end} />
        </div>
      )}
      {error && (
        <p className={v.briefError} role="alert">
          {error}
        </p>
      )}
      <form
        className={v.askForm}
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
      >
        <textarea
          value={question}
          rows={2}
          maxLength={2000}
          placeholder="Ask anything about this traveller's trip…"
          aria-label="Ask about this trip"
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void ask(question);
            }
          }}
        />
        <button type="submit" aria-label="Ask" disabled={asking || !question.trim()}>
          {asking ? <Loader2 size={15} className={v.spin} /> : <ArrowUp size={15} />}
        </button>
      </form>
      <small className={v.askNote}>
        Only your team sees this; nothing is saved. Tap a #number to see their message.
        {turns.length > 0 && (
          <button className={v.clearAsk} onClick={() => setTurns([])} disabled={asking}>
            Clear chat
          </button>
        )}
      </small>
    </section>
  );
}
