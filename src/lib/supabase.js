import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';

// Supabase now calls this the "publishable key" — it is safe to expose client-side.
// It is equivalent to the legacy "anon key". RLS policies protect all data.
const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || (!import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
    console.warn(
        '[Supabase] Missing environment variables.\n' +
        'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) are set in your .env file.'
    );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        // Persist session in localStorage so users stay logged in across page reloads
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
