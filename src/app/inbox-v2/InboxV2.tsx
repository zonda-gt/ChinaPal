"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Inbox as InboxIcon,
  Languages,
  Loader2,
  LockKeyhole,
  LogOut,
  MessageSquare,
  PanelRight,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import type { Conversation, Draft, Message, Staff } from "@/lib/inbox/types";
import type { ProfileSource } from "@/lib/inbox/profile-data";
import s from "../inbox/inbox.module.css";
import usePanelLayout from "../inbox/usePanelLayout";
import useContactIdentities from "../inbox/useContactIdentities";
import ContactAvatar from "../inbox/ContactAvatar";
import useMessageScroll from "../inbox/useMessageScroll";
import TripBrief from "./TripBrief";
import TripPlan from "./TripPlan";
import TripQuestions from "./TripQuestions";
import type { TripQuestion } from "@/lib/inbox/question-data";
import v from "./v2.module.css";

type Thread = {
  conversation: Conversation;
  messages: Message[];
  drafts: Draft[];
  canSend: boolean;
  latestInbound: string | null;
};
type Filter = "all" | "needs" | "drafts" | "unread" | "archived";
const MAX_MESSAGES = 3;

async function api<T>(path: string, body?: unknown): Promise<T> {
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
const date = (value: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";
const time = (value: string) => new Date(value).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
function waited(iso: string | null) {
  if (!iso) return "";
  const minutes = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 48 * 60) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}
const isUnread = (c: Conversation) =>
  c.stage !== "archived" && !!c.last_message_at && (!c.last_seen_at || c.last_message_at > c.last_seen_at);
const needsReply = (c: Conversation) => c.stage !== "archived" && c.last_direction === "inbound";

/** A textarea that grows with its text, shown as an outgoing message bubble. */
function BubbleInput(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [props.value]);
  return <textarea ref={ref} rows={1} {...props} />;
}

