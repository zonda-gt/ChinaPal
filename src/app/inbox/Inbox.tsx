"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Inbox as InboxIcon,
  Camera,
  Loader2,
  LockKeyhole,
  LogOut,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { Conversation, Draft, Message, Staff } from "@/lib/inbox/types";
import s from "./inbox.module.css";
type Thread = {
  conversation: Conversation;
  messages: Message[];
  drafts: Draft[];
  canSend: boolean;
  latestInbound: string | null;
};
async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/inbox/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
const date = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "";
const time = (value: string) =>
  new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
const initials = (name: string) =>
  name
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 2)
    .toUpperCase();
export default function Inbox() {
  const [staff, setStaff] = useState<Staff | null>(null),
    [checking, setChecking] = useState(true),
    [password, setPassword] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]),
    [selected, setSelected] = useState<string | null>(null),
    [thread, setThread] = useState<Thread | null>(null);
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null),
    [text, setText] = useState(""),
    [instruction, setInstruction] = useState(""),
    [dirty, setDirty] = useState(false),
    [conflict, setConflict] = useState(false);
  const [notes, setNotes] = useState(""),
    [stage, setStage] = useState("inquiry"),
    [detailsOpen, setDetailsOpen] = useState(false),
    [image, setImage] = useState<string | null>(null),
    [confirmSend, setConfirmSend] = useState(false),
    [limit, setLimit] = useState(100);
  const limitRef = useRef(limit),
    busyRef = useRef(false);
  // Keep recent chats in this signed-in tab only; never persist customer data
  // in localStorage. Request IDs prevent late responses from replacing newer data.
  const threadCache = useRef(
      new Map<string, { data: Thread; limit: number }>(),
    ),
    latestRequests = useRef(new Map<string, number>()),
    requestId = useRef(0),
    selectionVersion = useRef(0),
    sessionVersion = useRef(0),
    importing = useRef(new Set<string>());
  const selectedRef = useRef(selected),
    dirtyRef = useRef(dirty),
    draftRef = useRef(draft),
    notesDirty = useRef(false),
    end = useRef<HTMLDivElement>(null);
  limitRef.current = limit;
  selectedRef.current = selected;
  dirtyRef.current = dirty;
  draftRef.current = draft;
  const loadList = useCallback(async () => {
    const result = await api<{ conversations: Conversation[] }>(
      "conversations",
    );
    setConversations(result.conversations);
  }, []);
  const loadThread = useCallback(
    async (peer: string, count = 100, reset = false) => {
      const selection = selectionVersion.current;
      const request = ++requestId.current;
      latestRequests.current.set(peer, request);
      const data = await api<Thread>(`conversations/${peer}?limit=${count}`);
      if (latestRequests.current.get(peer) !== request) return;
      threadCache.current.delete(peer);
      threadCache.current.set(peer, { data, limit: count });
      if (threadCache.current.size > 30)
        threadCache.current.delete(threadCache.current.keys().next().value!);
      if (
        selectedRef.current !== peer ||
        selectionVersion.current !== selection
      )
        return data;
      setThread(data);
      if (!notesDirty.current || reset) {
        setNotes(data.conversation.notes);
        setStage(data.conversation.stage);
      }
      const saved = data.drafts.find((d) => d.status === "draft") || null;
      if (reset || !dirtyRef.current) {
        setDraft(saved);
        setText(saved?.body || "");
        setConflict(false);
      } else if (
        saved?.id !== draftRef.current?.id ||
        saved?.version !== draftRef.current?.version
      )
        setConflict(true);
      const seenAt = data.messages.at(-1)?.sent_at;
      if (seenAt && document.visibilityState === "visible")
        await api(`conversations/${peer}/read`, { seenAt });
      return data;
    },
    [],
  );
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
        if (
          !cancelled &&
          data &&
          !data.conversation.synced_at &&
          data.conversation.thread_id &&
          !importing.current.has(selected)
        ) {
          importing.current.add(selected);
          try {
            await api(`conversations/${selected}/sync`, {});
            if (sessionVersion.current === session)
              await loadThread(
                selected,
                threadCache.current.get(selected)?.limit ?? 100,
              );
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
      if (document.visibilityState === "visible")
        loadThread(selected, limitRef.current).catch(() => {});
    }, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [selected, staff, loadThread]);
  const lastMessageId = thread?.messages.at(-1)?.id;
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [selected, lastMessageId]);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current || notesDirty.current) {
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
        const result: { count: number; cursor: string | null } = await api(
          "sync",
          { cursor },
        );
        total += result.count;
        cursor = result.cursor;
        await loadList();
      } while (cursor);
      setNotice(`${total} conversations synced from Instagram.`);
    });
  }
  function choose(peer: string | null) {
    if (busyRef.current || confirmSend) return;
    if (peer === selected) return;
    if (
      (dirty || notesDirty.current) &&
      !window.confirm(
        "Discard your unsaved changes and open another conversation?",
      )
    )
      return;
    selectedRef.current = peer;
    selectionVersion.current++;
    const cached = peer ? threadCache.current.get(peer) : undefined;
    const saved = cached?.data.drafts.find((d) => d.status === "draft") || null;
    setThread(cached?.data ?? null);
    setDraft(saved);
    draftRef.current = saved;
    setText(saved?.body || "");
    setNotes(cached?.data.conversation.notes || "");
    setStage(cached?.data.conversation.stage || "inquiry");
    setLimit(cached?.limit ?? 100);
    limitRef.current = cached?.limit ?? 100;
    setDirty(false);
    dirtyRef.current = false;
    notesDirty.current = false;
    setConflict(false);
    setError("");
    setNotice("");
    setInstruction("");
    setSelected(peer);
    setDetailsOpen(false);
  }
  function acceptDraft(d: Draft) {
    const cached = threadCache.current.get(d.peer_id);
    if (cached) {
      // A poll started before this save must not restore the old draft.
      latestRequests.current.delete(d.peer_id);
      const data = {
        ...cached.data,
        drafts: [
          d,
          ...cached.data.drafts.filter(
            (other) => other.id !== d.id && other.status !== "draft",
          ),
        ],
      };
      threadCache.current.set(d.peer_id, { ...cached, data });
      setThread(data);
    }
    setDraft(d);
    draftRef.current = d;
    setText(d.body);
    setDirty(false);
    dirtyRef.current = false;
    setConflict(false);
  }
  async function save() {
    if (!selected || !thread) return;
    const result = await api<{ draft: Draft }>(
      `conversations/${selected}/draft`,
      {
        text,
        id: draft?.id,
        version: draft?.version,
        contextId: thread.messages.at(-1)?.id ?? null,
      },
    );
    acceptDraft(result.draft);
    return result.draft;
  }
  async function generate(revision?: string) {
    if (!selected) return;
    await run("generate", async () => {
      const result = await api<{ draft: Draft }>(
        `conversations/${selected}/generate`,
        {
          instruction: revision ?? instruction,
          currentText: text,
          id: draft?.id,
          version: draft?.version,
        },
      );
      acceptDraft(result.draft);
      setInstruction("");
      setNotice("Draft ready. Review the details before sending.");
    });
  }
  async function send() {
    if (!selected || !draft || dirty) return;
    setConfirmSend(false);
    await run("send", async () => {
      await api(`conversations/${selected}/send`, {
        id: draft.id,
        version: draft.version,
        approved: true,
      });
      setDraft(null);
      setText("");
      setDirty(false);
      dirtyRef.current = false;
      await loadThread(selected, limit, true);
      await loadList();
      setNotice("Reply sent on Instagram.");
    });
  }
  const active = thread?.conversation;
  const staleDraft = !!draft && draft.context_id !== (lastMessageId ?? null);
  const pending = thread?.drafts.find((d) => d.id === active?.sending_draft_id);
  const filtered = conversations.filter(
    (c) =>
      (filter === "all"
        ? c.stage !== "archived"
        : filter === "unread"
          ? c.stage !== "archived" &&
            !!c.last_message_at &&
            (!c.last_seen_at || c.last_message_at > c.last_seen_at)
          : c.stage === filter) &&
      c.username.toLowerCase().includes(search.toLowerCase()),
  );
  const unread = conversations.filter(
    (c) =>
      c.stage !== "archived" &&
      c.last_message_at &&
      (!c.last_seen_at || c.last_message_at > c.last_seen_at),
  ).length;
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
          <p>
            Sign in to the private ChinaPal inbox to help travelers and prepare
            replies together.
          </p>
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
            {busy ? (
              <Loader2 className={s.spin} size={18} />
            ) : (
              <LockKeyhole size={16} />
            )}{" "}
            Open inbox
          </button>
          <small>
            <ShieldCheck size={14} /> Private access · Replies always reviewed
            by you
          </small>
        </form>
        <Link href="/privacy">Privacy policy</Link>
      </main>
    );
  return (
    <main className={s.workspace} data-ph-no-capture data-clarity-mask="true">
      <aside className={s.rail}>
        <Link href="/" className={s.brand}>
          China<span>Pal</span>
          <small>TEAM WORKSPACE</small>
        </Link>
        <div className={s.railLabel}>WORKSPACE</div>
        <button className={s.railActive} onClick={() => choose(null)}>
          <InboxIcon size={19} /> Inbox <span>{unread || ""}</span>
        </button>
        <div className={s.railNote}>
          <Sparkles size={19} />
          <strong>A helping hand.</strong>
          <p>
            AI prepares the reply.
            <br />
            You make it personal.
          </p>
          <span>
            <span className={s.dot} /> Manual approval on
          </span>
        </div>
        <div className={s.railBottom}>
          <div className={s.staffAvatar}>CP</div>
          <div>
            <strong>ChinaPal team</strong>
            <small>Shared admin access</small>
          </div>
          <button
            aria-label="Sign out"
            title="Sign out"
            onClick={() =>
              run("logout", async () => {
                if (
                  (dirty || notesDirty.current) &&
                  !window.confirm("Sign out and discard unsaved edits?")
                )
                  return;
                await api("auth/logout", {});
                threadCache.current.clear();
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
      <section className={`${s.listPanel} ${selected ? s.mobileHide : ""}`}>
        <header className={s.listHeader}>
          <div>
            <span className={s.eyebrow}>INSTAGRAM</span>
            <h1>
              Inbox <span>{conversations.length}</span>
            </h1>
          </div>
          <button
            title="Sync conversations from Instagram"
            aria-label="Sync conversations"
            disabled={!!busy}
            onClick={refreshList}
          >
            <RefreshCw size={19} className={busy === "sync" ? s.spin : ""} />
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
        <div className={s.filters}>
          {[
            ["all", "All"],
            ["unread", "Unread"],
            ["customer", "Customers"],
            ["archived", "Archived"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={filter === id ? s.filterActive : ""}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={s.conversationList}>
          {filtered.map((c) => {
            const isUnread =
              c.last_message_at &&
              (!c.last_seen_at || c.last_message_at > c.last_seen_at);
            return (
              <button
                key={c.peer_id}
                className={`${s.conversationRow} ${selected === c.peer_id ? s.selected : ""}`}
                onClick={() => choose(c.peer_id)}
              >
                <span className={s.avatar}>{initials(c.username)}</span>
                <span className={s.rowContent}>
                  <span className={s.rowTop}>
                    <strong>@{c.username}</strong>
                    <time>{date(c.last_message_at)}</time>
                  </span>
                  <span className={s.rowBottom}>
                    {c.stage === "customer"
                      ? "Customer"
                      : c.stage === "archived"
                        ? "Archived"
                        : "Service inquiry"}
                    {isUnread && <i className={s.unreadDot} />}
                  </span>
                </span>
              </button>
            );
          })}
          {!filtered.length && (
            <div className={s.listEmpty}>
              <MessageSquare size={28} />
              <h3>
                {search ? "No matching conversations" : "Ready when you are"}
              </h3>
              <p>
                {search
                  ? "Try another Instagram username."
                  : "Sync Instagram to bring your existing conversations into the inbox."}
              </p>
              {!search && (
                <button onClick={refreshList} disabled={!!busy}>
                  Sync Instagram <RefreshCw size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        <footer className={s.listFooter}>
          <Camera size={14} /> Connected to your Instagram account
        </footer>
      </section>
      <section className={`${s.mainPanel} ${!selected ? s.mobileHide : ""}`}>
        {!selected ? (
          <div className={s.welcome}>
            <div className={s.welcomeIcon}>
              <MessageSquare size={32} />
            </div>
            <span className={s.eyebrow}>A WARM WELCOME STARTS HERE</span>
            <h2>
              A local friend.
              <br />
              One conversation at a time.
            </h2>
            <p>
              Choose a conversation to read the history,
              <br />
              prepare a helpful reply, and make it yours.
            </p>
            <div>
              <ShieldCheck size={16} /> Nothing is sent until you approve it.
            </div>
          </div>
        ) : (
          <>
            <header className={s.threadHeader}>
              <button
                className={s.back}
                aria-label="Back to conversations"
                onClick={() => choose(null)}
              >
                <ArrowLeft size={20} />
              </button>
              <span className={s.avatar}>
                {initials(active?.username || "")}
              </span>
              <div className={s.threadTitle}>
                <h2>
                  @
                  {active?.username ||
                    conversations.find((c) => c.peer_id === selected)
                      ?.username ||
                    "Loading…"}
                </h2>
                <span>
                  <Camera size={12} /> Instagram direct message
                </span>
              </div>
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
                <RefreshCw
                  size={17}
                  className={busy === "refresh" ? s.spin : ""}
                />
              </button>
              <button
                className={s.detailsButton}
                onClick={() => setDetailsOpen(!detailsOpen)}
              >
                Details <ChevronDown size={15} />
              </button>
            </header>
            {detailsOpen && (
              <section className={s.details}>
                <label>
                  Conversation stage
                  <select
                    value={stage}
                    onChange={(e) => {
                      setStage(e.target.value);
                      notesDirty.current = true;
                    }}
                  >
                    <option value="inquiry">Inquiry</option>
                    <option value="customer">Customer</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label>
                  Private notes for the team and AI
                  <textarea
                    value={notes}
                    maxLength={5000}
                    placeholder="Travel dates, preferences, details already confirmed…"
                    onChange={(e) => {
                      setNotes(e.target.value);
                      notesDirty.current = true;
                    }}
                  />
                </label>
                <button
                  disabled={!!busy}
                  onClick={() =>
                    run("details", async () => {
                      await api(`conversations/${selected}/details`, {
                        stage,
                        notes,
                      });
                      notesDirty.current = false;
                      await loadThread(selected, limit);
                      await loadList();
                      setNotice("Details saved.");
                    })
                  }
                >
                  Save details
                </button>
                <a
                  href="https://www.instagram.com/direct/inbox/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Instagram <ArrowUpRight size={14} />
                </a>
              </section>
            )}
            <div className={s.messages}>
              {!thread && (
                <div className={s.loading}>
                  <Loader2 className={s.spin} /> Loading conversation…
                </div>
              )}
              {thread && (
                <>
                  <div className={s.historyBar}>
                    <button
                      disabled={!!busy}
                      onClick={() =>
                        run("history", async () => {
                          if (!thread.conversation.history_complete)
                            await api(`conversations/${selected}/sync`, {
                              older: true,
                            });
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
                      {(index === 0 ||
                        date(thread.messages[index - 1].sent_at) !==
                          date(m.sent_at)) && (
                        <div className={s.day}>{date(m.sent_at)}</div>
                      )}
                      <div
                        className={`${s.message} ${m.direction === "outbound" ? s.outbound : s.inbound}`}
                      >
                        <div className={s.bubble}>
                          {m.deleted ? (
                            <em>Message was unsent</em>
                          ) : (
                            <>
                              {m.text && <p>{m.text}</p>}
                              {m.attachments.map((a, i) =>
                                a.type === "image" ? (
                                  <button
                                    key={i}
                                    className={s.imageButton}
                                    onClick={() => setImage(a.url)}
                                    aria-label="Open attached image"
                                  >
                                    <img
                                      src={a.url}
                                      alt="Instagram message attachment"
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.alt =
                                          "Image unavailable — refresh or open Instagram";
                                      }}
                                    />
                                  </button>
                                ) : (
                                  <a
                                    key={i}
                                    href="https://www.instagram.com/direct/inbox/"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {a.type} attachment · View in Instagram{" "}
                                    <ArrowUpRight size={13} />
                                  </a>
                                ),
                              )}
                              {!m.text && !m.attachments.length && (
                                <em>
                                  Content unavailable through the API. View in
                                  Instagram.
                                </em>
                              )}
                            </>
                          )}
                        </div>
                        <time>
                          {m.direction === "outbound" && "ChinaPal · "}
                          {time(m.sent_at)}
                        </time>
                      </div>
                    </div>
                  ))}
                  {!thread.messages.length && (
                    <div className={s.loading}>
                      No saved messages yet. Refresh to load this conversation.
                    </div>
                  )}
                  <div ref={end} />
                </>
              )}
            </div>
            {thread && (
              <section className={s.composer}>
                <div className={s.composerHeading}>
                  <span>
                    <Sparkles size={16} /> Reply assistant{" "}
                    <small>Draft only</small>
                  </span>
                  <span className={s.saved}>
                    {dirty
                      ? "Unsaved edits"
                      : draft
                        ? "Shared draft saved"
                        : "Ready to help"}
                  </span>
                </div>
                {pending && (
                  <div className={s.warning}>
                    <strong>
                      A reply is being sent or awaiting confirmation.
                    </strong>{" "}
                    If this remains pending for two minutes, check the actual
                    Instagram chat before resolving it.
                    <div>
                      {[
                        ["sent", "It was sent"],
                        ["not-sent", "It was not sent"],
                      ].map(([outcome, label]) => (
                        <button
                          key={outcome}
                          disabled={
                            !!busy ||
                            Date.now() - Date.parse(pending.updated_at) < 120000
                          }
                          onClick={() => {
                            if (
                              window.confirm(
                                "Have you checked the actual Instagram chat and confirmed this delivery status?",
                              )
                            )
                              run("resolve", async () => {
                                await api(`conversations/${selected}/resolve`, {
                                  id: pending.id,
                                  outcome,
                                  checkedInstagram: true,
                                });
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
                {staleDraft && (
                  <div className={s.warning}>
                    New messages arrived after this draft was saved. Review
                    them, then save or revise your reply.
                  </div>
                )}
                {conflict && (
                  <div className={s.warning}>
                    The shared draft changed while you were editing. Your text
                    is preserved.
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Replace your unsaved text with the latest shared draft?",
                          )
                        ) {
                          setDirty(false);
                          dirtyRef.current = false;
                          loadThread(selected, limit, true).catch((e) =>
                            setError(e.message),
                          );
                        }
                      }}
                    >
                      Load shared draft
                    </button>
                  </div>
                )}
                {draft?.warnings?.length ? (
                  <div className={s.aiNotes}>
                    <CircleHelp size={15} />
                    <div>
                      {draft.warnings.map((w, i) => (
                        <p key={i}>{w}</p>
                      ))}
                    </div>
                  </div>
                ) : null}
                <textarea
                  className={s.reply}
                  aria-label="Reply draft"
                  value={text}
                  maxLength={4000}
                  onChange={(e) => {
                    setText(e.target.value);
                    setDirty(true);
                    dirtyRef.current = true;
                  }}
                  placeholder="Write your reply, or let AI prepare a first draft…"
                  disabled={!!busy || !!pending}
                />
                <div className={s.revision}>
                  <Sparkles size={15} />
                  <input
                    aria-label="Revision instruction"
                    placeholder="Ask AI to refine it: “shorter”, “add the price”, “more friendly”…"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && instruction.trim() && !busy) {
                        e.preventDefault();
                        generate();
                      }
                    }}
                    disabled={!!busy || !!pending}
                  />
                  <button
                    disabled={
                      !!busy || !!pending || !thread.messages.length || conflict
                    }
                    onClick={() => generate()}
                  >
                    {busy === "generate" ? (
                      <Loader2 size={15} className={s.spin} />
                    ) : (
                      <Sparkles size={15} />
                    )}
                    {text ? "Revise" : "Generate draft"}
                  </button>
                </div>
                <div className={s.composerFooter}>
                  <span>
                    {[...text].length}/1,000{" "}
                    <span className={s.window}>
                      {thread.canSend
                        ? "· Reply window open"
                        : "· Reply in Instagram: 24-hour window closed"}
                    </span>
                  </span>
                  <div>
                    <button
                      disabled={
                        !!busy ||
                        !text.trim() ||
                        conflict ||
                        !!pending ||
                        (!dirty && !!draft && !staleDraft)
                      }
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
                      disabled={
                        !!busy ||
                        !draft ||
                        dirty ||
                        staleDraft ||
                        conflict ||
                        !!pending ||
                        !thread.canSend ||
                        [...text].length > 1000
                      }
                      onClick={() => setConfirmSend(true)}
                    >
                      <Send size={15} /> Approve & send
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </section>
      {(error || notice) && (
        <div
          role={error ? "alert" : "status"}
          className={`${s.toast} ${error ? s.error : s.success}`}
        >
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
          <img
            className={s.fullImage}
            src={image}
            alt="Expanded Instagram attachment"
          />
        </div>
      )}
      {confirmSend && (
        <div className={s.overlay}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-title"
            className={s.sendDialog}
          >
            <div className={s.lock}>
              <Send size={22} />
            </div>
            <h2 id="send-title">Send this reply?</h2>
            <p>
              This will send a real Instagram DM to{" "}
              <strong>@{active?.username}</strong>.
            </p>
            <blockquote>{text}</blockquote>
            <div>
              <button onClick={() => setConfirmSend(false)}>
                Keep editing
              </button>
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
