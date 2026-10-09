/**
 * src/lib/supabaseClient.js
 *
 * Browser-side Supabase client.
 * Uses ONLY the public anon key — NEVER the service_role key.
 *
 * Import this wherever you need direct Supabase calls from the frontend
 * (real-time subscriptions, storage downloads, etc.).
 * For calls that go through your Express server use src/lib/api.js instead.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Validate at startup so you get a clear message ───────────────
if (!SUPABASE_URL) {
  throw new Error(
    '[supabaseClient] VITE_SUPABASE_URL is missing.\n' +
    '  1. Open wollo-info-hub/.env\n' +
    '  2. Add:  VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co\n' +
    '  3. Restart the dev server (npm run dev).'
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    '[supabaseClient] VITE_SUPABASE_ANON_KEY is missing.\n' +
    '  1. Open wollo-info-hub/.env\n' +
    '  2. Add:  VITE_SUPABASE_ANON_KEY=<your anon/public key>\n' +
    '     ⚠  Use the anon key, NOT the service_role key.\n' +
    '  3. Restart the dev server (npm run dev).'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession:     true,   // keeps user logged in across page refreshes
    autoRefreshToken:   true,   // silently renews the access token
    detectSessionInUrl: true,   // handles OAuth / magic-link redirects
    storageKey:         'wou_session',
  },
});

export default supabase;
