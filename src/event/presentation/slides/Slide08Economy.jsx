import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, Shield, Sparkles, TrendingUp, Award } from 'lucide-react';

export function Slide08Economy() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-5xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/50 border border-yellow-500/40 text-yellow-300 font-mono text-xs shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                >
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span>EVENT ECONOMY • S-COINS & XP LEDGER</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    THE S-COIN & XP REWARD PROTOCOL
                </h2>

                <div className="p-6 rounded-3xl bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-cyan-500/10 border border-yellow-400/40 backdrop-blur-2xl max-w-2xl mx-auto text-center space-y-2">
                    <div className="text-3xl sm:text-4xl font-black text-yellow-400 font-mono">
                        10 S-COINS = 1 SYNAPSE XP
                    </div>
                    <p className="text-xs font-mono text-zinc-300">
                        Every challenge completed dynamically syncs to your personal Agent Pass and permanently upgrades your Synapse Profile level.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                        <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                            <Zap size={14} /> Round 1 Bounty
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">+500 S (= 50 XP)</div>
                        <p className="text-[11px] text-zinc-400">Awarded for complete deconstruction and repository submission.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                        <div className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                            <TrendingUp size={14} /> Round 2 Bounty
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">+1000 S (= 100 XP)</div>
                        <p className="text-[11px] text-zinc-400">Awarded for system proposals and high quiz gauntlet precision.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                        <div className="text-xs font-mono font-bold text-yellow-300 flex items-center gap-1.5">
                            <Award size={14} /> Grand Final Bounty
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">+1000 S (= 100 XP)</div>
                        <p className="text-[11px] text-zinc-400">Crown honors, exclusive digital badges, and society perks.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
