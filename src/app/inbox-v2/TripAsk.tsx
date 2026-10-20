"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Copy, Loader2, MessageCircleQuestion, Reply } from "lucide-react";
import v from "./v2.module.css";

type Turn = { role: "team" | "assistant"; text: string };
const SUGGESTIONS = ["What's still not booked?", "List every place they mentioned with Chinese names", "Write tomorrow's plan as a WeChat message"];

/** Team-only chat about one traveller's trip. Kept in this browser tab only. */
export default function TripAsk({ peer, onUse }: { peer: string; onUse: (text: string) => void }) {
  const [turns, setTurns] = useState<Turn[]>([]),
    [question, setQuestion] = useState(""),
    [asking, setAsking] = useState(false),
    [error, setError] = useState(""),
    [copied, setCopied] = useState<number | null>(null);
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
      const history = turns.slice(-8).map((t) => ({ ...t, text: t.text.slice(0, 2500) }));
      const response = await fetch(`/api/inbox/conversations/${peer}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant could not answer.");
      setTurns((t) => [...t, { role: "assistant", text: data.answer }]);
    } catch (e) {
      setError((e as Error).message);
      setTurns((t) => t.slice(0, -1));
      setQuestion(q);
    } finally {
      setAsking(false);
    }
  }

  return (
    <section className={`${v.briefSection} ${v.ask}`}>
      <header>
        <h4>
          <MessageCircleQuestion size={13} /> Ask about this trip
        </h4>
        {turns.length > 0 && (
          <button className={v.clearAsk} onClick={() => setTurns([])} disabled={asking}>
            Clear
          </button>
        )}
      </header>
      {!turns.length && (
        <div className={v.suggestions}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => void ask(s)} disabled={asking}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className={v.askTurns}>
        {turns.map((t, i) =>
          t.role === "team" ? (
            <p key={i} className={v.askQ}>
              {t.text}
            </p>
          ) : (
            <div key={i} className={v.askA}>
              <p>{t.text}</p>
              <span>
                <button
                  onClick={() => {
                    void navigator.clipboard?.writeText(t.text);
                    setCopied(i);
                    setTimeout(() => setCopied((c) => (c === i ? null : c)), 1500);
                  }}
                >
                  <Copy size={11} /> {copied === i ? "Copied" : "Copy"}
                </button>
                <button onClick={() => onUse(t.text)} title="Add this to the reply draft">
                  <Reply size={11} /> Add to reply
                </button>
              </span>
            </div>
          ),
        )}
        {asking && (
          <p className={v.askThinking}>
            <Loader2 size={13} className={v.spin} /> Reading the chat…
          </p>
        )}
        {error && (
          <p className={v.briefError} role="alert">
            {error}
          </p>
        )}
        <div ref={end} />
      </div>
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
          <ArrowUp size={15} />
        </button>
      </form>
      <small className={v.askNote}>Only your team sees this. It reads the chat, notes, brief and recent images; not saved.</small>
    </section>
  );
}
