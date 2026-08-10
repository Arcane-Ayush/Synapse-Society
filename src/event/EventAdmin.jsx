import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Radio, Users, Clock, Play, Pause, Zap, Award, Flame, Trophy,
    CheckCircle2, RotateCcw, PlusCircle, MinusCircle, Coins, XCircle, ChevronRight,
    Sparkles, Send, UserPlus, Image, Eye, EyeOff, Layers, Search, Coffee,
    ArrowUpRight, ArrowDownLeft, Trash2, Undo2, ChevronDown, ChevronUp, ExternalLink, Monitor, Video, Check, Gift, Plus, Filter, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
    EVENT_PHASES,
    DEFAULT_EVENT_STATE,
    broadcastEventState,
    broadcastTimerUpdate,
    subscribeToEventState,
    fetchEventTeamsFromDb,
    toggleTeamElimination,
    awardTeamSCoins,
    assignMemberToTeamByAgentId,
    assignMultipleMembersToTeam,
    createEventTeamInDb,
    toggleTeamActiveStatus,
    updateTeamAssignedApp,
    resetAllTeamsInDb
} from './lib/eventState';
import { playEventSound, broadcastPlaySound } from './lib/soundSystem';
import { getTeamNumberBadge } from './lib/eventTeamsData';
import { supabase } from '../lib/supabase';

