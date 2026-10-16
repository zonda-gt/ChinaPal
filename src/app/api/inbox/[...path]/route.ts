import { getTravelProfile, generateTravelProfile } from "@/lib/inbox/profile";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { logout, login, requireStaff } from "@/lib/inbox/auth";
import { generateDraft } from "@/lib/inbox/ai";
import { assertSameOrigin } from "@/lib/inbox/policy";
import { mediaBytes } from "@/lib/inbox/graph";
import {
  conversation,
  listConversations,
  saveDraft,
  sendDraft,
  syncConversations,
  syncThread,
  threadData,
} from "@/lib/inbox/service";
import { InboxError, type Message } from "@/lib/inbox/types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;
const noStore = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
};
function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: noStore });
}
function str(value: unknown, max = 10000) {
  if (typeof value !== "string" || value.length > max)
    throw new InboxError("Invalid request.");
  return value;
}
function num(value: unknown) {
  if (!Number.isInteger(value) || Number(value) < 1)
    throw new InboxError("Invalid draft version.");
  return Number(value);
}
async function handler(
  request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await ctx.params;
    const action = path.join("/");
    const method = request.method;
    let body: Record<string, unknown> = {};
    if (method === "POST") {
      assertSameOrigin(request);
      const text = await request.text();
      if (text.length > 25000)
        throw new InboxError("Request is too large.", 413);
      try {
        body = JSON.parse(text || "{}");
        if (!body || Array.isArray(body) || typeof body !== "object")
          throw Error();
      } catch {
        throw new InboxError("Invalid request.");
      }
      if (action === "auth/login") {
        await login(str(body.password, 256), request);
        return json({ ok: true });
      }
      if (action === "auth/logout") {
        await logout();
        return json({ ok: true });
      }
    }
    const staff = await requireStaff();
    if (method === "GET" && action === "session") return json({ staff });
    if (method === "GET" && action === "conversations")
      return json({ conversations: await listConversations() });
    if (method === "POST" && action === "sync")
      return json(
        await syncConversations(
          body.cursor ? str(body.cursor, 5000) : undefined,
        ),
      );
    if (method === "GET" && action === "media") {
      const params = new URL(request.url).searchParams;
      const id = params.get("id"),
        index = Number(params.get("index") || 0);
      if (!id || !Number.isInteger(index) || index < 0)
        throw new InboxError("Invalid image.");
      const { data, error } = await db()
        .from("inbox_messages")
        .select("attachments,deleted")
        .eq("id", id)
        .single();
      if (error || !data || data.deleted || !data.attachments[index])
        throw new InboxError("Image not found.", 404);
      const { bytes, type } = await mediaBytes(data.attachments[index].url);
      return new Response(new Uint8Array(bytes), {
        headers: {
          ...noStore,
          "Content-Type": type,
          "Content-Disposition": "inline",
          "Content-Security-Policy": "default-src 'none'; sandbox",
        },
      });
    }
    if (path[0] === "conversations" && path[1]) {
      const peer = path[1];
      if (!/^\d+$/.test(peer)) throw new InboxError("Invalid conversation.");
      const operation = path[2];
      if (method === "GET" && operation === "profile")
        return json(await getTravelProfile(peer));
      if (method === "POST" && operation === "profile")
        return json(await generateTravelProfile(peer));
      if (method === "GET" && !operation) {
        const limit = Math.max(
          50,
          Math.min(
            1000,
            Number(new URL(request.url).searchParams.get("limit")) || 100,
          ),
        );
        const data = await threadData(peer, limit);
        return json({
          ...data,
          messages: data.messages.map((m: Message) => ({
            ...m,
            attachments: m.attachments.map((a, index) => ({
              type: a.type,
              url: `/api/inbox/media?id=${encodeURIComponent(m.id)}&index=${index}`,
            })),
          })),
        });
      }
      if (method === "POST" && operation === "sync")
        return json(await syncThread(peer, body.older === true));
      if (method === "POST" && operation === "read") {
        // Mark only what this browser actually displayed, not a later incoming message.
        const seenAt = str(body.seenAt, 40);
        if (
          !Number.isFinite(Date.parse(seenAt)) ||
          Date.parse(seenAt) > Date.now()
        )
          throw new InboxError("Invalid read timestamp.");
        const { error } = await db()
          .from("inbox_conversations")
          .update({ last_seen_at: seenAt })
          .eq("peer_id", peer)
          .or(`last_seen_at.is.null,last_seen_at.lt.${seenAt}`);
        if (error) throw new InboxError("Could not save read status.", 503);
        return json({ ok: true });
      }
      if (method === "POST" && operation === "details") {
        await conversation(peer);
        const stage = str(body.stage, 20);
        if (!["inquiry", "customer", "archived"].includes(stage))
          throw new InboxError("Invalid stage.");
        const { error } = await db()
          .from("inbox_conversations")
          .update({ stage, notes: str(body.notes, 5000) })
          .eq("peer_id", peer);
        if (error)
          throw new InboxError("Could not save conversation details.", 503);
        return json({ ok: true });
      }
      if (method === "POST" && operation === "draft") {
        const data = await threadData(peer, 1);
        const contextId =
          body.contextId === null ? null : str(body.contextId, 2000);
        if ((data.messages.at(-1)?.id ?? null) !== contextId)
          throw new InboxError(
            "A new message arrived. Review it before saving the reply.",
            409,
          );
        return json({
          draft: await saveDraft(
            peer,
            str(body.text, 4000),
            contextId,
            staff,
            body.id ? str(body.id, 50) : undefined,
            body.id ? num(body.version) : undefined,
          ),
        });
      }
      if (method === "POST" && operation === "generate")
        return json({
          draft: await generateDraft(peer, staff, {
            instruction: body.instruction
              ? str(body.instruction, 2000)
              : undefined,
            currentText: body.currentText
              ? str(body.currentText, 4000)
              : undefined,
            draftId: body.id ? str(body.id, 50) : undefined,
            version: body.id ? num(body.version) : undefined,
          }),
        });
      if (method === "POST" && operation === "send") {
        if (body.approved !== true)
          throw new InboxError("Review and approve the reply before sending.");
        return json(
          await sendDraft(peer, str(body.id, 50), num(body.version), staff),
        );
      }
      if (method === "POST" && operation === "resolve") {
        const c = await conversation(peer);
        const id = str(body.id, 50);
        if (
          c.sending_draft_id !== id ||
          !["sent", "not-sent"].includes(String(body.outcome)) ||
          body.checkedInstagram !== true
        )
          throw new InboxError(
            "Check the actual Instagram conversation before resolving this send.",
          );
        const { error } = await db().rpc("inbox_resolve_send", {
          p_peer: peer,
          p_id: id,
          p_sent: body.outcome === "sent",
          p_email: staff.email,
        });
        if (error)
          throw new InboxError(
            error.code === "P0001"
              ? error.message
              : "Could not resolve the delivery.",
            409,
          );
        return json({ ok: true });
      }
    }
    return json({ error: "Not found." }, 404);
  } catch (e) {
    if (e instanceof InboxError) return json({ error: e.message }, e.status);
    // Never leak SDK request/response objects, which may contain tokens or DMs.
    console.error("[inbox] Request failed");
    return json(
      {
        error:
          "The request could not be completed. Your draft is preserved; please refresh before retrying.",
      },
      503,
    );
  }
}
export const GET = handler;
export const POST = handler;
