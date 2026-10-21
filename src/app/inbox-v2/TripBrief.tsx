"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Lightbulb,
  Loader2,
  MapPin,
  MessageCircleQuestion,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  STAGES,
  applyEdits,
  itemText,
  type BriefFact,
  type BriefResponse,
  type BriefSection,
  type RequestStatus,
} from "@/lib/inbox/brief-data";
import type { ProfileSource } from "@/lib/inbox/profile-data";
import ContactAvatar from "../inbox/ContactAvatar";
import TripAsk from "./TripAsk";
import v from "./v2.module.css";

const REQUEST_LABELS: Record<RequestStatus, string> = {
  requested: "Requested",
  proposed: "Proposed",
  waiting_customer: "Waiting on them",
  booked: "Booked",
  done: "Done",
  customer_handles: "They handle it",
  declined: "Not needed",
};
type Props = {
  peer: string;
  name: string;
  username: string;
  picture?: string | null;
  revision: string;
  notes: string;
  archived: boolean;
  onNotes: (notes: string) => Promise<void>;
  onArchive: (archived: boolean) => Promise<void>;
  onAddToReply: (text: string) => void;
  onShowSource: (source: ProfileSource) => void;
  onBuilt: () => void; // a new brief may have changed the questions list
};

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
const ago = (iso: string) => {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 48 * 60) return `${Math.round(minutes / 60)} h ago`;
  return `${Math.round(minutes / 1440)} days ago`;
};
function countdown(start: string) {
  if (!start) return "";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
  const days = Math.round((Date.parse(start) - Date.parse(today)) / 86400000);
  if (days > 1) return `starts in ${days} days`;
  if (days === 1) return "starts tomorrow";
  if (days === 0) return "starts today";
  return `started ${-days} days ago`;
}

