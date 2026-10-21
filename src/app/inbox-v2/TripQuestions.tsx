"use client";
import { useState } from "react";
import { Check, ClipboardCheck, MessageCircleQuestion, Pencil, Plus, RotateCcw, X } from "lucide-react";
import type { QuestionOwner, TripQuestion } from "@/lib/inbox/question-data";
import v from "./v2.module.css";

type Props = {
  peer: string;
  questions: TripQuestion[];
  loading: boolean;
  onChange: (questions: TripQuestion[]) => void;
  onError: (message: string) => void;
};
const SOURCE: Record<TripQuestion["source"], string> = { brief: "from brief", plan: "from plan", team: "team" };

/** What we still need to ask the traveller or check ourselves. */
export default function TripQuestions({ peer, questions, loading, onChange, onError }: Props) {
  const [editing, setEditing] = useState<string | null>(null),
    [editText, setEditText] = useState(""),
    [adding, setAdding] = useState<QuestionOwner | null>(null),
    [newText, setNewText] = useState(""),
    [newUrgent, setNewUrgent] = useState(false),
    [saving, setSaving] = useState(false);

  async function change(body: Record<string, unknown>) {
    setSaving(true);
    try {
      const response = await fetch(`/api/inbox/conversations/${peer}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save. Please try again.");
      onChange(data.questions);
      return true;
    } catch (e) {
      onError((e as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  }
  const update = (q: TripQuestion, patch: Record<string, unknown>) => change({ action: "update", id: q.id, ...patch });

  const ask = questions.filter((q) => q.owner === "customer" && q.status === "open");
  const check = questions.filter((q) => q.owner === "team" && q.status === "open");
  const waiting = questions.filter((q) => q.status === "asked");
  const closed = questions.filter((q) => q.status === "answered" || q.status === "dismissed");
  const ticked = ask.filter((q) => q.include).length;

  function renderRow(q: TripQuestion) {
    if (editing === q.id)
      return (
        <li key={q.id}>
          <form
            className={v.inlineEdit}
            onSubmit={async (e) => {
              e.preventDefault();
              if (await update(q, { text: editText })) setEditing(null);
            }}
          >
            <input autoFocus value={editText} maxLength={300} onChange={(e) => setEditText(e.target.value)} aria-label="Edit question" onKeyDown={(e) => e.key === "Escape" && setEditing(null)} />
            <button type="submit" aria-label="Save" disabled={!editText.trim() || saving}>
              <Check size={14} />
            </button>
            <button type="button" aria-label="Cancel" onClick={() => setEditing(null)}>
              <X size={14} />
            </button>
          </form>
        </li>
      );
    const open = q.status === "open";
    return (
      <li key={q.id} className={`${v.item} ${v.question} ${q.include && open ? v.questionOn : ""}`}>
        {q.owner === "customer" && open ? (
          <label className={v.questionTick} title="Ask this in the next AI draft">
            <input type="checkbox" checked={q.include} disabled={saving} onChange={(e) => void update(q, { include: e.target.checked })} />
            <span className={v.srOnly}>Ask in the next draft</span>
          </label>
        ) : (
          <span className={v.questionDot} aria-hidden />
        )}
        <div className={v.questionBody}>
          <span>{q.text}</span>
          <span className={v.questionMeta}>
            {q.urgent && open && <b className={v.urgentTag}>Urgent</b>}
            {q.draft_id && open && <b className={v.inDraftTag}>In current draft</b>}
            <span>{SOURCE[q.source]}</span>
            {q.why && <span>· {q.why}</span>}
          </span>
          {q.answer && <span className={v.answer}>“{q.answer}”</span>}
        </div>
        <span className={v.itemActions}>
          {(open || q.status === "asked") && (
            <button aria-label={q.owner === "team" ? "Mark done" : "Mark answered"} title={q.owner === "team" ? "Done" : "Answered"} onClick={() => void update(q, { status: "answered" })}>
              <Check size={12} />
            </button>
          )}
          {open && (
            <button aria-label="Edit" title="Edit" onClick={() => (setEditing(q.id), setEditText(q.text))}>
              <Pencil size={12} />
            </button>
          )}
          {!open && (
            <button aria-label="Reopen" title="Reopen" onClick={() => void update(q, { status: "open" })}>
              <RotateCcw size={12} />
            </button>
          )}
          {q.status !== "dismissed" && (
            <button aria-label="Dismiss" title="Not needed" onClick={() => void update(q, { status: "dismissed" })}>
              <X size={12} />
            </button>
          )}
        </span>
      </li>
    );
  }
  function renderAdd(owner: QuestionOwner) {
    if (adding !== owner)
      return (
        <button className={v.addButton} onClick={() => (setAdding(owner), setNewText(""), setNewUrgent(false))} aria-label={owner === "customer" ? "Add a question to ask" : "Add something to check"} title="Add">
          <Plus size={13} />
        </button>
      );
    return null;
  }
  function renderAddForm(owner: QuestionOwner) {
    if (adding !== owner) return null;
    return (
      <form
        className={v.questionAdd}
        onSubmit={async (e) => {
          e.preventDefault();
          if (await change({ action: "add", owner, text: newText, urgent: newUrgent })) setAdding(null);
        }}
      >
        <input autoFocus value={newText} maxLength={300} placeholder={owner === "customer" ? "Question for the traveller" : "Something the team must check"} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setAdding(null)} aria-label="New question" />
        <label>
          <input type="checkbox" checked={newUrgent} onChange={(e) => setNewUrgent(e.target.checked)} /> Urgent
        </label>
        <button type="submit" disabled={!newText.trim() || saving}>
          Add
        </button>
        <button type="button" aria-label="Cancel" onClick={() => setAdding(null)}>
          <X size={14} />
        </button>
      </form>
    );
  }

  return (
    <div className={v.brief}>
      <p className={v.questionsIntro}>
        {ticked
          ? `${ticked} ticked question${ticked > 1 ? "s" : ""} will go into the next AI draft, and are marked asked when that reply is sent.`
          : "Tick a question to have the next AI draft ask it. It is marked asked when that reply is sent."}
      </p>
      {loading && !questions.length && <p className={v.none}>Loading questions…</p>}

      <section className={v.briefSection}>
        <header>
          <h4>
            <MessageCircleQuestion size={13} /> Ask the traveller
          </h4>
          {renderAdd("customer")}
        </header>
        {ask.length ? <ul>{ask.map(renderRow)}</ul> : adding !== "customer" && <p className={v.none}>Nothing to ask right now</p>}
        {renderAddForm("customer")}
      </section>

      <section className={v.briefSection}>
        <header>
          <h4>
            <ClipboardCheck size={13} /> Team to check
          </h4>
          {renderAdd("team")}
        </header>
        {check.length ? <ul>{check.map(renderRow)}</ul> : adding !== "team" && <p className={v.none}>Nothing to check</p>}
        {renderAddForm("team")}
      </section>

      {waiting.length > 0 && (
        <section className={v.briefSection}>
          <header>
            <h4>Asked, waiting for an answer</h4>
          </header>
          <ul>{waiting.map(renderRow)}</ul>
        </section>
      )}

      {closed.length > 0 && (
        <details className={v.closedQuestions}>
          <summary>Answered, done or dismissed ({closed.length})</summary>
          <ul>{closed.map(renderRow)}</ul>
        </details>
      )}
      <p className={v.questionsHint}>
        Updating the trip brief adds missing basics and marks questions answered from the chat. Building a plan adds
        what it couldn&apos;t plan without.
      </p>
    </div>
  );
}
