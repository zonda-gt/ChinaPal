"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  BedDouble,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Lightbulb,
  Loader2,
  Map as MapIcon,
  Maximize2,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  TrainFront,
  Undo2,
  X,
} from "lucide-react";
import { BOOKING_LABELS, cleanText, type PlanItem, type SavedPlan, type TripPlan as Plan } from "@/lib/inbox/plan-data";
import v from "./v2.module.css";

type Props = { peer: string; onQuestionsChanged: () => void };

async function call<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/inbox/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
const minutes = (from: string | null, to = Date.now()) => (from ? Math.max(0, Math.round((to - Date.parse(from)) / 60000)) : 0);
const ago = (iso: string) => {
  const m = minutes(iso);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  if (m < 48 * 60) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} days ago`;
};
const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
/** The first sentence, used as the one-line summary of a stop. */
function splitDetail(detail: string) {
  const text = cleanText(detail);
  const match = text.match(/^.+?[.!?](?=\s+[A-Z(]|$)/);
  const first = match ? match[0] : text;
  return { first, rest: text.slice(first.length).trim() };
}

/** One readable day-by-day plan: short rows, details on tap. */
function PlanView({ plan, wide, changed }: { plan: Plan; wide: boolean; changed: Set<string> }) {
  const [open, setOpen] = useState<Set<string>>(new Set()),
    [closedDays, setClosedDays] = useState<Set<number>>(new Set()),
    [copied, setCopied] = useState<string | null>(null),
    [allOpen, setAllOpen] = useState(false);
  const toggle = <T,>(set: Set<T>, key: T) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };
  function copy(id: string, text: string) {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    });
  }
  const checks = plan.days.flatMap((d) =>
    d.items.filter((i) => i.verify).map((i) => ({ day: d.label || d.date, title: i.title, verify: cleanText(i.verify) })),
  );
  const ourBookings = plan.bookings.filter((b) => b.status === "to_book").length;

  function renderStop(item: PlanItem, id: string) {
    const expanded = allOpen || open.has(id);
    const { first, rest } = splitDetail(item.detail);
    // Clock times sit in the time column; longer phrases go under the title.
    const shortTime =
      item.time.length <= 13 && (/^~?\d{1,2}:\d{2}/.test(item.time) || item.time.split(/\s+/).every((w) => w.length <= 7));
    const chinese = [item.place_cn, item.address_cn].filter(Boolean).join(" · ");
    const hasMore = !!(rest || chinese || item.getting_there || item.cost || item.verify || item.source);
    return (
      <li key={id} className={`${v.stopRow} ${item.kind === "fixed" ? v.stopFixed : ""} ${item.kind === "option" ? v.stopOption : ""} ${changed.has(id) ? v.stopUpdated : ""}`}>
        <span className={v.stopTime}>{shortTime ? item.time : ""}</span>
        <div className={v.stopMain}>
          <button
            className={v.stopHead}
            onClick={() => hasMore && setOpen(toggle(open, id))}
            aria-expanded={hasMore ? expanded : undefined}
            disabled={!hasMore}
          >
            <span className={v.stopTitle}>
              {item.title}
              {item.kind === "fixed" && <i className={v.stopTag}>Fixed</i>}
              {item.kind === "option" && <i className={v.stopTag}>Optional</i>}
              {changed.has(id) && <i className={v.updatedTag}>Updated</i>}
              {item.verify && (
                <i className={v.checkMark} title={`To check: ${cleanText(item.verify)}`}>
                  <AlertTriangle size={11} />
                </i>
              )}
            </span>
            {!shortTime && item.time && <span className={v.stopWhen}>{item.time}</span>}
            {first && <span className={v.stopSummary}>{first}</span>}
            {hasMore && (expanded ? <ChevronDown size={13} className={v.stopChevron} /> : <ChevronRight size={13} className={v.stopChevron} />)}
          </button>
          {expanded && hasMore && (
            <div className={v.stopDetails}>
              {rest && <p>{rest}</p>}
              {chinese && (
                <button className={v.planChinese} onClick={() => copy(id, item.address_cn || item.place_cn)} title="Copy for Amap or DiDi">
                  <MapIcon size={12} />
                  <span>{chinese}</span>
                  {copied === id ? <small>Copied</small> : <Copy size={11} />}
                </button>
              )}
              {item.getting_there && (
                <p className={v.planRoute}>
                  <TrainFront size={12} /> <span>{cleanText(item.getting_there)}</span>
                </p>
              )}
              {item.cost && <p className={v.planCost}>{cleanText(item.cost)}</p>}
              {item.verify && (
                <p className={v.planVerify}>
                  <AlertTriangle size={12} /> <span>{cleanText(item.verify)}</span>
                </p>
              )}
              {item.source && (
                <a className={v.planSource} href={item.source} target="_blank" rel="noreferrer noopener">
                  <ExternalLink size={11} /> {host(item.source)}
                </a>
              )}
            </div>
          )}
        </div>
      </li>
    );
  }

  return (
    <div className={`${v.planView} ${wide ? v.planWide : ""}`}>
      {plan.overview && (
        <button
          className={v.planOverview}
          onClick={() => setOpen(toggle(open, "overview"))}
          title={wide ? undefined : "Show the whole overview"}
        >
          <span className={!wide && !open.has("overview") ? v.overviewClamp : ""}>{cleanText(plan.overview)}</span>
        </button>
      )}
      <p className={v.planCounts}>
        <span>{plan.days.length} days</span>
        {ourBookings > 0 && <span>{ourBookings} for us to book</span>}
        {checks.length > 0 && (
          <span className={v.planCountsCheck}>
            <AlertTriangle size={11} /> {checks.length} to check
          </span>
        )}
        <button className={v.moreLink} onClick={() => (setAllOpen(!allOpen), setOpen(new Set()))}>
          {allOpen ? "Hide details" : "Show all details"}
        </button>
      </p>

      <ol className={v.planDays}>
        {plan.days.map((d, di) => {
          const closed = closedDays.has(di);
          return (
            <li key={di} className={v.planDay}>
              <button className={v.planDayHead} onClick={() => setClosedDays(toggle(closedDays, di))} aria-expanded={!closed}>
                {closed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                <b>{d.label || d.date}</b>
                <span>{d.city}</span>
              </button>
              {!closed && (
                <>
                  {d.base && (
                    <p className={v.planBase}>
                      <BedDouble size={12} /> {cleanText(d.base)}
                    </p>
                  )}
                  <ul className={v.stopList}>
                    {d.items.map((item, ii) => renderStop(item, `${di}-${ii}`))}
                    {!d.items.length && <li className={v.free}>Free day</li>}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ol>

      {plan.bookings.length > 0 && (
        <section className={v.planSection}>
          <h4>
            <CalendarCheck size={13} /> To book
          </h4>
          <ul>
            {plan.bookings.map((b, i) => (
              <li key={i} className={v.planBooking}>
                <span className={v.requestTop}>
                  <b>{b.item}</b>
                  <span className={`${v.status} ${b.status === "booked" ? v.status_booked : ""}`}>{BOOKING_LABELS[b.status]}</span>
                </span>
                {b.when && <small>{cleanText(b.when)}</small>}
                {b.deadline && <small className={v.bookingBy}>By: {cleanText(b.deadline)}</small>}
                {(allOpen || open.has(`b${i}`)) && b.how ? (
                  <small>{cleanText(b.how)}</small>
                ) : (
                  b.how && (
                    <button className={v.moreLink} onClick={() => setOpen(toggle(open, `b${i}`))}>
                      How
                    </button>
                  )
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {checks.length > 0 && (
        <details className={v.planSection}>
          <summary>
            <AlertTriangle size={13} /> Still to check ({checks.length})
          </summary>
          <ul className={v.checkList}>
            {checks.map((c, i) => (
              <li key={i}>
                <b>
                  {c.day} · {c.title}
                </b>
                <span>{c.verify}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {plan.tips.length > 0 && (
        <section className={v.planSection}>
          <h4>
            <Lightbulb size={13} /> Tips for this trip
          </h4>
          <ul className={v.planTips}>
            {plan.tips.map((t, i) => (
              <li key={i}>{cleanText(t)}</li>
            ))}
          </ul>
        </section>
      )}

      {plan.sources.length > 0 && (
        <details className={v.planSection}>
          <summary>Pages the research used ({plan.sources.length})</summary>
          <ul className={v.planSources}>
            {plan.sources.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer noopener">
                  {host(url)}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

/** The AI's researched day-by-day plan, built in the background on request. */
export default function TripPlan({ peer, onQuestionsChanged }: Props) {
  const [saved, setSaved] = useState<SavedPlan | null>(null),
    [loading, setLoading] = useState(true),
    [starting, setStarting] = useState(false),
    [error, setError] = useState(""),
    [instruction, setInstruction] = useState(""),
    [reviseOpen, setReviseOpen] = useState(false),
    [wide, setWide] = useState(false),
    [chatText, setChatText] = useState(""),
    [chatBusy, setChatBusy] = useState<"" | "send" | "undo">(""),
    [, setTick] = useState(0);
  const request = useRef(0),
    builtAt = useRef<string | null>(null);

  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const body = await call<SavedPlan>(`conversations/${peer}/plan`);
      if (id !== request.current) return;
      // A finished plan may have added questions to the list.
      if (builtAt.current !== null && body.generated_at !== builtAt.current) onQuestionsChanged();
      builtAt.current = body.generated_at ?? "";
      setSaved(body);
      setError("");
    } catch (e) {
      if (id === request.current) setError((e as Error).message);
    } finally {
      if (id === request.current) setLoading(false);
    }
  }, [peer, onQuestionsChanged]);
  useEffect(() => {
    void load();
  }, [load]);
  const running = saved?.status === "running";
  useEffect(() => {
    if (!running) return;
    const poll = setInterval(() => void load(), 8000),
      clock = setInterval(() => setTick((t) => t + 1), 30000);
    return () => (clearInterval(poll), clearInterval(clock));
  }, [running, load]);
  useEffect(() => {
    if (!wide) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setWide(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [wide]);

  async function start() {
    setStarting(true);
    setError("");
    try {
      const body = await call<SavedPlan>(`conversations/${peer}/plan`, { instruction: instruction.trim() });
      request.current++;
      setSaved(body);
      setInstruction("");
      setReviseOpen(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setStarting(false);
    }
  }
  async function cancel() {
    try {
      const body = await call<SavedPlan>(`conversations/${peer}/plan/cancel`, {});
      request.current++;
      setSaved(body);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function sendChat() {
    const message = chatText.trim();
    if (!message || chatBusy) return;
    setChatBusy("send");
    setError("");
    try {
      const body = await call<SavedPlan>(`conversations/${peer}/plan/chat`, { message });
      request.current++;
      setSaved(body);
      setChatText("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setChatBusy("");
    }
  }
  async function undo() {
    setChatBusy("undo");
    setError("");
    try {
      const body = await call<SavedPlan>(`conversations/${peer}/plan/undo`, {});
      request.current++;
      setSaved(body);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setChatBusy("");
    }
  }

  const plan = saved?.plan;
  // Stops changed by the latest chat reply get an "Updated" tag.
  const changed = new Set(plan?.chat?.filter((t) => t.role === "assistant").at(-1)?.changed ?? []);
  const meta =
    saved && plan
      ? [
          saved.generated_at && `Built ${ago(saved.generated_at)}`,
          saved.started_by && `by ${saved.started_by}`,
          saved.usage && `${saved.usage.searches} web searches`,
          saved.instruction && `asked: “${saved.instruction}”`,
        ]
          .filter(Boolean)
          .join(" · ")
      : "";
  const startForm = (
    <form
      className={v.planStart}
      onSubmit={(e) => {
        e.preventDefault();
        void start();
      }}
    >
      <textarea
        value={instruction}
        maxLength={2000}
        rows={2}
        autoFocus={!!plan}
        placeholder={plan ? "What should change? e.g. move the perm to Tuesday, add a qipao shop" : "Anything to focus on? (optional) e.g. perm on Monday, relaxed first day"}
        onChange={(e) => setInstruction(e.target.value)}
        aria-label="Instruction for the plan"
      />
      <div className={v.generateRow}>
        <button className={v.generate} type="submit" disabled={starting}>
          {starting ? <Loader2 size={14} className={v.spin} /> : plan ? <RefreshCw size={14} /> : <Sparkles size={14} />}
          {starting ? "Starting…" : plan ? (instruction.trim() ? "Revise plan" : "Rebuild from scratch") : "Build plan"}
        </button>
        <span>{plan ? "A few minutes · this plan stays until the new one is ready" : "Takes 3–10 minutes"}</span>
      </div>
    </form>
  );

  return (
    <div className={v.brief}>
      {loading && (
        <p className={v.none}>
          <Loader2 size={13} className={v.spin} /> Loading plan…
        </p>
      )}
      {error && (
        <p className={v.briefError} role="alert">
          {error}
        </p>
      )}
      {saved?.status === "failed" && saved.error && !running && (
        <p className={v.briefError} role="alert">
          {saved.error}
        </p>
      )}
      {running && (
        <div className={v.planRunning}>
          <Loader2 size={16} className={v.spin} />
          <div>
            <strong>Researching and planning… {minutes(saved.started_at)} min</strong>
            <span>
              Usually 3–10 minutes. You can keep working or close this; the plan saves itself
              {saved.instruction ? ` (asked: “${saved.instruction}”)` : ""}.
            </span>
          </div>
          <button className={v.ghostSmall} onClick={() => void cancel()}>
            Stop
          </button>
        </div>
      )}
      {!loading && !running && !plan && (
        <>
          <p className={v.briefEmpty}>
            A researched day-by-day plan around their fixed points, with Chinese addresses, metro routes, what to book and
            what still needs checking. Anything it can&apos;t plan without goes into Questions.
          </p>
          {startForm}
        </>
      )}

      {plan && (
        <>
          <div className={v.planToolbar}>
            <span>{meta}</span>
            <button className={v.ghostSmall} onClick={() => setWide(true)} title="Read the plan full width">
              <Maximize2 size={12} /> Full view
            </button>
          </div>
          <section className={v.planChat} aria-label="Change the plan with AI">
            <h4>
              <MessageSquare size={13} /> Change the plan with AI
            </h4>
            {!!plan.chat?.length && (
              <ol className={v.planChatLog}>
                {plan.chat.slice(-6).map((turn, i) => (
                  <li key={i} className={turn.role === "team" ? v.chatTeam : v.chatAi}>
                    {turn.role === "team" && turn.by && <small>{turn.by}</small>}
                    <span>{turn.text}</span>
                  </li>
                ))}
              </ol>
            )}
            <form
              className={v.planChatForm}
              onSubmit={(e) => {
                e.preventDefault();
                void sendChat();
              }}
            >
              <textarea
                value={chatText}
                maxLength={2000}
                rows={2}
                disabled={!!chatBusy || running}
                placeholder="e.g. Move the rowing boat to Monday afternoon and add lunch near Lingyin"
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendChat();
                  }
                }}
                aria-label="Ask the AI to change the plan"
              />
              <button type="submit" className={v.generate} disabled={!chatText.trim() || !!chatBusy || running} aria-label="Send">
                {chatBusy === "send" ? <Loader2 size={14} className={v.spin} /> : <Send size={14} />}
              </button>
            </form>
            <div className={v.planChatFoot}>
              <span>{chatBusy === "send" ? "Updating the plan… usually 15–40 seconds" : "Changes are saved straight away. The AI can’t browse here; use Revise below for changes that need research."}</span>
              {plan.undo && (
                <button className={v.ghostSmall} onClick={() => void undo()} disabled={!!chatBusy || running}>
                  {chatBusy === "undo" ? <Loader2 size={12} className={v.spin} /> : <Undo2 size={12} />} Undo last change
                </button>
              )}
            </div>
          </section>
          <PlanView plan={plan} wide={false} changed={changed} />
          {!running &&
            (reviseOpen ? (
              startForm
            ) : (
              <button className={v.reviseButton} onClick={() => setReviseOpen(true)}>
                <RefreshCw size={13} /> Revise or rebuild this plan
              </button>
            ))}
        </>
      )}

      {wide &&
        plan &&
        createPortal(
          <div className={v.planOverlay} role="dialog" aria-modal="true" aria-label="Trip plan" onClick={() => setWide(false)}>
            <div className={v.planSheet} onClick={(e) => e.stopPropagation()}>
              <header>
                <div>
                  <h2>Trip plan</h2>
                  <span>{meta}</span>
                </div>
                <button aria-label="Close" onClick={() => setWide(false)} autoFocus>
                  <X size={18} />
                </button>
              </header>
              <PlanView plan={plan} wide changed={changed} />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
