import { getTravelProfile, generateTravelProfile } from "@/lib/inbox/profile";
import { editBrief, generateBrief, getBrief } from "@/lib/inbox/brief";
import { translateMessage } from "@/lib/inbox/translate";
import { cancelPlan, chatPlan, getPlan, startPlan, undoPlan } from "@/lib/inbox/plan";
import { changeQuestion } from "@/lib/inbox/questions";
import { listQuestions, markAsked } from "@/lib/inbox/question-store";
import { changeCare, dueCounts, getCare } from "@/lib/inbox/care";
import { markCareSent } from "@/lib/inbox/care-store";
import { askTrip, type AskTurn } from "@/lib/inbox/ask";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { logout, login, requireStaff } from "@/lib/inbox/auth";
import { generateDraft } from "@/lib/inbox/ai";
import { assertSameOrigin } from "@/lib/inbox/policy";
import { mediaBytes } from "@/lib/inbox/graph";
import { contactIdentity } from "@/lib/inbox/contacts";
import {
  conversation,
  listConversations,
  queueNextPart,
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
function parts(value: unknown) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 2)
    throw new InboxError("Invalid follow-up messages.");
  return value.map((v) => str(v, 4000));
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
        await login(str(body.who ?? "", 20), str(body.password, 256), request);
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
    if (method === "GET" && action === "care/due")
      return json({ due: await dueCounts() });
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
      if (method === "POST" && operation === "identity")
        return json(await contactIdentity(peer));
      if (method === "POST" && operation === "ask") {
        if (!Array.isArray(body.history) || body.history.length > 20) throw new InboxError("Invalid conversation.");
        const history: AskTurn[] = body.history.map((turn: unknown) => {
          const t = turn as Record<string, unknown>;
          if (t?.role !== "team" && t?.role !== "assistant") throw new InboxError("Invalid conversation.");
          return { role: t.role, text: str(t.text, 6000) };
        });
        return json(await askTrip(peer, str(body.question, 2000), history));
      }
      if (method === "POST" && operation === "translate")
        return json(await translateMessage(str(body.text, 4000)));
      if (method === "GET" && operation === "brief")
        return json(await getBrief(peer));
      if (method === "POST" && operation === "brief" && path[3] === "edit")
        return json(
          await editBrief(peer, staff, {
            remove: body.remove === undefined ? undefined : str(body.remove, 100),
            section: body.section,
            action: body.action,
            text: body.text,
            target: body.target,
            day: body.day,
          }),
        );
      if (method === "POST" && operation === "brief" && !path[3])
        return json(await generateBrief(peer));
      if (method === "GET" && operation === "questions")
        return json({ questions: await listQuestions(peer) });
      if (method === "POST" && operation === "questions")
        return json(await changeQuestion(peer, staff, body));
      if (method === "GET" && operation === "care")
        return json(await getCare(peer));
      if (method === "POST" && operation === "care")
        return json(await changeCare(peer, staff, body));
      if (method === "GET" && operation === "plan")
        return json(await getPlan(peer));
      if (method === "POST" && operation === "plan" && path[3] === "cancel")
        return json(await cancelPlan(peer));
      if (method === "POST" && operation === "plan" && path[3] === "chat")
        return json(await chatPlan(peer, staff, str(body.message, 2000)));
      if (method === "POST" && operation === "plan" && path[3] === "undo")
        return json(await undoPlan(peer, staff));
      if (method === "POST" && operation === "plan" && !path[3])
        return json(
          await startPlan(peer, staff, body.instruction === undefined ? "" : str(body.instruction, 2000).trim()),
        );
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
            [],
            {
              parts: parts(body.parts),
              staffFacts:
                body.staffFacts === undefined ? undefined : str(body.staffFacts, 2000),
            },
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
              ? str(body.currentText, 6000)
              : undefined,
            staffFacts: body.staffFacts
              ? str(body.staffFacts, 2000)
              : undefined,
            draftId: body.id ? str(body.id, 50) : undefined,
            version: body.id ? num(body.version) : undefined,
          }),
        });
      if (method === "POST" && operation === "send") {
        if (body.approved !== true)
          throw new InboxError("Review and approve the reply before sending.");
        const id = str(body.id, 50);
        const result = await sendDraft(peer, id, num(body.version), staff);
        await markAsked(peer, id);
        await markCareSent(peer, id, staff.name || staff.email);
        return json(result);
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
        if (body.outcome === "sent") {
          await markAsked(peer, id);
          await markCareSent(peer, id, staff.name || staff.email);
          const data = await threadData(peer, 1);
          const resolved = data.drafts.find((d) => d.id === id);
          if (resolved)
            await queueNextPart(resolved, data.messages.at(-1)?.id ?? null, staff);
        }
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
