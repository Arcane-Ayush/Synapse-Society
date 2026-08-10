import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Maximize, Minimize,
    Grid, Play, Sparkles, Trophy, Radio, Presentation
} from 'lucide-react';
import { playEventSound } from '../lib/soundSystem';
import { PresentationCircuitCanvas } from './components/PresentationCircuitCanvas';

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
    const [currentSlideIndex, setCurrentSlideIndex] = useState(() => {
        const saved = sessionStorage.getItem('synapse_slide_index');
        return saved !== null ? parseInt(saved, 10) : 0;
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const isWheelingRef = useRef(false);
    const wheelTimerRef = useRef(null);

    // Persist slide index whenever it changes
    useEffect(() => {
        sessionStorage.setItem('synapse_slide_index', String(currentSlideIndex));
    }, [currentSlideIndex]);

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

    const goToSlide = (idx, isKey = false) => {
        const target = Math.max(0, Math.min(totalSlides - 1, idx));
        if (target === currentSlideIndex) return;
        setDirection(target > currentSlideIndex ? 1 : -1);
        setCurrentSlideIndex(target);
        if (isKey) {
            playEventSound('thock');
        }
    };

    const nextSlide = (isKey = false) => {
        if (currentSlideIndex < totalSlides - 1) {
            setDirection(1);
            setCurrentSlideIndex(prev => prev + 1);
            if (isKey) playEventSound('thock');
        }
    };

    const prevSlide = (isKey = false) => {
        if (currentSlideIndex > 0) {
            setDirection(-1);
            setCurrentSlideIndex(prev => prev - 1);
            if (isKey) playEventSound('thock');
        }
    };

    // Keyboard navigation listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

            if (['ArrowRight', 'ArrowDown', 'Space', 'PageDown'].includes(e.code)) {
                e.preventDefault();
                nextSlide(true);
            } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.code)) {
                e.preventDefault();
                prevSlide(true);
            } else if (e.code === 'KeyS' && onSwitchToSession) {
                onSwitchToSession();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlideIndex]);

    // Natural Mouse Wheel / Trackpad Swipe Gesture (Debounced)
    const handleWheel = (e) => {
        if (isWheelingRef.current) return;
        if (Math.abs(e.deltaY) < 35) return;

        isWheelingRef.current = true;
        if (e.deltaY > 0) {
            nextSlide(true);
        } else {
            prevSlide(true);
        }

        clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = setTimeout(() => {
            isWheelingRef.current = false;
        }, 400);
    };

    const CurrentSlideComp = slides[currentSlideIndex].component;

    // Slide transition animation variants
    const slideVariants = {
        enter: (dir) => ({
            y: dir > 0 ? 30 : -30,
            opacity: 0,
            scale: 0.98,
        }),
        center: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                y: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.25 },
                scale: { duration: 0.25 }
            }
        },
        exit: (dir) => ({
            y: dir > 0 ? -30 : 30,
            opacity: 0,
            scale: 0.98,
            transition: {
                duration: 0.2
            }
        })
    };

    return (
        <div
            onWheel={handleWheel}
            className="w-full h-full flex flex-col justify-between select-none relative"
        >
            {/* Live Interactive Circuit Canvas Background */}
            <PresentationCircuitCanvas />

            {/* Top Keynote Controls HUD */}
            <div className="flex items-center justify-between z-30 pb-2 border-b border-white/10 relative">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        className="px-3 py-1 rounded-xl bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 flex items-center gap-1.5 cursor-pointer backdrop-blur-xl shadow-lg"
                    >
                        <Grid size={13} />
                        <span>Slides ({currentSlideIndex + 1}/{totalSlides})</span>
                    </button>
                    <span className="text-xs font-mono text-cyan-300 font-bold hidden sm:inline drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                        {slides[currentSlideIndex].title}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        disabled={currentSlideIndex === 0}
                        onClick={() => prevSlide(true)}
                        className="p-1.5 rounded-xl bg-black/60 hover:bg-white/10 disabled:opacity-30 text-zinc-300 cursor-pointer border border-white/10 backdrop-blur-xl"
                        title="Previous Slide (Up/Left)"
                    >
                        <ChevronLeft size={15} />
                    </button>
                    <button
                        disabled={currentSlideIndex === totalSlides - 1}
                        onClick={() => nextSlide(true)}
                        className="p-1.5 rounded-xl bg-black/60 hover:bg-white/10 disabled:opacity-30 text-zinc-300 cursor-pointer border border-white/10 backdrop-blur-xl"
                        title="Next Slide (Down/Right/Space)"
                    >
                        <ChevronRight size={15} />
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
                                    goToSlide(idx, true);
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

            {/* Center Stage: Single Active Slide (Lag-Free 60fps) */}
            <div className="w-full my-auto py-2 z-10 flex items-center justify-center min-h-[60vh]">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={currentSlideIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full flex items-center justify-center"
                    >
                        <CurrentSlideComp
                            onNext={() => nextSlide(true)}
                            onSwitchToSession={onSwitchToSession}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Progress Bar */}
            <div className="w-full pt-2 z-20">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400"
                        animate={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
                        transition={{ duration: 0.25 }}
                    />
                </div>
            </div>
        </div>
    );
}
