// Browser-side Supabase client (singleton).
// Points at the SHARED project (same as the inbound_travel app), so a Google
// login here yields the same auth.users.id the customer will have in the app.
// Used for: login-first checkout (sign in, then read the access token to stamp
// onto the Stripe session).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  _client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // parses the OAuth redirect back from Google
      flowType: "pkce",
    },
  });
  return _client;
}
