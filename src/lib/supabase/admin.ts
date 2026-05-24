import "server-only";
// Server-only Supabase client using the SECRET (service-role) key.
// Bypasses Row Level Security — used by the Stripe webhook to INSERT entitlements.
// Never import this from a client component.
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  _admin = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}

/**
 * Verify a Supabase access token (JWT) sent from the browser and return the
 * authenticated user, or null. This is how a route handler learns "who is this"
 * server-side without cookie machinery — the client sends its access_token, we
 * validate it against Supabase here.
 */
export async function getUserFromAccessToken(
  token: string | undefined | null,
): Promise<User | null> {
  if (!token) return null;
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
