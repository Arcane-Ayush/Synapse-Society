import { supabase } from '../../lib/supabase';

export const EVENT_PHASES = {
    PHASE_0_CHECKIN: 'phase_0_checkin',          // Attendee ID Card & Check-in
    PHASE_0_5_AUDIENCE_TAP: 'phase_0_5_audience', // Audience Arc Reactor Tap & Power Surge
    PHASE_1_TEAMS: 'phase_1_teams',              // Team Allocation & Docked HUD Badge
    PHASE_2_ROUND_1: 'phase_2_round_1',          // Reverse Hackathon Quest Challenge
    PHASE_3_RED_BULL: 'phase_3_red_bull',        // Red Bull Break / Intermission (Dual Timers)
    PHASE_4_ROUND_2: 'phase_4_round_2',          // Qualifiers Proposal Quest + Redemption Quiz
    PHASE_5_FINALE: 'phase_5_finale'             // Final Standings & Winner Ceremony
};

export const DEFAULT_EVENT_STATE = {
    phase: EVENT_PHASES.PHASE_0_CHECKIN,
    phaseTitle: 'Agent Check-In & Identity Pass',
    roundTimerEnd: null,
    roundTimerDurationSec: 45 * 60,
    roundTimerRunning: false,
    redBullTimerEnd: null,
    redBullTimerDurationSec: 15 * 60,
    redBullTimerRunning: false,
    round1Prompt: null,
    round2Prompt: null
};

const BROADCAST_CHANNEL_NAME = 'synapse_neural_nexus_2026';

/**
 * Exchange rate: 10 S-Coins = 1 XP
 */
export function sCoinsToXp(sCoins = 0) {
    return Math.floor((Number(sCoins) || 0) / 10);
}

/**
 * Compute sequential Agent ID from user index / timestamp.
 */
