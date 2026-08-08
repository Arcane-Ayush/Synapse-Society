import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Shield, Zap, ChevronLeft, ChevronRight, Maximize2, Users, Flame, Award, Radio, Terminal, Cpu } from 'lucide-react';
import { fetchEventTeamsFromDb } from '../lib/eventState';

export function StageKeynoteDeck({ currentPhase, onSelectPhase }) {
    const [slideIndex, setSlideIndex] = useState(0);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchEventTeamsFromDb().then(dbTeams => {
            if (dbTeams && dbTeams.length > 0) setTeams(dbTeams);
        });
    }, []);

    const slides = [
        { id: 'inauguration_bar', label: '01. INAUGURATION', title: 'Inauguration Power Matrix' },
        { id: 'splash', label: '02. REVEAL', title: 'Neural Nexus • Mainframe Reveal' },
        { id: 'intro_roadmap', label: '03. ROADMAP', title: 'Synapse Society • Season 1 Vision' },
        { id: 'team_showcase', label: '04. SQUADS', title: '40 Squads • Holographic Faction Grid' },
        { id: 'round_1_hackathon', label: '05. ROUND 1', title: 'Reverse Hackathon Arena' },
        { id: 'redbull_break', label: '06. BREAK', title: 'Red Bull Energy Break' },
        { id: 'round_2_redemption', label: '07. ROUND 2', title: 'Qualifiers & Redemption Arena' },
        { id: 'finale', label: '08. FINALE', title: 'Grand Finale • Champion Podium' }
    ];

    const nextSlide = () => setSlideIndex(prev => (prev + 1) % slides.length);
    const prevSlide = () => setSlideIndex(prev => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="w-full min-h-[640px] flex flex-col justify-between relative select-none">
            {/* Top Minimal Slide Tracker */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 px-4">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-cyan-300">
                        {slides[slideIndex]?.label} • {slides[slideIndex]?.title}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={prevSlide}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-xs cursor-pointer transition-colors"
                    >
                        ← Prev
                    </button>
                    <button
                        onClick={nextSlide}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold cursor-pointer transition-colors border border-cyan-400/30"
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* Slide Body Container */}
            <div className="my-auto py-10">
                <AnimatePresence mode="wait">
                    {/* Slide 0: Inauguration Bar */}
                    {slideIndex === 0 && (
                        <motion.div
                            key="slide-0"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-center max-w-5xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono font-black text-cyan-300 uppercase tracking-widest mb-8 shadow-[0_0_30px_rgba(0,240,255,0.25)]">
                                <Sparkles size={16} className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                                CEREMONIAL INAUGURATION PROTOCOL
                            </div>

                            <h1
                                className="text-6xl sm:text-8xl font-black tracking-tight mb-6"
                                style={{
                                    fontFamily: 'Space Grotesk',
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #00F0FF 40%, #A855F7 80%, #EC4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 0 60px rgba(0,240,255,0.4)'
                                }}
                            >
                                Neural Nexus 2026
                            </h1>

                            <p className="text-lg sm:text-xl font-mono text-cyan-200/80 max-w-3xl mx-auto leading-relaxed mb-10">
                                Official dignitary key activation & live audience arc reactor synchronization at Chandigarh University.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
                                {[
                                    { title: 'HOD CSE', sub: 'Dept Key', col: '#06B6D4' },
                                    { title: 'Dean Academic', sub: 'Affairs Key', col: '#A855F7' },
                                    { title: 'Pro VC', sub: 'Executive Key', col: '#F59E0B' },
                                    { title: 'President', sub: 'Student Key', col: '#EC4899' },
                                    { title: 'Audience', sub: 'Arc Reactor', col: '#00F0FF' }
                                ].map((k, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-2xl backdrop-blur-xl border flex flex-col items-center justify-center text-center"
                                        style={{ background: `${k.col}10`, borderColor: `${k.col}40` }}
                                    >
                                        <span className="w-2 h-2 rounded-full mb-2 animate-ping" style={{ background: k.col }} />
                                        <div className="text-xs font-black text-white font-mono">{k.title}</div>
                                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{k.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 1: Cinematic Splash Screen */}
                    {slideIndex === 1 && (
                        <motion.div
                            key="slide-1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center py-8"
                        >
                            <div className="relative inline-block mb-4">
                                <div className="text-7xl sm:text-9xl font-black tracking-tighter" style={{
                                    fontFamily: 'Space Grotesk',
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #00F0FF 35%, #A855F7 70%, #F43F5E 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 60px rgba(0,240,255,0.6))'
                                }}>
                                    NEURAL NEXUS
                                </div>
                                <div className="text-sm sm:text-lg font-mono uppercase tracking-[0.6em] text-cyan-300 mt-3 font-bold">
                                    THE FUTURE OF DECENTRALIZED COMPUTING
                                </div>
                            </div>
                            <p className="text-sm font-mono text-purple-200/60 max-w-xl mx-auto">
                                Season 1 Flagship Event • Seminar Hall Block E
                            </p>
                        </motion.div>
                    )}

                    {/* Slide 2: Season 1 Vision & Roadmap */}
                    {slideIndex === 2 && (
                        <motion.div
                            key="slide-2"
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -25 }}
                            className="max-w-5xl mx-auto"
                        >
                            <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-10" style={{ fontFamily: 'Space Grotesk' }}>
                                Season 1 Architecture & Vision
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-8 rounded-3xl bg-black/50 border border-purple-500/30 text-center backdrop-blur-xl">
                                    <Cpu size={40} className="text-purple-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                        Decentralized Guilds
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                                        40 squads competing in high-velocity reverse engineering and parallel algorithmic problem solving.
                                    </p>
                                </div>

                                <div className="p-8 rounded-3xl bg-black/50 border border-cyan-500/30 text-center backdrop-blur-xl">
                                    <Shield size={40} className="text-cyan-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                        S-Coin Economy
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                                        Instant on-chain quest bounties with a 10:1 conversion rate into permanent Synapse XP profiles.
                                    </p>
                                </div>

                                <div className="p-8 rounded-3xl bg-black/50 border border-pink-500/30 text-center backdrop-blur-xl">
                                    <Trophy size={40} className="text-pink-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                        The Redemption Arena
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                                        Zero dead ends. Knockout recovery mechanics allow eliminated squads to reclaim points via live trivia.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 3: 40 Squads Card-Lock Matrix */}
                    {slideIndex === 3 && (
                        <motion.div
                            key="slide-3"
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -25 }}
                            className="max-w-6xl mx-auto text-center"
                        >
                            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                                40 Squads • Holographic Faction Grid
                            </h2>
                            <p className="text-xs font-mono text-cyan-300/80 mb-8">
                                Database-connected rosters • Real-time card locks synchronized across the hall
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                                {teams.map(t => (
                                    <div
                                        key={t.id}
                                        className="p-3 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl transition-all duration-300 hover:scale-105"
                                        style={{
                                            background: `${t.color || '#00F0FF'}10`,
                                            border: `1px solid ${t.color || '#00F0FF'}44`,
                                            boxShadow: `0 0 20px ${t.color || '#00F0FF'}22`
                                        }}
                                    >
                                        <span className="text-2xl mb-1">{t.badge}</span>
                                        <span className="text-xs font-bold text-white truncate w-full" style={{ fontFamily: 'Space Grotesk' }}>
                                            {t.code}
                                        </span>
                                        <span className="text-[9px] font-mono text-zinc-400 truncate w-full mt-0.5">
                                            {t.name.split('·')[1]?.trim() || t.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 4: Round 1 Reverse Hackathon */}
                    {slideIndex === 4 && (
                        <motion.div
                            key="slide-4"
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -25 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 uppercase mb-6">
                                <Terminal size={14} className="text-cyan-400" />
                                ROUND 1 • REVERSE HACKATHON ARENA
                            </div>

                            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                                Deconstruct & Rebuild
                            </h2>

                            <div className="p-8 rounded-3xl bg-black/60 border border-cyan-400/40 text-left space-y-4 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                                <div className="text-cyan-300 font-mono text-sm font-bold">CHALLENGE DIRECTIVE:</div>
                                <p className="text-sm font-mono text-zinc-300 leading-relaxed">
                                    Analyze the obfuscated graph traversal module. Isolate the race condition, re-architect the async pipeline, and submit your patched repository link.
                                </p>
                                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-3 border-t border-white/10">
                                    <span>BOUNTY: <strong className="text-yellow-400">+500 S-COINS</strong></span>
                                    <span>TIME CAP: <strong>45 MINUTES</strong></span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 5: Red Bull Break */}
                    {slideIndex === 5 && (
                        <motion.div
                            key="slide-5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <div className="text-6xl sm:text-8xl font-black text-red-500 mb-4" style={{ fontFamily: 'Space Grotesk', textShadow: '0 0 60px rgba(239,68,68,0.5)' }}>
                                RED BULL BREAK
                            </div>
                            <p className="text-base font-mono text-zinc-300 mb-8 max-w-xl mx-auto">
                                15 Minutes Intermission • Recharge your neural cores for Round 2 and The Redemption Arena!
                            </p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-300 font-mono font-bold text-sm">
                                <Flame size={18} className="text-yellow-400 animate-bounce" />
                                GIVES YOU WINGS • SYNAPSE SOCIETY
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 6: Round 2 & Redemption */}
                    {slideIndex === 6 && (
                        <motion.div
                            key="slide-6"
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -25 }}
                            className="max-w-5xl mx-auto"
                        >
                            <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                                Round 2: Proposals vs The Redemption Arena
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-3xl bg-cyan-950/20 border border-cyan-400/40 backdrop-blur-xl">
                                    <div className="text-xs font-mono font-bold text-cyan-300 uppercase mb-2">QUALIFIER TRACK</div>
                                    <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                                        Architecture Proposal
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-300 leading-relaxed mb-4">
                                        Qualified squads draft comprehensive deployment architecture with cloud cost & latency metrics.
                                    </p>
                                    <span className="text-xs font-mono text-yellow-400 font-bold">+1000 S-Coins Bounty</span>
                                </div>

                                <div className="p-8 rounded-3xl bg-pink-950/20 border border-pink-400/40 backdrop-blur-xl">
                                    <div className="text-xs font-mono font-bold text-pink-300 uppercase mb-2">REDEMPTION TRACK</div>
                                    <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                                        Cyber Trivia Gauntlet
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-300 leading-relaxed mb-4">
                                        Eliminated squads answer high-speed CS/AI questions to reclaim points back to their ledger.
                                    </p>
                                    <span className="text-xs font-mono text-yellow-400 font-bold">+100 S-Coins per Correct Question</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 7: Finale Podium */}
                    {slideIndex === 7 && (
                        <motion.div
                            key="slide-7"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <Trophy size={64} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-5xl sm:text-7xl font-black text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                                Grand Champions
                            </h2>
                            <p className="text-base font-mono text-cyan-300/80 mb-6">
                                Neural Nexus 2026 • Top Factions Ascend to the Hall of Fame
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Dots */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setSlideIndex(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                            slideIndex === i ? 'w-10 bg-cyan-400 shadow-[0_0_15px_#00F0FF]' : 'w-2.5 bg-white/20 hover:bg-white/40'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
