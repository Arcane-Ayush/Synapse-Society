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
    roundTimerVisible: true,
    sponsorTimerTitle: 'MINI_BREAK',
    sponsorTimerDurationSec: 15 * 60,
    sponsorTimerRunning: false,
    sponsorTimerVisible: false,
    breakTimerRunning: false,
    soundMuted: false,
    round1Prompt: {
        title: 'Round 1 · Problem Discovery',
        rewardSCoins: 300,
        description: 'Identify one real-world problem within your assigned domain. Explain why it matters, and explain why AI is the right solution.',
        rules: '10 Mins Prep · 60s Live Stage Pitch · Top 16 Teams Advance'
    },
    round2Prompt: {
        title: 'Round 2 · Product Innovation',
        rewardSCoins: 500,
        description: 'Identify a major user pain point in your assigned app and propose an innovative AI feature or UI/UX improvement. Create a 1-page concept: Target User Problem, New Feature/Improvement, Feature Name, and a Wireframe sketch.',
        rules: '15 Mins Prep · 1-Page PDF Concept · Top 8 Teams Advance'
    },
    round3Prompt: {
        title: 'Round 3 · Smart City Design',
        rewardSCoins: 1000,
        description: 'Design a sustainable, efficient, and AI-powered smart city layout within ₹6,000 Cr budget and 25 sq km constraints.',
        rules: '20 Mins Prep · Top 3 Justifications · Data Lines Connectivity'
    },
    adEnabled: true,
    activeAdIndex: 0,
    adMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-animation-4364-large.mp4',
    adTitle: 'Official Event Partners & Technology Guilds',
    sponsorAds: [
        { id: 1, title: 'Slot 1 · Synapse Showcase', url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-animation-4364-large.mp4', active: true },
        { id: 2, title: 'Slot 2 · GitHub Campus', url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4', active: false },
        { id: 3, title: 'Slot 3 · Synapse Tech Showcase', url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-working-in-a-laboratory-41484-large.mp4', active: false }
    ],
    quizLiveStarted: false,
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
 * Compute sequential Agent ID from user index / registration timestamp.
 * Users are ordered chronologically by created_at date & time.
 */
export function generateAgentNumber(user, profile) {
    if (!user && !profile) return '001';
    if (profile?.agent_number) return String(profile.agent_number).padStart(3, '0');
    if (user?.user_metadata?.agent_number) return String(user.user_metadata.agent_number).padStart(3, '0');

    // Deterministic hash based on creation date or user ID
    const dateStr = user?.created_at || profile?.created_at || profile?.date_joined || user?.id;
    if (dateStr) {
        let hash = 0;
        const str = String(dateStr);
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        const seq = (Math.abs(hash) % 40) + 1; // 1 to 40
        return seq.toString().padStart(3, '0');
    }
    return '001';
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
const DEFAULT_QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "Which of the following memories is volatile?",
        options: ["ROM", "SSD", "RAM", "HDD"],
        correct_index: 2, // C
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 2,
        question: "Which component performs arithmetic and logical operations?",
        options: ["Control Unit", "ALU", "Register", "Cache"],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 3,
        question: "Which of these is not a programming language?",
        options: ["Python", "Java", "HTML", "C"],
        correct_index: 2, // C
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 4,
        question: "Which statement best describes a compiler?",
        options: ["Executes code line by line", "Converts the whole program into machine code before execution", "Stores source code", "Edits source files"],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 5,
        question: "What is the full form of \"URL\"?",
        options: ["Uniform Resource Locator", "Universal Resource Link", "Unique Reference Locator", "United Resource Locator"],
        correct_index: 0, // A
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 6,
        question: "Convert 101101₂ to decimal.",
        options: ["43", "45", "47", "53"],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 7,
        question: "Convert 59₁₀ to binary.",
        options: ["111011", "111001", "101111", "110111"],
        correct_index: 3, // D
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 8,
        question: "Which of the following is not a valid variable name?",
        options: ["_count", "totalMarks", "2value", "value2"],
        correct_index: 2, // C
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 9,
        question: "If one byte equals 8 bits, how many bytes are there in 2 KB?",
        options: ["1024", "2000", "2048", "4096"],
        correct_index: 2, // C
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 10,
        question: "Which keyword prevents modification of a variable?",
        options: ["volatile", "const", "static", "signed"],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 11,
        question: "Which memory is closest to the CPU?",
        options: ["RAM", "Cache", "SSD", "HDD"],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 12,
        question: "Which of the following is not a valid C keyword?",
        options: ["return", "switch", "function", "break"],
        correct_index: 2, // C
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 13,
        question: "Which loop is guaranteed to execute its body at least once, even if the condition is false?",
        options: ["for loop", "while loop", "do-while loop", "for-each loop"],
        correct_index: 2, // C
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 14,
        question: "Which logic gate produces an output of 1 only when both inputs are 1?",
        options: ["OR", "AND", "NOT", "XOR"],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 15,
        question: "What is virtual memory primarily used for?",
        options: ["Faster CPU", "Extend available memory using disk", "Increase RAM speed", "Store BIOS"],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 16,
        question: "Which cache level is generally the fastest?",
        options: ["L1", "L2", "L3", "RAM"],
        correct_index: 0, // A
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 17,
        question: "What is the primary purpose of cache memory?",
        options: ["Store the operating system", "Increase permanent storage", "Reduce CPU memory access time", "Replace RAM"],
        correct_index: 2, // C
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 18,
        question: "Which statement about a compiler and an interpreter is correct?",
        options: [
            "Both execute code line by line.",
            "A compiler translates the entire program before execution, while an interpreter translates one statement at a time.",
            "An interpreter is always faster than a compiler.",
            "A compiler requires no source code."
        ],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 19,
        question: "What is the main purpose of version control tools like Git?",
        options: [
            "To design website layouts",
            "To track and manage changes to code/files over time",
            "To compress image files",
            "To scan for viruses"
        ],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 20,
        question: "What best describes an \"API\" (Application Programming Interface)?",
        options: [
            "A physical computer component",
            "A set of rules that lets different software applications communicate with each other",
            "A type of programming language",
            "A tool for editing images"
        ],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    },
    {
        id: 21,
        question: "What is the primary function of DNS (Domain Name System) on the internet?",
        options: [
            "Encrypts network traffic",
            "Translates domain names into IP addresses",
            "Assigns MAC addresses to devices",
            "Compresses data for faster transfer"
        ],
        correct_index: 1, // B
        reward_s_coins: 30,
        timer_sec: 10
    }
];

export async function fetchQuizQuestionsFromDb() {
    try {
        const { data, error } = await supabase
            .from('event_quiz_questions')
            .select('*')
            .order('id', { ascending: true });

        if (data && data.length >= 21) {
            return data.map(q => ({
                ...q,
                timer_sec: Number(q.timer_sec) || 10,
                options: Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? JSON.parse(q.options) : [])
            }));
        }
    } catch (e) {
        console.error('Error fetching quiz questions from DB:', e);
    }
    return DEFAULT_QUIZ_QUESTIONS;
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
            let r1P = data.round_1_prompt || DEFAULT_EVENT_STATE.round1Prompt;
            if (!r1P.title || r1P.title.includes('Reverse Hackathon') || r1P.description?.includes('obfuscated')) {
                r1P = DEFAULT_EVENT_STATE.round1Prompt;
            }

            let r2P = data.round_2_prompt || DEFAULT_EVENT_STATE.round2Prompt;
            if (!r2P.description || r2P.description.includes('Red Bull')) {
                r2P = DEFAULT_EVENT_STATE.round2Prompt;
            }

            return {
                ...DEFAULT_EVENT_STATE,
                phase: data.phase || EVENT_PHASES.PHASE_0_CHECKIN,
                phaseTitle: data.phase_title || 'Agent Check-In & Identity Pass',
                breakTitle: data.break_title || DEFAULT_EVENT_STATE.breakTitle,
                round1Prompt: r1P,
                round2Prompt: r2P,
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
 * Register multiple members to a team using space or comma separated AGENT IDs (e.g. "42 81 243 51").
 */
export async function assignMultipleMembersToTeam(teamId, agentInput) {
    try {
        if (!teamId || !agentInput) return { data: null, count: 0, error: 'Missing team or agent IDs' };

        const tokens = String(agentInput)
            .split(/[\s,]+/)
            .map(t => t.trim().replace(/^AGENT-/i, ''))
            .filter(Boolean);

        if (tokens.length === 0) return { data: null, count: 0, error: 'No valid agent IDs' };

        const { data: team } = await supabase
            .from('event_teams')
            .select('members')
            .eq('id', teamId)
            .maybeSingle();

        const currentMembers = Array.isArray(team?.members) ? team.members : [];
        const newMembers = [];

        for (const tok of tokens) {
            const cleanNo = String(tok).padStart(3, '0');
            if (!currentMembers.some(m => m.agentNo === cleanNo) && !newMembers.some(m => m.agentNo === cleanNo)) {
                newMembers.push({
                    agentNo: cleanNo,
                    name: `Agent #${cleanNo}`,
                    assignedAt: new Date().toISOString()
                });
            }
        }

        const updatedMembers = [...currentMembers, ...newMembers];

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
            payload: { teamId, added: newMembers, members: updatedMembers }
        });

        return { data, count: newMembers.length, added: newMembers, error };
    } catch (e) {
        return { data: null, count: 0, error: e };
    }
}

/**
 * Create/Register a new event team in the database.
 */
export async function createEventTeamInDb({ code, name, badge = '', color = '#00F0FF', motto = '' }) {
    try {
        const match = (code || name || '').match(/\d+/);
        const numBadge = badge || (match ? String(match[0]).padStart(2, '0') : '01');

        const { data, error } = await supabase
            .from('event_teams')
            .insert({
                code: (code || '').toUpperCase().trim(),
                name: (name || '').trim(),
                badge: numBadge,
                color: color || '#00F0FF',
                motto: motto || 'Synchronized for neural gauntlet.',
                s_coins: 0,
                quiz_score: 0,
                is_active: true,
                is_qualified: true,
                is_eliminated: false,
                members: []
            })
            .select()
            .single();

        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'team_active_changed',
            payload: { team: data }
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
 * Update quiz score for a team during Round of Redemption by calculating team member average.
 */
export async function recordMemberQuizSubmission(teamId, userId, memberScore, memberCoins) {
    if (!teamId) return;
    try {
        if (userId) {
            const { data: existing } = await supabase
                .from('event_submissions')
                .select('id')
                .eq('team_id', teamId)
                .eq('user_id', userId)
                .eq('round', 2)
                .maybeSingle();

            if (existing?.id) {
                await supabase.from('event_submissions').update({
                    s_coins_awarded: memberCoins,
                    notes: `Quiz score: ${memberScore}`,
                    updated_at: new Date().toISOString()
                }).eq('id', existing.id);
            } else {
                await supabase.from('event_submissions').insert({
                    team_id: teamId,
                    user_id: userId,
                    round: 2,
                    s_coins_awarded: memberCoins,
                    notes: `Quiz score: ${memberScore}`,
                    submitted_at: new Date().toISOString()
                });
            }
        }

        const { data: teamSubmissions } = await supabase
            .from('event_submissions')
            .select('s_coins_awarded')
            .eq('team_id', teamId)
            .eq('round', 2);

        let avgCoins = Math.min(600, memberCoins);
        let avgScore = memberScore;

        if (teamSubmissions && teamSubmissions.length > 0) {
            const totalCoins = teamSubmissions.reduce((acc, cur) => acc + (cur.s_coins_awarded || 0), 0);
            avgCoins = Math.min(600, Math.round(totalCoins / teamSubmissions.length));
            avgScore = Math.round(avgCoins / 30);
        }

        const { data, error } = await supabase
            .from('event_teams')
            .update({
                quiz_score: avgScore,
                s_coins: avgCoins,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select();

        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'team_quiz_updated',
            payload: { teamId, quiz_score: avgScore, s_coins: avgCoins }
        });

        return { data, error };
    } catch (e) {
        console.error('Error recording member quiz submission:', e);
    }
}

/**
 * Get assigned team for a user during the event from database.
 */
export async function getAssignedEventTeam(userId, user = null, profile = null) {
    if (!userId) return null;
    try {
        // 1. Query direct assignment from event_attendees
        const { data } = await supabase
            .from('event_attendees')
            .select('team_id, event_teams(*)')
            .eq('user_id', userId)
            .maybeSingle();

        if (data?.event_teams) {
            return data.event_teams;
        }

        // 2. Fallback: Search event_teams.members JSON array for user's Agent ID
        const agentNo = generateAgentNumber(user, profile);
        if (agentNo) {
            const cleanNo = String(agentNo).padStart(3, '0');
            const { data: allTeams } = await supabase
                .from('event_teams')
                .select('*');

            if (allTeams && allTeams.length > 0) {
                const matchedTeam = allTeams.find(t => {
                    if (!t.members) return false;
                    let membersArr = t.members;
                    if (typeof membersArr === 'string') {
                        try { membersArr = JSON.parse(membersArr); } catch(e) {}
                    }
                    if (Array.isArray(membersArr)) {
                        return membersArr.some(m => {
                            let obj = m;
                            if (typeof m === 'string') {
                                try { obj = JSON.parse(m); } catch(e) { obj = m; }
                            }
                            const num = typeof obj === 'object' ? (obj?.agentNo || obj?.agent_number) : obj;
                            return String(num).padStart(3, '0') === cleanNo || String(num) === String(Number(cleanNo));
                        });
                    }
                    const str = JSON.stringify(t.members);
                    return str.includes(`"${cleanNo}"`) || str.includes(`"${Number(cleanNo)}"`);
                });

                if (matchedTeam) {
                    // Auto-sync link in event_attendees database table
                    await setAssignedEventTeam(userId, matchedTeam);
                    return matchedTeam;
                }
            }
        }
    } catch (e) {
        console.error('Error in getAssignedEventTeam:', e);
    }
    return null;
}

/**
 * Assign a user to an event team in database.
 */
export async function setAssignedEventTeam(userId, teamData) {
    if (!userId) return;
    try {
        await supabase.from('event_attendees').upsert({
            user_id: userId,
            team_id: teamData?.id || null,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'attendee_team_assigned',
            payload: { userId, team: teamData }
        });
    } catch (e) {}
}

/**
 * Reset all 40 event teams to 0 S-Coins and clean status in Supabase DB.
 */
export async function resetAllTeamsInDb() {
    try {
        const { data, error } = await supabase
            .from('event_teams')
            .update({
                s_coins: 0,
                quiz_score: 0,
                is_qualified: false,
                is_eliminated: false,
                is_active: false,
                members: [],
                updated_at: new Date().toISOString()
            })
            .gte('id', 0)
            .select();

        if (!error) {
            broadcastEventStateUpdate({ type: 'teams_reset_all' });
        }
        return { data, error };
    } catch (e) {
        console.error('Error resetting all teams in DB:', e);
        return { error: e };
    }
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

/**
 * Assign Round 2 App to a team in database.
 */
export async function updateTeamAssignedApp(teamId, val) {
    try {
        let mottoStr = '';
        if (val) {
            if (val.startsWith('Domain: ') || val.startsWith('App: ')) {
                mottoStr = val;
            } else {
                mottoStr = `App: ${val}`;
            }
        }
        const { data, error } = await supabase
            .from('event_teams')
            .update({
                motto: mottoStr,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId)
            .select();

        if (!error) {
            broadcastEventStateUpdate({ type: 'team_app_assigned', teamId, appName: mottoStr });
        }
        return { data, error };
    } catch (err) {
        console.error('Error assigning app to team:', err);
        return { error: err };
    }
}
