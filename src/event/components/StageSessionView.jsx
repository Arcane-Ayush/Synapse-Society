import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Zap, Award, Flame, Play, Pause, RotateCcw, PlusCircle,
    Maximize2, Minimize2, Radio, Sparkles, ExternalLink, Shield, Info, Trophy, AlertTriangle
} from 'lucide-react';
import { StageLeaderboard } from './StageLeaderboard';
import { playEventSound } from '../lib/eventState';

export function StageSessionView({ eventState, isAdmin = false }) {
    const [isLeftMaximized, setIsLeftMaximized] = useState(false);
    const [roundSeconds, setRoundSeconds] = useState(eventState?.roundTimerDurationSec || 45 * 60);
    const [roundRunning, setRoundRunning] = useState(eventState?.roundTimerRunning || false);
    const [redBullSeconds, setRedBullSeconds] = useState(eventState?.redBullTimerDurationSec || 15 * 60);
    const [redBullRunning, setRedBullRunning] = useState(eventState?.redBullTimerRunning || false);
    const [adIndex, setAdIndex] = useState(0);

    // Sponsor Ads rotation
    const sponsorAds = [
        {
            title: 'Red Bull • Official Energy Partner',
            tag: 'GIVES YOU WINGS',
            color: '#EF4444',
            bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(30, 10, 20, 0.95) 100%)',
            desc: 'Refuel your mental agility during the 15-minute intermission break.'
        },
        {
            title: 'Synapse Society • Technical Guilds',
            tag: 'BUILD THE FUTURE',
            color: '#00F0FF',
            bg: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(10, 20, 35, 0.95) 100%)',
            desc: 'Join the student developer community driving open-source and competitive tech at CU.'
        },
        {
            title: 'GitHub Campus Guild • Open Source',
            tag: 'DEV ECOSYSTEM',
            color: '#A855F7',
            bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(20, 10, 35, 0.95) 100%)',
            desc: 'Submit your solution repositories directly for judge review and validation.'
        }
    ];

    // Cycle ads every 8 seconds if enabled
    useEffect(() => {
        if (!eventState?.adEnabled && eventState?.adEnabled !== undefined) return;
        const interval = setInterval(() => {
            setAdIndex(prev => (prev + 1) % sponsorAds.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [eventState?.adEnabled]);

    // Timers ticks with auto time's up buzzer trigger
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

    useEffect(() => {
        let interval = null;
        if (redBullRunning) {
            interval = setInterval(() => {
                setRedBullSeconds(prev => {
                    if (prev <= 1) {
                        setRedBullRunning(false);
                        playEventSound('chime');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [redBullRunning]);

    const formatDigits = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return {
            min: m.toString().padStart(2, '0'),
            sec: s.toString().padStart(2, '0')
        };
    };

    const roundDigits = formatDigits(roundSeconds);
    const redBullDigits = formatDigits(redBullSeconds);
    const currentAd = sponsorAds[adIndex];
    const isTimeUp = roundSeconds === 0 && !roundRunning;

    // Get current challenge info from state
    const currentPhase = eventState?.phase || 'phase_2_round_1';
    const isRound1 = currentPhase === 'phase_2_round_1';
    const isRound2 = currentPhase === 'phase_4_round_2';
    const isRound3 = currentPhase === 'phase_5_round_3';
    const isBreak = currentPhase === 'phase_3_break' || currentPhase === 'phase_3_red_bull';

    const getRoundTitle = () => {
        if (isRound1) return eventState?.round1Prompt?.title || 'Round 1: Reverse Hackathon';
        if (isRound2) return eventState?.round2Prompt?.title || 'Round 2: Architecture Proposal';
        if (isRound3) return eventState?.round3Prompt?.title || 'Round 3: Grand Final Showdown';
        if (isBreak) return eventState?.breakTitle || 'Intermission & Energy Break';
        return eventState?.phaseTitle || 'Live Stage Session';
    };

    const getRoundDescription = () => {
        if (isRound1) {
            return eventState?.round1Prompt?.description || 'Deconstruct the provided algorithm, isolate the latent logical defect, and submit your patched repository link.';
        }
        if (isRound2) {
            return eventState?.round2Prompt?.description || 'Top 16 squads draft cloud deployment architecture. Eliminated squads play the Redemption Quiz to reclaim points.';
        }
        if (isRound3) {
            return eventState?.round3Prompt?.description || 'Final stage defense: Present your architecture & live prototype directly before the jury on stage!';
        }
        if (isBreak) {
            return '15-Minute energy break. Ground crew is verifying submissions and compiling qualifier standings.';
        }
        return 'Active stage session synchronized with all registered squads.';
    };

    const getRoundRules = () => {
        if (isRound1) return eventState?.round1Prompt?.rules || 'Max Reward: +500 S-Coins (50 XP) · Top 16 Advance';
        if (isRound2) return eventState?.round2Prompt?.rules || 'Max Reward: +500 S-Coins (50 XP) · Top Finalists Advance';
        if (isRound3) return eventState?.round3Prompt?.rules || 'Presented Live on Stage · Grand Champion Decided';
        return '10 S-Coins = 1 XP';
    };

    const getRoundBounty = () => {
        if (isRound1) return eventState?.round1Prompt?.rewardSCoins || 500;
        if (isRound2) return eventState?.round2Prompt?.rewardSCoins || 500;
        if (isRound3) return eventState?.round3Prompt?.rewardSCoins || 1000;
        return 100;
    };

    return (
        <div className="w-full select-none">
            {/* Widescreen 3:7 Layout or Maximized View */}
            <div className={`grid gap-6 transition-all duration-500 ${
                isLeftMaximized
                    ? 'grid-cols-1 max-w-4xl mx-auto'
                    : 'grid-cols-1 lg:grid-cols-10'
            }`}>
                {/* ── LEFT PANEL (3 / 10 = 30%) ──────────────────────────────────── */}
                <div className={`${isLeftMaximized ? 'lg:col-span-1' : 'lg:col-span-3'} flex flex-col gap-4`}>
                    {/* Panel Header with Maximize Toggle */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                            <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                                STAGE MISSION HUD
                            </span>
                        </div>

                        <button
                            onClick={() => setIsLeftMaximized(!isLeftMaximized)}
                            className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 font-mono text-[10px] flex items-center gap-1.5 cursor-pointer transition-all border border-white/10"
                            title={isLeftMaximized ? 'Restore 3:7 Layout' : 'Maximize Left Screen'}
                        >
                            {isLeftMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                            <span>{isLeftMaximized ? '3:7 View' : 'Maximize'}</span>
                        </button>
                    </div>

                    {/* Valorant Esports Timers Container */}
                    <div
                        className="rounded-3xl p-5 backdrop-blur-2xl relative overflow-hidden text-center"
                        style={{
                            background: isTimeUp
                                ? 'linear-gradient(165deg, rgba(40, 10, 15, 0.98) 0%, rgba(30, 8, 20, 0.98) 100%)'
                                : 'linear-gradient(165deg, rgba(14, 18, 30, 0.95) 0%, rgba(20, 12, 38, 0.98) 100%)',
                            border: isTimeUp ? '2px solid rgba(239, 68, 68, 0.8)' : '1px solid rgba(0, 240, 255, 0.35)',
                            boxShadow: isTimeUp ? '0 0 50px rgba(239, 68, 68, 0.4)' : '0 0 35px rgba(0, 240, 255, 0.15)'
                        }}
                    >
                        {/* Time's Up Alert Banner */}
                        {isTimeUp && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-2 px-3 py-1 rounded-xl bg-red-500/30 border border-red-400/50 text-red-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 animate-pulse"
                            >
                                <AlertTriangle size={14} className="text-red-400" /> TIME'S UP • LOCK SUBMISSIONS!
                            </motion.div>
                        )}

                        {/* Header Badge */}
                        <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                            <div className="flex items-center gap-1.5 text-cyan-300 font-black tracking-wider uppercase">
                                <Clock size={14} className="text-cyan-400 animate-pulse" />
                                <span>{isBreak ? 'INTERMISSION TIMER' : 'ROUND TIMER'}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest ${
                                (isBreak ? redBullRunning : roundRunning)
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                                    : 'bg-white/5 text-zinc-400 border border-white/10'
                            }`}>
                                {(isBreak ? redBullRunning : roundRunning) ? 'ON AIR' : 'PAUSED'}
                            </span>
                        </div>

                        {/* Valorant Digital Monospace Hero Clock */}
                        <div className="py-2 flex items-center justify-center gap-2">
                            <div className="flex flex-col items-center">
                                <span
                                    className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white px-3 py-1 rounded-2xl bg-black/50 border border-white/10"
                                    style={{
                                        fontFamily: 'Space Grotesk, monospace',
                                        textShadow: isTimeUp ? '0 0 30px rgba(239,68,68,0.8)' : '0 0 30px rgba(0,240,255,0.6)'
                                    }}
                                >
                                    {isBreak ? redBullDigits.min : roundDigits.min}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">MIN</span>
                            </div>

                            <span className={`text-4xl font-black -mt-4 animate-pulse ${isTimeUp ? 'text-red-400' : 'text-cyan-400'}`}>:</span>

                            <div className="flex flex-col items-center">
                                <span
                                    className={`text-5xl sm:text-6xl font-black font-mono tracking-tight px-3 py-1 rounded-2xl bg-black/50 border ${
                                        isTimeUp ? 'text-red-400 border-red-500/40' : 'text-cyan-300 border-cyan-400/30'
                                    }`}
                                    style={{
                                        fontFamily: 'Space Grotesk, monospace',
                                        textShadow: isTimeUp ? '0 0 30px rgba(239,68,68,0.8)' : '0 0 30px rgba(0,240,255,0.6)'
                                    }}
                                >
                                    {isBreak ? redBullDigits.sec : roundDigits.sec}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">SEC</span>
                            </div>
                        </div>

                        {/* Break Secondary Timer (if not already break) */}
                        {!isBreak && (
                            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                                <span className="text-red-400 flex items-center gap-1 font-bold">
                                    <Zap size={12} /> RED BULL BREAK:
                                </span>
                                <span className="text-yellow-300 font-bold tracking-wider">
                                    {redBullDigits.min}:{redBullDigits.sec}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Current Ongoing Event / Challenge Description */}
                    <div
                        className="rounded-3xl p-4.5 backdrop-blur-xl relative overflow-hidden"
                        style={{
                            background: isRound3
                                ? 'linear-gradient(165deg, rgba(30, 20, 10, 0.95) 0%, rgba(40, 25, 10, 0.98) 100%)'
                                : 'linear-gradient(165deg, rgba(15, 12, 28, 0.95) 0%, rgba(25, 15, 40, 0.95) 100%)',
                            border: isRound3 ? '1.5px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(168, 85, 247, 0.3)',
                            boxShadow: isRound3 ? '0 0 40px rgba(251, 191, 36, 0.2)' : '0 0 30px rgba(168, 85, 247, 0.12)'
                        }}
                    >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold flex items-center gap-1.5">
                                <Info size={13} className="text-purple-400" /> ACTIVE DIRECTIVE
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[10px] font-mono font-bold">
                                +{getRoundBounty()} S-Coins ({Math.floor(getRoundBounty() / 10)} XP)
                            </span>
                        </div>

                        <h3 className="text-base font-black text-white mb-1.5" style={{ fontFamily: 'Space Grotesk' }}>
                            {getRoundTitle()}
                        </h3>

                        <p className="text-xs font-mono text-zinc-200 leading-relaxed mb-2.5">
                            {getRoundDescription()}
                        </p>

                        <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/10 flex items-center justify-between">
                            <span>{getRoundRules()}</span>
                        </div>
                    </div>

                    {/* Dynamic Sponsor Advertisement Showcase (Swapped dynamically below description) */}
                    {(eventState?.adEnabled !== false) && currentAd && (
                        <motion.div
                            key={adIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-3xl p-4 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between"
                            style={{
                                background: currentAd.bg,
                                border: `1px solid ${currentAd.color}44`,
                                boxShadow: `0 0 25px ${currentAd.color}15`
                            }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-mono tracking-widest uppercase font-black px-2 py-0.5 rounded bg-black/40" style={{ color: currentAd.color }}>
                                    {currentAd.tag}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-400">PARTNER SPOTLIGHT</span>
                            </div>

                            <h4 className="text-xs font-black text-white mb-0.5" style={{ fontFamily: 'Space Grotesk' }}>
                                {currentAd.title}
                            </h4>

                            <p className="text-[10px] font-mono text-zinc-300 leading-relaxed mb-2">
                                {currentAd.desc}
                            </p>

                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 pt-1.5 border-t border-white/10">
                                <span>Official Partner</span>
                                <span className="text-cyan-300 font-bold">Synapse Society</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ── RIGHT PANEL (7 / 10 = 70%) ─────────────────────────────────── */}
                {!isLeftMaximized && (
                    <div className="lg:col-span-7 flex flex-col justify-start">
                        <StageLeaderboard currentPhase={currentPhase} />
                    </div>
                )}
            </div>
        </div>
    );
}
