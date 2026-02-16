import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server Supabase client (API routes, Server Actions).
 * Uses service role so we enforce access via Clerk auth + user_id checks.
 */
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey);
}
