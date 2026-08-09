import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Trophy, HelpCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export function Slide13RoundOfRedemption() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-4xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 font-mono text-xs shadow-[0_0_35px_rgba(236,72,153,0.5)]"
                >
                    <Flame className="w-4 h-4 text-pink-400 animate-bounce" />
                    <span>THE SECRET COMEBACK • TRACK B REVEAL</span>
                </motion.div>

                <h2 className="text-3xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-yellow-300 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    ROUND OF REDEMPTION
                </h2>

                <p className="text-sm sm:text-base font-sans text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    Knocked out in Round 1? <strong className="text-pink-300">Don't be disheartened — the battle isn't over.</strong>
                </p>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-950/40 via-black/80 to-purple-950/40 border border-pink-500/40 backdrop-blur-2xl text-left space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="text-pink-400" size={22} />
                            <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                THE CYBER QUIZ GAUNTLET
                            </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-yellow-300 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                            Reclaim S-Coins & XP
                        </span>
                    </div>

                    <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                        All remaining squads enter the high-speed Cyber Quiz protocol directly on their phones. Answer system-level challenges, earn back critical S-Coins, and the highest-scoring redemption squads <strong className="text-yellow-300">steal tickets directly into the Round 3 Grand Final!</strong>
                    </p>

                    <div className="p-3.5 rounded-2xl bg-black/60 border border-pink-500/20 text-xs font-mono text-pink-200 flex items-center justify-between">
                        <span>🔥 Top Redemption Teams Advance to Grand Final</span>
                        <span className="font-bold text-yellow-400">+100 S-Coins / Correct Answer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