export function EventAdmin() {
    const { profile, isLead, isVolunteer, isAuthenticated } = useAuth();
    const [eventState, setEventState] = useState(DEFAULT_EVENT_STATE);
    const [teams, setTeams] = useState([]);
    const [broadcastSuccess, setBroadcastSuccess] = useState(false);
    const [awardMessage, setAwardMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [round3TeamIds, setRound3TeamIds] = useState([]);

    // 1. Round Timer States
    const [customRoundMinutes, setCustomRoundMinutes] = useState(45);
    const [roundSeconds, setRoundSeconds] = useState(45 * 60);
    const [roundRunning, setRoundRunning] = useState(false);
    const [roundVisible, setRoundVisible] = useState(true);

    // 2. Mini Break Timer States
    const [customSponsorTitle, setCustomSponsorTitle] = useState('MINI_BREAK');
    const [customSponsorMinutes, setCustomSponsorMinutes] = useState(15);
    const [sponsorSeconds, setSponsorSeconds] = useState(15 * 60);
    const [sponsorRunning, setSponsorRunning] = useState(false);
    const [sponsorVisible, setSponsorVisible] = useState(false);

    // 3. Custom Scene Break Settings
    const [customBreakTitle, setCustomBreakTitle] = useState('Intermission & Energy Break');
    const [customBreakMinutes, setCustomBreakMinutes] = useState(15);
    const [breakSeconds, setBreakSeconds] = useState(15 * 60);
    const [breakRunning, setBreakRunning] = useState(false);

    // 4. 3-Slot Sponsor Ads Overlay State
    const [adSlots, setAdSlots] = useState([
        { id: 1, title: 'Slot 1 · Synapse Showcase', url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-animation-4364-large.mp4', active: true },
        { id: 2, title: 'Slot 2 · GitHub Campus', url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4', active: false },
        { id: 3, title: 'Slot 3 · Synapse Tech Showcase', url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-working-in-a-laboratory-41484-large.mp4', active: false }
    ]);
    const [activeAdIndex, setActiveAdIndex] = useState(0);

    // Prompt Editors
    const [r1Prompt, setR1Prompt] = useState(DEFAULT_EVENT_STATE.round1Prompt);
    const [r2Prompt, setR2Prompt] = useState(DEFAULT_EVENT_STATE.round2Prompt);
    const [r3Prompt, setR3Prompt] = useState(DEFAULT_EVENT_STATE.round3Prompt);
    const [editingPromptRound, setEditingPromptRound] = useState(null);

    // Member & Team Creation Modals
    const [registerTeamId, setRegisterTeamId] = useState(null);
    const [agentIdInput, setAgentIdInput] = useState('');
    const [memberNameInput, setMemberNameInput] = useState('');
    const [isCreateSquadOpen, setIsCreateSquadOpen] = useState(false);
    const [newSquadCode, setNewSquadCode] = useState('');
    const [newSquadName, setNewSquadName] = useState('');
    const [newSquadBadge, setNewSquadBadge] = useState('⚡');
    const [newSquadColor, setNewSquadColor] = useState('#00F0FF');

    // Elimination Cutoff Threshold States
    const [r1CutoffThreshold, setR1CutoffThreshold] = useState(200);
    const [r2CutoffThreshold, setR2CutoffThreshold] = useState(350);

    // Individual Team Custom Score Input Map (for judge evaluations like 230, 240, etc.)
    const [teamScoreInputs, setTeamScoreInputs] = useState({});

    const loadTeams = () => {
        fetchEventTeamsFromDb().then(data => {
            if (data && data.length > 0) setTeams(data);
        });
    };

    useEffect(() => {
        loadTeams();
        const unsubscribe = subscribeToEventState((newState) => {
            if (newState) {
                setEventState(newState);
                if (newState.round1Prompt) setR1Prompt(newState.round1Prompt);
                if (newState.round2Prompt) setR2Prompt(newState.round2Prompt);
                if (newState.round3Prompt) setR3Prompt(newState.round3Prompt);
                if (newState.breakTitle) setCustomBreakTitle(newState.breakTitle);
                if (newState.sponsorTimerTitle) setCustomSponsorTitle(newState.sponsorTimerTitle);
                if (newState.roundTimerVisible !== undefined) setRoundVisible(newState.roundTimerVisible);
                if (newState.sponsorTimerVisible !== undefined) setSponsorVisible(newState.sponsorTimerVisible);
                if (Array.isArray(newState.sponsorAds)) setAdSlots(newState.sponsorAds);
                if (newState.activeAdIndex !== undefined) setActiveAdIndex(newState.activeAdIndex);
                if (Array.isArray(newState.round3TeamIds)) setRound3TeamIds(newState.round3TeamIds);
            }
        });
        return () => unsubscribe();
    }, []);

    // Round countdown tick + periodic sync broadcast every 5s
    useEffect(() => {
        let interval = null;
        let syncTick = 0;
        if (roundRunning) {
            interval = setInterval(() => {
                setRoundSeconds(prev => {
                    if (prev <= 1) {
                        setRoundRunning(false);
                        broadcastPlaySound('buzzer');
                        broadcastTimerUpdate({ roundTimerRunning: false, roundTimerDurationSec: 0 });
                        return 0;
                    }
                    const next = prev - 1;
                    // Sync to all screens every 5 seconds so late-joiners/view-switchers stay in sync
                    syncTick++;
                    if (syncTick % 5 === 0) {
                        broadcastTimerUpdate({ roundTimerRunning: true, roundTimerDurationSec: next });
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [roundRunning]);

    // Mini Break timer tick + periodic sync broadcast every 5s
    useEffect(() => {
        let interval = null;
        let syncTick = 0;
        if (sponsorRunning) {
            interval = setInterval(() => {
                setSponsorSeconds(prev => {
                    if (prev <= 1) {
                        setSponsorRunning(false);
                        broadcastPlaySound('chime');
                        broadcastTimerUpdate({ sponsorTimerRunning: false, sponsorTimerDurationSec: 0 });
                        return 0;
                    }
                    const next = prev - 1;
                    syncTick++;
                    if (syncTick % 5 === 0) {
                        broadcastTimerUpdate({ sponsorTimerRunning: true, sponsorTimerDurationSec: next });
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [sponsorRunning]);

    // Break countdown tick
    useEffect(() => {
        let interval = null;
        if (breakRunning) {
            interval = setInterval(() => {
                setBreakSeconds(prev => {
                    if (prev <= 1) {
                        setBreakRunning(false);
                        broadcastPlaySound('chime');
                        broadcastTimerUpdate({ breakTimerRunning: false, breakDurationSec: 0 });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [breakRunning]);

    const updatePhase = async (newPhase, title) => {
        const updated = {
            ...eventState,
            phase: newPhase,
            phaseTitle: title
        };
        setEventState(updated);
        await broadcastEventState(updated);
        broadcastPlaySound('chime');
        setBroadcastSuccess(true);
        setTimeout(() => setBroadcastSuccess(false), 2000);
    };

    // 1. Round Timer Controls
    const handleToggleRoundTimer = async () => {
        const nextState = !roundRunning;
        setRoundRunning(nextState);
        await broadcastTimerUpdate({
            roundTimerRunning: nextState,
            roundTimerDurationSec: roundSeconds
        });
    };

    const handleApplyRoundDuration = async (minutes) => {
        const secs = minutes * 60;
        setCustomRoundMinutes(minutes);
        setRoundSeconds(secs);
        setRoundRunning(false);
        await broadcastTimerUpdate({
            roundTimerDurationSec: secs,
            roundTimerRunning: false
        });
        setAwardMessage(`Round timer set to ${minutes} mins.`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleAdjustRoundSeconds = async (deltaSec) => {
        const next = Math.max(0, roundSeconds + deltaSec);
        setRoundSeconds(next);
        await broadcastTimerUpdate({
            roundTimerDurationSec: next,
            roundTimerRunning: roundRunning
        });
    };

    const ROUND2_APPS = ['Instagram', 'Snapchat', 'Spotify', 'Netflix', 'LinkedIn', 'Zomato', 'Pinterest', 'Nykaa'];

    const handleAssignAppToTeam = async (teamId, appName) => {
        await updateTeamAssignedApp(teamId, appName);
        loadTeams();
        setAwardMessage(`Assigned ${appName || 'None'} to team.`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleToggleRoundVisibility = async () => {
        const next = !roundVisible;
        setRoundVisible(next);
        const updated = { ...eventState, roundTimerVisible: next };
        setEventState(updated);
        await broadcastEventState(updated);
        setAwardMessage(`Round Timer display on stage: ${next ? 'VISIBLE' : 'HIDDEN'}`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    // 2. Red Bull / Sponsor Break Timer Controls
    const handleToggleSponsorTimer = async () => {
        const nextState = !sponsorRunning;
        setSponsorRunning(nextState);
        await broadcastTimerUpdate({
            sponsorTimerRunning: nextState,
            sponsorTimerDurationSec: sponsorSeconds,
            sponsorTimerTitle: customSponsorTitle
        });
    };

    const handleApplySponsorDuration = async (minutes) => {
        const secs = minutes * 60;
        setCustomSponsorMinutes(minutes);
        setSponsorSeconds(secs);
        setSponsorRunning(false);
        await broadcastTimerUpdate({
            sponsorTimerDurationSec: secs,
            sponsorTimerRunning: false,
            sponsorTimerTitle: customSponsorTitle
        });
        setAwardMessage(`Sponsor break timer set to ${minutes} mins.`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleAdjustSponsorSeconds = async (deltaSec) => {
        const next = Math.max(0, sponsorSeconds + deltaSec);
        setSponsorSeconds(next);
        await broadcastTimerUpdate({
            sponsorTimerDurationSec: next,
            sponsorTimerRunning: sponsorRunning
        });
    };

    const handleToggleSponsorVisibility = async () => {
        const next = !sponsorVisible;
        setSponsorVisible(next);
        const updated = {
            ...eventState,
            sponsorTimerVisible: next,
            sponsorTimerTitle: customSponsorTitle,
            sponsorTimerDurationSec: sponsorSeconds,
            sponsorTimerRunning: sponsorRunning
        };
        setEventState(updated);
        await broadcastEventState(updated);
        setAwardMessage(`Mini Break timer on stage: ${next ? 'VISIBLE' : 'HIDDEN'}`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    // 3. Scene Break Trigger
    const handleStartBreak = async () => {
        const secs = customBreakMinutes * 60;
        const updated = {
            ...eventState,
            phase: EVENT_PHASES.PHASE_3_BREAK,
            phaseTitle: customBreakTitle,
            breakTitle: customBreakTitle,
            breakDurationSec: secs,
            breakTimerRunning: true
        };
        setBreakSeconds(secs);
        setBreakRunning(true);
        setEventState(updated);
        await broadcastEventState(updated);
        broadcastPlaySound('chime');
        setAwardMessage(`Break started: "${customBreakTitle}" for ${customBreakMinutes} mins`);
        setTimeout(() => setAwardMessage(null), 3000);
    };

    // 4. Sponsor Ads Management (3 Slots)
    const handleSelectActiveAd = async (idx) => {
        setActiveAdIndex(idx);
        const updated = {
            ...eventState,
            activeAdIndex: idx,
            sponsorAds: adSlots.map((s, i) => ({ ...s, active: i === idx }))
        };
        setEventState(updated);
        await broadcastEventState(updated);
        setAwardMessage(`Active Stage Ad switched to: "${adSlots[idx]?.title || `Slot ${idx + 1}`}"`);
        setTimeout(() => setAwardMessage(null), 2500);
    };

    const handleUpdateAdSlot = (idx, field, value) => {
        const updated = [...adSlots];
        updated[idx] = { ...updated[idx], [field]: value };
        setAdSlots(updated);
    };

    const handleSaveAllAds = async () => {
        const updated = {
            ...eventState,
            sponsorAds: adSlots,
            activeAdIndex: activeAdIndex
        };
        setEventState(updated);
        await broadcastEventState(updated);
        setAwardMessage('All 3 Sponsor Ad slots saved & broadcast to stage!');
        setTimeout(() => setAwardMessage(null), 2500);
    };

    const handleToggleAds = async () => {
        const nextVal = !eventState.adEnabled;
        const updated = { ...eventState, adEnabled: nextVal };
        setEventState(updated);
        await broadcastEventState(updated);
        setAwardMessage(`Sponsor ads on stage: ${nextVal ? 'ENABLED' : 'MUTED'}`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleToggleRedemptionLeaderboard = async () => {
        const nextVal = !eventState.redemptionLeaderboardVisible;
        const updated = { ...eventState, redemptionLeaderboardVisible: nextVal };
        setEventState(updated);
        await broadcastEventState(updated);
        setAwardMessage(`Redemption track on stage leaderboard: ${nextVal ? 'SHOWN' : 'HIDDEN'}`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleSavePrompts = async () => {
        const updated = {
            ...eventState,
            round1Prompt: r1Prompt,
            round2Prompt: r2Prompt,
            round3Prompt: r3Prompt
        };
        setEventState(updated);
        await broadcastEventState(updated);
        setEditingPromptRound(null);
        setAwardMessage('Challenge prompts updated live!');
        setTimeout(() => setAwardMessage(null), 2500);
    };

    // ── TEAM-WISE EVALUATION SCORE HANDLERS ────────────────────────────────
    const handleSetCustomScoreInput = (teamId, val) => {
        setTeamScoreInputs(prev => ({ ...prev, [teamId]: val }));
    };

    const handleAwardCustomPoints = async (teamId, defaultFallback = 100) => {
        const raw = teamScoreInputs[teamId];
        const amt = raw !== undefined && raw !== '' ? Number(raw) : Number(defaultFallback);
        if (isNaN(amt) || amt === 0) return;

        const res = await awardTeamSCoins(teamId, amt);
        if (!res.error) {
            setTeams(prev => prev.map(t => t.id === teamId ? { ...t, s_coins: (t.s_coins || 0) + amt } : t));
            setTeamScoreInputs(prev => ({ ...prev, [teamId]: '' }));
            playEventSound('thock');
            setAwardMessage(`+${amt} S-Coins awarded to team!`);
            setTimeout(() => setAwardMessage(null), 2000);
        }
    };

    // ── CUTOFF THRESHOLD ELIMINATION HANDLERS ──────────────────────────────
    const handleApplyRound1Cutoff = async () => {
        const threshold = Number(r1CutoffThreshold) || 200;
        const toTrackA = [];
        const toTrackB = [];

        for (const team of round1Pool) {
            const score = team.s_coins || 0;
            if (score >= threshold) {
                toTrackA.push(team.id);
            } else {
                toTrackB.push(team.id);
            }
        }

        // Update Track A qualifiers
        if (toTrackA.length > 0) {
            await supabase
                .from('event_teams')
                .update({ is_qualified: true, is_eliminated: false, updated_at: new Date().toISOString() })
                .in('id', toTrackA);
        }

        // Update Track B redemption
        if (toTrackB.length > 0) {
            await supabase
                .from('event_teams')
                .update({ is_eliminated: true, is_qualified: false, updated_at: new Date().toISOString() })
                .in('id', toTrackB);
        }

        loadTeams();
        playEventSound('fanfare');
        setAwardMessage(`Cutoff Applied (≥${threshold} S): ${toTrackA.length} to Track A, ${toTrackB.length} to Track B.`);
        setTimeout(() => setAwardMessage(null), 3500);
    };

    const handleApplyRound2Cutoff = async () => {
        const threshold = Number(r2CutoffThreshold) || 350;
        const eliminatedIds = [];

        for (const team of round2TrackA) {
            const score = team.s_coins || 0;
            if (score < threshold) {
                eliminatedIds.push(team.id);
            }
        }

        if (eliminatedIds.length > 0) {
            await supabase
                .from('event_teams')
                .update({ is_eliminated: true, is_qualified: false, updated_at: new Date().toISOString() })
                .in('id', eliminatedIds);
        }

        loadTeams();
        setAwardMessage(`Eliminated ${eliminatedIds.length} teams scoring below ${threshold} S-Coins.`);
        setTimeout(() => setAwardMessage(null), 3000);
    };

    // Team Governance Handlers
    const handlePromoteToRound3 = async (teamId) => {
        const updatedIds = Array.from(new Set([...round3TeamIds, teamId]));
        setRound3TeamIds(updatedIds);
        const updatedState = { ...eventState, round3TeamIds: updatedIds };
        setEventState(updatedState);
        await broadcastEventState(updatedState);

        await supabase
            .from('event_teams')
            .update({ is_qualified: true, is_eliminated: false, updated_at: new Date().toISOString() })
            .eq('id', teamId);

        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_qualified: true, is_eliminated: false } : t));
        broadcastPlaySound('fanfare');
        setAwardMessage(`Team promoted to Round 3 Grand Final!`);
        setTimeout(() => setAwardMessage(null), 2500);
    };

    const handleDemoteFromRound3 = async (teamId) => {
        const updatedIds = round3TeamIds.filter(id => id !== teamId);
        setRound3TeamIds(updatedIds);
        const updatedState = { ...eventState, round3TeamIds: updatedIds };
        setEventState(updatedState);
        await broadcastEventState(updatedState);
        setAwardMessage(`Team removed from Round 3.`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleEliminateTeam = async (teamId) => {
        const updatedIds = round3TeamIds.filter(id => id !== teamId);
        setRound3TeamIds(updatedIds);
        const updatedState = { ...eventState, round3TeamIds: updatedIds };
        setEventState(updatedState);
        await broadcastEventState(updatedState);

        await supabase
            .from('event_teams')
            .update({ is_eliminated: true, is_qualified: false, updated_at: new Date().toISOString() })
            .eq('id', teamId);

        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_eliminated: true, is_qualified: false } : t));
        setAwardMessage(`Team disqualified.`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleQualifyToTrackA = async (teamId) => {
        await supabase
            .from('event_teams')
            .update({ is_qualified: true, is_eliminated: false, updated_at: new Date().toISOString() })
            .eq('id', teamId);

        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_qualified: true, is_eliminated: false } : t));
        setAwardMessage(`Team assigned to Track A (Qualifiers).`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleRouteToTrackB = async (teamId) => {
        await supabase
            .from('event_teams')
            .update({ is_eliminated: true, is_qualified: false, updated_at: new Date().toISOString() })
            .eq('id', teamId);

        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_eliminated: true, is_qualified: false } : t));
        setAwardMessage(`Team routed to Track B (Redemption).`);
        setTimeout(() => setAwardMessage(null), 2000);
    };

    const handleRegisterMember = async (e) => {
        e.preventDefault();
        if (!registerTeamId || !agentIdInput.trim()) return;

        const res = await assignMultipleMembersToTeam(registerTeamId, agentIdInput.trim());
        if (!res.error) {
            loadTeams();
            setAwardMessage(`Added ${res.count || 1} member(s) to team!`);
            setAgentIdInput('');
            setMemberNameInput('');
            setRegisterTeamId(null);
            setTimeout(() => setAwardMessage(null), 3000);
        }
    };

    const handleCreateSquad = async (e) => {
        e.preventDefault();
        if (!newSquadCode.trim() || !newSquadName.trim()) return;

        const res = await createEventTeamInDb({
            code: newSquadCode.trim(),
            name: newSquadName.trim(),
            badge: newSquadBadge.trim() || '⚡',
            color: newSquadColor
        });

        if (!res.error) {
            loadTeams();
            setIsCreateSquadOpen(false);
            setNewSquadCode('');
            setNewSquadName('');
            setAwardMessage(`Team ${newSquadName} created & active!`);
            setTimeout(() => setAwardMessage(null), 3000);
        }
    };

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Category Pools
    const activeTeams = teams.filter(t => t.is_active || (Array.isArray(t.members) && t.members.length > 0));
    const round3Finalists = activeTeams.filter(t => round3TeamIds.includes(t.id));
    const round2TrackA = activeTeams.filter(t => t.is_qualified && !t.is_eliminated && !round3TeamIds.includes(t.id));
    const round2TrackB = activeTeams.filter(t => t.is_eliminated && !round3TeamIds.includes(t.id));
    const round1Pool = activeTeams.length > 0 ? activeTeams : teams;

    // Threshold Preview Counts
    const r1AboveCutoff = round1Pool.filter(t => (t.s_coins || 0) >= (Number(r1CutoffThreshold) || 200)).length;
    const r1BelowCutoff = round1Pool.length - r1AboveCutoff;

    const r2AboveCutoff = round2TrackA.filter(t => (t.s_coins || 0) >= (Number(r2CutoffThreshold) || 350)).length;
    const r2BelowCutoff = round2TrackA.length - r2AboveCutoff;

    // Permissions: Leads and Volunteers have access
    const hasAccess = isAuthenticated && (isLead || isVolunteer);

    if (!hasAccess) {
        return (
            <div className="min-h-screen px-4 py-24 flex items-center justify-center text-center bg-[#07070E] text-white">
                <div className="p-8 rounded-xl bg-zinc-950 border border-red-500/30 max-w-md">
                    <Shield size={36} className="text-red-400 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-white mb-2 font-mono">
                        Restricted Event Mission Control
                    </h2>
                    <p className="text-xs font-mono text-zinc-400">
                        Only authenticated club leads, administrators, and volunteers may govern the live Neural Nexus event modules.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07070E] text-zinc-200 px-3 sm:px-6 py-6 max-w-7xl mx-auto select-none space-y-5 font-mono">
            {/* ── TOP HEADER & METRICS BAR ────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/80 border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
                        <Radio size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Event Mission Control
                        </h1>
                        <p className="text-xs text-purple-300">
                            Neural Nexus 2026 • Live Orchestrator {isVolunteer && !isLead ? '(Volunteer)' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-zinc-400">TEAMS: </span>
                        <strong className="text-white">{teams.length}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
                        <span>ACTIVE: </span>
                        <strong>{activeTeams.length}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                        <span>TRACK A: </span>
                        <strong>{round2TrackA.length}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-pink-950/40 border border-pink-500/40 text-pink-300">
                        <span>TRACK B: </span>
                        <strong>{round2TrackB.length}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-yellow-950/40 border border-yellow-500/40 text-yellow-300">
                        <span>ROUND 3: </span>
                        <strong>{round3Finalists.length}/10</strong>
                    </div>
                    <button
                        onClick={async () => {
                            if (window.confirm('Reset all 40 teams to 0 S-Coins and clean state in database?')) {
                                await resetAllTeamsInDb();
                                loadTeams();
                                setAwardMessage('All 40 teams reset to 0 S-Coins in Supabase DB.');
                                setTimeout(() => setAwardMessage(null), 2500);
                            }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                        title="Reset all team points to 0"
                    >
                        <RotateCcw size={12} /> Reset Points (0 S)
                    </button>
                    <a
                        href="/volunteer"
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1 cursor-pointer"
                    >
                        <Users size={12} /> Volunteer Panel
                    </a>
                </div>
            </div>

            {/* Notification Banner */}
            {awardMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" /> {awardMessage}
                </div>
            )}

            {/* ── 1. LIVE EVENT SCENE TRANSITIONS & BREAK SCENE BOX ───────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 p-4 rounded-xl bg-zinc-950/60 border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={14} /> 1. Live Event Scene Transitions
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                            { key: EVENT_PHASES.PHASE_0_CHECKIN, label: 'Phase 0: Check-In', sub: 'Attendee Pass' },
                            { key: EVENT_PHASES.PHASE_0_5_AUDIENCE_TAP, label: 'Phase 0.5: Audience Tap', sub: 'Arc Reactor Sync' },
                            { key: EVENT_PHASES.PHASE_1_TEAMS, label: 'Phase 1: Team Allocation', sub: 'Team Pass' },
                            { key: EVENT_PHASES.PHASE_2_ROUND_1, label: 'Round 1: Problem Discovery', sub: 'AI Pitch (40 Teams)' },
                            { key: EVENT_PHASES.PHASE_4_ROUND_2, label: 'Round 2: Product Innovation', sub: 'App Reimagination (16 Teams)' },
                            { key: EVENT_PHASES.PHASE_5_ROUND_3, label: 'Round 3: Smart City Design', sub: 'Final Showdown (10 Teams)' },
                        ].map(p => {
                            const isActive = eventState.phase === p.key;
                            return (
                                <button
                                    key={p.key}
                                    onClick={() => updatePhase(p.key, p.label)}
                                    className={`p-2.5 rounded-lg text-left transition-all cursor-pointer flex flex-col justify-between ${
                                        isActive
                                            ? 'bg-purple-950/60 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                            : 'bg-black/40 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    <div>
                                        <div className="text-xs font-bold text-white">{p.label}</div>
                                        <div className="text-[10px] text-zinc-400 mt-0.5">{p.sub}</div>
                                    </div>
                                    {isActive && (
                                        <div className="mt-1.5 flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE ON AIR
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Customizable Scene Break Box */}
                <div className="lg:col-span-4 p-4 rounded-xl bg-red-950/15 border border-red-500/30 space-y-2.5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Coffee size={13} className="text-red-400" /> Break / Intermission Scene
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                eventState.phase === EVENT_PHASES.PHASE_3_BREAK ? 'bg-red-500/30 text-red-200 animate-pulse' : 'bg-white/5 text-zinc-400'
                            }`}>
                                {eventState.phase === EVENT_PHASES.PHASE_3_BREAK ? 'ON AIR' : 'IDLE'}
                            </span>
                        </div>

                        <input
                            type="text"
                            value={customBreakTitle}
                            onChange={e => setCustomBreakTitle(e.target.value)}
                            placeholder="Break Heading"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white outline-none focus:border-red-400"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-zinc-300">
                            <span>Duration:</span>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={customBreakMinutes}
                                onChange={e => setCustomBreakMinutes(Number(e.target.value))}
                                className="w-8 bg-transparent text-white font-bold text-center outline-none"
                            />
                            <span>m</span>
                        </div>

                        <button
                            onClick={handleStartBreak}
                            className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            <Play size={12} /> Start Break Scene
                        </button>
                    </div>
                </div>
            </div>

            {/* ── 2. STAGE TIMERS & AUDIO SFX CONTROL ─────────────────────────── */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} /> 2. Stage Timers & Audio SFX Control (Live Synced to Projector)
                    </div>

                    {/* SFX Bar with Reactor Sound Effect Button */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-400 mr-1">SFX:</span>
                        <button
                            onClick={() => { playEventSound('buzzer'); broadcastPlaySound('buzzer'); }}
                            className="px-2.5 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold cursor-pointer border border-red-500/40"
                        >
                            🚨 Buzzer
                        </button>
                        <button
                            onClick={() => { playEventSound('fanfare'); broadcastPlaySound('fanfare'); }}
                            className="px-2.5 py-1 rounded-md bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-[10px] font-bold cursor-pointer border border-yellow-500/40"
                        >
                            🏆 Fanfare
                        </button>
                        <button
                            onClick={() => { playEventSound('reactor'); broadcastPlaySound('reactor'); }}
                            className="px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold cursor-pointer border border-cyan-400/40 flex items-center gap-1 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                        >
                            ⚡ Reactor SFX
                        </button>
                        <button
                            onClick={() => { playEventSound('thock'); broadcastPlaySound('thock'); }}
                            className="px-2.5 py-1 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold cursor-pointer border border-purple-400/40"
                        >
                            🎹 Thock
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* A. ROUND COUNTDOWN TIMER */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] text-cyan-400 font-bold uppercase">Round Countdown</div>
                                <div className="text-2xl sm:text-3xl font-black text-white tracking-widest">{formatTimer(roundSeconds)}</div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleToggleRoundTimer}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer ${
                                        roundRunning ? 'bg-amber-500 text-black' : 'bg-cyan-500 text-black'
                                    }`}
                                >
                                    {roundRunning ? 'Pause' : 'Start'}
                                </button>
                                <button
                                    onClick={() => handleAdjustRoundSeconds(300)}
                                    className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 cursor-pointer"
                                >
                                    +5m
                                </button>
                                <button
                                    onClick={() => handleAdjustRoundSeconds(-60)}
                                    className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 cursor-pointer"
                                >
                                    -1m
                                </button>
                                <button
                                    onClick={() => handleApplyRoundDuration(customRoundMinutes)}
                                    className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-400 cursor-pointer"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-zinc-400 text-[11px]">Set:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="180"
                                    value={customRoundMinutes}
                                    onChange={e => setCustomRoundMinutes(Number(e.target.value))}
                                    className="w-12 px-1.5 py-0.5 rounded bg-black border border-white/20 text-white font-bold text-center"
                                />
                                <span className="text-zinc-400 text-[11px]">m</span>
                                <button
                                    onClick={() => handleApplyRoundDuration(customRoundMinutes)}
                                    className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold cursor-pointer"
                                >
                                    Apply
                                </button>
                            </div>

                            <button
                                onClick={handleToggleRoundVisibility}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                                    roundVisible ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                }`}
                            >
                                Stage: {roundVisible ? 'VISIBLE' : 'HIDDEN'}
                            </button>
                        </div>
                    </div>

                    {/* B. RED BULL / MONSTER SPONSOR TIMER */}
                    <div className="p-3.5 rounded-xl bg-red-950/15 border border-red-500/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <input
                                    type="text"
                                    value={customSponsorTitle}
                                    onChange={e => setCustomSponsorTitle(e.target.value)}
                                    placeholder="Label (e.g. MINI_BREAK)"
                                    className="text-[10px] text-red-300 font-bold uppercase bg-transparent outline-none border-b border-red-500/30 pb-0.5 mb-1 w-36"
                                />
                                <div className="text-2xl sm:text-3xl font-black text-yellow-300 tracking-widest">{formatTimer(sponsorSeconds)}</div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleToggleSponsorTimer}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer ${
                                        sponsorRunning ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'
                                    }`}
                                >
                                    {sponsorRunning ? 'Pause' : 'Start'}
                                </button>
                                <button
                                    onClick={() => handleAdjustSponsorSeconds(300)}
                                    className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 cursor-pointer"
                                >
                                    +5m
                                </button>
                                <button
                                    onClick={() => handleAdjustSponsorSeconds(-60)}
                                    className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 cursor-pointer"
                                >
                                    -1m
                                </button>
                                <button
                                    onClick={() => handleApplySponsorDuration(customSponsorMinutes)}
                                    className="px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-400 cursor-pointer"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-zinc-400 text-[11px]">Set:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={customSponsorMinutes}
                                    onChange={e => setCustomSponsorMinutes(Number(e.target.value))}
                                    className="w-12 px-1.5 py-0.5 rounded bg-black border border-white/20 text-white font-bold text-center"
                                />
                                <span className="text-zinc-400 text-[11px]">m</span>
                                <button
                                    onClick={() => handleApplySponsorDuration(customSponsorMinutes)}
                                    className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[10px] font-bold cursor-pointer"
                                >
                                    Apply
                                </button>
                            </div>

                            <button
                                onClick={handleToggleSponsorVisibility}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                                    sponsorVisible ? 'bg-red-500/30 text-red-200 border-red-500/50' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                }`}
                            >
                                Stage: {sponsorVisible ? 'DISPLAY (ON)' : 'HIDDEN (OFF)'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 3. PRESENTATION & STAGE CONTROLS (3 AD SLOTS) ────────────────── */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-indigo-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Monitor size={14} className="text-indigo-400" /> 3. Presentation & Stage Screen Controls
                    </div>
                    <a
                        href="/presentation"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-400/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                        <ExternalLink size={11} /> Open Stage Screen
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                    {/* Sponsor Ads Overlay: 3 Distinct Rows */}
                    <div className="lg:col-span-8 p-3 rounded-lg bg-black/40 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Video size={13} className="text-red-400" /> Sponsor Ads (3 Configurable Video Slots)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleToggleAds}
                                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                        eventState.adEnabled ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : 'bg-zinc-800 text-zinc-400'
                                    }`}
                                >
                                    {eventState.adEnabled ? 'ADS ACTIVE (ON)' : 'ADS MUTED (OFF)'}
                                </button>
                                <button
                                    onClick={handleSaveAllAds}
                                    className="px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold cursor-pointer"
                                >
                                    Save Slots
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            {adSlots.map((slot, idx) => {
                                const isCurrentActive = activeAdIndex === idx;
                                return (
                                    <div
                                        key={slot.id || idx}
                                        className={`p-2 rounded-md border flex items-center gap-2 ${
                                            isCurrentActive
                                                ? 'bg-purple-950/40 border-purple-500/50'
                                                : 'bg-black/30 border-white/5'
                                        }`}
                                    >
                                        <input
                                            type="text"
                                            value={slot.title}
                                            onChange={e => handleUpdateAdSlot(idx, 'title', e.target.value)}
                                            className="w-24 px-1.5 py-0.5 rounded bg-black border border-white/10 text-[10px] text-white font-bold"
                                            placeholder={`Slot ${idx + 1}`}
                                        />

                                        <input
                                            type="text"
                                            value={slot.url}
                                            onChange={e => handleUpdateAdSlot(idx, 'url', e.target.value)}
                                            placeholder="Video / Banner Media URL (.mp4, .webp, https://...)"
                                            className="flex-1 px-2 py-0.5 rounded bg-black border border-white/10 text-[10px] text-zinc-300"
                                        />

                                        <button
                                            onClick={() => handleSelectActiveAd(idx)}
                                            className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer flex items-center gap-1 ${
                                                isCurrentActive
                                                    ? 'bg-emerald-500 text-black font-black'
                                                    : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                                            }`}
                                        >
                                            {isCurrentActive ? <Check size={10} /> : null}
                                            <span>{isCurrentActive ? 'Active' : 'Select'}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Redemption Toggle & Dignitaries */}
                    <div className="lg:col-span-4 space-y-2.5">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold text-pink-300 flex items-center gap-1">
                                    <Flame size={12} className="text-pink-400" /> Redemption Standings
                                </div>
                                <div className="text-[10px] text-zinc-400">Toggle Stage Quiz scores</div>
                            </div>
                            <button
                                onClick={handleToggleRedemptionLeaderboard}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                    eventState.redemptionLeaderboardVisible ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50' : 'bg-zinc-800 text-zinc-400'
                                }`}
                            >
                                {eventState.redemptionLeaderboardVisible ? 'VISIBLE' : 'HIDDEN'}
                            </button>
                        </div>

                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 space-y-1.5">
                            <span className="text-[11px] font-bold text-yellow-300 flex items-center gap-1">
                                <Sparkles size={11} /> Inauguration Portals
                            </span>
                            <div className="grid grid-cols-2 gap-1">
                                {[
                                    { name: 'Reactor', path: '/inauguration' },
                                    { name: 'Dean Key', path: '/inauguration/dean' },
                                    { name: 'HOD Key', path: '/inauguration/hod' },
                                    { name: 'Pro-VC Key', path: '/inauguration/provc' },
                                    { name: 'President', path: '/inauguration/president' },
                                    { name: 'Audience', path: '/audience' },
                                ].map(l => (
                                    <a
                                        key={l.path}
                                        href={l.path}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] text-zinc-300 flex items-center justify-between"
                                    >
                                        <span>{l.name}</span>
                                        <ExternalLink size={7} className="text-zinc-500" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 4. CUTOFF THRESHOLD & EVALUATION RULES PANEL ─────────────────── */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-yellow-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Filter size={14} /> 4. Evaluation Thresholds & Track Cutoff Automator
                    </div>
                    <span className="text-[10px] text-zinc-400">Judges provide team scores · Cutoffs route tracks</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Round 1 Cutoff Automator */}
                    <div className="p-3.5 rounded-lg bg-black/40 border border-cyan-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-300">Round 1 Cutoff Threshold</span>
                            <span className="text-[10px] text-zinc-400">Max Round 1: 300 S</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">Cutoff:</span>
                            <input
                                type="number"
                                min="0"
                                max="400"
                                value={r1CutoffThreshold}
                                onChange={e => setR1CutoffThreshold(Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded bg-black border border-white/20 text-xs text-white font-bold text-center"
                            />
                            <span className="text-xs text-zinc-400">S-Coins</span>
                            <button
                                onClick={handleApplyRound1Cutoff}
                                className="ml-auto px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                            >
                                Apply Cutoff Filter
                            </button>
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-emerald-300 font-bold">≥ {r1CutoffThreshold} S: {r1AboveCutoff} teams (Track A)</span>
                            <span className="text-pink-300 font-bold">&lt; {r1CutoffThreshold} S: {r1BelowCutoff} teams (Track B)</span>
                        </div>
                    </div>

                    {/* Round 2 Cutoff Automator */}
                    <div className="p-3.5 rounded-lg bg-black/40 border border-purple-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-300">Round 2 Elimination Cutoff</span>
                            <span className="text-[10px] text-zinc-400">Max A: 500 / B: 600 S</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">Cutoff:</span>
                            <input
                                type="number"
                                min="0"
                                max="1000"
                                value={r2CutoffThreshold}
                                onChange={e => setR2CutoffThreshold(Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded bg-black border border-white/20 text-xs text-white font-bold text-center"
                            />
                            <span className="text-xs text-zinc-400">S-Coins</span>
                            <button
                                onClick={handleApplyRound2Cutoff}
                                className="ml-auto px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                            >
                                Eliminate Below Cutoff
                            </button>
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-emerald-300 font-bold">≥ {r2CutoffThreshold} S: {r2AboveCutoff} qualified</span>
                            <span className="text-red-400 font-bold">&lt; {r2CutoffThreshold} S: {r2BelowCutoff} eliminated</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 5. TEAM ROSTERS & TEAM-WISE SCORE EVALUATION ─────────────────── */}
            <div className="space-y-4">
                {/* Search & Team Creation Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Users size={15} className="text-purple-400" /> 5. Competition Teams & Judge Score Evaluation
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsCreateSquadOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={13} /> + Add Team
                        </button>

                        <div className="relative w-56">
                            <Search size={12} className="absolute left-2.5 top-2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Filter teams..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-7 pr-2 py-1 rounded-lg bg-black border border-white/10 text-xs text-white outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>
                </div>

                {/* ── ROUND 1: TEAM-WISE SCORE EVALUATION ─────────────────────── */}
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                            <Award size={13} /> ROUND 1: REVERSE HACKATHON EVALUATION ({round1Pool.length} Teams)
                        </div>
                        <button
                            onClick={() => setEditingPromptRound(editingPromptRound === 'r1' ? null : 'r1')}
                            className="px-2.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] cursor-pointer"
                        >
                            {editingPromptRound === 'r1' ? 'Close Prompt' : 'Edit Prompt'}
                        </button>
                    </div>

                    {editingPromptRound === 'r1' && (
                        <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-400/30 space-y-2">
                            <input
                                type="text"
                                value={r1Prompt?.title || ''}
                                onChange={e => setR1Prompt({ ...r1Prompt, title: e.target.value })}
                                className="w-full px-2 py-1 rounded bg-black border border-white/10 text-xs text-white"
                            />
                            <textarea
                                rows={2}
                                value={r1Prompt?.description || ''}
                                onChange={e => setR1Prompt({ ...r1Prompt, description: e.target.value })}
                                className="w-full px-2 py-1 rounded bg-black border border-white/10 text-xs text-white"
                            />
                            <button
                                onClick={handleSavePrompts}
                                className="px-2.5 py-1 rounded bg-cyan-500 text-black text-xs font-bold cursor-pointer"
                            >
                                Save Prompt
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                        {round1Pool
                            .filter(t => t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || t.code?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(team => (
                                <div key={team.id} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">#{getTeamNumberBadge(team)}</span>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-white truncate">{team.name}</div>
                                                <div className="text-[10px] text-zinc-400">{team.code}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <select
                                                value={(team.motto || '').replace('Domain: ', '').replace('App: ', '')}
                                                onChange={e => handleAssignAppToTeam(team.id, e.target.value ? `Domain: ${e.target.value}` : '')}
                                                className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold outline-none cursor-pointer"
                                            >
                                                <option value="">Domain...</option>
                                                {['Healthcare', 'Transport', 'Agriculture', 'Education', 'Cybersecurity', 'Waste Management', 'Tourism', 'Public Safety'].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            <div className="text-xs font-bold text-yellow-300">
                                                {team.s_coins || 0} S
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team-wise Judge Score Input & Quick Awards */}
                                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                                        <input
                                            type="number"
                                            placeholder="Score (e.g. 240)"
                                            value={teamScoreInputs[team.id] ?? ''}
                                            onChange={e => handleSetCustomScoreInput(team.id, e.target.value)}
                                            className="w-24 px-1.5 py-0.5 rounded bg-black border border-white/20 text-xs text-white font-bold"
                                        />
                                        <button
                                            onClick={() => handleAwardCustomPoints(team.id, 100)}
                                            className="px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-bold cursor-pointer"
                                            title="Award Score"
                                        >
                                            +Award
                                        </button>
                                        <button
                                            onClick={() => handleQualifyToTrackA(team.id)}
                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                                                team.is_qualified && !team.is_eliminated ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : 'bg-white/5 text-zinc-400'
                                            }`}
                                        >
                                            Trk A
                                        </button>
                                        <button
                                            onClick={() => handleRouteToTrackB(team.id)}
                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                                                team.is_eliminated ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50' : 'bg-white/5 text-zinc-400'
                                            }`}
                                        >
                                            Trk B
                                        </button>
                                        <button
                                            onClick={() => setRegisterTeamId(team.id)}
                                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 cursor-pointer ml-auto"
                                            title="Add Members"
                                        >
                                            <UserPlus size={11} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* ── ROUND 2 DUAL TRACKS ────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                    {/* Track A: Qualifiers */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                            <span className="text-xs font-bold text-emerald-300">TRACK A: QUALIFIERS ({round2TrackA.length} Teams)</span>
                            <span className="text-[10px] text-zinc-400">Max: 500 S</span>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                            {round2TrackA.map(team => (
                                <div key={team.id} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">#{getTeamNumberBadge(team)}</span>
                                            <div className="text-xs font-bold text-white truncate">{team.name}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={(team.motto || '').replace('App: ', '')}
                                                onChange={e => handleAssignAppToTeam(team.id, e.target.value)}
                                                className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-bold outline-none cursor-pointer"
                                            >
                                                <option value="">Assign App...</option>
                                                {ROUND2_APPS.map(app => (
                                                    <option key={app} value={app}>{app}</option>
                                                ))}
                                            </select>
                                            <span className="text-xs font-bold text-yellow-300">{team.s_coins || 0} S</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 pt-1 border-t border-white/10">
                                        <input
                                            type="number"
                                            placeholder="Score (e.g. 450)"
                                            value={teamScoreInputs[team.id] ?? ''}
                                            onChange={e => handleSetCustomScoreInput(team.id, e.target.value)}
                                            className="w-24 px-1.5 py-0.5 rounded bg-black border border-white/20 text-xs text-white font-bold"
                                        />
                                        <button
                                            onClick={() => handleAwardCustomPoints(team.id, 450)}
                                            className="px-2 py-0.5 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-[10px] font-bold cursor-pointer"
                                        >
                                            +Award
                                        </button>
                                        <button
                                            onClick={() => handlePromoteToRound3(team.id)}
                                            className="px-2 py-0.5 rounded bg-yellow-500 text-black text-[10px] font-bold cursor-pointer"
                                        >
                                            To R3
                                        </button>
                                        <button
                                            onClick={() => handleEliminateTeam(team.id)}
                                            className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 cursor-pointer ml-auto"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Track B: Redemption */}
                    <div className="p-3.5 rounded-xl bg-pink-950/15 border border-pink-500/30 space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                            <span className="text-xs font-bold text-pink-300">TRACK B: REDEMPTION ({round2TrackB.length} Teams)</span>
                            <span className="text-[10px] text-zinc-400">Max: 600 S</span>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                            {round2TrackB.map(team => (
                                <div key={team.id} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">#{getTeamNumberBadge(team)}</span>
                                            <div className="text-xs font-bold text-white truncate">{team.name}</div>
                                        </div>
                                        <span className="text-xs font-bold text-pink-300">{team.quiz_score || 0} Quiz pts</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 pt-1 border-t border-white/10">
                                        <input
                                            type="number"
                                            placeholder="Score (e.g. 500)"
                                            value={teamScoreInputs[team.id] ?? ''}
                                            onChange={e => handleSetCustomScoreInput(team.id, e.target.value)}
                                            className="w-24 px-1.5 py-0.5 rounded bg-black border border-white/20 text-xs text-white font-bold"
                                        />
                                        <button
                                            onClick={() => handleAwardCustomPoints(team.id, 500)}
                                            className="px-2 py-0.5 rounded bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-[10px] font-bold cursor-pointer"
                                        >
                                            +Award
                                        </button>
                                        <button
                                            onClick={() => handlePromoteToRound3(team.id)}
                                            className="px-2 py-0.5 rounded bg-yellow-500 text-black text-[10px] font-bold cursor-pointer"
                                        >
                                            To R3
                                        </button>
                                        <button
                                            onClick={() => handleEliminateTeam(team.id)}
                                            className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 cursor-pointer ml-auto"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── ROUND 3 GRAND FINAL SHOWDOWN (TEAM-WISE PRIZE ALLOCATION) ──── */}
                <div className="p-3.5 rounded-xl bg-yellow-950/15 border border-yellow-500/40 space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                        <div className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                            <Trophy size={13} className="text-yellow-400" /> ROUND 3: GRAND FINAL SHOWDOWN ({round3Finalists.length}/10 Finalists)
                        </div>
                        <span className="text-[10px] text-zinc-400">Award prize S-Coins during live jury evaluation</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                        {round3Finalists.map((team, idx) => (
                            <div key={team.id} className="p-2.5 rounded-lg bg-black/60 border border-yellow-500/40 flex flex-col justify-between gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">#{getTeamNumberBadge(team)}</span>
                                        <div className="text-xs font-bold text-white truncate">{team.name}</div>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-400">{team.s_coins || 0} S</span>
                                </div>

                                {/* Placement Quick-Prize Buttons */}
                                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/10">
                                    <button
                                        onClick={() => handleAwardPoints(team.id, 1500)}
                                        className="px-1 py-0.5 rounded bg-yellow-500 text-black text-[9px] font-bold cursor-pointer text-center"
                                        title="1st Place Prize (+1500 S)"
                                    >
                                        1st (1.5k)
                                    </button>
                                    <button
                                        onClick={() => handleAwardPoints(team.id, 1000)}
                                        className="px-1 py-0.5 rounded bg-zinc-300 text-black text-[9px] font-bold cursor-pointer text-center"
                                        title="2nd Place Prize (+1000 S)"
                                    >
                                        2nd (1k)
                                    </button>
                                    <button
                                        onClick={() => handleAwardPoints(team.id, 750)}
                                        className="px-1 py-0.5 rounded bg-amber-700 text-white text-[9px] font-bold cursor-pointer text-center"
                                        title="3rd Place Prize (+750 S)"
                                    >
                                        3rd (750)
                                    </button>
                                </div>

                                {/* Custom Score Input for Jury */}
                                <div className="flex items-center gap-1 pt-1">
                                    <input
                                        type="number"
                                        placeholder="Prize S"
                                        value={teamScoreInputs[team.id] ?? ''}
                                        onChange={e => handleSetCustomScoreInput(team.id, e.target.value)}
                                        className="w-16 px-1 py-0.5 rounded bg-black border border-white/20 text-[10px] text-white font-bold"
                                    />
                                    <button
                                        onClick={() => handleAwardCustomPoints(team.id, 500)}
                                        className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-[9px] font-bold cursor-pointer"
                                    >
                                        +Award
                                    </button>
                                    <button
                                        onClick={() => handleDemoteFromRound3(team.id)}
                                        className="px-1 py-0.5 rounded bg-red-500/20 text-red-300 text-[9px] cursor-pointer ml-auto"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CREATE TEAM MODAL ───────────────────────────────────────────── */}
            <AnimatePresence>
                {isCreateSquadOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md p-6 rounded-xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-4 text-left"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                    Register New Event Team
                                </h3>
                                <button onClick={() => setIsCreateSquadOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSquad} className="space-y-3">
                                <div>
                                    <label className="block text-[10px] text-zinc-400 uppercase mb-1">Team Code *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. SYN-T41"
                                        value={newSquadCode}
                                        onChange={e => setNewSquadCode(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white focus:border-cyan-400 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] text-zinc-400 uppercase mb-1">Team Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Cyber Dragons"
                                        value={newSquadName}
                                        onChange={e => setNewSquadName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white focus:border-cyan-400 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Badge Emoji</label>
                                        <input
                                            type="text"
                                            value={newSquadBadge}
                                            onChange={e => setNewSquadBadge(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white text-center focus:border-cyan-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-zinc-400 uppercase mb-1">Color Theme</label>
                                        <input
                                            type="color"
                                            value={newSquadColor}
                                            onChange={e => setNewSquadColor(e.target.value)}
                                            className="w-full h-9 rounded-lg bg-black border border-white/20 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateSquadOpen(false)}
                                        className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                                    >
                                        Create Team
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── REGISTER MEMBER MODAL (SPACE-SEPARATED AGENT IDS) ────────────── */}
            <AnimatePresence>
                {registerTeamId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md p-6 rounded-xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-4 text-left"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                    Add Members by Agent IDs
                                </h3>
                                <button onClick={() => setRegisterTeamId(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleRegisterMember} className="space-y-3">
                                <div>
                                    <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                                        Agent IDs (Space-Separated) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 42 81 243 51"
                                        value={agentIdInput}
                                        onChange={e => setAgentIdInput(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white focus:border-cyan-400 outline-none"
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-1">
                                        Enter one or more IDs separated by space (e.g. <span className="text-cyan-300">42 81 243 51</span>)
                                    </p>
                                </div>

                                <div className="pt-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setRegisterTeamId(null)}
                                        className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                                    >
                                        Add Members
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
