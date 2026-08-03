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

    if (error) {
        if (error.message?.includes('profiles_username_key') || error.message?.includes('unique constraint') || error.message?.includes('duplicate key')) {
            return { data: null, error: new Error('Username already exists. Please choose a different username.') };
        }
    }
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
            { mission_id: missionId, user_id: userId, status: 'in_progress', started_at: new Date().toISOString() }
        ])
        .select();
        
    return { data, error };
}

/**
 * Submit proof URL and/or Image for an accepted quest.
 */
export async function submitMissionProof(missionId, userId, submissionUrl = '', submissionNotes = '', submissionImageUrl = null) {
    if (!missionId || !userId) {
        return { data: null, error: new Error('Missing user or quest identification.') };
    }
    if (!submissionUrl && !submissionImageUrl) {
        return { data: null, error: new Error('Please provide a proof URL or upload an image proof.') };
    }
    const { data, error } = await supabase
        .from('user_missions')
        .update({
            status: 'submitted',
            submission_url: submissionUrl || null,
            submission_notes: submissionNotes || null,
            submission_image_url: submissionImageUrl || null,
            submitted_at: new Date().toISOString()
        })
        .eq('mission_id', missionId)
        .eq('user_id', userId)
        .select();
    return { data, error };
}

/**
 * Fetch all pending quest submissions for Lead/Admin review.
 * Uses a SECURITY DEFINER RPC so submitter email is only ever
 * returned to leads/administrators — never to regular members.
 */
export async function getPendingSubmissions() {
    const { data, error } = await supabase.rpc('get_pending_submissions');
    if (error) return { data: [], error };

    // Re-shape flat RPC rows into the nested structure the UI expects
    // Note: output columns renamed (submission_id, submitter_id, quest_id) to
    // avoid PostgreSQL "column reference is ambiguous" errors with RETURNS TABLE.
    const shaped = (data || []).map(row => ({
        id:                   row.submission_id,
        user_id:              row.submitter_id,
        mission_id:           row.quest_id,
        status:               row.status,
        submission_url:       row.submission_url,
        submission_notes:     row.submission_notes,
        submission_image_url: row.submission_image_url,
        started_at:           row.started_at,
        submitted_at:         row.submitted_at,
        completed_at:         row.completed_at,
        xp_awarded:           row.xp_awarded,
        profiles: {
            id:           row.profile_id,
            display_name: row.profile_display_name,
            username:     row.profile_username,
            avatar_url:   row.profile_avatar_url,
            email:        row.profile_email,
        },
        missions: {
            id:          row.quest_id,
            title:       row.mission_title,
            xp_reward:   row.mission_xp_reward,
            type:        row.mission_type,
            assigned_to: row.mission_assigned_to,
            proof_type:  row.mission_proof_type,
        },
    }));
    return { data: shaped, error: null };
}

/**
 * Approve or Reject a submitted quest.
 */
export async function reviewMissionSubmission(userMissionId, targetUserId, missionTitle, xpReward, approved) {
    if (approved) {
        // 1. Award XP via RPC
        const { data: xpRes, error: xpErr } = await supabase.rpc('award_xp', {
            p_user_id: targetUserId,
            p_amount: xpReward || 50,
            p_reason: `Quest Completed: ${missionTitle}`,
            p_source: 'mission',
            p_reference_id: null
        });
        if (xpErr) return { data: null, error: xpErr };

        // 2. Mark user_mission as completed
        const { data, error } = await supabase
            .from('user_missions')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                xp_awarded: xpReward
            })
            .eq('id', userMissionId)
            .select();
        return { data, error };
    } else {
        // Reject -> reset to in_progress so user can re-submit
        const { data, error } = await supabase
            .from('user_missions')
            .update({
                status: 'in_progress',
                submission_url: null,
                submission_notes: null,
                submission_image_url: null,
                submitted_at: null
            })
            .eq('id', userMissionId)
            .select();
        return { data, error };
    }
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

    if (error || !data) return { data: null, error };

    if (data.teams) {
        data.teams.tokens = data.teams.total_tokens ?? data.teams.tokens ?? 0;
    }

    return { data, error: null };
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
    
    // Generate cryptographically secure 6-character invite code
    const buf = new Uint8Array(4);
    crypto.getRandomValues(buf);
    const randomCode = Array.from(buf, b => b.toString(36)).join('').slice(0, 6).toUpperCase();
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
 * Validate and claim a form signup code.
 * The secret salt and hashing logic have been moved server-side into the
 * `redeem_form_signup_code` Supabase RPC (see migration 20260803000000).
 * This client function is a thin wrapper that calls the secure server-side RPC.
 *
 * @param {string} userId - The authenticated user's ID
 * @param {string} code   - The code the user submitted
 * @returns {Promise<{ data, error }>}
 */
export async function redeemFormSignupCode(userId, code) {
    const { data, error } = await supabase.rpc('redeem_form_signup_code', {
        p_user_id: userId,
        p_code: code,
    });
    return { data, error };
}

/**
 * Fetch all available cards for admin selection.
 */
export async function getAllAvailableCards() {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('id', { ascending: true });
    return { data: data || [], error };
}

/**
 * Bulk award XP and/or Cards to a list of usernames/emails/display_names.
 *
 * Security: user resolution is delegated to the `bulk_resolve_users` SECURITY
 * DEFINER RPC. Email addresses are matched server-side and NEVER returned to
 * the client — only (id, username, display_name) come back.
 */
export async function bulkAwardRewards({ identifiers = [], xpAmount = 0, xpReason = 'Admin Award', cardId = null, source = 'admin_award' }) {
    if (!identifiers || identifiers.length === 0) {
        return { data: null, error: new Error('No user identifiers provided.') };
    }

    const cleanIdentifiers = identifiers
        .map(i => i.trim())
        .filter(Boolean);

    // 1. Resolve user IDs server-side — email matching happens in DB, never in browser
    const { data: matchedUsers, error: pErr } = await supabase.rpc('bulk_resolve_users', {
        p_identifiers: cleanIdentifiers,
    });

    if (pErr) return { data: null, error: pErr };

    if (!matchedUsers || matchedUsers.length === 0) {
        return { data: [], matchedCount: 0, totalRequested: cleanIdentifiers.length, error: new Error('No matching user profiles found for the given list.') };
    }

    const results = [];

    for (const u of matchedUsers) {
        // bulk_resolve_users returns 'user_id' (not 'id') to avoid SQL ambiguity
        const resObj = { userId: u.user_id, username: u.username || u.display_name, xpSuccess: false, cardSuccess: false };

        // Award XP if amount > 0
        if (xpAmount > 0) {
            const { data: xpRes, error: xpErr } = await supabase.rpc('award_xp', {
                p_user_id: u.user_id,
                p_amount: Number(xpAmount),
                p_reason: xpReason || 'Admin Award',
                p_source: 'admin_award',
                p_reference_id: null
            });
            resObj.xpSuccess = !xpErr && xpRes?.success !== false;
            resObj.xpError = xpErr?.message || xpRes?.error;
        }

        // Award Card if cardId provided
        if (cardId) {
            const { data: cardRes, error: cardErr } = await supabase.rpc('award_card', {
                p_user_id: u.user_id,
                p_card_id: cardId,
                p_source: source || 'admin_award'
            });
            resObj.cardSuccess = !cardErr && cardRes?.success !== false;
            resObj.cardError = cardErr?.message || cardRes?.error;
        }

        results.push(resObj);
    }

    return { data: results, matchedCount: matchedUsers.length, totalRequested: cleanIdentifiers.length, error: null };
}