export default function InboxV2() {
  const panels = usePanelLayout();
  const [staff, setStaff] = useState<Staff | null>(null),
    [checking, setChecking] = useState(true),
    [password, setPassword] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]),
    [selected, setSelected] = useState<string | null>(null),
    [thread, setThread] = useState<Thread | null>(null);
  const identities = useContactIdentities(conversations, !!staff);
  const messageScroll = useMessageScroll(thread?.conversation.peer_id ?? null, thread?.messages);
  function contactLabel(c?: Conversation) {
    if (!c) return "Loading…";
    const identity = identities.contacts[c.peer_id];
    return identity?.name || `@${identity?.username || c.username}`;
  }
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState<Filter>("all"),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null),
    [text, setText] = useState(""),
    [parts, setParts] = useState<string[]>([]),
    [facts, setFacts] = useState(""),
    [instruction, setInstruction] = useState(""),
    [dirty, setDirty] = useState(false),
    [conflict, setConflict] = useState(false);
  // Right column: trip brief, the AI plan and the questions list.
  const [panelTab, setPanelTab] = useState<"brief" | "plan" | "questions">("brief"),
    [questions, setQuestions] = useState<TripQuestion[]>([]),
    [questionsLoading, setQuestionsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false),
    [image, setImage] = useState<string | null>(null),
    [confirmSend, setConfirmSend] = useState(false),
    [limit, setLimit] = useState(100);
  // Redesign state: composer layout, the warnings checklist, undo and chat tools.
  const [composerOpen, setComposerOpen] = useState(false),
    [tab, setTab] = useState<"reply" | "facts">("reply"),
    [checksOpen, setChecksOpen] = useState(false),
    [checked, setChecked] = useState<Record<string, boolean>>({}),
    [undo, setUndo] = useState<{ text: string; parts: string[] } | null>(null),
    [findOpen, setFindOpen] = useState(false),
    [query, setQuery] = useState(""),
    [match, setMatch] = useState(0),
    [translations, setTranslations] = useState<Record<string, string>>({}),
    [translating, setTranslating] = useState<string | null>(null),
    [flash, setFlash] = useState<string | null>(null);
  const limitRef = useRef(limit),
    busyRef = useRef(false);
  // Keep recent chats in this signed-in tab only; never persist customer data
  // in localStorage. Request IDs prevent late responses from replacing newer data.
  const threadCache = useRef(new Map<string, { data: Thread; limit: number }>()),
    latestRequests = useRef(new Map<string, number>()),
    requestId = useRef(0),
    selectionVersion = useRef(0),
    sessionVersion = useRef(0),
    importing = useRef(new Set<string>());
  const selectedRef = useRef(selected),
    dirtyRef = useRef(dirty),
    draftRef = useRef(draft);
  limitRef.current = limit;
  selectedRef.current = selected;
  dirtyRef.current = dirty;
  draftRef.current = draft;
  const loadList = useCallback(async () => {
    const result = await api<{ conversations: Conversation[] }>("conversations");
    setConversations(result.conversations);
  }, []);
  const loadThread = useCallback(async (peer: string, count = 100, reset = false) => {
    const selection = selectionVersion.current;
    const request = ++requestId.current;
    latestRequests.current.set(peer, request);
    const data = await api<Thread>(`conversations/${peer}?limit=${count}`);
    if (latestRequests.current.get(peer) !== request) return;
    threadCache.current.delete(peer);
    threadCache.current.set(peer, { data, limit: count });
    if (threadCache.current.size > 30) threadCache.current.delete(threadCache.current.keys().next().value!);
    if (selectedRef.current !== peer || selectionVersion.current !== selection) return data;
    setThread(data);
    const saved = data.drafts.find((d) => d.status === "draft") || null;
    if (reset || !dirtyRef.current) {
      setDraft(saved);
      setText(saved?.body || "");
      setParts(saved?.parts ?? []);
      setFacts(saved?.staff_facts ?? "");
      setConflict(false);
    } else if (saved?.id !== draftRef.current?.id || saved?.version !== draftRef.current?.version) setConflict(true);
    const seenAt = data.messages.at(-1)?.sent_at;
    if (seenAt && document.visibilityState === "visible") await api(`conversations/${peer}/read`, { seenAt });
    return data;
  }, []);
  useEffect(() => {
    api<{ staff: Staff }>("session")
      .then((d) => setStaff(d.staff))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (!staff) return;
    loadList().catch((e) => setError(e.message));
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") loadList().catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [staff, loadList]);
  useEffect(() => {
    if (!selected || !staff) return;
    let cancelled = false;
    const session = sessionVersion.current;
    // Hydration happens immediately in choose(). Revalidate saved data without
    // blanking the chat. Instagram is needed only for a first history import.
    loadThread(selected, limitRef.current)
      .then(async (data) => {
        if (!cancelled && data && !data.conversation.synced_at && data.conversation.thread_id && !importing.current.has(selected)) {
          importing.current.add(selected);
          try {
            await api(`conversations/${selected}/sync`, {});
            if (sessionVersion.current === session)
              await loadThread(selected, threadCache.current.get(selected)?.limit ?? 100);
          } catch (e) {
            if (!cancelled) setError((e as Error).message);
          } finally {
            importing.current.delete(selected);
          }
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") loadThread(selected, limitRef.current).catch(() => {});
    }, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [selected, staff, loadThread]);
  const lastMessageId = thread?.messages.at(-1)?.id;
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  async function run(label: string, action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(label);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      busyRef.current = false;
      setBusy("");
    }
  }
  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    await run("login", async () => {
      await api("auth/login", { password });
      const result = await api<{ staff: Staff }>("session");
      setPassword("");
      setStaff(result.staff);
    });
  }
  async function refreshList() {
    await run("sync", async () => {
      let cursor: string | null = null;
      let total = 0;
      do {
        const result: { count: number; cursor: string | null } = await api("sync", { cursor });
        total += result.count;
        cursor = result.cursor;
        await loadList();
      } while (cursor);
      setNotice(`${total} conversations synced from Instagram.`);
    });
  }
  function markDirty() {
    setDirty(true);
    dirtyRef.current = true;
  }
  function choose(peer: string | null) {
    if (busyRef.current || confirmSend) return;
    if (peer === selected) return;
    if (dirty && !window.confirm("Discard your unsaved changes and open another conversation?")) return;
    selectedRef.current = peer;
    selectionVersion.current++;
    const cached = peer ? threadCache.current.get(peer) : undefined;
    const saved = cached?.data.drafts.find((d) => d.status === "draft") || null;
    setThread(cached?.data ?? null);
    setDraft(saved);
    draftRef.current = saved;
    setText(saved?.body || "");
    setParts(saved?.parts ?? []);
    setFacts(saved?.staff_facts ?? "");
    setLimit(cached?.limit ?? 100);
    limitRef.current = cached?.limit ?? 100;
    setDirty(false);
    dirtyRef.current = false;
    setConflict(false);
    setError("");
    setNotice("");
    setInstruction("");
    setUndo(null);
    setTab("reply");
    setChecksOpen(false);
    setFindOpen(false);
    setQuery("");
    setComposerOpen(!!conversations.find((c) => c.peer_id === peer)?.has_draft);
    setSelected(peer);
    setDetailsOpen(false);
  }
  const loadQuestions = useCallback(async () => {
    const peer = selectedRef.current;
    if (!peer) return;
    setQuestionsLoading(true);
    try {
      const result = await api<{ questions: TripQuestion[] }>(`conversations/${peer}/questions`);
      if (selectedRef.current === peer) setQuestions(result.questions);
    } catch {
      // Before the questions migration the list simply stays empty.
      if (selectedRef.current === peer) setQuestions([]);
    } finally {
      if (selectedRef.current === peer) setQuestionsLoading(false);
    }
  }, []);
  useEffect(() => {
    setQuestions([]);
    if (selected) void loadQuestions();
  }, [selected, loadQuestions]);
  const toAsk = questions.filter((q) => q.owner === "customer" && q.status === "open" && q.include).length;
  function openQuestions() {
    setPanelTab("questions");
    setDetailsOpen(true);
  }
  function acceptDraft(d: Draft) {
    const cached = threadCache.current.get(d.peer_id);
    if (cached) {
      // A poll started before this save must not restore the old draft.
      latestRequests.current.delete(d.peer_id);
      const data = {
        ...cached.data,
        drafts: [d, ...cached.data.drafts.filter((other) => other.id !== d.id && other.status !== "draft")],
      };
      threadCache.current.set(d.peer_id, { ...cached, data });
      setThread(data);
    }
    setDraft(d);
    draftRef.current = d;
    setText(d.body);
    setParts(d.parts ?? []);
    setFacts(d.staff_facts ?? "");
    setDirty(false);
    dirtyRef.current = false;
    setConflict(false);
  }
  async function save() {
    if (!selected || !thread) return;
    const result = await api<{ draft: Draft }>(`conversations/${selected}/draft`, {
      text,
      parts: parts.filter((p) => p.trim()),
      staffFacts: facts,
      id: draft?.id,
      version: draft?.version,
      contextId: thread.messages.at(-1)?.id ?? null,
    });
    acceptDraft(result.draft);
    setUndo(null);
    return result.draft;
  }
  async function generate(revision?: string) {
    if (!selected) return;
    setComposerOpen(true);
    const before = { text, parts };
    await run("generate", async () => {
      const result = await api<{ draft: Draft }>(`conversations/${selected}/generate`, {
        instruction: revision ?? instruction,
        // The whole multi-message draft, so a revision can rework all of it.
        currentText: [text, ...parts].filter((p) => p.trim()).join("\n\n---\n\n"),
        staffFacts: facts,
        id: draft?.id,
        version: draft?.version,
      });
      acceptDraft(result.draft);
      void loadQuestions();
      setUndo(before.text.trim() ? before : null);
      setInstruction("");
      setTab("reply");
      setNotice("Draft ready. Review the details before sending.");
    });
  }
  async function send() {
    if (!selected || !draft || dirty) return;
    setConfirmSend(false);
    await run("send", async () => {
      const result = await api<{ next?: boolean }>(`conversations/${selected}/send`, {
        id: draft.id,
        version: draft.version,
        approved: true,
      });
      setDraft(null);
      setText("");
      setParts([]);
      setDirty(false);
      dirtyRef.current = false;
      setUndo(null);
      await loadThread(selected, limit, true);
      await loadList();
      void loadQuestions();
      setNotice(
        result.next
          ? "Reply sent on Instagram. The next message is ready below; review it before sending."
          : "Reply sent on Instagram.",
      );
    });
  }
  async function saveDetails(stage: Conversation["stage"], notes: string) {
    if (!selected) return;
    await api(`conversations/${selected}/details`, { stage, notes });
    await loadList();
  }
  function addToReply(question: string) {
    setComposerOpen(true);
    setTab("reply");
    if (parts.length) setParts(parts.map((p, i) => (i === parts.length - 1 ? `${p.trim()}\n\n${question}`.trim() : p)));
    else setText((t) => `${t.trim()}\n\n${question}`.trim());
    markDirty();
  }
  function scrollToMessage(id: string) {
    const viewport = messageScroll.viewport.current;
    const el = viewport?.querySelector<HTMLElement>(`[data-message="${CSS.escape(id)}"]`);
    if (!viewport || !el) return false;
    viewport.scrollTop += el.getBoundingClientRect().top - viewport.getBoundingClientRect().top - viewport.clientHeight / 3;
    setFlash(id);
    setTimeout(() => setFlash((f) => (f === id ? null : f)), 1800);
    return true;
  }
  function showSource(source: ProfileSource) {
    const found = thread?.messages.find((m) => m.sent_at === source.time) ??
      thread?.messages.find((m) => m.text.slice(0, 80) === source.text.slice(0, 80));
    if (!found || !scrollToMessage(found.id))
      setNotice("That message is further back. Use “Show older saved messages” at the top of the chat, then try again.");
  }
  async function translate(m: Message) {
    if (!selected || translating) return;
    setTranslating(m.id);
    try {
      const result = await api<{ translation: string }>(`conversations/${selected}/translate`, { text: m.text });
      setTranslations((t) => ({ ...t, [m.id]: result.translation }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTranslating(null);
    }
  }

  const active = thread?.conversation;
  const selectedContact = conversations.find((c) => c.peer_id === selected) || active;
  const selectedIdentity = selected ? identities.contacts[selected] : undefined;
  const staleDraft = !!draft && draft.context_id !== (lastMessageId ?? null);
  const pending = thread?.drafts.find((d) => d.id === active?.sending_draft_id);
  const messagesAll = [text, ...parts];
  const warnings = draft?.warnings ?? [];
  const checkKey = (i: number) => `${draft?.id}:${draft?.version}:${i}`;
  const checkedCount = warnings.filter((_, i) => checked[checkKey(i)]).length;
  const tooLong = messagesAll.some((m) => [...m].length > 1000);

  // Where the new messages start: after the draft was written, or after our last reply.
  const msgs = thread?.messages ?? [];
  let dividerAt = -1,
    dividerLabel = "";
  if (staleDraft && draft?.context_id) {
    const at = msgs.findIndex((m) => m.id === draft.context_id);
    if (at >= 0 && at < msgs.length - 1) {
      dividerAt = at + 1;
      dividerLabel = `${msgs.length - at - 1} new since this draft`;
    }
  } else {
    const lastOut = msgs.findLastIndex((m) => m.direction === "outbound");
    if (lastOut >= 0 && lastOut < msgs.length - 1 && msgs.at(-1)?.direction === "inbound") {
      dividerAt = lastOut + 1;
      dividerLabel = "New since your last reply";
    }
  }
  const needle = query.trim().toLowerCase();
  const matches = needle ? msgs.filter((m) => m.text.toLowerCase().includes(needle)).map((m) => m.id) : [];
  useEffect(() => {
    if (matches.length) scrollToMessage(matches[Math.min(match, matches.length - 1)]);
    // Scroll only when the search or the chosen match changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needle, match]);

  const counts = {
    needs: conversations.filter(needsReply).length,
    drafts: conversations.filter((c) => c.has_draft && c.stage !== "archived").length,
    unread: conversations.filter(isUnread).length,
  };
  const filtered = conversations.filter(
    (c) =>
      (filter === "all"
        ? c.stage !== "archived"
        : filter === "needs"
          ? needsReply(c)
          : filter === "drafts"
            ? c.has_draft && c.stage !== "archived"
            : filter === "unread"
              ? isUnread(c)
              : c.stage === "archived") &&
      [c.username, identities.contacts[c.peer_id]?.username, identities.contacts[c.peer_id]?.name].some((value) =>
        value?.toLowerCase().includes(search.toLowerCase()),
      ),
  );
  // Longest-waiting first when looking at chats that need a reply.
  if (filter === "needs") filtered.sort((a, b) => (a.last_message_at ?? "").localeCompare(b.last_message_at ?? ""));

  if (checking)
    return (
      <main className={s.login}>
        <Loader2 className={s.spin} />
        <p>Opening your inbox…</p>
      </main>
    );
  if (!staff)
    return (
      <main className={s.login} data-ph-no-capture data-clarity-mask="true">
        <Link href="/" className={s.brand}>
          China<span>Pal</span>
          <small>TEAM WORKSPACE</small>
        </Link>
        <form onSubmit={signIn} className={s.loginCard}>
          <div className={s.lock}>
            <LockKeyhole size={24} />
          </div>
          <h1>
            Your conversations,
            <br />a little easier.
          </h1>
          <p>Sign in to the private ChinaPal inbox to help travelers and prepare replies together.</p>
          <label htmlFor="admin-password">Admin password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          {error && (
            <div role="alert" className={s.error}>
              {error}
            </div>
          )}
          <button className={s.primary} disabled={!!busy}>
            {busy ? <Loader2 className={s.spin} size={18} /> : <LockKeyhole size={16} />} Open inbox
          </button>
          <small>
            <ShieldCheck size={14} /> Private access · Replies always reviewed by you
          </small>
        </form>
        <Link href="/privacy">Privacy policy</Link>
      </main>
    );
  return (
    <main
      ref={panels.workspace}
      style={panels.style}
      data-resizing={panels.active || undefined}
      className={`${s.workspace} ${v.layout}`}
      data-ph-no-capture
      data-clarity-mask="true"
    >
      <aside className={s.rail}>
        <Link href="/" className={s.railBrand} aria-label="ChinaPal home" title="ChinaPal home">
          C<span>P</span>
        </Link>
        <button className={s.railActive} onClick={() => choose(null)} aria-label="Inbox" title={`Inbox · ${counts.needs} need a reply`}>
          <InboxIcon size={22} />
          {counts.needs > 0 && <span className={s.railBadge}>{counts.needs}</span>}
        </button>
        <div className={s.railBottom}>
          <div className={s.staffAvatar} title="ChinaPal team · Shared admin access">
            CP
          </div>
          <button
            aria-label="Sign out"
            title="Sign out"
            onClick={() =>
              run("logout", async () => {
                if (dirty && !window.confirm("Sign out and discard unsaved edits?")) return;
                await api("auth/logout", {});
                threadCache.current.clear();
                identities.clear();
                latestRequests.current.clear();
                sessionVersion.current++;
                selectedRef.current = null;
                selectionVersion.current++;
                setStaff(null);
                setConversations([]);
                setThread(null);
                setSelected(null);
              })
            }
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <section ref={panels.list} id="conversation-list" className={`${s.listPanel} ${v.list} ${selected ? s.mobileHide : ""}`}>
        <header className={v.listHeader}>
          <div>
            <h1>Inbox</h1>
            <span className={v.channel}>
              <Camera size={12} /> Instagram · {conversations.length} chats <i className={v.connectedDot} /> Connected
            </span>
          </div>
          <button title="Sync conversations from Instagram" aria-label="Sync conversations" disabled={!!busy} onClick={refreshList}>
            <RefreshCw size={18} className={busy === "sync" ? s.spin : ""} />
          </button>
        </header>
        <label className={s.search}>
          <Search size={17} />
          <input
            placeholder="Find a conversation"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search conversations"
          />
        </label>
        <div className={v.filters} role="tablist" aria-label="Conversation filters">
          {(
            [
              ["all", "All", 0],
              ["needs", "Needs reply", counts.needs],
              ["drafts", "Drafts", counts.drafts],
              ["unread", "Unread", counts.unread],
              ["archived", "Archived", 0],
            ] as const
          ).map(([id, label, n]) => (
            <button key={id} role="tab" aria-selected={filter === id} className={filter === id ? v.filterActive : ""} onClick={() => setFilter(id)}>
              {label}
              {n > 0 && <b>{n}</b>}
            </button>
          ))}
        </div>
        <div className={s.conversationList}>
          {filtered.map((c) => (
            <button
              key={c.peer_id}
              className={`${s.conversationRow} ${v.row} ${selected === c.peer_id ? s.selected : ""}`}
              onClick={() => choose(c.peer_id)}
            >
              <ContactAvatar name={contactLabel(c)} picture={identities.contacts[c.peer_id]?.picture} />
              <span className={s.rowContent}>
                <span className={s.rowTop}>
                  <strong title={`@${identities.contacts[c.peer_id]?.username || c.username}`} className={isUnread(c) ? v.unreadName : ""}>
                    {contactLabel(c)}
                  </strong>
                  <time>{date(c.last_message_at)}</time>
                </span>
                <span className={s.rowBottom}>
                  <span className={s.preview}>
                    {c.last_direction === "outbound" ? "You: " : ""}
                    {c.last_preview || "History not loaded yet"}
                  </span>
                  {isUnread(c) && <i className={s.unreadDot} />}
                </span>
                {(needsReply(c) || c.has_draft) && (
                  <span className={v.rowTags}>
                    {needsReply(c) && (
                      <span
                        className={`${v.tag} ${Date.now() - Date.parse(c.last_message_at ?? "") > 12 * 3600000 ? v.tagLate : v.tagNeeds}`}
                      >
                        Needs reply · {waited(c.last_message_at)}
                      </span>
                    )}
                    {c.has_draft && <span className={`${v.tag} ${v.tagDraft}`}>Draft ready</span>}
                  </span>
                )}
              </span>
            </button>
          ))}
          {!filtered.length && (
            <div className={s.listEmpty}>
              <MessageSquare size={28} />
              <h3>{search ? "No matching conversations" : filter === "needs" ? "Everyone has a reply" : "Nothing here"}</h3>
              <p>{search ? "Try another name or Instagram username." : "Choose another filter to see more chats."}</p>
            </div>
          )}
        </div>
      </section>

      <section ref={panels.main} className={`${s.mainPanel} ${v.main} ${!selected ? s.mobileHide : ""}`}>
        <div className={`${s.resizeHandle} ${s.listResize}`} {...panels.handle("list", "Resize conversation list", "conversation-list")} />
        {!selected ? (
          <div className={s.welcome}>
            <div className={s.welcomeIcon}>
              <MessageSquare size={32} />
            </div>
            <span className={s.eyebrow}>A WARM WELCOME STARTS HERE</span>
            <h2>
              {counts.needs ? `${counts.needs} conversation${counts.needs > 1 ? "s" : ""} waiting for a reply` : "You're all caught up"}
            </h2>
            <p>Choose a conversation to read the history, prepare a helpful reply, and make it yours.</p>
            {counts.needs > 0 && (
              <button className={v.welcomeButton} onClick={() => setFilter("needs")}>
                Show chats that need a reply
              </button>
            )}
            <div>
              <ShieldCheck size={16} /> Nothing is sent until you approve it.
            </div>
          </div>
        ) : (
          <>
            <header className={`${s.threadHeader} ${v.threadHeader}`}>
              <button className={s.back} aria-label="Back to conversations" onClick={() => choose(null)}>
                <ArrowLeft size={20} />
              </button>
              <ContactAvatar name={contactLabel(selectedContact)} picture={selectedIdentity?.picture} />
              <div className={s.threadTitle}>
                <h2>{contactLabel(selectedContact)}</h2>
                <span>
                  <Camera size={12} /> {selectedIdentity?.username ? `@${selectedIdentity.username}` : "Instagram direct message"}
                </span>
              </div>
              {findOpen && (
                <div className={v.find}>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setMatch(0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && matches.length) setMatch((m) => (m + 1) % matches.length);
                      if (e.key === "Escape") {
                        setFindOpen(false);
                        setQuery("");
                      }
                    }}
                    placeholder="Search this chat"
                    aria-label="Search this chat"
                  />
                  <span>{needle ? `${matches.length ? Math.min(match, matches.length - 1) + 1 : 0}/${matches.length}` : ""}</span>
                  <button aria-label="Previous match" disabled={!matches.length} onClick={() => setMatch((m) => (m - 1 + matches.length) % matches.length)}>
                    <ChevronUp size={15} />
                  </button>
                  <button aria-label="Next match" disabled={!matches.length} onClick={() => setMatch((m) => (m + 1) % matches.length)}>
                    <ChevronDown size={15} />
                  </button>
                </div>
              )}
              <button
                aria-label={findOpen ? "Close search" : "Search this chat"}
                title="Search this chat"
                onClick={() => {
                  setFindOpen(!findOpen);
                  setQuery("");
                }}
              >
                {findOpen ? <X size={17} /> : <Search size={17} />}
              </button>
              <button
                disabled={!!busy || !thread}
                aria-label="Refresh messages"
                title="Refresh messages"
                onClick={() =>
                  run("refresh", async () => {
                    await api(`conversations/${selected}/sync`, {});
                    await loadThread(selected, limit);
                    setNotice("Latest messages refreshed.");
                  })
                }
              >
                <RefreshCw size={17} className={busy === "refresh" ? s.spin : ""} />
              </button>
              <button
                className={s.detailsButton}
                aria-label="Trip brief"
                aria-expanded={detailsOpen}
                aria-controls="contact-details"
                onClick={() => setDetailsOpen(!detailsOpen)}
              >
                <PanelRight size={17} /> <span>Brief</span>
              </button>
            </header>
            <div className={s.messages} ref={messageScroll.viewport} onScroll={messageScroll.onScroll} aria-label="Conversation messages">
              {!thread && (
                <div className={s.loading}>
                  <Loader2 className={s.spin} /> Loading conversation…
                </div>
              )}
              {thread && (
                <div ref={messageScroll.content}>
                  <div className={s.historyBar}>
                    <button
                      disabled={!!busy}
                      onClick={() =>
                        run("history", async () => {
                          if (!thread.conversation.history_complete) await api(`conversations/${selected}/sync`, { older: true });
                          const next = Math.min(limit + 100, 1000);
                          setLimit(next);
                          await loadThread(selected, next);
                        })
                      }
                    >
                      {busy === "history"
                        ? "Loading…"
                        : !thread.conversation.history_complete
                          ? "Load older history"
                          : limit < 1000 && thread.messages.length >= limit
                            ? "Show older saved messages"
                            : "Available history loaded"}
                    </button>
                    <span>{thread.messages.length} messages shown</span>
                  </div>
                  {thread.messages.map((m, index) => (
                    <div key={m.id}>
                      {(index === 0 || date(thread.messages[index - 1].sent_at) !== date(m.sent_at)) && (
                        <div className={s.day}>{date(m.sent_at)}</div>
                      )}
                      {index === dividerAt && (
                        <div className={v.newDivider}>
                          <span>{dividerLabel}</span>
                        </div>
                      )}
                      <div
                        data-message={m.id}
                        className={`${s.message} ${m.direction === "outbound" ? s.outbound : s.inbound} ${
                          matches.includes(m.id) ? v.match : ""
                        } ${matches[Math.min(match, matches.length - 1)] === m.id ? v.currentMatch : ""} ${flash === m.id ? v.flash : ""}`}
                      >
                        <div className={s.bubble}>
                          {m.deleted ? (
                            <em>Message was unsent</em>
                          ) : (
                            <>
                              {m.text && <p>{m.text}</p>}
                              {m.attachments.map((a, i) =>
                                a.type === "image" ? (
                                  <button key={i} className={s.imageButton} onClick={() => setImage(a.url)} aria-label="Open attached image">
                                    <img
                                      src={a.url}
                                      alt="Instagram message attachment"
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.alt = "Image unavailable — refresh or open Instagram";
                                      }}
                                    />
                                  </button>
                                ) : (
                                  <a key={i} href="https://www.instagram.com/direct/inbox/" target="_blank" rel="noreferrer">
                                    {a.type} attachment · View in Instagram <ArrowUpRight size={13} />
                                  </a>
                                ),
                              )}
                              {!m.text && !m.attachments.length && <em>Content unavailable through the API. View in Instagram.</em>}
                            </>
                          )}
                        </div>
                        {translations[m.id] && (
                          <p className={v.translation}>
                            <Languages size={12} /> {translations[m.id]}
                          </p>
                        )}
                        <time>
                          {m.direction === "outbound" && "ChinaPal · "}
                          {time(m.sent_at)}
                          {m.direction === "inbound" && m.text.trim() && !translations[m.id] && (
                            <button className={v.translate} onClick={() => void translate(m)} disabled={!!translating}>
                              {translating === m.id ? <Loader2 size={11} className={s.spin} /> : <Languages size={11} />} Translate
                            </button>
                          )}
                        </time>
                      </div>
                    </div>
                  ))}
                  {!thread.messages.length && <div className={s.loading}>No saved messages yet. Refresh to load this conversation.</div>}
                </div>
              )}
            </div>
            {thread && (
              <>
                {composerOpen && (
                  <div className={`${s.resizeHandle} ${s.composerResize}`} {...panels.handle("composer", "Resize reply assistant", "reply-assistant")} />
                )}
                <section
                  ref={panels.composer}
                  id="reply-assistant"
                  className={`${s.composer} ${v.composer} ${composerOpen ? v.composerOpen : v.composerClosed}`}
                >
                  <div className={v.composerTop}>
                    <button className={v.composerTitle} onClick={() => setComposerOpen(!composerOpen)} aria-expanded={composerOpen}>
                      <Sparkles size={15} /> Reply
                      <span className={v.saveState}>
                        {dirty ? "Unsaved edits" : draft ? `Draft saved · ${messagesAll.filter((m) => m.trim()).length} message${messagesAll.filter((m) => m.trim()).length > 1 ? "s" : ""}` : ""}
                      </span>
                      {composerOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                    </button>
                    {toAsk > 0 && (
                      <button className={v.askChip} onClick={openQuestions} title="Ticked questions the next AI draft will ask">
                        <CircleHelp size={13} /> Asks {toAsk} question{toAsk > 1 ? "s" : ""}
                      </button>
                    )}
                    {composerOpen && (
                      <div className={v.tabs} role="tablist">
                        <button role="tab" aria-selected={tab === "reply"} className={tab === "reply" ? v.tabActive : ""} onClick={() => setTab("reply")}>
                          Draft
                        </button>
                        <button role="tab" aria-selected={tab === "facts"} className={tab === "facts" ? v.tabActive : ""} onClick={() => setTab("facts")}>
                          What we&apos;ve done{facts.trim() && <i className={v.tabDot} />}
                        </button>
                      </div>
                    )}
                    {!composerOpen && (
                      <div className={v.closedActions}>
                        {!draft && (
                          <button onClick={() => setComposerOpen(true)} className={v.ghost}>
                            Write a reply
                          </button>
                        )}
                        <button className={v.generateButton} onClick={() => (draft ? setComposerOpen(true) : void generate())} disabled={!!busy || !thread.messages.length || !!pending}>
                          {busy === "generate" ? <Loader2 size={14} className={s.spin} /> : <Sparkles size={14} />}
                          {draft ? "Review draft" : "Generate draft"}
                        </button>
                      </div>
                    )}
                  </div>
                  {!composerOpen && draft && <p className={v.closedPreview}>{text}</p>}

                  {composerOpen && (
                    <>
                      {pending && (
                        <div className={s.warning}>
                          <strong>A reply is being sent or awaiting confirmation.</strong> If this remains pending for two
                          minutes, check the actual Instagram chat before resolving it.
                          <div>
                            {[
                              ["sent", "It was sent"],
                              ["not-sent", "It was not sent"],
                            ].map(([outcome, label]) => (
                              <button
                                key={outcome}
                                disabled={!!busy || Date.now() - Date.parse(pending.updated_at) < 120000}
                                onClick={() => {
                                  if (window.confirm("Have you checked the actual Instagram chat and confirmed this delivery status?"))
                                    run("resolve", async () => {
                                      await api(`conversations/${selected}/resolve`, { id: pending.id, outcome, checkedInstagram: true });
                                      await loadThread(selected, limit, true);
                                    });
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {staleDraft && !pending && (
                        <div className={v.staleBar}>
                          <span>
                            {dividerAt >= 0 ? dividerLabel : "New messages"} — the draft may be out of date.
                          </span>
                          <button disabled={!!busy || conflict} onClick={() => void generate("Update the reply for the newest messages.")}>
                            {busy === "generate" ? <Loader2 size={13} className={s.spin} /> : <RefreshCw size={13} />} Redo draft
                          </button>
                        </div>
                      )}
                      {conflict && (
                        <div className={s.warning}>
                          The shared draft changed while you were editing. Your text is preserved.
                          <button
                            onClick={() => {
                              if (window.confirm("Replace your unsaved text with the latest shared draft?")) {
                                setDirty(false);
                                dirtyRef.current = false;
                                loadThread(selected, limit, true).catch((e) => setError(e.message));
                              }
                            }}
                          >
                            Load shared draft
                          </button>
                        </div>
                      )}

                      {tab === "reply" ? (
                        <>
                          {warnings.length > 0 && (
                            <div className={v.checks}>
                              <button className={v.checksSummary} onClick={() => setChecksOpen(!checksOpen)} aria-expanded={checksOpen}>
                                <CircleHelp size={14} />
                                {warnings.length} thing{warnings.length > 1 ? "s" : ""} to check before sending
                                <span>
                                  {checkedCount}/{warnings.length} checked
                                </span>
                                {checksOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                              {checksOpen && (
                                <ul>
                                  {warnings.map((w, i) => (
                                    <li key={i}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={!!checked[checkKey(i)]}
                                          onChange={(e) => setChecked((c) => ({ ...c, [checkKey(i)]: e.target.checked }))}
                                        />
                                        <span>{w}</span>
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                          <div className={v.preview}>
                            <span className={v.previewLabel}>Draft · not sent yet</span>
                            {messagesAll.map((m, i) => (
                              <div key={i} className={v.outgoing}>
                                <BubbleInput
                                  className={v.bubbleInput}
                                  aria-label={`Message ${i + 1}`}
                                  value={m}
                                  maxLength={4000}
                                  placeholder={i === 0 ? "Write your reply, or generate a draft…" : "Next message…"}
                                  disabled={!!busy || !!pending}
                                  onChange={(e) => {
                                    if (i === 0) setText(e.target.value);
                                    else setParts(parts.map((p, j) => (j === i - 1 ? e.target.value : p)));
                                    markDirty();
                                  }}
                                />
                                <span className={`${v.bubbleMeta} ${[...m].length > 1000 ? v.over : ""}`}>
                                  {messagesAll.length > 1 && `Message ${i + 1} · `}
                                  {[...m].length}/1,000
                                  {i > 0 && (
                                    <button
                                      aria-label={`Remove message ${i + 1}`}
                                      disabled={!!busy || !!pending}
                                      onClick={() => {
                                        setParts(parts.filter((_, j) => j !== i - 1));
                                        markDirty();
                                      }}
                                    >
                                      <X size={12} /> Remove
                                    </button>
                                  )}
                                </span>
                              </div>
                            ))}
                            {messagesAll.length < MAX_MESSAGES && text.trim() && (
                              <button
                                className={v.addMessage}
                                disabled={!!busy || !!pending}
                                onClick={() => {
                                  setParts([...parts, ""]);
                                  markDirty();
                                }}
                              >
                                <Plus size={13} /> Add another message
                              </button>
                            )}
                          </div>
                          <div className={`${s.revision} ${v.revision}`}>
                            <Sparkles size={15} />
                            <input
                              aria-label="Instruction for the AI"
                              placeholder={text ? "Ask AI to change it, e.g. “mention the refund”…" : "Optional: tell the AI what to cover…"}
                              value={instruction}
                              onChange={(e) => setInstruction(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !busy) {
                                  e.preventDefault();
                                  void generate();
                                }
                              }}
                              disabled={!!busy || !!pending}
                            />
                            {undo && (
                              <button
                                className={v.undo}
                                onClick={() => {
                                  setText(undo.text);
                                  setParts(undo.parts);
                                  setUndo(null);
                                  markDirty();
                                }}
                                title="Go back to the text before the last AI change"
                              >
                                <Undo2 size={13} /> Undo
                              </button>
                            )}
                            <button disabled={!!busy || !!pending || !thread.messages.length || conflict} onClick={() => void generate()}>
                              {busy === "generate" ? <Loader2 size={15} className={s.spin} /> : <Sparkles size={15} />}
                              {text ? "Revise" : "Generate draft"}
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className={v.factsTab}>
                          <span>
                            Facts the AI can state as done in the next draft: calls made, bookings held, prices confirmed.
                          </span>
                          <textarea
                            aria-label="What we've done"
                            value={facts}
                            maxLength={2000}
                            onChange={(e) => {
                              setFacts(e.target.value);
                              markDirty();
                            }}
                            placeholder="e.g. “Called Fu 1088: earliest 9pm, private room, RMB500 min spend, booked as backup”"
                            disabled={!!busy || !!pending}
                          />
                        </label>
                      )}

                      <div className={`${s.composerFooter} ${v.footer}`}>
                        <span>{!thread.canSend && <b className={v.closedWindow}>Reply in Instagram: the 24-hour window has closed</b>}</span>
                        <div>
                          <button
                            disabled={!!busy || !text.trim() || conflict || !!pending || (!dirty && !!draft && !staleDraft)}
                            onClick={() =>
                              run("save", async () => {
                                await save();
                                setNotice("Draft saved for the team.");
                              })
                            }
                          >
                            Save draft
                          </button>
                          <button
                            className={s.primary}
                            disabled={!!busy || !draft || dirty || staleDraft || conflict || !!pending || !thread.canSend || tooLong}
                            onClick={() => setConfirmSend(true)}
                            title={dirty ? "Save the draft first" : undefined}
                          >
                            <Send size={15} /> Approve & send
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </section>

      <div className={`${s.resizeHandle} ${s.detailsResize} ${v.detailsResize}`} {...panels.handle("details", "Resize trip brief", "contact-details")} />
      <aside
        ref={panels.details}
        id="contact-details"
        aria-label="Trip brief"
        className={`${s.infoPanel} ${v.info} ${detailsOpen && selected ? `${s.infoOpen} ${v.open}` : ""}`}
      >
        <header className={`${s.infoHeading} ${v.infoHeading} ${v.panelHeading}`}>
          <h2 className={v.srOnly}>Trip</h2>
          <div className={v.panelTabs} role="tablist" aria-label="Trip panel">
            {(
              [
                ["brief", "Brief"],
                ["plan", "Plan"],
                ["questions", "Questions"],
              ] as const
            ).map(([key, label]) => {
              const open = questions.filter((q) => q.status === "open").length;
              return (
                <button key={key} role="tab" aria-selected={panelTab === key} className={panelTab === key ? v.panelTabOn : ""} onClick={() => setPanelTab(key)}>
                  {label}
                  {key === "questions" && open > 0 && <i className={v.panelCount}>{open}</i>}
                </button>
              );
            })}
          </div>
          <button className={s.infoClose} aria-label="Close trip brief" onClick={() => setDetailsOpen(false)}>
            <X size={18} />
          </button>
        </header>
        {selected && thread && panelTab === "plan" && <TripPlan key={selected} peer={selected} onQuestionsChanged={loadQuestions} />}
        {selected && thread && panelTab === "questions" && (
          <TripQuestions key={selected} peer={selected} questions={questions} loading={questionsLoading} onChange={setQuestions} onError={setError} />
        )}
        {selected && thread ? (
          <div hidden={panelTab !== "brief"}>
            <TripBrief
              key={selected}
              peer={selected}
              name={contactLabel(selectedContact)}
              username={selectedIdentity?.username || selectedContact?.username || ""}
              picture={selectedIdentity?.picture}
              revision={String(thread.messages.length)}
              notes={thread.conversation.notes}
              archived={thread.conversation.stage === "archived"}
              onNotes={(notes) => saveDetails(thread.conversation.stage, notes)}
              onArchive={async (archive) => {
                await run("details", async () => {
                  await saveDetails(archive ? "archived" : "inquiry", thread.conversation.notes);
                  await loadThread(selected, limit);
                  setNotice(archive ? "Conversation archived." : "Conversation moved back to the inbox.");
                });
              }}
              onAddToReply={addToReply}
              onShowSource={showSource}
              onBuilt={loadQuestions}
            />
          </div>
        ) : (
          <div className={s.infoEmpty}>
            <Check size={28} />
            <h3>Get to know your traveller</h3>
            <p>Select a conversation to see their trip brief and your team&apos;s notes.</p>
          </div>
        )}
      </aside>
      {(error || notice) && (
        <div role={error ? "alert" : "status"} className={`${s.toast} ${error ? s.error : s.success}`}>
          {error || notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => {
              setError("");
              setNotice("");
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {image && (
        <div className={s.overlay} onClick={() => setImage(null)}>
          <button aria-label="Close image" className={s.closeImage}>
            <X />
          </button>
          <img className={s.fullImage} src={image} alt="Expanded Instagram attachment" />
        </div>
      )}
      {confirmSend && (
        <div className={s.overlay}>
          <section role="dialog" aria-modal="true" aria-labelledby="send-title" className={s.sendDialog}>
            <div className={s.lock}>
              <Send size={22} />
            </div>
            <h2 id="send-title">Send this reply?</h2>
            <p>
              This will send a real Instagram DM to <strong>@{active?.username}</strong>.
            </p>
            <blockquote>{text}</blockquote>
            {parts.length > 0 && (
              <p>
                Message 1 of {parts.length + 1}. The next message will be ready for you to review and send after this one.
              </p>
            )}
            <div>
              <button onClick={() => setConfirmSend(false)}>Keep editing</button>
              <button className={s.primary} onClick={send}>
                <Check size={16} /> Send reply
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
