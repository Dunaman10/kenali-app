import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/**
 * Supabase Browser Client untuk Client Components
 * Menggunakan @supabase/ssr createBrowserClient dengan Database Types
 */
export const createClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};

export const getSupabaseBrowserClient = createClient;
