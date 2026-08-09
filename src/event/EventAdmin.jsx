import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Radio, Users, Clock, Play, Pause, Zap, Award, Flame,
    CheckCircle2, RotateCcw, PlusCircle, MinusCircle, Coins, XCircle, ChevronRight,
    Sparkles, Send, UserPlus, Image, Eye, EyeOff, Layers, Search, Coffee, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
    EVENT_PHASES,
    DEFAULT_EVENT_STATE,
    broadcastEventState,
    subscribeToEventState,
    fetchEventTeamsFromDb,
    toggleTeamElimination,
    awardTeamSCoins,
    assignMemberToTeamByAgentId,
    toggleTeamActiveStatus
} from './lib/eventState';
import { playEventSound, broadcastPlaySound } from './lib/soundSystem';

export function EventAdmin() {
    const { profile, isLead, isAuthenticated } = useAuth();
    const [eventState, setEventState] = useState(DEFAULT_EVENT_STATE);
    const [teams, setTeams] = useState([]);
    const [broadcastSuccess, setBroadcastSuccess] = useState(false);
    const [awardMessage, setAwardMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Timer States
    const [customRoundMinutes, setCustomRoundMinutes] = useState(45);
    const [roundSeconds, setRoundSeconds] = useState(45 * 60);
    const [roundRunning, setRoundRunning] = useState(false);

    // Custom Break Settings
    const [customBreakTitle, setCustomBreakTitle] = useState('Intermission & Energy Break');
    const [customBreakMinutes, setCustomBreakMinutes] = useState(15);
    const [breakSeconds, setBreakSeconds] = useState(15 * 60);
    const [breakRunning, setBreakRunning] = useState(false);

    // Prompt Editors
    const [r1Prompt, setR1Prompt] = useState(DEFAULT_EVENT_STATE.round1Prompt);
    const [r2Prompt, setR2Prompt] = useState(DEFAULT_EVENT_STATE.round2Prompt);
    const [r3Prompt, setR3Prompt] = useState(DEFAULT_EVENT_STATE.round3Prompt);
    const [editingPromptRound, setEditingPromptRound] = useState(null);

    // Quick Member Register
    const [registerTeamId, setRegisterTeamId] = useState(null);
    const [agentIdInput, setAgentIdInput] = useState('');
    const [memberNameInput, setMemberNameInput] = useState('');

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
            }
        });
        return () => unsubscribe();
    }, []);

    // Round countdown tick
    useEffect(() => {
        let interval = null;
        if (roundRunning) {
            interval = setInterval(() => {
                setRoundSeconds(prev => {
                    if (prev <= 1) {
                        setRoundRunning(false);
                        broadcastPlaySound('buzzer');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [roundRunning]);

    // Break countdown tick
    useEffect(() => {
        let interval = null;
        if (breakRunning) {
            interval = setInterval(() => {
                setBreakSeconds(prev => {
                    if (prev <= 1) {
                        setBreakRunning(false);
                        broadcastPlaySound('chime');
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

    const handleStartBreak = async () => {
        const updated = {
            ...eventState,
            phase: EVENT_PHASES.PHASE_3_BREAK,
            phaseTitle: customBreakTitle,
            breakTitle: customBreakTitle,
            breakDurationSec: customBreakMinutes * 60
        };
        setBreakSeconds(customBreakMinutes * 60);
        setBreakRunning(true);
        setEventState(updated);
        await broadcastEventState(updated);
        broadcastPlaySound('chime');
        setAwardMessage(`Break started: "${customBreakTitle}" for ${customBreakMinutes} mins`);
        setTimeout(() => setAwardMessage(null), 3000);
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

    const handleToggleElimination = async (team) => {
        const newEliminatedState = !team.is_eliminated;
        await toggleTeamElimination(team.id, newEliminatedState);
        setTeams(prev => prev.map(t => t.id === team.id ? { ...t, is_eliminated: newEliminatedState, is_qualified: !newEliminatedState } : t));
    };

    const handleToggleActive = async (team) => {
        const newActive = !team.is_active;
        await toggleTeamActiveStatus(team.id, newActive);
        setTeams(prev => prev.map(t => t.id === team.id ? { ...t, is_active: newActive } : t));
    };

    const handleAwardPoints = async (teamId, amt = 100) => {
        if (!teamId || !amt) return;
        const res = await awardTeamSCoins(teamId, amt);
        if (!res.error) {
            setTeams(prev => prev.map(t => t.id === teamId ? { ...t, s_coins: (t.s_coins || 0) + Number(amt) } : t));
            setAwardMessage(`+${amt} S-Coins awarded to squad!`);
            setTimeout(() => setAwardMessage(null), 2000);
        }
    };

    const handleRegisterMember = async (e) => {
        e.preventDefault();
        if (!registerTeamId || !agentIdInput.trim()) return;

        const res = await assignMemberToTeamByAgentId(registerTeamId, agentIdInput.trim(), memberNameInput.trim());
        if (!res.error) {
            loadTeams();
            setAwardMessage(`Agent #${agentIdInput.trim()} registered to squad.`);
            setAgentIdInput('');
            setMemberNameInput('');
            setRegisterTeamId(null);
            setTimeout(() => setAwardMessage(null), 3000);
        }
    };

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Category Pools
    const activeTeams = teams.filter(t => t.is_active);
    const round1Pool = activeTeams; // All active squads
    const round2QualifiedPool = activeTeams.filter(t => !t.is_eliminated); // Top squads
    const round2RedemptionPool = activeTeams.filter(t => t.is_eliminated); // Eliminated squads
    const round3FinalistsPool = activeTeams.filter(t => !t.is_eliminated).slice(0, 4); // Top 4 finalists

    // Metrics
    const totalCount = teams.length;
    const activeCount = activeTeams.length;
    const standingCount = round2QualifiedPool.length;
    const eliminatedCount = round2RedemptionPool.length;

    if (!isAuthenticated || !isLead) {
        return (
            <div className="min-h-screen px-4 py-24 flex items-center justify-center text-center">
                <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/30 max-w-md">
                    <Shield size={36} className="text-red-400 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                        Restricted Event Admin Console
                    </h2>
                    <p className="text-xs font-mono text-zinc-400">
                        Only authenticated club leads and administrators may govern the live Neural Nexus event modules.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 sm:px-6 py-6 max-w-7xl mx-auto select-none space-y-6 text-zinc-200">
            {/* ── TOP HEADER & METRICS BAR ────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/60 border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
                        <Radio size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Event Mission Control
                        </h1>
                        <p className="text-[11px] font-mono text-purple-300">
                            Neural Nexus 2026 • Live Orchestrator
                        </p>
                    </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
                    <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-zinc-400">TOTAL: </span>
                        <strong className="text-white">{totalCount}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300">
                        <span>ACTIVE: </span>
                        <strong>{activeCount}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                        <span>QUALIFIED: </span>
                        <strong>{standingCount}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-pink-950/30 border border-pink-500/30 text-pink-300">
                        <span>REDEMPTION: </span>
                        <strong>{eliminatedCount}</strong>
                    </div>
                    {broadcastSuccess && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse font-bold">
                            ✓ SYNCED
                        </span>
                    )}
                </div>
            </div>

            {/* Notification */}
            {awardMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" /> {awardMessage}
                </div>
            )}

            {/* ── 1. LIVE EVENT SCENE TRANSITIONS & DEDICATED BREAK BOX ───────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Event Progression */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={14} /> Main Event Scenes
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {[
                            { key: EVENT_PHASES.PHASE_0_CHECKIN, label: 'Phase 0: Check-In', sub: 'ID Pass' },
                            { key: EVENT_PHASES.PHASE_0_5_AUDIENCE_TAP, label: 'Phase 0.5: Tap', sub: 'Arc Sync' },
                            { key: EVENT_PHASES.PHASE_1_TEAMS, label: 'Phase 1: Teams', sub: 'Squad Pass' },
                            { key: EVENT_PHASES.PHASE_2_ROUND_1, label: 'Round 1: Rev Hack', sub: 'Hackathon' },
                            { key: EVENT_PHASES.PHASE_4_ROUND_2, label: 'Round 2: Dual Track', sub: 'Qual + Quiz' },
                            { key: EVENT_PHASES.PHASE_5_ROUND_3, label: 'Round 3: Grand Final', sub: 'On Stage' },
                        ].map(p => {
                            const isActive = eventState.phase === p.key;
                            return (
                                <button
                                    key={p.key}
                                    onClick={() => updatePhase(p.key, p.label)}
                                    className={`p-3 rounded-xl text-left font-mono transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-purple-600/30 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white'
                                            : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-xs font-bold truncate">{p.label}</div>
                                    <div className="text-[10px] text-zinc-500">{p.sub}</div>
                                    {isActive && <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-1" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dedicated Customizable Break / Intermission Box */}
                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Coffee size={14} className="text-red-400" /> Break / Intermission
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            eventState.phase === EVENT_PHASES.PHASE_3_BREAK ? 'bg-red-500/30 text-red-200 animate-pulse' : 'bg-white/5 text-zinc-400'
                        }`}>
                            {eventState.phase === EVENT_PHASES.PHASE_3_BREAK ? 'ON AIR' : 'IDLE'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            value={customBreakTitle}
                            onChange={e => setCustomBreakTitle(e.target.value)}
                            placeholder="Break Heading (e.g. Red Bull Break)"
                            className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-red-400"
                        />

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-300">
                                <span>Duration:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={customBreakMinutes}
                                    onChange={e => setCustomBreakMinutes(Number(e.target.value))}
                                    className="w-10 bg-transparent text-white font-bold text-center outline-none"
                                />
                                <span>m</span>
                            </div>

                            <button
                                onClick={handleStartBreak}
                                className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                            >
                                <Play size={12} /> Start Break
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 2. EDITABLE TIMERS & SOUND EFFECTS BAR ────────────────────────── */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} /> Stage Timer & Audio SFX Control
                    </div>

                    {/* SFX Triggers */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-zinc-400 mr-1">PLAY SOUND:</span>
                        <button
                            onClick={() => broadcastPlaySound('buzzer')}
                            className="px-2.5 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-[10px] font-bold cursor-pointer border border-red-500/40"
                        >
                            🚨 Buzzer
                        </button>
                        <button
                            onClick={() => broadcastPlaySound('fanfare')}
                            className="px-2.5 py-1 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-mono text-[10px] font-bold cursor-pointer border border-yellow-500/40"
                        >
                            🏆 Fanfare
                        </button>
                        <button
                            onClick={() => broadcastPlaySound('chime')}
                            className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold cursor-pointer border border-cyan-400/40"
                        >
                            🔔 Chime
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Round Timer */}
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-4">
                        <div>
                            <div className="text-[10px] font-mono text-zinc-400 uppercase">Round Countdown</div>
                            <div className="text-3xl font-black font-mono text-white tracking-widest">{formatTimer(roundSeconds)}</div>
                        </div>

                        <div className="flex items-center flex-wrap gap-1.5">
                            <button
                                onClick={() => setRoundRunning(!roundRunning)}
                                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold cursor-pointer"
                            >
                                {roundRunning ? 'Pause' : 'Start'}
                            </button>
                            <button
                                onClick={() => setRoundSeconds(prev => prev + 300)}
                                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 cursor-pointer"
                            >
                                +5m
                            </button>
                            <button
                                onClick={() => setRoundSeconds(prev => Math.max(0, prev - 60))}
                                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 cursor-pointer"
                            >
                                -1m
                            </button>
                            <button
                                onClick={() => { setRoundRunning(false); setRoundSeconds(customRoundMinutes * 60); }}
                                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-400 cursor-pointer"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Break Timer */}
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-4">
                        <div>
                            <div className="text-[10px] font-mono text-zinc-400 uppercase">Break Countdown</div>
                            <div className="text-3xl font-black font-mono text-yellow-300 tracking-widest">{formatTimer(breakSeconds)}</div>
                        </div>

                        <div className="flex items-center flex-wrap gap-1.5">
                            <button
                                onClick={() => setBreakRunning(!breakRunning)}
                                className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-mono text-xs font-bold cursor-pointer"
                            >
                                {breakRunning ? 'Pause' : 'Start'}
                            </button>
                            <button
                                onClick={() => setBreakSeconds(prev => prev + 300)}
                                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 cursor-pointer"
                            >
                                +5m
                            </button>
                            <button
                                onClick={() => { setBreakRunning(false); setBreakSeconds(customBreakMinutes * 60); }}
                                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-400 cursor-pointer"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 3. SEPARATE TEAM SECTIONS FOR ROUNDS 1, 2, AND 3 ─────────────── */}
            <div className="space-y-6">
                {/* Search / Filter */}
                <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-black font-mono text-white uppercase tracking-wider flex items-center gap-2">
                        <Users size={16} className="text-purple-400" /> Squad Rosters by Round & Track
                    </div>

                    <div className="relative w-64">
                        <Search size={13} className="absolute left-3 top-2.5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Filter squads..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                </div>

                {/* ── ROUND 1 SECTION ─────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div>
                            <div className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                                <Award size={14} /> ROUND 1: REVERSE HACKATHON ROSTER ({round1Pool.length} Active Squads)
                            </div>
                            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                                All registered squads competing in Round 1. Max Reward: +500 S-Coins (50 XP).
                            </p>
                        </div>

                        <button
                            onClick={() => setEditingPromptRound(editingPromptRound === 'r1' ? null : 'r1')}
                            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono cursor-pointer border border-white/10"
                        >
                            {editingPromptRound === 'r1' ? 'Close Prompt' : 'Edit Prompt'}
                        </button>
                    </div>

                    {editingPromptRound === 'r1' && (
                        <div className="p-3 rounded-xl bg-black/60 border border-cyan-400/30 space-y-2">
                            <input
                                type="text"
                                value={r1Prompt?.title || ''}
                                onChange={e => setR1Prompt({ ...r1Prompt, title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs font-mono text-white"
                            />
                            <textarea
                                rows={2}
                                value={r1Prompt?.description || ''}
                                onChange={e => setR1Prompt({ ...r1Prompt, description: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs font-mono text-white"
                            />
                            <button
                                onClick={handleSavePrompts}
                                className="px-3 py-1 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold cursor-pointer"
                            >
                                Save Prompt
                            </button>
                        </div>
                    )}

                    {/* Squads in Round 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {round1Pool
                            .filter(t => t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || t.code?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(team => (
                                <div key={team.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-xl">{team.badge}</span>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-white truncate">{team.name}</div>
                                            <div className="text-[10px] font-mono text-yellow-300 font-bold">{team.s_coins || 0} S-Coins</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleAwardPoints(team.id, 100)}
                                            className="px-2 py-1 rounded bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25 text-[10px] font-mono font-bold cursor-pointer"
                                        >
                                            +100
                                        </button>
                                        <button
                                            onClick={() => handleToggleElimination(team)}
                                            className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                                                team.is_eliminated ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                                            }`}
                                        >
                                            {team.is_eliminated ? 'Redeem' : 'Qualify'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* ── ROUND 2 SECTION (TWO SEPARATE TRACKS) ───────────────────── */}
                <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div>
                            <div className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                                <Award size={14} /> ROUND 2: DUAL TRACKS (Top 16 Qualifiers + Redemption Track)
                            </div>
                            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                                Track A: Top 16 squads submitting proposals. Track B: Knocked-out squads reclaiming points via Redemption Quiz.
                            </p>
                        </div>

                        <button
                            onClick={() => setEditingPromptRound(editingPromptRound === 'r2' ? null : 'r2')}
                            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono cursor-pointer border border-white/10"
                        >
                            {editingPromptRound === 'r2' ? 'Close Prompt' : 'Edit Prompt'}
                        </button>
                    </div>

                    {editingPromptRound === 'r2' && (
                        <div className="p-3 rounded-xl bg-black/60 border border-purple-400/30 space-y-2">
                            <input
                                type="text"
                                value={r2Prompt?.title || ''}
                                onChange={e => setR2Prompt({ ...r2Prompt, title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs font-mono text-white"
                            />
                            <textarea
                                rows={2}
                                value={r2Prompt?.description || ''}
                                onChange={e => setR2Prompt({ ...r2Prompt, description: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs font-mono text-white"
                            />
                            <button
                                onClick={handleSavePrompts}
                                className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-mono font-bold cursor-pointer"
                            >
                                Save Prompt
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Track A: Qualified Teams (Top 16) */}
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-bold text-emerald-300">TRACK A: QUALIFIERS ({round2QualifiedPool.length})</span>
                                <span className="text-zinc-400 text-[10px]">Proposal Track</span>
                            </div>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                {round2QualifiedPool.length > 0 ? (
                                    round2QualifiedPool.map(team => (
                                        <div key={team.id} className="p-2 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span>{team.badge}</span>
                                                <div className="truncate font-bold text-white">{team.name}</div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-yellow-300 font-bold">{team.s_coins || 0} S</span>
                                                <button
                                                    onClick={() => handleAwardPoints(team.id, 100)}
                                                    className="px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-300 text-[10px] font-mono cursor-pointer"
                                                >
                                                    +100
                                                </button>
                                                <button
                                                    onClick={() => handleToggleElimination(team)}
                                                    className="p-1 rounded bg-red-500/20 text-red-300 text-[10px] font-mono cursor-pointer"
                                                    title="Move to Redemption Track"
                                                >
                                                    <ArrowDownLeft size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs font-mono text-zinc-500">
                                        No squads qualified yet. Qualify squads in Round 1 above.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Track B: Round of Redemption Teams */}
                        <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30 space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-bold text-pink-300">TRACK B: REDEMPTION ({round2RedemptionPool.length})</span>
                                <span className="text-zinc-400 text-[10px]">Quiz Track</span>
                            </div>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                {round2RedemptionPool.length > 0 ? (
                                    round2RedemptionPool.map(team => (
                                        <div key={team.id} className="p-2 rounded-lg bg-black/40 border border-pink-500/20 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span>{team.badge}</span>
                                                <div className="truncate font-bold text-white">{team.name}</div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-pink-300 font-bold">{team.quiz_score || 0} pts</span>
                                                <span className="font-mono text-yellow-300 font-bold">({team.s_coins || 0} S)</span>
                                                <button
                                                    onClick={() => handleAwardPoints(team.id, 100)}
                                                    className="px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-300 text-[10px] font-mono cursor-pointer"
                                                >
                                                    +100
                                                </button>
                                                <button
                                                    onClick={() => handleToggleElimination(team)}
                                                    className="p-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono cursor-pointer"
                                                    title="Promote back to Qualifiers"
                                                >
                                                    <ArrowUpRight size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs font-mono text-zinc-500">
                                        No squads in redemption track.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ROUND 3 SECTION (GRAND FINALISTS SHOWDOWN) ───────────────── */}
                <div className="p-5 rounded-2xl bg-black/40 border border-yellow-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div>
                            <div className="text-xs font-bold text-yellow-300 font-mono flex items-center gap-1.5">
                                <Trophy size={14} /> ROUND 3: GRAND FINAL SHOWDOWN ({round3FinalistsPool.length} Finalists)
                            </div>
                            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                                Top finalist squads defending system architecture live on the stage projector.
                            </p>
                        </div>

                        <button
                            onClick={() => setEditingPromptRound(editingPromptRound === 'r3' ? null : 'r3')}
                            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono cursor-pointer border border-white/10"
                        >
                            {editingPromptRound === 'r3' ? 'Close Prompt' : 'Edit Prompt'}
                        </button>
                    </div>

                    {editingPromptRound === 'r3' && (
                        <div className="p-3 rounded-xl bg-black/60 border border-yellow-400/30 space-y-2">
                            <input
                                type="text"
                                value={r3Prompt?.title || ''}
                                onChange={e => setR3Prompt({ ...r3Prompt, title: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs font-mono text-white"
                            />
                            <textarea
                                rows={2}
                                value={r3Prompt?.description || ''}
                                onChange={e => setR3Prompt({ ...r3Prompt, description: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs font-mono text-white"
                            />
                            <button
                                onClick={handleSavePrompts}
                                className="px-3 py-1 rounded-lg bg-yellow-500 text-black text-xs font-mono font-bold cursor-pointer"
                            >
                                Save Prompt
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {round3FinalistsPool.map((team, idx) => (
                            <div key={team.id} className="p-3 rounded-xl bg-yellow-950/20 border border-yellow-500/30 text-center space-y-1">
                                <div className="text-[10px] font-mono text-yellow-400 font-bold">FINALIST #{idx + 1}</div>
                                <div className="text-2xl">{team.badge}</div>
                                <div className="text-xs font-bold text-white truncate">{team.name}</div>
                                <div className="text-xs font-mono text-yellow-300 font-black">{team.s_coins || 0} S-Coins</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── ALL SQUADS & AGENT ID REGISTRATION DIRECTORY ─────────────── */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                            <UserPlus size={14} className="text-purple-400" /> Squad Directory & AGENT ID Registration
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">
                            {teams.filter(t => !t.is_active).length} Unregistered Squads Remaining
                        </span>
                    </div>

                    {/* Register AGENT ID Quick Box */}
                    {registerTeamId && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2"
                        >
                            <div className="flex items-center justify-between text-xs font-mono text-purple-200">
                                <span>Register Member by AGENT ID to Squad #{registerTeamId}</span>
                                <button onClick={() => setRegisterTeamId(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleRegisterMember} className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    placeholder="Agent # (e.g. 042)"
                                    value={agentIdInput}
                                    onChange={e => setAgentIdInput(e.target.value)}
                                    className="w-32 px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs font-mono text-white uppercase"
                                />
                                <input
                                    type="text"
                                    placeholder="Member Name (Optional)"
                                    value={memberNameInput}
                                    onChange={e => setMemberNameInput(e.target.value)}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs font-mono text-white"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold cursor-pointer"
                                >
                                    Register & Activate
                                </button>
                            </form>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                        {teams.map(team => (
                            <div key={team.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 text-xs">
                                <div className="min-w-0">
                                    <div className="font-bold text-white truncate flex items-center gap-1">
                                        <span>{team.badge}</span>
                                        <span className="truncate">{team.name}</span>
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-400">
                                        {team.is_active ? `Active (${team.members?.length || 0})` : 'Inactive'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setRegisterTeamId(team.id)}
                                    className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-[10px] font-mono font-bold cursor-pointer flex-shrink-0"
                                >
                                    +Agent
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
