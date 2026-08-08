import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Radio, Users, Clock, Play, Pause, Zap, Award, Flame,
    CheckCircle2, RotateCcw, PlusCircle, Coins, XCircle, ChevronRight, Sparkles, Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
    EVENT_PHASES,
    DEFAULT_EVENT_STATE,
    broadcastEventState,
    subscribeToEventState,
    fetchEventTeamsFromDb,
    toggleTeamElimination,
    awardTeamSCoins
} from './lib/eventState';
import { DualTimerController } from './components/DualTimerController';

export function EventAdmin() {
    const { profile, isLead, isAuthenticated } = useAuth();
    const [eventState, setEventState] = useState(DEFAULT_EVENT_STATE);
    const [teams, setTeams] = useState([]);
    const [broadcastSuccess, setBroadcastSuccess] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [pointsToAward, setPointsToAward] = useState(100);
    const [awardMessage, setAwardMessage] = useState(null);

    const loadTeams = () => {
        fetchEventTeamsFromDb().then(data => {
            if (data && data.length > 0) setTeams(data);
        });
    };

    useEffect(() => {
        loadTeams();
        const unsubscribe = subscribeToEventState((newState) => {
            if (newState) setEventState(newState);
        });
        return () => unsubscribe();
    }, []);

    const updatePhase = async (newPhase, title) => {
        const updated = {
            ...eventState,
            phase: newPhase,
            phaseTitle: title
        };
        setEventState(updated);
        await broadcastEventState(updated);
        setBroadcastSuccess(true);
        setTimeout(() => setBroadcastSuccess(false), 2000);
    };

    const handleToggleElimination = async (team) => {
        const newEliminatedState = !team.is_eliminated;
        await toggleTeamElimination(team.id, newEliminatedState);
        setTeams(prev => prev.map(t => t.id === team.id ? { ...t, is_eliminated: newEliminatedState, is_qualified: !newEliminatedState } : t));
    };

    const handleAwardPoints = async (teamId) => {
        if (!teamId || !pointsToAward) return;
        const res = await awardTeamSCoins(teamId, pointsToAward);
        if (!res.error) {
            setTeams(prev => prev.map(t => t.id === teamId ? { ...t, s_coins: (t.s_coins || 0) + Number(pointsToAward) } : t));
            setAwardMessage(`+${pointsToAward} S-Coins successfully awarded!`);
            setTimeout(() => setAwardMessage(null), 2500);
        }
    };

    const handleBulkAwardQualified = async () => {
        const qualified = teams.filter(t => !t.is_eliminated);
        for (const t of qualified) {
            await awardTeamSCoins(t.id, pointsToAward);
        }
        loadTeams();
        setAwardMessage(`+${pointsToAward} S-Coins awarded to all ${qualified.length} qualified squads!`);
        setTimeout(() => setAwardMessage(null), 3000);
    };

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
        <div className="min-h-screen px-4 py-12 max-w-6xl mx-auto select-none">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        <Radio size={24} className="text-purple-400 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Event Mission Control
                        </h1>
                        <p className="text-xs font-mono text-purple-300">
                            Neural Nexus 2026 • Live Stage & Attendee Orchestrator
                        </p>
                    </div>
                </div>

                {broadcastSuccess && (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                        <CheckCircle2 size={14} /> State Broadcasted Live
                    </span>
                )}
            </div>

            {/* 1. Live Phase Switcher */}
            <div className="mb-10">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                    <Zap size={14} /> Live Event Phase Transitions (Click to Broadcast)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                        { key: EVENT_PHASES.PHASE_0_CHECKIN, label: 'Phase 0: Check-In', desc: 'ID Pass' },
                        { key: EVENT_PHASES.PHASE_0_5_AUDIENCE_TAP, label: 'Phase 0.5: Tap', desc: 'Arc Reactor' },
                        { key: EVENT_PHASES.PHASE_1_TEAMS, label: 'Phase 1: Teams', desc: '40 Squads' },
                        { key: EVENT_PHASES.PHASE_2_ROUND_1, label: 'Phase 2: Round 1', desc: 'Reverse Hack' },
                        { key: EVENT_PHASES.PHASE_3_RED_BULL, label: 'Phase 3: Break', desc: 'Red Bull' },
                        { key: EVENT_PHASES.PHASE_4_ROUND_2, label: 'Phase 4: Round 2', desc: 'Qual + Quiz' },
                    ].map(p => {
                        const isActive = eventState.phase === p.key;
                        return (
                            <button
                                key={p.key}
                                onClick={() => updatePhase(p.key, p.label)}
                                className={`p-4 rounded-2xl text-left font-mono transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-purple-600/30 border-2 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] text-white'
                                        : 'bg-black/40 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                                }`}
                            >
                                <div className="text-[11px] font-bold truncate">{p.label}</div>
                                <div className="text-[10px] text-zinc-500 mt-1">{p.desc}</div>
                                {isActive && <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-2" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Dual Timers Controller */}
            <div className="mb-10">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                    <Clock size={14} /> Dual Stage Timers Command
                </div>
                <DualTimerController isAdmin={true} />
            </div>

            {/* 3. Team Elimination & S-Coin Point Distribution */}
            <div className="p-6 rounded-3xl bg-black/40 border border-white/10 mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                    <div>
                        <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Squad Governance • Elimination & S-Coin Distribution
                        </h3>
                        <p className="text-xs font-mono text-zinc-400">
                            Manage the 40 database squads live: toggle qualification for Round 2, or dispatch S-Coin rewards.
                        </p>
                    </div>

                    {/* Bulk Points Dispatch */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
                            <Coins size={14} className="text-yellow-400" />
                            <input
                                type="number"
                                value={pointsToAward}
                                onChange={e => setPointsToAward(Number(e.target.value))}
                                className="w-16 bg-transparent text-white font-bold outline-none"
                            />
                            <span className="text-zinc-500">S-Coins</span>
                        </div>
                        <button
                            onClick={handleBulkAwardQualified}
                            className="px-3.5 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                            <Send size={12} /> Award All Qualified
                        </button>
                    </div>
                </div>

                {awardMessage && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 size={14} /> {awardMessage}
                    </div>
                )}

                {/* 40 Teams Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {teams.map(team => {
                        const isElim = team.is_eliminated;
                        return (
                            <div
                                key={team.id}
                                className="p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all"
                                style={{
                                    background: isElim ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                    border: isElim ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
                                }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-2xl">{team.badge}</span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                                                {team.name}
                                            </span>
                                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400">
                                                {team.code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-mono font-bold text-yellow-300">
                                                {team.s_coins || 0} S-Coins
                                            </span>
                                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${isElim ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                                {isElim ? 'ELIMINATED' : 'QUALIFIED'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleAwardPoints(team.id)}
                                        className="p-1.5 px-2 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-300 text-[10px] font-mono font-bold cursor-pointer transition-colors"
                                        title="Award S-Coins to this squad"
                                    >
                                        +{pointsToAward} S
                                    </button>

                                    <button
                                        onClick={() => handleToggleElimination(team)}
                                        className={`p-1.5 px-2.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                                            isElim
                                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                                                : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                                        }`}
                                    >
                                        {isElim ? 'Restore' : 'Eliminate'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
