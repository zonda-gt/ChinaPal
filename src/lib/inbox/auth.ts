import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getConciergeDatabase as db } from "@/lib/instagram/database";
import { InboxError, type Staff } from "./types";
import { lease } from "./service";
import { TEAM, type TeamId } from "./team";
const COOKIE = "cp-inbox-session";
const digest = (s: string) => createHash("sha256").update(s).digest("hex");
// Each person can have their own password (INBOX_PASSWORD_STEVEN, ...);
// without one they share INBOX_ADMIN_PASSWORD.
function password(id: TeamId) {
  const value = process.env[`INBOX_PASSWORD_${id.toUpperCase()}`] || process.env.INBOX_ADMIN_PASSWORD;
  if (!value || value.length < 16)
    throw new InboxError(
      "Set an admin password of at least 16 characters on the server.",
      503,
    );
  return value;
}
// A session records who signed in through its password version, so changing
// a password signs that person out and no schema change is needed.
const sessionVersion = (id: TeamId) => digest(`${id}:${password(id)}`);
export async function requireStaff(): Promise<Staff> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    throw new InboxError("Sign in to the inbox.", 401);
  const { data, error } = await db()
    .from("inbox_sessions")
    .select("expires_at,password_version")
    .eq("token_hash", digest(token))
    .maybeSingle();
  if (error)
    throw new InboxError(
      "The inbox database needs setup. Apply the inbox SQL migration first.",
      503,
    );
  const member =
    data && Date.parse(data.expires_at) > Date.now()
      ? TEAM.find((m) => data.password_version === sessionVersion(m.id))
      : undefined;
  if (!member)
    throw new InboxError("Your session expired. Please sign in again.", 401);
  return { email: member.id, name: member.name };
}
export async function login(who: string, value: string, request: Request) {
  const member = TEAM.find((m) => m.id === who);
  if (!member) throw new InboxError("Choose who is signing in.");
  const expected = password(member.id);
  // Global and per-source throttles are durable across Vercel instances.
  await lease("login-global", 1);
  const ip =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    "local";
  await lease(`login-ip:${digest(ip.split(",")[0].trim())}`, 5);
  if (
    !timingSafeEqual(Buffer.from(digest(value)), Buffer.from(digest(expected)))
  )
    throw new InboxError("Incorrect password.", 401);
  const token = randomBytes(32).toString("hex");
  const { error } = await db()
    .from("inbox_sessions")
    .insert({
      token_hash: digest(token),
      password_version: sessionVersion(member.id),
      expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    });
  if (error)
    throw new InboxError(
      "Could not start a session. Check the inbox database setup.",
      503,
    );
  await db()
    .from("inbox_sessions")
    .delete()
    .lt("expires_at", new Date().toISOString());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/inbox",
    maxAge: 12 * 60 * 60,
  });
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token)
    await db().from("inbox_sessions").delete().eq("token_hash", digest(token));
  jar.set(COOKIE, "", {
    path: "/api/inbox",
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
