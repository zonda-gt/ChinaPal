"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Loader2, LockKeyhole, LogOut, MessageCircle, Plus, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import s from "../inbox/inbox.module.css";
import c from "./comment.module.css";
import { LIMITS, type CommentReply, type CommentRule } from "@/lib/inbox/comment-data";
import type { PostSummary } from "@/lib/inbox/comments";
import type { Staff } from "@/lib/inbox/types";

// /comment: keyword comment replies. Same sign-in and API as the inbox.
type PageData = { rules: CommentRule[]; replies: CommentReply[]; posts: PostSummary[]; postsError: string };

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
const when = (iso: string) =>
  iso ? new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
const STATUS: Record<CommentReply["status"], string> = {
  pending: "Waiting",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
  skipped: "Not sent",
};

/** One keyword's messages: the DM and the optional reply under the comment. */
function RuleEditor(props: {
  rule: CommentRule | null;
  mediaId: string | null;
  busy: boolean;
  onSave: (body: Record<string, unknown>) => Promise<boolean>;
  onCancel?: () => void;
}) {
  const { rule } = props;
  const [keyword, setKeyword] = useState(rule?.keyword ?? ""),
    [message, setMessage] = useState(rule?.message ?? ""),
    [publicReply, setPublicReply] = useState(rule ? rule.public_reply : "Sent you a DM 📩"),
    [active, setActive] = useState(rule?.active ?? true);
  const changed =
    !rule || keyword !== rule.keyword || message !== rule.message || publicReply !== rule.public_reply || active !== rule.active;
  const save = () =>
    props.onSave({ id: rule?.id ?? null, mediaId: props.mediaId, keyword, message, publicReply, active }).then((ok) => {
      if (ok && !rule) props.onCancel?.();
    });
  return (
    <div className={c.rule} data-off={!active || undefined}>
      <div className={c.ruleTop}>
        <label>
          Keyword
          <input value={keyword} maxLength={LIMITS.keyword} placeholder="CHINA" onChange={(e) => setKeyword(e.target.value)} />
        </label>
        <label className={c.toggle}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> On
        </label>
      </div>
      <label>
        DM we send them <small>{[...message].length}/{LIMITS.message}</small>
        <textarea
          rows={4}
          value={message}
          maxLength={LIMITS.message}
          placeholder="Here's the itinerary: https://www.chinapal.co/itinerary/… Tell me your dates and I'll help you plan 😊"
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <label>
        Reply under their comment <small>leave empty for none</small>
        <input value={publicReply} maxLength={LIMITS.publicReply} onChange={(e) => setPublicReply(e.target.value)} />
      </label>
      <div className={c.ruleActions}>
        {rule && (
          <button
            className={c.danger}
            disabled={props.busy}
            onClick={() => confirm(`Delete the "${rule.keyword}" reply?`) && props.onSave({ id: rule.id, delete: true })}
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
        {props.onCancel && (
          <button className={c.plain} disabled={props.busy} onClick={props.onCancel}>
            Cancel
          </button>
        )}
        <button className={s.primary} disabled={props.busy || !changed || !keyword.trim() || !message.trim()} onClick={save}>
          <Check size={14} /> Save
        </button>
      </div>
    </div>
  );
}

export default function CommentReplies() {
  const [staff, setStaff] = useState<Staff | null>(null),
    [checking, setChecking] = useState(true),
    [who, setWho] = useState(() => {
      try {
        return localStorage.getItem("cp-inbox-who") ?? "";
      } catch {
        return "";
      }
    }),
    [password, setPassword] = useState(""),
    [data, setData] = useState<PageData | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [adding, setAdding] = useState<string | null | undefined>(undefined); // undefined = not adding; null = every post

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const load = () => run(async () => setData(await api<PageData>("comments")));

  useEffect(() => {
    api<{ staff: Staff }>("session")
      .then((r) => {
        setStaff(r.staff);
        return api<PageData>("comments").then(setData);
      })
      .catch((e) => {
        if (!/sign in|session/i.test((e as Error).message)) setError((e as Error).message);
      })
      .finally(() => setChecking(false));
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    await run(async () => {
      await api("auth/login", { who, password });
      try {
        localStorage.setItem("cp-inbox-who", who.trim());
      } catch {}
      setPassword("");
      setStaff((await api<{ staff: Staff }>("session")).staff);
      setData(await api<PageData>("comments"));
    });
  }
  const saveRule = (body: Record<string, unknown>) => run(async () => setData(await api<PageData>("comments/rule", body)));
  const retry = (commentId: string) => run(async () => setData(await api<PageData>("comments/retry", { commentId })));

  if (checking)
    return (
      <main className={s.login}>
        <Loader2 className={s.spin} />
        <p>Opening comment replies…</p>
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
          <h1>Comment replies</h1>
          <p>Sign in with your inbox username and password.</p>
          <label htmlFor="comment-username">Username</label>
          <input
            id="comment-username"
            autoComplete="username"
            autoCapitalize="none"
            placeholder="Steven or Kira"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            required
            autoFocus={!who}
          />
          <label htmlFor="comment-password">Password</label>
          <input
            id="comment-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus={!!who}
          />
          {error && (
            <div role="alert" className={s.error}>
              {error}
            </div>
          )}
          <button className={s.primary} disabled={busy}>
            {busy ? <Loader2 className={s.spin} size={18} /> : <LockKeyhole size={16} />} Sign in
          </button>
          <small>
            <ShieldCheck size={14} /> Private access
          </small>
        </form>
      </main>
    );

  const rules = data?.rules ?? [];
  const everyPost = rules.filter((r) => r.media_id === null);
  const postById = new Map((data?.posts ?? []).map((p) => [p.id, p]));
  return (
    <main className={c.page} data-ph-no-capture data-clarity-mask="true">
      <header className={c.header}>
        <Link href="/" className={s.brand}>
          China<span>Pal</span>
        </Link>
        <h1>Comment replies</h1>
        <span className={c.who}>{staff.name}</span>
        <button
          className={c.plain}
          onClick={() =>
            run(async () => {
              await api("auth/logout", {});
              setStaff(null);
              setData(null);
            })
          }
        >
          <LogOut size={14} /> Sign out
        </button>
      </header>
      {error && (
        <div role="alert" className={`${s.error} ${c.banner}`}>
          {error}
        </div>
      )}

      <section className={c.section}>
        <h2>Every post and reel</h2>
        <p className={c.hint}>
          When someone comments the keyword, we DM them this message (once per comment) and reply under their comment. A post with its own reply below
          uses that one instead.
        </p>
        {everyPost.map((r) => (
          <RuleEditor key={r.id + r.updated_at} rule={r} mediaId={null} busy={busy} onSave={saveRule} />
        ))}
        {adding === null ? (
          <RuleEditor rule={null} mediaId={null} busy={busy} onSave={saveRule} onCancel={() => setAdding(undefined)} />
        ) : (
          <button className={c.add} disabled={busy} onClick={() => setAdding(null)}>
            <Plus size={14} /> Add a keyword
          </button>
        )}
      </section>

      <section className={c.section}>
        <h2>Your posts</h2>
        {data?.postsError && <p className={c.hint}>{data.postsError}</p>}
        <div className={c.posts}>
          {(data?.posts ?? []).map((p) => {
            const own = rules.filter((r) => r.media_id === p.id);
            return (
              <article key={p.id} className={c.post}>
                <a href={p.permalink} target="_blank" rel="noreferrer" className={c.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- Instagram's own image link */}
                  {p.thumbnail ? <img src={p.thumbnail} alt="" referrerPolicy="no-referrer" loading="lazy" /> : <span>{p.kind}</span>}
                </a>
                <div className={c.postBody}>
                  <div className={c.postMeta}>
                    {p.kind} · {when(p.at)} · <MessageCircle size={12} /> {p.comments}
                    <a href={p.permalink} target="_blank" rel="noreferrer" aria-label="Open on Instagram">
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className={c.caption}>{p.caption || "No caption"}</p>
                  {own.map((r) => (
                    <RuleEditor key={r.id + r.updated_at} rule={r} mediaId={p.id} busy={busy} onSave={saveRule} />
                  ))}
                  {adding === p.id ? (
                    <RuleEditor rule={null} mediaId={p.id} busy={busy} onSave={saveRule} onCancel={() => setAdding(undefined)} />
                  ) : (
                    <div className={c.postRule}>
                      {!own.length && <span>{everyPost.some((r) => r.active) ? "Uses the reply for every post" : "No reply set"}</span>}
                      <button className={c.plain} disabled={busy} onClick={() => setAdding(p.id)}>
                        <Plus size={14} /> {own.length ? "Another keyword" : "Give it its own reply"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={c.section}>
        <div className={c.sectionTop}>
          <h2>Recent keyword comments</h2>
          <button className={c.plain} disabled={busy} onClick={load}>
            {busy ? <Loader2 className={s.spin} size={14} /> : <RotateCcw size={14} />} Refresh
          </button>
        </div>
        {!data?.replies.length && <p className={c.hint}>No keyword comments yet.</p>}
        <ul className={c.log}>
          {(data?.replies ?? []).map((r) => {
            const post = postById.get(r.media_id);
            return (
              <li key={r.comment_id}>
                <span className={c.status} data-status={r.status}>
                  {STATUS[r.status]}
                </span>
                <div>
                  <strong>@{r.username || r.commenter_id}</strong> “{r.comment}”
                  <small>
                    {when(r.commented_at)}
                    {post && (
                      <>
                        {" · "}
                        <a href={post.permalink} target="_blank" rel="noreferrer">
                          {post.caption.slice(0, 40) || post.kind}
                        </a>
                      </>
                    )}
                    {r.dm_sent_at && " · DM sent"}
                    {r.public_sent_at && " · replied under the comment"}
                  </small>
                  {r.error && <small className={c.err}>{r.error}</small>}
                </div>
                {r.status === "failed" && (
                  <button className={c.plain} disabled={busy} onClick={() => retry(r.comment_id)}>
                    <RotateCcw size={14} /> Retry
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
