import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Dedicated concierge project; website checkout/auth use a separate database.
export function getConciergeDatabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.CONCIERGE_SUPABASE_URL;
  const secret = process.env.CONCIERGE_SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error("Missing concierge database configuration");
  }
  client = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
