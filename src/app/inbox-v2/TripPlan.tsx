"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BedDouble,
  CalendarCheck,
  Copy,
  ExternalLink,
  Lightbulb,
  Loader2,
  Map as MapIcon,
  RefreshCw,
  Sparkles,
  TrainFront,
} from "lucide-react";
import { BOOKING_LABELS, type PlanItem, type SavedPlan } from "@/lib/inbox/plan-data";
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

/** The AI's researched day-by-day plan, built in the background on request. */
export default function TripPlan({ peer, onQuestionsChanged }: Props) {
  const [saved, setSaved] = useState<SavedPlan | null>(null),
    [loading, setLoading] = useState(true),
    [starting, setStarting] = useState(false),
    [error, setError] = useState(""),
    [instruction, setInstruction] = useState(""),
    [copied, setCopied] = useState<string | null>(null),
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

  async function start() {
    setStarting(true);
    setError("");
    try {
      const body = await call<SavedPlan>(`conversations/${peer}/plan`, { instruction: instruction.trim() });
      request.current++;
      setSaved(body);
      setInstruction("");
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
  function copy(id: string, text: string) {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    });
  }

  const plan = saved?.plan;
  function renderItem(item: PlanItem, id: string) {
    const chinese = [item.place_cn, item.address_cn].filter(Boolean).join(" · ");
    return (
      <li key={id} className={`${v.planItem} ${item.kind === "fixed" ? v.planFixed : ""} ${item.kind === "option" ? v.planOption : ""}`}>
        <div className={v.planItemHead}>
          {item.time && <em className={v.time}>{item.time}</em>}
          <b>{item.title}</b>
          {item.kind === "fixed" && <span className={v.planKind}>Fixed</span>}
          {item.kind === "option" && <span className={v.planKind}>Option</span>}
        </div>
        {item.detail && <p>{item.detail}</p>}
        {chinese && (
          <button className={v.planChinese} onClick={() => copy(id, item.address_cn || item.place_cn)} title="Copy the Chinese name or address">
            <MapIcon size={12} />
            <span>{chinese}</span>
            <Copy size={11} />
            {copied === id && <small>Copied</small>}
          </button>
        )}
        {item.getting_there && (
          <p className={v.planRoute}>
            <TrainFront size={12} /> {item.getting_there}
          </p>
        )}
        {item.cost && <p className={v.planCost}>{item.cost}</p>}
        {item.verify && (
          <p className={v.planVerify}>
            <AlertTriangle size={12} /> Check: {item.verify}
          </p>
        )}
        {item.source && (
          <a className={v.planSource} href={item.source} target="_blank" rel="noreferrer noopener">
            <ExternalLink size={11} /> {host(item.source)}
          </a>
        )}
      </li>
    );
  }

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

      {running ? (
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
      ) : (
        !loading && (
          <form
            className={v.planStart}
            onSubmit={(e) => {
              e.preventDefault();
              void start();
            }}
          >
            {!plan && (
              <p className={v.briefEmpty}>
                A researched day-by-day plan around their fixed points, with Chinese addresses, metro routes, what to book
                and what still needs checking. Anything it can&apos;t plan without goes into Questions.
              </p>
            )}
            <textarea
              value={instruction}
              maxLength={2000}
              rows={2}
              placeholder={plan ? "What should change? e.g. move the perm to Tuesday, add a qipao shop" : "Anything to focus on? (optional) e.g. perm on Monday, relaxed first day"}
              onChange={(e) => setInstruction(e.target.value)}
              aria-label="Instruction for the plan"
            />
            <div className={v.generateRow}>
              <button className={v.generate} type="submit" disabled={starting}>
                {starting ? <Loader2 size={14} className={v.spin} /> : plan ? <RefreshCw size={14} /> : <Sparkles size={14} />}
                {starting ? "Starting…" : plan ? (instruction.trim() ? "Revise plan" : "Rebuild plan") : "Build plan"}
              </button>
              <span>{plan ? "Takes a few minutes · the current plan stays until the new one is ready" : "Takes 3–10 minutes"}</span>
            </div>
          </form>
        )
      )}

      {plan && saved && (
        <>
          <p className={v.planMeta}>
            Built {saved.generated_at ? ago(saved.generated_at) : ""}
            {saved.started_by ? ` by ${saved.started_by}` : ""}
            {saved.usage ? ` · ${saved.usage.searches} web searches` : ""}
            {saved.started_at && saved.generated_at ? ` · took ${minutes(saved.started_at, Date.parse(saved.generated_at))} min` : ""}
            {saved.instruction ? ` · asked: “${saved.instruction}”` : ""}
          </p>
          {plan.overview && <p className={v.planOverview}>{plan.overview}</p>}

          <section className={v.briefSection}>
            <ol className={v.timeline}>
              {plan.days.map((d, di) => (
                <li key={di} className={v.day}>
                  <div className={v.dayHead}>
                    <b>{d.label || d.date}</b>
                    <span>{d.city}</span>
                  </div>
                  {d.base && (
                    <p className={v.planBase}>
                      <BedDouble size={12} /> {d.base}
                    </p>
                  )}
                  <ul className={v.planItems}>
                    {d.items.map((item, ii) => renderItem(item, `${di}-${ii}`))}
                    {!d.items.length && <li className={v.free}>Free day</li>}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          {plan.bookings.length > 0 && (
            <section className={v.briefSection}>
              <header>
                <h4>
                  <CalendarCheck size={13} /> To book
                </h4>
              </header>
              <ul>
                {plan.bookings.map((b, i) => (
                  <li key={i} className={v.planBooking}>
                    <span className={v.requestTop}>
                      <b>{b.item}</b>
                      <span className={`${v.status} ${b.status === "booked" ? v.status_booked : ""}`}>{BOOKING_LABELS[b.status]}</span>
                    </span>
                    <small>
                      {[b.when, b.how].filter(Boolean).join(" · ")}
                      {b.deadline && <strong> · by {b.deadline}</strong>}
                    </small>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {plan.tips.length > 0 && (
            <section className={v.briefSection}>
              <header>
                <h4>
                  <Lightbulb size={13} /> Tips for this trip
                </h4>
              </header>
              <ul className={v.planTips}>
                {plan.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          {plan.sources.length > 0 && (
            <details className={v.closedQuestions}>
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
        </>
      )}
    </div>
  );
}
