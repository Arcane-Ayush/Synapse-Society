import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Users, Layers, Sparkles, Terminal } from 'lucide-react';

export function Slide07NeuralNexusIntro() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-4xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono text-xs shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                >
                    <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span>INAUGURAL FLAGSHIP EVENT • LIVE ARENA</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 tracking-tight"
                    style={{ fontFamily: 'Space Grotesk' }}
                >
                    NEURAL NEXUS 2026
                </motion.h1>

                <p className="text-sm sm:text-lg font-mono text-zinc-300 max-w-2xl mx-auto">
                    The Ultimate Algorithmic Reverse-Engineering & High-Stakes Gauntlet.
                </p>

                {/* 3 Metrics Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                    <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-1">
                            <Users size={16} /> 40 REGISTERED SQUADS
                        </div>
                        <p className="text-xs text-zinc-400">Battle-ready engineering teams competing simultaneously.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold mb-1">
                            <Layers size={16} /> 3 PROGRESSION ROUNDS
                        </div>
                        <p className="text-xs text-zinc-400">Reverse Hackathon, Dual Tracks, and Grand Final Showdown.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-yellow-500/30 backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold mb-1">
                            <Trophy size={16} /> S-COINS & XP REWARDS
                        </div>
                        <p className="text-xs text-zinc-400">Every submission converts directly into verified Synapse XP.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
