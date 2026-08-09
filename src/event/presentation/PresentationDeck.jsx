import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Maximize, Minimize,
    Grid, Play, Sparkles, Trophy, Radio, ArrowRight
} from 'lucide-react';
import { playEventSound } from '../lib/soundSystem';

import { Slide01Welcome } from './slides/Slide01Welcome';
import { Slide02AboutSociety } from './slides/Slide02AboutSociety';
import { Slide03Pillars } from './slides/Slide03Pillars';
import { Slide04Guilds } from './slides/Slide04Guilds';
import { Slide05Constitution } from './slides/Slide05Constitution';
import { Slide06Leadership } from './slides/Slide06Leadership';
import { Slide07NeuralNexusIntro } from './slides/Slide07NeuralNexusIntro';
import { Slide08Economy } from './slides/Slide08Economy';
import { Slide09SquadMatrix } from './slides/Slide09SquadMatrix';
import { Slide10Round1Overview } from './slides/Slide10Round1Overview';
import { Slide11LaunchRound1 } from './slides/Slide11LaunchRound1';
import { Slide12Round2DualTracks } from './slides/Slide12Round2DualTracks';
import { Slide13RoundOfRedemption } from './slides/Slide13RoundOfRedemption';
import { Slide14Round3FinalShowdown } from './slides/Slide14Round3FinalShowdown';
import { Slide15GrandFinale } from './slides/Slide15GrandFinale';

export function PresentationDeck({ onSwitchToSession }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const slides = [
        { id: 0, title: 'Welcome to Synapse', component: Slide01Welcome },
        { id: 1, title: 'About Society', component: Slide02AboutSociety },
        { id: 2, title: 'Four Pillars', component: Slide03Pillars },
        { id: 3, title: 'Technical Guilds', component: Slide04Guilds },
        { id: 4, title: 'Constitution & Charter', component: Slide05Constitution },
        { id: 5, title: 'Patron Leadership', component: Slide06Leadership },
        { id: 6, title: 'Neural Nexus Flagship', component: Slide07NeuralNexusIntro },
        { id: 7, title: 'S-Coins & XP Economy', component: Slide08Economy },
        { id: 8, title: '40 Squad Matrix', component: Slide09SquadMatrix },
        { id: 9, title: 'Round 1: Reverse Hack', component: Slide10Round1Overview },
        { id: 10, title: 'Launch Round 1', component: Slide11LaunchRound1 },
        { id: 11, title: 'Round 2: Dual Tracks', component: Slide12Round2DualTracks },
        { id: 12, title: 'Round of Redemption', component: Slide13RoundOfRedemption },
        { id: 13, title: 'Round 3: Grand Final', component: Slide14Round3FinalShowdown },
        { id: 14, title: 'Grand Finale & Outro', component: Slide15GrandFinale },
    ];

    const totalSlides = slides.length;

    const goToSlide = (idx) => {
        const target = Math.max(0, Math.min(totalSlides - 1, idx));
        setCurrentSlideIndex(target);
        playEventSound('chime');
    };

    const nextSlide = () => {
        if (currentSlideIndex < totalSlides - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        }
    };

    // Keyboard navigation listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

            if (['ArrowRight', 'ArrowDown', 'Space', 'PageDown'].includes(e.code)) {
                e.preventDefault();
                nextSlide();
            } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.code)) {
                e.preventDefault();
                prevSlide();
            } else if (e.code === 'KeyF') {
                toggleFullscreen();
            } else if (e.code === 'KeyS' && onSwitchToSession) {
                onSwitchToSession();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlideIndex]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    };

    const CurrentSlideComp = slides[currentSlideIndex].component;

    return (
        <div className="w-full relative select-none flex flex-col justify-between">
            {/* Top Keynote Controls HUD */}
            <div className="flex items-center justify-between z-30 pb-3 mb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 flex items-center gap-1.5 cursor-pointer"
                    >
                        <Grid size={13} />
                        <span>Slides ({currentSlideIndex + 1}/{totalSlides})</span>
                    </button>
                    <span className="text-xs font-mono text-cyan-300 font-bold hidden sm:inline">
                        {slides[currentSlideIndex].title}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        disabled={currentSlideIndex === 0}
                        onClick={prevSlide}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-zinc-300 cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        disabled={currentSlideIndex === totalSlides - 1}
                        onClick={nextSlide}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-zinc-300 cursor-pointer"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 cursor-pointer ml-1"
                        title="Toggle Fullscreen (F)"
                    >
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                </div>
            </div>

            {/* Slide Quick-Jump Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-12 left-0 right-0 z-50 p-4 rounded-2xl bg-black/95 border border-purple-500/40 backdrop-blur-2xl shadow-2xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-80 overflow-y-auto"
                    >
                        {slides.map((s, idx) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    goToSlide(idx);
                                    setIsDrawerOpen(false);
                                }}
                                className={`p-2.5 rounded-xl text-left font-mono text-xs cursor-pointer transition-all ${
                                    idx === currentSlideIndex
                                        ? 'bg-purple-600/40 border border-purple-400 text-white font-bold'
                                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                                }`}
                            >
                                <div className="text-[10px] text-zinc-500">0{idx + 1}</div>
                                <div className="truncate text-white">{s.title}</div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Slide Display */}
            <div className="w-full my-auto py-2 z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <CurrentSlideComp
                            onNext={nextSlide}
                            onSwitchToSession={onSwitchToSession}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Progress Bar */}
            <div className="w-full pt-4 z-20">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400"
                        animate={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
        </div>
    );
}
