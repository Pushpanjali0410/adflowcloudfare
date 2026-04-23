import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client lazily to avoid errors during build
export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    return createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// For backward compatibility
export const supabase = getSupabase();

// Get admin client (server-side only)
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    return createClient(supabaseUrl || 'https://placeholder.supabase.co', serviceRoleKey || 'placeholder');
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
