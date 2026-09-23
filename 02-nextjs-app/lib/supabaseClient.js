import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Won't crash the build, but requests will fail until .env.local is set —
  // see README.md.
  console.warn('Supabase env vars belum diisi. Lihat README.md.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