export default function TripBrief(props: Props) {
  const { peer } = props;
  const [data, setData] = useState<BriefResponse | null>(null);
  const [loading, setLoading] = useState(true),
    [generating, setGenerating] = useState(false),
    [error, setError] = useState(""),
    [editing, setEditing] = useState<string | null>(null),
    [draftText, setDraftText] = useState(""),
    [openSources, setOpenSources] = useState<string | null>(null),
    [notes, setNotes] = useState(props.notes),
    [notesState, setNotesState] = useState<"" | "saving" | "saved">(""),
    [askOpen, setAskOpen] = useState(false);
  const request = useRef(0);
  const notesTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const body = await call<BriefResponse>(`conversations/${peer}/brief`);
      if (id === request.current) setData(body);
    } catch (e) {
      if (id === request.current) setError((e as Error).message);
    } finally {
      if (id === request.current) setLoading(false);
    }
  }, [peer]);
  useEffect(() => {
    void load();
  }, [load, props.revision]);
  useEffect(() => setNotes(props.notes), [props.notes]);
  useEffect(() => () => clearTimeout(notesTimer.current), []);

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const body = await call<BriefResponse>(`conversations/${peer}/brief`, {});
      request.current++;
      setData(body);
      props.onBuilt();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }
  async function edit(change: Record<string, unknown>) {
    setError("");
    try {
      const body = await call<BriefResponse>(`conversations/${peer}/brief/edit`, change);
      request.current++;
      setData(body);
      setEditing(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  /** Replace an item: team items are rewritten, AI items are replaced by a team version. */
  async function replace(section: BriefSection, item: unknown, text: string) {
    const { editId, day } = (item ?? {}) as { editId?: string; day?: string };
    if (editId) {
      await edit({ remove: editId });
      if (text.trim()) await edit({ section, action: "set", text, day });
    } else if (text.trim()) await edit({ section, action: "set", text, day, target: itemText(section, item) });
  }
  async function remove(section: BriefSection, item: unknown) {
    const editId = (item as { editId?: string }).editId;
    await edit(editId ? { remove: editId } : { section, action: "hide", target: itemText(section, item) });
  }
  function saveNotes(value: string) {
    setNotes(value);
    setNotesState("saving");
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      props
        .onNotes(value)
        .then(() => setNotesState("saved"))
        .catch((e) => {
          setNotesState("");
          setError((e as Error).message);
        });
    }, 900);
  }

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
  const saved = data?.saved;
  const brief = saved?.brief ? applyEdits(saved.brief, saved.edits) : null;

  function renderEditor({ id, initial, onSave, placeholder }: { id: string; initial: string; onSave: (t: string) => void; placeholder?: string }) {
    if (editing !== id) return null;
    return (
      <form
        className={v.inlineEdit}
        onSubmit={(e) => {
          e.preventDefault();
          onSave(draftText);
        }}
      >
        <input
          autoFocus
          value={draftText}
          maxLength={500}
          placeholder={placeholder}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
          aria-label="Edit brief item"
        />
        <button type="submit" aria-label="Save" disabled={!draftText.trim() && !initial}>
          <Check size={14} />
        </button>
        <button type="button" aria-label="Cancel" onClick={() => setEditing(null)}>
          <X size={14} />
        </button>
      </form>
    );
  }
  function startEdit(id: string, text: string) {
    setEditing(id);
    setDraftText(text);
  }
  function renderSources({ id, sources }: { id: string; sources: ProfileSource[] }) {
    if (openSources !== id || !sources.length) return null;
    return (
      <div className={v.sources}>
        {sources.map((source, i) => (
          <button key={i} onClick={() => props.onShowSource(source)} title="Show this message in the chat">
            <small>
              {source.role === "customer" ? "Traveller" : "ChinaPal"} ·{" "}
              {new Date(source.time).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </small>
            <span>{source.text}</span>
          </button>
        ))}
      </div>
    );
  }
  /** One brief item with its sources, certainty and edit controls. */
  function renderItem({
    key,
    id,
    section,
    item,
    children,
    certainty,
    sources = [],
    className = "",
    extra,
  }: {
    key?: string;
    id: string;
    section: BriefSection;
    item: unknown;
    children: ReactNode;
    certainty?: BriefFact["certainty"];
    sources?: ProfileSource[];
    className?: string;
    extra?: ReactNode;
  }) {
    const team = !!(item as { editId?: string }).editId;
    if (editing === id)
      return <li key={key}>{renderEditor({ id, initial: itemText(section, item), onSave: (t) => void replace(section, item, t) })}</li>;
    return (
      <li key={key} className={`${v.item} ${certainty === "suggested" ? v.suggested : ""} ${certainty === "inferred" ? v.inferred : ""} ${className}`}>
        <button
          className={v.itemBody}
          onClick={() => setOpenSources(openSources === id ? null : id)}
          aria-expanded={openSources === id}
          title={sources.length ? "Show where this came from" : undefined}
        >
          {children}
          {team && <span className={v.teamTag}>Team</span>}
          {certainty === "suggested" && <span className={v.certainty}>our suggestion</span>}
          {certainty === "inferred" && <span className={v.certainty}>likely</span>}
        </button>
        {extra}
        <span className={v.itemActions}>
          <button aria-label="Edit" title="Edit" onClick={() => startEdit(id, itemText(section, item))}>
            <Pencil size={12} />
          </button>
          <button aria-label="Remove" title="Remove" onClick={() => void remove(section, item)}>
            <X size={12} />
          </button>
        </span>
        {renderSources({ id: id, sources: sources })}
      </li>
    );
  }
  function renderSection({
    title,
    icon,
    section,
    empty,
    children,
    count,
  }: {
    title: string;
    icon: ReactNode;
    section: BriefSection;
    empty: string;
    children: ReactNode;
    count: number;
  }) {
    const addId = `${section}-add`;
    return (
      <section className={v.briefSection}>
        <header>
          <h4>
            {icon} {title}
          </h4>
          <button className={v.addButton} onClick={() => startEdit(addId, "")} aria-label={`Add to ${title}`} title="Add">
            <Plus size={13} />
          </button>
        </header>
        {count ? <ul>{children}</ul> : editing !== addId && <p className={v.none}>{empty}</p>}
        {renderEditor({ id: addId, initial: "", placeholder: "Add an item", onSave: (t) => void edit({ section, action: "set", text: t }) })}
      </section>
    );
  }
  function renderSingle({ section, fact, label, icon }: { section: "need" | "dates" | "party" | "paid"; fact: BriefFact | null; label: string; icon?: ReactNode }) {
    const id = `single-${section}`;
    if (editing === id)
      return renderEditor({ id, initial: fact?.text ?? "", placeholder: label, onSave: (t) => void edit({ section, action: "set", text: t }) });
    return (
      <div className={`${v.single} ${v[`single_${section}`] ?? ""}`}>
        <button className={v.itemBody} onClick={() => setOpenSources(openSources === id ? null : id)} disabled={!fact?.sources.length && !fact}>
          {icon}
          <span className={fact ? "" : v.none}>{fact?.text || `${label}: not known yet`}</span>
          {brief?.teamSet[section] && <span className={v.teamTag}>Team</span>}
        </button>
        <span className={v.itemActions}>
          <button aria-label={`Edit ${label}`} title="Edit" onClick={() => startEdit(id, fact?.text ?? "")}>
            <Pencil size={12} />
          </button>
        </span>
        {renderSources({ id: id, sources: fact?.sources ?? [] })}
      </div>
    );
  }

  const coverage = saved?.coverage ?? data?.coverage;
  return (
    <div className={v.brief}>
      <div className={v.person}>
        <ContactAvatar name={props.name} picture={props.picture} />
        <div>
          <strong>{brief?.name || props.name}</strong>
          <a href="https://www.instagram.com/direct/inbox/" target="_blank" rel="noreferrer">
            @{props.username} <ArrowUpRight size={11} />
          </a>
        </div>
        {brief && (
          <label className={`${v.stage} ${v[`stage_${brief.stage.value}`] ?? ""}`} title={brief.stage.reason}>
            <span className={v.srOnly}>Stage</span>
            <select value={brief.stage.value} onChange={(e) => void edit({ section: "stage", action: "set", text: e.target.value })}>
              {Object.entries(STAGES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className={v.generateRow}>
        <button
          className={`${v.askJump} ${askOpen ? v.askJumpOn : ""}`}
          aria-expanded={askOpen}
          aria-controls="trip-ask"
          onClick={() => setAskOpen(!askOpen)}
        >
          <MessageCircleQuestion size={14} /> Ask AI
        </button>
        <button className={v.generate} onClick={() => void generate()} disabled={generating || loading || !coverage?.count}>
          {generating ? <Loader2 size={14} className={v.spin} /> : brief ? <RefreshCw size={14} /> : <Sparkles size={14} />}
          {generating ? "Reading the chat…" : brief ? "Update brief" : "Build trip brief"}
        </button>
        <span>
          {generating
            ? "Takes about 30–60 seconds"
            : saved?.generated_at
              ? `Updated ${ago(saved.generated_at)} · ${saved.coverage?.count ?? 0} messages`
              : coverage?.count
                ? `${coverage.count} messages to read`
                : "Open the chat to load messages first"}
        </span>
      </div>
      <div id="trip-ask" hidden={!askOpen}>
        <TripAsk peer={peer} onUse={props.onAddToReply} onShowSource={props.onShowSource} />
      </div>
      {data?.stale && !generating && (
        <p className={v.stale}>New messages or edits since this brief. Update it when you need the latest picture.</p>
      )}
      {error && (
        <p className={v.briefError} role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className={v.none}>
          <Loader2 size={13} className={v.spin} /> Loading brief…
        </p>
      )}
      {!loading && !brief && (
        <p className={v.briefEmpty}>
          A one-screen summary of this traveller: what they want from us, their route, what we&apos;re doing for them,
          what to watch out for, and whose turn it is.
        </p>
      )}

      {brief && (
        <>
          <div className={v.headline}>
            {renderSingle({ section: "need", fact: brief.need, label: "What they want" })}
            <div className={v.keyFacts}>
              {renderSingle({ section: "dates", fact: brief.dates, label: "Dates", icon: <CalendarDays size={13} /> })}
              {brief.start && <span className={v.countdown}>{countdown(brief.start)}</span>}
              {renderSingle({ section: "party", fact: brief.party, label: "Travel party", icon: <Users size={13} /> })}
              {renderSingle({ section: "paid", fact: brief.paid, label: "Payment", icon: <Check size={13} /> })}
            </div>
          </div>

          {brief.days.length > 0 && (
            <section className={v.briefSection}>
              <header>
                <h4>
                  <CalendarDays size={13} /> Day by day
                </h4>
              </header>
              <ol className={v.timeline}>
                {brief.days.map((d, di) => {
                  const key = d.date || d.label;
                  const addId = `day-add-${di}`;
                  const isToday = d.date === today;
                  return (
                    <li key={key || di} className={`${v.day} ${isToday ? v.today : ""} ${d.date && d.date < today ? v.past : ""}`}>
                      <div className={v.dayHead}>
                        <b>{d.label || d.date}</b>
                        <span>{d.city}</span>
                        {isToday && <span className={v.todayTag}>Today</span>}
                        <button className={v.addButton} onClick={() => startEdit(addId, "")} aria-label={`Add to ${d.label}`} title="Add">
                          <Plus size={12} />
                        </button>
                      </div>
                      <ul>
                        {d.items.map((item, ii) =>
                          renderItem({
                            key: `d${di}-${ii}`,
                            id: `day-${di}-${ii}`,
                            section: "days",
                            item,
                            certainty: item.certainty,
                            sources: item.sources,
                            className: `${v.dayItem} ${item.booked ? v.booked : ""}`,
                            children: (
                              <>
                                <span className={v.stopDot} aria-hidden />
                                <span>
                                  {item.time && <em className={v.time}>{item.time}</em>}
                                  {item.text}
                                  {item.booked && <span className={v.bookedTag}> Booked</span>}
                                </span>
                              </>
                            ),
                          }),
                        )}
                        {!d.items.length && editing !== addId && <li className={v.free}>Free day</li>}
                      </ul>
                      {renderEditor({
                        id: addId,
                        initial: "",
                        placeholder: `Add to ${d.label || "this day"}`,
                        onSave: (t) => void edit({ section: "days", action: "set", text: t, day: key }),
                      })}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {brief.days.length === 0 && renderSection({
            title: "Route",
            icon: <MapPin size={13} />,
            section: "route",
            empty: "No places yet",
            count: brief.route.length,
            children: brief.route.map((stop, i) =>
              renderItem({
                key: `r${i}`,
                id: `route-${i}`,
                section: "route",
                item: stop,
                certainty: stop.certainty,
                sources: stop.sources,
                className: `${v.stop} ${stop.booked ? v.booked : ""}`,
                children: (
                  <>
                    <span className={v.stopDot} aria-hidden />
                    <span className={v.stopText}>
                      <b>{stop.place}</b>
                      {stop.dates && <em>{stop.dates}</em>}
                      {stop.booked && <span className={v.bookedTag}>Booked</span>}
                      {stop.text && stop.text !== stop.place && <small>{stop.text}</small>}
                    </span>
                  </>
                ),
              }),
            ),
          })}

          {renderSection({
            title: "What we're doing for them",
            icon: <Check size={13} />,
            section: "requests",
            empty: "Nothing requested yet",
            count: brief.requests.length + brief.deadlines.length,
            children: (
              <>
                {brief.requests.map((r, i) =>
                  renderItem({
                    key: `q${i}`,
                    id: `req-${i}`,
                    section: "requests",
                    item: r,
                    sources: r.sources,
                    children: (
                      <>
                        <span className={v.requestTop}>
                          <b>{r.item}</b>
                          <span className={`${v.status} ${v[`status_${r.status}`] ?? ""}`}>{REQUEST_LABELS[r.status]}</span>
                        </span>
                        {r.next && <small>Next: {r.next}</small>}
                      </>
                    ),
                  }),
                )}
                {brief.deadlines.map((d, i) =>
                  renderItem({
                    key: `d${i}`,
                    id: `deadline-${i}`,
                    section: "deadlines",
                    item: d,
                    sources: d.sources,
                    className: v.deadline,
                    children: (
                      <>
                        <Clock size={13} />
                        <span>
                          {d.by && <b>{d.by}: </b>}
                          {d.text}
                        </span>
                      </>
                    ),
                  }),
                )}
              </>
            ),
          })}

          {renderSection({
            title: "Must know",
            icon: <AlertTriangle size={13} />,
            section: "mustKnow",
            empty: "Nothing flagged",
            count: brief.mustKnow.length,
            children: brief.mustKnow.map((m, i) =>
              renderItem({
                key: `m${i}`,
                id: `must-${i}`,
                section: "mustKnow",
                item: m,
                certainty: m.certainty,
                sources: m.sources,
                className: m.critical ? v.critical : "",
                children: (
                  <>
                    {m.critical && <AlertTriangle size={13} />}
                    <span>{m.text}</span>
                  </>
                ),
              }),
            ),
          })}

          {renderSection({
            title: "Preferences",
            icon: <Sparkles size={13} />,
            section: "preferences",
            empty: "None noted",
            count: brief.preferences.length,
            children: brief.preferences.map((p, i) =>
              renderItem({
                key: `p${i}`,
                id: `pref-${i}`,
                section: "preferences",
                item: p,
                certainty: p.certainty,
                sources: p.sources,
                children: <span>{p.text}</span>,
              }),
            ),
          })}

          {renderSection({
            title: "Ideas to offer",
            icon: <Lightbulb size={13} />,
            section: "ideas",
            empty: "No ideas yet",
            count: brief.ideas.length,
            children: brief.ideas.map((idea, i) =>
              renderItem({
                key: `i${i}`,
                id: `idea-${i}`,
                section: "ideas",
                item: idea,
                className: v.idea,
                children: (
                  <>
                    <span>{idea.text}</span>
                    {idea.why && <small>{idea.why}</small>}
                  </>
                ),
              }),
            ),
          })}
        </>
      )}

      <section className={v.briefSection}>
        <header>
          <h4>
            <Pencil size={13} /> Team notes
          </h4>
          <span className={v.notesState}>{notesState === "saving" ? "Saving…" : notesState === "saved" ? "Saved" : ""}</span>
        </header>
        <textarea
          className={v.notes}
          value={notes}
          maxLength={5000}
          placeholder="Anything the team and the AI should know: confirmed bookings, phone calls, preferences from WeChat…"
          onChange={(e) => saveNotes(e.target.value)}
          aria-label="Team notes"
        />
      </section>
      <button className={v.archive} onClick={() => void props.onArchive(!props.archived)}>
        {props.archived ? "Move back to inbox" : "Archive conversation"}
      </button>
    </div>
  );
}
