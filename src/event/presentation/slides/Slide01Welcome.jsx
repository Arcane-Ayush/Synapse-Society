import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { playEventSound } from '../../lib/soundSystem';

export function Slide01Welcome({ onNext }) {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            {/* Ambient Backlight */}
            <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/25 via-cyan-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6"
            >
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-xs shadow-[0_0_25px_rgba(168,85,247,0.35)] backdrop-blur-xl"
                >
                    <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>PREMIER STUDENT TECH & AI SOCIETY • CHANDIGARH UNIVERSITY</span>
                </motion.div>

                {/* Main Hero Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-cyan-300 tracking-tight leading-none"
                    style={{ fontFamily: 'Space Grotesk' }}
                >
                    SYNAPSE SOCIETY
                </motion.h1>

                {/* Subtitle Sanskrit Motto */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    className="flex flex-col items-center gap-1"
                >
                    <span className="text-xl sm:text-3xl font-extrabold text-purple-300 tracking-[0.25em]" style={{ fontFamily: 'Space Grotesk' }}>
                        ज्ञानस्य सेतु
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-cyan-300 tracking-[0.35em] uppercase">
                        THE BRIDGE OF KNOWLEDGE
                    </span>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans"
                >
                    Empowering student innovators, artificial intelligence pioneers, systems developers, and competitive engineers to architect the next era of technology.
                </motion.p>

                {/* Start Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.75 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playEventSound('chime');
                        if (onNext) onNext();
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-mono text-xs font-black tracking-widest uppercase cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-2"
                >
                    <span>Begin Keynote Presentation</span>
                    <ArrowRight size={16} />
                </motion.button>
            </motion.div>
        </div>
    );
}
