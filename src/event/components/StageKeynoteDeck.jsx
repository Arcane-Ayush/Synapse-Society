import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Trophy, Shield, Zap, ChevronLeft, ChevronRight, Maximize2,
    Users, Flame, Award, Radio, Terminal, Cpu, Clock, CheckCircle2, FileCode, Layers
} from 'lucide-react';
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
        { id: 'opening', label: '01. OPENING', title: 'Official Event Opening Ceremony' },
        { id: 'about', label: '02. ABOUT', title: 'Synapse Society • Vision & Mission' },
        { id: 'agenda', label: '03. AGENDA', title: 'Event Structure & Rounds Overview' },
        { id: 'teams', label: '04. SQUADS', title: 'Participating Squads Matrix' },
        { id: 'round_1', label: '05. ROUND 1', title: 'Reverse Hackathon Challenge' },
        { id: 'intermission', label: '06. BREAK', title: 'Intermission & Energy Refreshment' },
        { id: 'round_2', label: '07. ROUND 2', title: 'Architecture Proposals & Redemption' },
        { id: 'finale', label: '08. FINALE', title: 'Grand Finale & Award Ceremony' }
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
            {/* Top Slide Tracker */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 px-4">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-cyan-300">
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
            <div className="my-auto py-8">
                <AnimatePresence mode="wait">
                    {/* Slide 0: Inauguration Protocol */}
                    {slideIndex === 0 && (
                        <motion.div
                            key="slide-0"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="text-center max-w-5xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest mb-6">
                                <Sparkles size={16} className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                                OFFICIAL FLAGSHIP EVENT OPENING
                            </div>

                            <h1
                                className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6"
                                style={{
                                    fontFamily: 'Space Grotesk',
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #00F0FF 40%, #A855F7 80%, #EC4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 0 50px rgba(0,240,255,0.35)'
                                }}
                            >
                                Synapse Society
                            </h1>

                            <p className="text-base sm:text-xl font-mono text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
                                Inaugural Flagship Technology Challenge • Department of Computer Science & Engineering, Chandigarh University
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
                                {[
                                    { title: 'HOD CSE', sub: 'Departmental Key', col: '#06B6D4' },
                                    { title: 'Dean Academics', sub: 'Academic Affairs Key', col: '#A855F7' },
                                    { title: 'Pro VC', sub: 'Executive Key', col: '#F59E0B' },
                                    { title: 'President', sub: 'Student Executive Key', col: '#EC4899' },
                                    { title: 'Delegates', sub: 'Live Synchronization', col: '#00F0FF' }
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

                    {/* Slide 1: About Synapse Society */}
                    {slideIndex === 1 && (
                        <motion.div
                            key="slide-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-5xl mx-auto text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/30 text-xs font-mono font-bold text-purple-300 uppercase mb-6">
                                <Cpu size={14} className="text-purple-400" />
                                STUDENT TECHNICAL GUILD
                            </div>

                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                                Engineering The Next Generation
                            </h2>

                            <p className="text-sm sm:text-base font-mono text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-10">
                                Synapse Society is Chandigarh University's premier technical community dedicated to software craftsmanship, distributed systems, algorithmic mastery, and collaborative engineering.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-4 text-cyan-400">
                                        <Terminal size={20} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1.5" style={{ fontFamily: 'Space Grotesk' }}>
                                        High-Velocity Problem Solving
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                                        Fostering rigorous analytical engineering through competitive reverse-engineering, optimization, and system design.
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center mb-4 text-purple-400">
                                        <Layers size={20} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1.5" style={{ fontFamily: 'Space Grotesk' }}>
                                        Production Architectures
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                                        Bridging foundational algorithms with industrial deployment, cloud infrastructure, and distributed computing models.
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-400/30 flex items-center justify-center mb-4 text-yellow-400">
                                        <Trophy size={20} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1.5" style={{ fontFamily: 'Space Grotesk' }}>
                                        Merit-Based Rewards
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                                        Real-time scoring and S-Coin recognition directly converted into permanent institutional portfolio credentials.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 2: Event Structure & Agenda */}
                    {slideIndex === 2 && (
                        <motion.div
                            key="slide-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <h2 className="text-3xl sm:text-5xl font-black text-white text-center mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                Event Agenda & Competition Flow
                            </h2>
                            <p className="text-xs font-mono text-cyan-300 text-center mb-8">
                                Multi-Phase Synchronized Gauntlet • Live Stage Deliberation
                            </p>

                            <div className="space-y-3">
                                {[
                                    { phase: '01', title: 'Check-In & Squad Allocation', desc: 'Scan QR at /users, claim unique Agent ID pass, align with table squad.', tag: 'Phase 0 & 1' },
                                    { phase: '02', title: 'Round 1: Reverse Hackathon', desc: 'Analyze obfuscated production codebase, identify vulnerability, re-architect and submit patch.', tag: '45 Minutes' },
                                    { phase: '03', title: 'Intermission & Mini Break', desc: 'Judge deliberation on Round 1 pitches, live score publication, short refreshment break.', tag: '15 Minutes' },
                                    { phase: '04', title: 'Round 2 & Redemption Track', desc: 'Parallel execution: Top squads draft deployment proposals while eliminated squads play Redemption Quiz.', tag: '30 Minutes' },
                                    { phase: '05', title: 'Grand Finale & Podium Honors', desc: 'Final live rankings, award presentation to champion squads, permanent profile XP conversion.', tag: 'Final Stage' },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4 backdrop-blur-xl transition-all hover:border-cyan-400/40"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <span className="text-lg font-black font-mono text-cyan-400 w-8">{item.phase}</span>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                                                    {item.title}
                                                </h4>
                                                <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300 flex-shrink-0">
                                            {item.tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 3: Participating Squads */}
                    {slideIndex === 3 && (
                        <motion.div
                            key="slide-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-6xl mx-auto text-center"
                        >
                            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                40 Competing Squads
                            </h2>
                            <p className="text-xs font-mono text-cyan-300/80 mb-6">
                                Live Database Rosters • Real-Time Registered Squad Matrix
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                                {teams.map(t => (
                                    <div
                                        key={t.id}
                                        className="p-3 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl transition-all duration-200 hover:scale-105"
                                        style={{
                                            background: `${t.color || '#00F0FF'}10`,
                                            border: `1px solid ${t.color || '#00F0FF'}44`,
                                            boxShadow: `0 0 15px ${t.color || '#00F0FF'}18`
                                        }}
                                    >
                                        <span className="text-2xl mb-1">{t.badge}</span>
                                        <span className="text-xs font-bold text-white truncate w-full" style={{ fontFamily: 'Space Grotesk' }}>
                                            {t.code}
                                        </span>
                                        <span className="text-[9px] font-mono text-zinc-400 truncate w-full mt-0.5">
                                            {(t.name || '').split('·')[1]?.trim() || t.name || ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 4: Round 1 Challenge */}
                    {slideIndex === 4 && (
                        <motion.div
                            key="slide-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 uppercase mb-6">
                                <Terminal size={14} className="text-cyan-400" />
                                ROUND 1 • REVERSE HACKATHON
                            </div>

                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                                Deconstruct & Rebuild
                            </h2>

                            <div className="p-8 rounded-3xl bg-black/60 border border-cyan-400/40 text-left space-y-4 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
                                <div className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">CHALLENGE DIRECTIVE:</div>
                                <p className="text-sm font-mono text-zinc-200 leading-relaxed">
                                    Analyze the provided obfuscated codebase. Identify the latent logical bottleneck, refactor the data structures for optimal time complexity, and submit your verified repository link.
                                </p>
                                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-4 border-t border-white/10">
                                    <span className="flex items-center gap-1.5">
                                        <Award size={14} className="text-yellow-400" />
                                        REWARD: <strong className="text-yellow-400">+500 S-COINS</strong>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-cyan-400" />
                                        TIME LIMIT: <strong>45 MINUTES</strong>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 5: Intermission */}
                    {slideIndex === 5 && (
                        <motion.div
                            key="slide-5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <div className="text-5xl sm:text-7xl font-black text-red-500 mb-4" style={{ fontFamily: 'Space Grotesk', textShadow: '0 0 50px rgba(239,68,68,0.4)' }}>
                                INTERMISSION & RECHARGE
                            </div>
                            <p className="text-base font-mono text-zinc-300 mb-8 max-w-xl mx-auto leading-relaxed">
                                15-Minute Break • Enjoy refreshments and prepare your strategy for Round 2 and the Round of Redemption!
                            </p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-300 font-mono font-bold text-sm">
                                <Flame size={18} className="text-yellow-400 animate-bounce" />
                                POWERED BY RED BULL • SYNAPSE SOCIETY
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 6: Round 2 & Redemption */}
                    {slideIndex === 6 && (
                        <motion.div
                            key="slide-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <h2 className="text-3xl sm:text-5xl font-black text-white text-center mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                                Round 2: Dual Simultaneous Tracks
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="p-8 rounded-3xl bg-cyan-950/20 border border-cyan-400/40 backdrop-blur-xl">
                                    <div className="text-xs font-mono font-bold text-cyan-300 uppercase mb-2">QUALIFIER TRACK</div>
                                    <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                                        Architecture Proposal
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-300 leading-relaxed mb-4">
                                        Qualified squads formulate a scalable deployment blueprint detailing cloud cost, latency thresholds, and observability.
                                    </p>
                                    <div className="text-xs font-mono text-yellow-400 font-bold">+1000 S-Coins Maximum Bounty</div>
                                </div>

                                <div className="p-8 rounded-3xl bg-pink-950/20 border border-pink-400/40 backdrop-blur-xl">
                                    <div className="text-xs font-mono font-bold text-pink-300 uppercase mb-2">REDEMPTION TRACK</div>
                                    <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                                        Computer Science Trivia Gauntlet
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-300 leading-relaxed mb-4">
                                        Eliminated squads answer high-speed technical questions on algorithms, operating systems, and architectures to reclaim points.
                                    </p>
                                    <div className="text-xs font-mono text-yellow-400 font-bold">+100 S-Coins per Correct Answer</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Slide 7: Finale */}
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
                            <p className="text-base font-mono text-cyan-300/90 mb-6 max-w-xl mx-auto">
                                Congratulations to all participating squads. Total earned S-Coins will be converted at a 10:1 ratio into your permanent Synapse Society Profile XP!
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
                        title={s.title}
                    />
                ))}
            </div>
        </div>
    );
}
