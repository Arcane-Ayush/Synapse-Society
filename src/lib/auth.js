import { supabase } from './supabase';

/**
 * Sign up with email + password.
 * Supabase handles hashing — never touch the password in app code.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} displayName - shown in UI, stored in profile
 * @returns {Promise<{ data, error }>}
 */
export async function signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: displayName },  // passed to handle_new_user() trigger
        },
    });
    return { data, error };
}

/**
 * Sign in with email + password.
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

/**
 * Sign out current user.
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
    });
    return { data, error };
}

/**
 * Get the current active session (null if not logged in).
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
}

/**
 * Subscribe to auth state changes (login / logout / token refresh).
 * Returns unsubscribe function.
 */
export function onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
    return () => subscription.unsubscribe();
}

/**
 * Fetch the current user's profile from the profiles table.
 */
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            levels (label, xp_required)
        `)
        .eq('id', userId)
        .single();
    return { data, error };
}

/**
 * Update the current user's own profile.
 * Only display_name and avatar_url are user-editable.
 */
export async function updateProfile(userId, updates) {
    const allowed = ['display_name', 'avatar_url', 'username'];
    const sanitized = Object.fromEntries(
        Object.entries(updates).filter(([key]) => allowed.includes(key))
    );

    const { data, error } = await supabase
        .from('profiles')
        .update(sanitized)
        .eq('id', userId)
        .select()
        .single();
    return { data, error };
}

/**
 * Fetch dynamic XP rank of a user from get_user_rank RPC.
 */
export async function getUserRank(userId) {
    const { data, error } = await supabase.rpc('get_user_rank', { p_user_id: userId });
    return { data: data ?? 1, error };
}

/**
 * Fetch all cards owned by a user.
 */
export async function getUserCards(userId) {
    const { data, error } = await supabase
        .from('user_cards')
        .select(`
            unlocked_at,
            source,
            cards (*)
        `)
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

    if (data) {
        const normalized = data.map(item => ({
            ...item,
            cards: {
                ...item.cards,
                colors: {
                    primary: item.cards.primary_color,
                    secondary: item.cards.secondary_color,
                    glow: item.cards.glow_color
                },
                foilColors: item.cards.foil_colors,
                characterEmoji: item.cards.character_emoji,
                xpRequired: item.cards.xp_required,
                xpMax: item.cards.xp_max,
                imageUrl: item.cards.image_url,
                maxSupply: item.cards.max_supply
            }
        }));
        return { data: normalized, error };
    }
    return { data, error };
}

/**
 * Fetch paginated leaderboard using the optimized RPC function.
 */
export async function getLeaderboard(limit = 50, offset = 0) {
    const { data, error } = await supabase
        .rpc('get_leaderboard', { p_limit: limit, p_offset: offset });
    return { data, error };
}

/**
 * Fetch all public activities.
 */
export async function getActivities() {
    const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('event_date', { ascending: true });
    return { data, error };
}

/**
 * Fetch all active/upcoming missions.
 */
export async function getMissions() {
    const { data, error } = await supabase
        .from('missions')
        .select('*')
        .in('status', ['Active', 'Upcoming'])
        .order('deadline', { ascending: true });
    return { data, error };
}

/**
 * Fetch all teams (factions leaderboard).
 */
export async function getTeams() {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('total_tokens', { ascending: false });
    return { data, error };
}

/**
 * Fetch all projects.
 */
export async function getProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
}

/**
 * Fetch all team members (About page).
 */
export async function getTeamMembers() {
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });
    return { data, error };
}

/**
 * Fetch all card definitions (for Nexus cards tab).
 */
export async function getAllCards() {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('level', { ascending: true, nullsLast: true });

    if (data) {
        const normalized = data.map(card => ({
            ...card,
            colors: {
                primary: card.primary_color,
                secondary: card.secondary_color,
                glow: card.glow_color
            },
            foilColors: card.foil_colors,
            characterEmoji: card.character_emoji,
            xpRequired: card.xp_required,
            xpMax: card.xp_max,
            imageUrl: card.image_url,
            maxSupply: card.max_supply
        }));
        return { data: normalized, error };
    }

    return { data, error };
}

/**
 * Fetch XP history for a user.
 */
export async function getXpHistory(userId, limit = 20) {
    const { data, error } = await supabase
        .from('xp_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
    return { data, error };
}

/**
 * Generate a unique access code based on a user's email.
 * This matches the logic on the Synapse Form site to verify form submission without DB linking.
 */
export async function generateFormCode(email) {
    if (!email) return null;
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim() + "SYNAPSE_SECRET_SALT_2026");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return "SYN-" + hashHex.slice(0, 8).toUpperCase();
}
