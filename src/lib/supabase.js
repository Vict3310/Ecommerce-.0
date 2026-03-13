import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = "Missing Supabase environment variables! Please check your .env file or Vercel Environment Variables.";
  console.error(errorMsg);
  // Optional: Throw error to prevent silent failure if needed
  // throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
