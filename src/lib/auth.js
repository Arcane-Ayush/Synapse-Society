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
 * Sign in with Google (OAuth).
 */
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/`,
        },
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
        .select('*')
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
    const [userCardsRes, levelsRes] = await Promise.all([
        supabase
            .from('user_cards')
            .select(`
                unlocked_at,
                source,
                cards (*)
            `)
            .eq('user_id', userId)
            .order('unlocked_at', { ascending: false }),
        supabase.from('levels').select('*')
    ]);

    if (userCardsRes.error) return { data: null, error: userCardsRes.error };

    const levels = levelsRes.data || [];

    const normalized = userCardsRes.data.map(item => {
        const cardLevel = levels.find(l => l.level === item.cards.level_required);
        const nextLevel = cardLevel ? levels.find(l => l.level === cardLevel.level + 1) : null;
        
        return {
            ...item,
            cards: {
                ...item.cards,
                level: item.cards.level_required,
                colors: {
                    primary: item.cards.primary_color,
                    secondary: item.cards.secondary_color,
                    glow: item.cards.glow_color
                },
                foilColors: item.cards.foil_colors,
                characterEmoji: item.cards.character_emoji,
                xpRequired: cardLevel ? cardLevel.xp_required : (item.cards.worth || 0),
                xpMax: nextLevel ? nextLevel.xp_required : (cardLevel ? 999999 : 0),
                imageUrl: item.cards.image_url,
                maxSupply: item.cards.max_supply
            }
        };
    });
    return { data: normalized, error: null };
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
        .select('*, user_missions(count)')
        .in('status', ['Active', 'Upcoming'])
        .order('deadline', { ascending: true });
    return { data, error };
}

/**
 * Fetch all missions accepted by a specific user.
 */
export async function getUserMissions(userId) {
    if (!userId) return { data: [], error: null };
    const { data, error } = await supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', userId);
    return { data, error };
}

/**
 * Accept a mission (Quests)
 */
export async function acceptMission(missionId, userId) {
    if (!missionId || !userId) return { data: null, error: new Error('Missing missionId or userId') };
    
    // Insert into user_missions
    const { data, error } = await supabase
        .from('user_missions')
        .insert([
            { mission_id: missionId, user_id: userId, status: 'In Progress', started_at: new Date().toISOString() }
        ])
        .select();
        
    return { data, error };
}

/**
 * Fetch all teams (factions leaderboard).
 */
export async function getTeams() {
    const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(count)')
        .order('total_tokens', { ascending: false });

    if (error) return { data: null, error };

    const mapped = data.map(team => ({
        ...team,
        badge: team.badge_emoji,
        color: team.color_hex,
        tokens: team.total_tokens,
        members: team.team_members?.[0]?.count || 0
    }));

    return { data: mapped, error: null };
}

/**
 * Fetch the team for a specific user.
 */
export async function getUserTeam(userId) {
    if (!userId) return { data: null, error: null };
    const { data, error } = await supabase
        .from('team_members')
        .select('*, teams(*)')
        .eq('user_id', userId)
        .maybeSingle();
    return { data, error };
}

/**
 * Join a team using an invite code.
 */
export async function joinTeam(userId, inviteCode) {
    if (!userId || !inviteCode) return { data: null, error: new Error('Missing userId or inviteCode') };
    
    // 1. Find the team by invite code
    const { data: team, error: teamErr } = await supabase
        .from('teams')
        .select('*')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .maybeSingle();
        
    if (teamErr) return { data: null, error: teamErr };
    if (!team) return { data: null, error: new Error('Invalid invite code.') };
    
    // 2. Insert into team_members
    const { data, error } = await supabase
        .from('team_members')
        .insert([{ team_id: team.id, user_id: userId }])
        .select('*, teams(*)');
        
    return { data, error };
}

/**
 * Create a new custom Team Faction.
 */
export async function createTeam(userId, name, color, emoji) {
    if (!userId || !name) return { data: null, error: new Error('Missing required fields.') };
    
    // Generate random 6-character invite code
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const inviteCode = `SYN-${randomCode}`;
    
    // 1. Create team
    const { data: team, error: teamErr } = await supabase
        .from('teams')
        .insert([{ 
            name, 
            color_hex: color, 
            badge_emoji: emoji, 
            invite_code: inviteCode,
            is_custom: true
        }])
        .select()
        .single();
        
    if (teamErr) return { data: null, error: teamErr };
    
    // 2. Add creator to team
    const { data, error } = await supabase
        .from('team_members')
        .insert([{ team_id: team.id, user_id: userId }])
        .select('*, teams(*)');
        
    return { data, error };
}

/**
 * Leave a custom team.
 */
export async function leaveTeam(userId, teamId) {
    if (!userId || !teamId) return { data: null, error: new Error('Missing userId or teamId') };
    
    const { data, error } = await supabase
        .from('team_members')
        .delete()
        .match({ user_id: userId, team_id: teamId });
        
    return { data, error };
}

/**
 * Fetch global app settings.
 */
export async function getAppSettings() {
    const { data, error } = await supabase
        .from('app_settings')
        .select('*');
        
    if (error) return { data: null, error };
    
    const settings = {};
    data.forEach(item => {
        settings[item.setting_key] = item.setting_value;
    });
    
    return { data: settings, error: null };
}

/**
 * Toggle hackathon registration (Admin only).
 */
export async function toggleHackathonRegistration(isOpen) {
    const { data, error } = await supabase
        .from('app_settings')
        .upsert([{ setting_key: 'hackathon_registration_open', setting_value: isOpen }])
        .select();
        
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
    const [cardsRes, levelsRes] = await Promise.all([
        supabase.from('cards').select('*').order('level_required', { ascending: true, nullsLast: true }),
        supabase.from('levels').select('*')
    ]);

    if (cardsRes.error) return { data: null, error: cardsRes.error };

    const levels = levelsRes.data || [];

    const normalized = cardsRes.data.map(card => {
        const cardLevel = levels.find(l => l.level === card.level_required);
        const nextLevel = cardLevel ? levels.find(l => l.level === cardLevel.level + 1) : null;

        return {
            ...card,
            level: card.level_required,
            colors: {
                primary: card.primary_color,
                secondary: card.secondary_color,
                glow: card.glow_color
            },
            foilColors: card.foil_colors,
            characterEmoji: card.character_emoji,
            xpRequired: cardLevel ? cardLevel.xp_required : (card.worth || 0),
            xpMax: nextLevel ? nextLevel.xp_required : (cardLevel ? 999999 : 0),
            imageUrl: card.image_url,
            maxSupply: card.max_supply
        };
    });

    return { data: normalized, error: null };
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
