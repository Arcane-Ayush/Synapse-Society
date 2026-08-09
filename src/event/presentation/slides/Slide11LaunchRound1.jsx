import React from 'react';
import { motion } from 'framer-motion';
import { Play, Terminal, Zap, ExternalLink, Sparkles } from 'lucide-react';
import { playEventSound } from '../../lib/soundSystem';

export function Slide11LaunchRound1({ onSwitchToSession }) {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-3xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_50px_rgba(0,240,255,0.4)]"
                >
                    <Terminal size={36} className="animate-pulse" />
                </motion.div>

                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    READY TO DECONSTRUCT?
                </h2>

                <p className="text-sm sm:text-base font-mono text-zinc-300 max-w-xl mx-auto">
                    All 40 squads: open your repository terminals and lock into your problem statements.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            playEventSound('fanfare');
                            if (onSwitchToSession) onSwitchToSession();
                        }}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono text-xs font-black tracking-widest uppercase cursor-pointer shadow-[0_0_35px_rgba(0,240,255,0.6)] flex items-center gap-2"
                    >
                        <Play size={16} fill="black" />
                        <span>Launch Round 1 Session Screen</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
