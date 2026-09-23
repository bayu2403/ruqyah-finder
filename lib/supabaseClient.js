import { createClient } from '@supabase/supabase-js';
import { createMockClient } from './mockSupabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasRealCredentials =
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR-PROJECT');

if (!hasRealCredentials) {
  // No Supabase project configured — fall back to hardcoded dummy data
  // (lib/mockSupabase.js) so the app still runs locally. See README.md.
  console.warn('Supabase env vars belum diisi — pakai dummy data lokal.');
}

export const supabase = hasRealCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