export function generateAgentNumber(user, profile) {
    if (!user && !profile) return '001';
    const dateStr = profile?.date_joined || user?.created_at || '2026-08-01';
    const seed = Math.abs(dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const num = ((seed % 88) + 1);
    return num.toString().padStart(3, '0');
}

/**
 * Fetch all 40 event teams live from PostgreSQL table `event_teams`.
 */
export async function fetchEventTeamsFromDb() {
    try {
        const { data, error } = await supabase
            .from('event_teams')
            .select('*')
            .order('id', { ascending: true });
        if (data && data.length > 0) return data;
    } catch (e) {
        console.error('Error fetching event teams from DB:', e);
    }
    return [];
}

/**
 * Fetch quiz questions live from PostgreSQL table `event_quiz_questions`.
 */
export async function fetchQuizQuestionsFromDb() {
    try {
        const { data, error } = await supabase
            .from('event_quiz_questions')
            .select('*')
            .order('id', { ascending: true });
        if (data && data.length > 0) return data;
    } catch (e) {
        console.error('Error fetching quiz questions from DB:', e);
    }
    return [];
}

/**
 * Fetch live event state from PostgreSQL table `event_states`.
 */
export async function fetchLiveEventStateFromDb() {
    try {
        const { data } = await supabase
            .from('event_states')
            .select('*')
            .eq('id', 'nexus_2026')
            .maybeSingle();
        if (data) {
            return {
                ...DEFAULT_EVENT_STATE,
                phase: data.phase || EVENT_PHASES.PHASE_0_CHECKIN,
                phaseTitle: data.phase_title || 'Agent Check-In & Identity Pass',
                round1Prompt: data.round_1_prompt,
                round2Prompt: data.round_2_prompt
            };
        }
    } catch (e) {
        console.error('Error reading event state from DB:', e);
    }
    return DEFAULT_EVENT_STATE;
}

/**
 * Subscribe to live event broadcasts via Supabase Realtime WebSockets.
 */
export function subscribeToEventState(onUpdate) {
    // Initial fetch from DB
    fetchLiveEventStateFromDb().then(st => onUpdate(st));

    const channel = supabase.channel(BROADCAST_CHANNEL_NAME, {
        config: { broadcast: { self: true } }
    });

    channel
        .on('broadcast', { event: 'event_state_update' }, (payload) => {
            if (payload?.payload) {
                onUpdate(payload.payload);
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * Broadcast updated event state from Admin Console to all screens and update database.
 */
export async function broadcastEventState(newState) {
    // 1. Persist directly into PostgreSQL
    try {
        await supabase.from('event_states').upsert({
            id: 'nexus_2026',
            phase: newState.phase,
            phase_title: newState.phaseTitle,
            round_1_prompt: newState.round1Prompt,
            round_2_prompt: newState.round2Prompt,
            updated_at: new Date().toISOString()
        });
    } catch (e) {
        console.error('DB update error:', e);
    }

    // 2. Realtime Broadcast across websockets to all connected attendees & stage screens
    const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
    await channel.send({
        type: 'broadcast',
        event: 'event_state_update',
        payload: newState
    });
}

/**
 * Eliminate or qualify a team in the database.
 */
export async function toggleTeamElimination(teamId, isEliminated) {
    try {
        const { data, error } = await supabase
            .from('event_teams')
            .update({
                is_eliminated: isEliminated,
                is_qualified: !isEliminated,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select();
        
        // Broadcast team update
        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'team_status_changed',
            payload: { teamId, isEliminated }
        });
        return { data, error };
    } catch (e) {
        return { data: null, error: e };
    }
}

/**
 * Distribute S-Coins to a team in the database.
 */
export async function awardTeamSCoins(teamId, amount) {
    try {
        const { data: currentTeam } = await supabase
            .from('event_teams')
            .select('s_coins')
            .eq('id', teamId)
            .maybeSingle();

        const currentCoins = currentTeam?.s_coins || 0;
        const newTotal = currentCoins + Number(amount);

        const { data, error } = await supabase
            .from('event_teams')
            .update({
                s_coins: newTotal,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select();

        // Broadcast points update to stage leaderboard
        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'team_scoins_awarded',
            payload: { teamId, s_coins: newTotal, delta: amount }
        });

        return { data, error };
    } catch (e) {
        return { data: null, error: e };
    }
}

/**
 * Get assigned team for a user during the event from database.
 */
export async function getAssignedEventTeam(userId) {
    if (!userId) return null;
    try {
        const { data } = await supabase
            .from('event_attendees')
            .select('team_id, event_teams(*)')
            .eq('user_id', userId)
            .maybeSingle();
        return data?.event_teams || null;
    } catch (e) {
        return null;
    }
}

/**
 * Assign a user to an event team in database.
 */
export async function setAssignedEventTeam(userId, teamData) {
    if (!userId) return;
    try {
        await supabase.from('event_attendees').upsert({
            user_id: userId,
            agent_number: teamData?.code || '001',
            team_id: teamData?.id || null,
            updated_at: new Date().toISOString()
        });

        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'attendee_team_assigned',
            payload: { userId, team: teamData }
        });
    } catch (e) {}
}

/**
 * Get user S-Coin balance from database.
 */
export async function getUserSCoins(userId) {
    if (!userId) return 0;
    try {
        const { data } = await supabase
            .from('event_attendees')
            .select('s_coins')
            .eq('user_id', userId)
            .maybeSingle();
        return Number(data?.s_coins) || 0;
    } catch (e) {
        return 0;
    }
}

/**
 * Add S-Coins to a user in database.
 */
export async function addUserSCoins(userId, amount) {
    if (!userId || !amount) return;
    try {
        const current = await getUserSCoins(userId);
        const total = current + Number(amount);
        await supabase.from('event_attendees').upsert({
            user_id: userId,
            s_coins: total,
            updated_at: new Date().toISOString()
        });
    } catch (e) {}
}
