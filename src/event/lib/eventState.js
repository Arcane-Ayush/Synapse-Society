import { supabase } from '../../lib/supabase';
export { playEventSound, broadcastPlaySound } from './soundSystem';

export const EVENT_PHASES = {
    PHASE_0_CHECKIN: 'phase_0_checkin',          // Attendee Check-In Pass
    PHASE_0_5_AUDIENCE_TAP: 'phase_0_5_audience', // Audience Sync
    PHASE_1_TEAMS: 'phase_1_teams',              // Squad Alignment Pass
    PHASE_2_ROUND_1: 'phase_2_round_1',          // Round 1: Reverse Hackathon
    PHASE_3_BREAK: 'phase_3_break',              // Intermission & Break
    PHASE_4_ROUND_2: 'phase_4_round_2',          // Round 2: Dual Track (Qualifiers + Redemption)
    PHASE_5_ROUND_3: 'phase_5_round_3',          // Round 3: Grand Final Showdown
    PHASE_6_FINALE: 'phase_6_finale'             // Podium Honors & XP Conversion
};

export const DEFAULT_EVENT_STATE = {
    phase: EVENT_PHASES.PHASE_0_CHECKIN,
    phaseTitle: 'Agent Check-In & Identity Pass',
    breakTitle: 'Intermission & Energy Break',
    breakDurationSec: 15 * 60,
    roundTimerEnd: null,
    roundTimerDurationSec: 45 * 60,
    roundTimerRunning: false,
    breakTimerRunning: false,
    soundMuted: false,
    round1Prompt: {
        title: 'Round 1 · Reverse Hackathon',
        rewardSCoins: 500,
        description: 'Deconstruct the provided algorithm, isolate the latent logical defect, and submit your patched repository link.',
        rules: 'Max Reward: +500 S-Coins (50 XP) · Top 16 Squads Advance to Round 2'
    },
    round2Prompt: {
        title: 'Round 2 · Architecture Proposal',
        rewardSCoins: 500,
        description: 'Top 16 squads: Draft scalable cloud deployment architecture. Eliminated squads: Play Redemption Quiz to reclaim points.',
        rules: 'Max Reward: +500 S-Coins (50 XP) · Top Finalists Advance to Round 3'
    },
    round3Prompt: {
        title: 'Round 3 · Grand Final Showdown',
        rewardSCoins: 1000,
        description: 'Live Stage Deliberation: Defend your system architecture & live prototype directly before the jury on stage!',
        rules: 'Presented Live on Stage · Grand Champion Crowned'
    },
    adEnabled: true,
    adMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-animation-4364-large.mp4',
    adTitle: 'Official Event Partners & Technology Guilds',
    quizDurationSec: 30,
    redemptionLeaderboardVisible: false
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
 * Fetch only active/registered event teams from DB.
 */
export async function fetchActiveEventTeamsFromDb() {
    try {
        const { data, error } = await supabase
            .from('event_teams')
            .select('*')
            .eq('is_active', true)
            .order('s_coins', { ascending: false });
        if (data && data.length > 0) return data;
    } catch (e) {
        console.error('Error fetching active event teams:', e);
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
                breakTitle: data.break_title || DEFAULT_EVENT_STATE.breakTitle,
                round1Prompt: data.round_1_prompt || DEFAULT_EVENT_STATE.round1Prompt,
                round2Prompt: data.round_2_prompt || DEFAULT_EVENT_STATE.round2Prompt,
                round3Prompt: data.round_3_prompt || DEFAULT_EVENT_STATE.round3Prompt,
                adEnabled: data.ad_enabled !== false,
                adMediaUrl: data.ad_media_url || DEFAULT_EVENT_STATE.adMediaUrl,
                quizDurationSec: data.quiz_duration_sec || 30,
                redemptionLeaderboardVisible: Boolean(data.redemption_leaderboard_visible)
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
        .on('broadcast', { event: 'timer_update' }, (payload) => {
            if (payload?.payload) {
                onUpdate(prev => ({ ...prev, ...payload.payload }));
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
    try {
        await supabase.from('event_states').upsert({
            id: 'nexus_2026',
            phase: newState.phase,
            phase_title: newState.phaseTitle,
            round_1_prompt: newState.round1Prompt,
            round_2_prompt: newState.round2Prompt,
            ad_enabled: newState.adEnabled !== false,
            ad_media_url: newState.adMediaUrl || null,
            redemption_leaderboard_visible: Boolean(newState.redemptionLeaderboardVisible),
            updated_at: new Date().toISOString()
        });
    } catch (e) {
        console.error('DB update error:', e);
    }

    const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
    await channel.send({
        type: 'broadcast',
        event: 'event_state_update',
        payload: newState
    });
}

/**
 * Broadcast timer updates in real-time
 */
export async function broadcastTimerUpdate(timerPayload) {
    const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
    await channel.send({
        type: 'broadcast',
        event: 'timer_update',
        payload: timerPayload
    });
}

/**
 * Register a member to a team using their AGENT ID and activate the team.
 */
export async function assignMemberToTeamByAgentId(teamId, agentNo, memberName = '') {
    try {
        const { data: team } = await supabase
            .from('event_teams')
            .select('members')
            .eq('id', teamId)
            .maybeSingle();

        const currentMembers = Array.isArray(team?.members) ? team.members : [];
        const newMember = {
            agentNo: String(agentNo).padStart(3, '0'),
            name: memberName || `Agent #${agentNo}`,
            assignedAt: new Date().toISOString()
        };

        const updatedMembers = currentMembers.some(m => m.agentNo === newMember.agentNo)
            ? currentMembers
            : [...currentMembers, newMember];

        const { data, error } = await supabase
            .from('event_teams')
            .update({
                members: updatedMembers,
                is_active: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select();

        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'team_member_assigned',
            payload: { teamId, member: newMember, members: updatedMembers }
        });

        return { data, error };
    } catch (e) {
        return { data: null, error: e };
    }
}

/**
 * Toggle team active status directly.
 */
export async function toggleTeamActiveStatus(teamId, isActive) {
    try {
        const { data, error } = await supabase
            .from('event_teams')
            .update({
                is_active: isActive,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select();

        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'team_active_changed',
            payload: { teamId, isActive }
        });

        return { data, error };
    } catch (e) {
        return { data: null, error: e };
    }
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
 * Update quiz score for a team during Round of Redemption.
 */
export async function updateTeamQuizScore(teamId, scoreDelta, coinsDelta = 100) {
    try {
        const { data: currentTeam } = await supabase
            .from('event_teams')
            .select('quiz_score, s_coins')
            .eq('id', teamId)
            .maybeSingle();

        const newScore = (currentTeam?.quiz_score || 0) + Number(scoreDelta);
        const newCoins = (currentTeam?.s_coins || 0) + Number(coinsDelta);

        const { data, error } = await supabase
            .from('event_teams')
            .update({
                quiz_score: newScore,
                s_coins: newCoins,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select();

        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'team_quiz_updated',
            payload: { teamId, quiz_score: newScore, s_coins: newCoins }
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
