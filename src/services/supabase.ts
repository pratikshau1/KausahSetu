import { mockDb } from './mockDb';

/**
 * KaushalSetu Supabase Client Interface
 * 
 * To connect your database to a real Supabase backend:
 * 1. Run: `npm install @supabase/supabase-js`
 * 2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
 * 3. Import createClient and export a real supabase client.
 */

export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (isSupabaseConfigured) {
  console.log('🔌 Supabase environment variables detected. Ready for backend hookup.');
} else {
  console.log('📦 Supabase keys missing. Running in Offline Sandbox Mode using localStorage DB.');
}

// Global database router
// Components call db.getJobs(), db.saveApplication() etc.
// This allows swapping mockDb for real Supabase queries effortlessly.
export const db = mockDb;
