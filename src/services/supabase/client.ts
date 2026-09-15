import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcrdrcqbrkzznnnwimje.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8QkBP3-6kvuhvKq2ysmKUA_2kGVCnD1';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase client initialized without complete environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
