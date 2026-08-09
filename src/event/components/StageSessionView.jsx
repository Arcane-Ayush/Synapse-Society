import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Zap, Award, Flame, Play, Pause, RotateCcw, PlusCircle,
    Maximize2, Minimize2, Radio, Sparkles, ExternalLink, Shield, Info, Trophy, AlertTriangle
} from 'lucide-react';
import { StageLeaderboard } from './StageLeaderboard';
import { playEventSound } from '../lib/soundSystem';

export function StageSessionView({ eventState, isAdmin = false }) {
    const [isLeftMaximized, setIsLeftMaximized] = useState(false);
    const [roundSeconds, setRoundSeconds] = useState(eventState?.roundTimerDurationSec || 45 * 60);
    const [roundRunning, setRoundRunning] = useState(eventState?.roundTimerRunning || false);
    const [sponsorSeconds, setSponsorSeconds] = useState(eventState?.sponsorTimerDurationSec || 15 * 60);
    const [sponsorRunning, setSponsorRunning] = useState(eventState?.sponsorTimerRunning || false);

    // Sync timer state from eventState
    useEffect(() => {
        if (eventState?.roundTimerDurationSec !== undefined) {
            setRoundSeconds(eventState.roundTimerDurationSec);
        }
        if (eventState?.roundTimerRunning !== undefined) {
            setRoundRunning(eventState.roundTimerRunning);
        }
    }, [eventState?.roundTimerDurationSec, eventState?.roundTimerRunning]);

    useEffect(() => {
        if (eventState?.sponsorTimerDurationSec !== undefined) {
            setSponsorSeconds(eventState.sponsorTimerDurationSec);
        }
        if (eventState?.sponsorTimerRunning !== undefined) {
            setSponsorRunning(eventState.sponsorTimerRunning);
        }
    }, [eventState?.sponsorTimerDurationSec, eventState?.sponsorTimerRunning]);

    // Round timer tick
    useEffect(() => {
        let interval = null;
        if (roundRunning) {
            interval = setInterval(() => {
                setRoundSeconds(prev => {
                    if (prev <= 1) {
                        setRoundRunning(false);
                        playEventSound('buzzer');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [roundRunning]);

    // Sponsor break timer tick
    useEffect(() => {
        let interval = null;
        if (sponsorRunning) {
            interval = setInterval(() => {
                setSponsorSeconds(prev => {
                    if (prev <= 1) {
                        setSponsorRunning(false);
                        playEventSound('chime');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [sponsorRunning]);

    const formatDigits = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return {
            min: m.toString().padStart(2, '0'),
            sec: s.toString().padStart(2, '0')
        };
    };

    const roundDigits = formatDigits(roundSeconds);
    const sponsorDigits = formatDigits(sponsorSeconds);
    const isTimeUp = roundSeconds === 0 && !roundRunning;

    const isBreak = eventState?.phase === 'phase_3_break';
    const isRound1 = eventState?.phase === 'phase_2_round_1';
    const isRound2 = eventState?.phase === 'phase_4_round_2';
    const isRound3 = eventState?.phase === 'phase_5_round_3';

    // Active Sponsor Ad from eventState
    const adsList = eventState?.sponsorAds || [
        { id: 1, title: 'Red Bull Energy', url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-animation-4364-large.mp4', active: true },
        { id: 2, title: 'GitHub Campus Guild', url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4', active: false },
        { id: 3, title: 'Synapse Society Showcase', url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-working-in-a-laboratory-41484-large.mp4', active: false }
    ];
    const activeAd = adsList[eventState?.activeAdIndex || 0] || adsList[0];

    const getRoundTitle = () => {
        if (isRound1) return eventState?.round1Prompt?.title || 'Round 1 · Reverse Hackathon';
        if (isRound2) return eventState?.round2Prompt?.title || 'Round 2 · Architecture Proposals & Redemption';
        if (isRound3) return eventState?.round3Prompt?.title || 'Round 3 · Grand Final Showdown';
        if (isBreak) return eventState?.breakTitle || 'Official Intermission & Energy Break';
        return eventState?.phaseTitle || 'Live Stage Protocol Active';
    };

    const getRoundDescription = () => {
        if (isRound1) return eventState?.round1Prompt?.description || 'Deconstruct the provided algorithm, isolate the latent defect, and submit your GitHub solution repository.';
        if (isRound2) return eventState?.round2Prompt?.description || 'Track A: 16 Qualifiers draft production cloud topology. Track B: Eliminated squads battle through Redemption Cyber Quiz!';
        if (isRound3) return eventState?.round3Prompt?.description || 'Top 10 Finalist squads pitch their engineered prototypes live on stage before the jury.';
        if (isBreak) return 'Teams may refuel, review standings, and prepare for the upcoming gauntlet.';
        return 'Active stage session synchronized with all registered squads.';
    };

    const getRoundBounty = () => {
        if (isRound1) return 300;
        if (isRound2) return 500;
        if (isRound3) return 1500;
        return 100;
    };

    const isRoundTimerVisible = eventState?.roundTimerVisible !== false;
    const isSponsorTimerVisible = eventState?.sponsorTimerVisible === true || isBreak;

    return (
        <div className="w-full h-full select-none font-mono">
            {/* Widescreen 3:7 Layout */}
            <div className={`grid gap-4 h-full ${
                isLeftMaximized
                    ? 'grid-cols-1 max-w-4xl mx-auto'
                    : 'grid-cols-1 lg:grid-cols-10'
            }`}>
                {/* ── LEFT PANEL (3 / 10 = 30%) ──────────────────────────────────── */}
                <div className={`${isLeftMaximized ? 'lg:col-span-1' : 'lg:col-span-3'} flex flex-col gap-3 justify-between`}>
                    <div className="space-y-3">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                                <span className="text-[11px] font-bold tracking-widest text-cyan-300 uppercase">
                                    STAGE MISSION HUD
                                </span>
                            </div>

                            <button
                                onClick={() => setIsLeftMaximized(!isLeftMaximized)}
                                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-300 text-[10px] flex items-center gap-1 cursor-pointer transition-all border border-white/10"
                            >
                                {isLeftMaximized ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                                <span>{isLeftMaximized ? '3:7 View' : 'Maximize'}</span>
                            </button>
                        </div>

                        {/* 1. ROUND COUNTDOWN TIMER (Clean Rectangular Box) */}
                        {isRoundTimerVisible && (
                            <div
                                className="rounded-xl p-4 bg-zinc-950/90 border border-cyan-500/40 relative overflow-hidden text-center shadow-lg"
                                style={{
                                    borderColor: isTimeUp ? '#EF4444' : '#00F0FF66'
                                }}
                            >
                                {isTimeUp && (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mb-2 px-2 py-1 rounded bg-red-500/30 border border-red-400/50 text-red-200 text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse"
                                    >
                                        <AlertTriangle size={13} className="text-red-400" /> TIME'S UP • LOCK SUBMISSIONS!
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-between text-[10px] mb-1.5">
                                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-wider">
                                        <Clock size={12} className="text-cyan-400" />
                                        <span>ROUND TIMER</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                        roundRunning
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                                            : 'bg-white/5 text-zinc-400 border border-white/10'
                                    }`}>
                                        {roundRunning ? 'ON AIR' : 'PAUSED'}
                                    </span>
                                </div>

                                <div className="py-1 flex items-center justify-center gap-2">
                                    <div className="flex flex-col items-center">
                                        <span
                                            className="text-4xl sm:text-5xl font-black text-white px-3 py-1 rounded-lg bg-black/60 border border-white/10"
                                            style={{ fontFamily: 'Space Grotesk, monospace' }}
                                        >
                                            {roundDigits.min}
                                        </span>
                                        <span className="text-[8px] text-zinc-500 mt-0.5 uppercase tracking-widest">MIN</span>
                                    </div>

                                    <span className={`text-3xl font-black -mt-3 animate-pulse ${isTimeUp ? 'text-red-400' : 'text-cyan-400'}`}>:</span>

                                    <div className="flex flex-col items-center">
                                        <span
                                            className={`text-4xl sm:text-5xl font-black px-3 py-1 rounded-lg bg-black/60 border ${
                                                isTimeUp ? 'text-red-400 border-red-500/40' : 'text-cyan-300 border-cyan-400/30'
                                            }`}
                                            style={{ fontFamily: 'Space Grotesk, monospace' }}
                                        >
                                            {roundDigits.sec}
                                        </span>
                                        <span className="text-[8px] text-zinc-500 mt-0.5 uppercase tracking-widest">SEC</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. DEDICATED RED BULL / SPONSOR BREAK TIMER CARD */}
                        {isSponsorTimerVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-xl p-4 bg-zinc-950/90 border border-red-500/60 relative overflow-hidden text-center shadow-lg"
                            >
                                <div className="flex items-center justify-between text-[10px] mb-1.5">
                                    <div className="flex items-center gap-1.5 text-red-300 font-bold uppercase tracking-wider">
                                        <Zap size={13} className="text-yellow-400 fill-yellow-400" />
                                        <span>{eventState?.sponsorTimerTitle || 'RED BULL BREAK'}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                        sponsorRunning
                                            ? 'bg-red-500/30 text-red-200 border border-red-500/50 animate-pulse'
                                            : 'bg-white/5 text-zinc-400 border border-white/10'
                                    }`}>
                                        {sponsorRunning ? 'ON AIR' : 'PAUSED'}
                                    </span>
                                </div>

                                <div className="py-1 flex items-center justify-center gap-2">
                                    <div className="flex flex-col items-center">
                                        <span
                                            className="text-4xl sm:text-5xl font-black text-white px-3 py-1 rounded-lg bg-black/70 border border-red-500/40"
                                            style={{ fontFamily: 'Space Grotesk, monospace' }}
                                        >
                                            {sponsorDigits.min}
                                        </span>
                                        <span className="text-[8px] text-red-400/80 mt-0.5 uppercase tracking-widest">MIN</span>
                                    </div>

                                    <span className="text-3xl font-black -mt-3 text-red-400 animate-pulse">:</span>

                                    <div className="flex flex-col items-center">
                                        <span
                                            className="text-4xl sm:text-5xl font-black text-yellow-300 px-3 py-1 rounded-lg bg-black/70 border border-yellow-500/40"
                                            style={{ fontFamily: 'Space Grotesk, monospace' }}
                                        >
                                            {sponsorDigits.sec}
                                        </span>
                                        <span className="text-[8px] text-yellow-400/80 mt-0.5 uppercase tracking-widest">SEC</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3. ACTIVE DIRECTIVE CARD */}
                        <div className="rounded-xl p-3.5 bg-zinc-950/80 border border-purple-500/30 relative overflow-hidden">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold flex items-center gap-1">
                                    <Info size={12} className="text-purple-400" /> ACTIVE DIRECTIVE
                                </span>
                                <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[10px] font-bold">
                                    +{getRoundBounty()} S-Coins
                                </span>
                            </div>

                            <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                                {getRoundTitle()}
                            </h3>

                            <p className="text-xs text-zinc-300 leading-relaxed">
                                {getRoundDescription()}
                            </p>
                        </div>
                    </div>

                    {/* 4. SPONSOR AD OVERLAY CARD (If Enabled) */}
                    {eventState?.adEnabled !== false && activeAd && (
                        <div className="rounded-xl p-2.5 bg-black/60 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                                    <Sparkles size={12} />
                                </div>
                                <div className="text-[11px] font-bold text-white truncate max-w-[170px]">{activeAd.title}</div>
                            </div>
                            <span className="text-[9px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold">
                                SPONSOR
                            </span>
                        </div>
                    )}
                </div>

                {/* ── RIGHT PANEL (7 / 10 = 70%) ─────────────────────────────────── */}
                <div className={`${isLeftMaximized ? 'hidden' : 'lg:col-span-7'} flex flex-col justify-between h-full`}>
                    <StageLeaderboard currentPhase={eventState?.phase} />
                </div>
            </div>
        </div>
    );
}
