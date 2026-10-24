"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BellRing, CalendarPlus, Check, Copy, Loader2, MapPin, Plane, RotateCcw, Sparkles, SkipForward, X } from "lucide-react";
import { isDue, isMissed, reminderInstruction, type CareView, type Reminder } from "@/lib/inbox/care-data";
import v from "./v2.module.css";

type Props = {
  peer: string;
  /** Changes after a send, so statuses marked by the server show up. */
  refresh: string;
  /** Writes the reminder as the current draft; resolves to the draft's id. */
  onDraft: (instruction: string) => Promise<string | null>;
  onDue: (count: number) => void;
  onError: (message: string) => void;
  children?: ReactNode;
};

const when = (iso: string) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-GB", { timeZone: "Asia/Shanghai", weekday: "short", day: "numeric", month: "short" });
  const time = d.toLocaleTimeString("en-GB", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit" });
  return `${day}, ${time}`;
};
const dayName = (date: string) =>
  new Date(`${date}T12:00:00+08:00`).toLocaleDateString("en-GB", { timeZone: "Asia/Shanghai", weekday: "short", day: "numeric", month: "short" });
const STATUS: Record<Reminder["status"], string> = { todo: "To do", drafted: "Drafted", sent: "Sent", skipped: "Skipped" };

/** Looking after a traveller close to and during their trip. */
export default function TripCare({ peer, refresh, onDraft, onDue, onError, children }: Props) {
  const [care, setCare] = useState<CareView | null>(null),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState<string | null>(null),
    [adding, setAdding] = useState(false),
    [form, setForm] = useState({ date: "", time: "", title: "", detail: "" }),
    [allUpcoming, setAllUpcoming] = useState(false),
    [copied, setCopied] = useState("");

  const accept = useCallback(
    (view: CareView) => {
      setCare(view);
      onDue(view.reminders.filter((r) => isDue(r)).length);
    },
    [onDue],
  );
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/inbox/conversations/${peer}/care`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Could not load the reminders.");
        if (!cancelled) accept(data);
      })
      .catch((e) => !cancelled && onError((e as Error).message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [peer, refresh, accept, onError]);

  async function change(body: Record<string, unknown>, label: string) {
    setSaving(label);
    try {
      const response = await fetch(`/api/inbox/conversations/${peer}/care`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save. Please try again.");
      accept(data);
      return true;
    } catch (e) {
      onError((e as Error).message);
      return false;
    } finally {
      setSaving(null);
    }
  }
  async function draft(r: Reminder) {
    if (!care) return;
    setSaving(r.key);
    try {
      const id = await onDraft(reminderInstruction(r, care.days));
      if (id) await change({ action: "status", key: r.key, status: "drafted", draftId: id }, r.key);
    } finally {
      setSaving(null);
    }
  }
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      onError("Could not copy. Select the text instead.");
    }
  }

  if (loading && !care) return <p className={`${v.none} ${v.careLoading}`}>Loading reminders…</p>;
  if (!care) return <div className={v.brief}>{children}</div>;

  const due = care.reminders.filter((r) => isDue(r));
  const drafted = care.reminders.filter((r) => r.status === "drafted");
  const upcoming = care.reminders.filter((r) => r.status === "todo" && !isDue(r) && !isMissed(r));
  const done = care.reminders.filter((r) => r.status === "sent" || r.status === "skipped" || isMissed(r));
  const trip = care.trip;

  function row(r: Reminder, actions: "due" | "drafted" | "upcoming" | "done") {
    const busy = saving === r.key;
    return (
      <li key={r.key} className={`${v.careReminder} ${actions === "due" ? v.careDue : ""}`}>
        <div className={v.careReminderTop}>
          <strong>
            {r.important && actions !== "done" && <BellRing size={12} aria-label="Fixed times" />} {r.title}
          </strong>
          <span className={v.careWhen}>{actions === "done" ? (isMissed(r) ? "Missed" : `${STATUS[r.status]}${r.updated_by ? ` · ${r.updated_by}` : ""}`) : when(r.due)}</span>
        </div>
        {actions !== "done" && r.summary.length > 0 && (
          <ul className={v.careSummary}>
            {r.summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
        <div className={v.careActions}>
          {(actions === "due" || actions === "upcoming") && (
            <button className={v.careDraft} disabled={!!saving} onClick={() => void draft(r)}>
              {busy ? <Loader2 size={12} className={v.spinIcon} /> : <Sparkles size={12} />} Draft reminder
            </button>
          )}
          {actions === "drafted" && <span className={v.careHint}>In the reply box. Sending it marks this sent.</span>}
          {actions !== "done" && (
            <>
              <button disabled={!!saving} title="Sent it from the Instagram app" onClick={() => void change({ action: "status", key: r.key, status: "sent" }, r.key)}>
                <Check size={12} /> Sent
              </button>
              <button disabled={!!saving} title="Not needed" onClick={() => void change({ action: "status", key: r.key, status: "skipped" }, r.key)}>
                <SkipForward size={12} /> Skip
              </button>
            </>
          )}
          {actions === "done" && (
            <button disabled={!!saving} onClick={() => void change({ action: "status", key: r.key, status: "todo" }, r.key)}>
              <RotateCcw size={12} /> Reopen
            </button>
          )}
        </div>
      </li>
    );
  }

  const copyLine = (label: string, text: string) =>
    text && (
      <li key={label} className={v.careInfoLine}>
        <span>
          <b>{label}</b> {text}
        </span>
        <button aria-label={`Copy ${label}`} title="Copy" onClick={() => void copy(text)}>
          {copied === text ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </li>
    );

  return (
    <div className={v.brief}>
      <div className={v.careNow}>
        {trip.stage === "none" && <p>No trip dates yet. Build a plan or a brief with dates, or add an appointment below.</p>}
        {trip.stage === "before" && (
          <p>
            <Plane size={14} /> Arrives in <b>{trip.days === 1 ? "1 day" : `${trip.days} days`}</b> · {dayName(trip.start)}
          </p>
        )}
        {trip.stage === "during" && (
          <>
            <p>
              <MapPin size={14} /> In China · <b>Day {trip.day} of {trip.of}</b>
              {trip.today.city && ` · ${trip.today.city}`}
            </p>
            {trip.today.base && <small>Staying at {trip.today.base}</small>}
            {trip.next && (
              <small>
                Next fixed time: {dayName(trip.next.date)} · {trip.next.time && `${trip.next.time} `}
                {trip.next.title}
              </small>
            )}
          </>
        )}
        {trip.stage === "after" && <p>Trip ended {dayName(trip.end)}.</p>}
      </div>

      {!care.saved && <p className={v.careWarning}>Reminders show here, but marking them and adding appointments needs the care database migration.</p>}

      {care.reminders.length > 0 && (
        <section className={v.briefSection}>
          <header>
            <h4>
              <BellRing size={13} /> Due tonight
            </h4>
          </header>
          {due.length ? <ul className={v.careList}>{due.map((r) => row(r, "due"))}</ul> : <p className={v.none}>Nothing due tonight</p>}
        </section>
      )}

      {drafted.length > 0 && (
        <section className={v.briefSection}>
          <header>
            <h4>Drafted, not sent yet</h4>
          </header>
          <ul className={v.careList}>{drafted.map((r) => row(r, "drafted"))}</ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className={v.briefSection}>
          <header>
            <h4>Coming up</h4>
          </header>
          <ul className={v.careList}>{(allUpcoming ? upcoming : upcoming.slice(0, 3)).map((r) => row(r, "upcoming"))}</ul>
          {upcoming.length > 3 && (
            <button className={v.careMore} onClick={() => setAllUpcoming(!allUpcoming)}>
              {allUpcoming ? "Show fewer" : `Show all ${upcoming.length}`}
            </button>
          )}
        </section>
      )}

      <section className={v.briefSection}>
        <header>
          <h4>
            <CalendarPlus size={13} /> Appointments
          </h4>
          {!adding && (
            <button className={v.addButton} aria-label="Add an appointment" title="Add" onClick={() => setAdding(true)} disabled={!care.saved}>
              +
            </button>
          )}
        </header>
        {care.events.length ? (
          <ul className={v.careList}>
            {care.events.map((e) => (
              <li key={e.id} className={v.careInfoLine}>
                <span>
                  <b>
                    {dayName(e.date)}
                    {e.time && ` ${e.time}`}
                  </b>{" "}
                  {e.title}
                  {e.detail && <small> · {e.detail}</small>}
                </span>
                <button aria-label="Remove appointment" title="Remove" disabled={!!saving} onClick={() => void change({ action: "remove", key: e.id }, e.id)}>
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !adding && <p className={v.none}>Haircut, tour, dinner booking… added here go into that night-before reminder.</p>
        )}
        {adding && (
          <form
            className={v.careForm}
            onSubmit={async (e) => {
              e.preventDefault();
              if (await change({ action: "add", ...form }, "add")) {
                setAdding(false);
                setForm({ date: "", time: "", title: "", detail: "" });
              }
            }}
          >
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} aria-label="Date" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} aria-label="Time" />
            <input autoFocus required maxLength={120} placeholder="What, e.g. Haircut at 发型屋" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Appointment" />
            <textarea maxLength={600} rows={2} placeholder="Chinese address, how to get there, anything to bring" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} aria-label="Details" />
            <div>
              <button type="submit" disabled={!form.date || !form.title.trim() || !!saving}>
                Add
              </button>
              <button type="button" onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      <section className={v.briefSection}>
        <header>
          <h4>Key info</h4>
        </header>
        <ul className={v.careList}>
          {care.info.hotels.map((h, i) => copyLine(care.info.hotels.length > 1 ? `Hotel ${i + 1}` : "Hotel", h))}
          {copyLine("Arrival", care.info.arrival)}
          {copyLine("Departure", care.info.departure)}
          {copyLine("Emergency", "Police 110 · Ambulance 120 · Fire 119")}
        </ul>
      </section>

      {done.length > 0 && (
        <details className={v.closedQuestions}>
          <summary>Sent, skipped or missed ({done.length})</summary>
          <ul className={v.careList}>{done.map((r) => row(r, "done"))}</ul>
        </details>
      )}

      {children && (
        <section className={v.briefSection}>
          <header>
            <h4>Open questions</h4>
          </header>
          <div className={v.careQuestions}>{children}</div>
        </section>
      )}
    </div>
  );
}
