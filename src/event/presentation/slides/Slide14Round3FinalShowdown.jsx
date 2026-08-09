import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Sparkles, Mic2, Star, Award } from 'lucide-react';

export function Slide14Round3FinalShowdown() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-4xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-950/80 border border-yellow-500/50 text-yellow-300 font-mono text-xs shadow-[0_0_35px_rgba(234,179,8,0.5)]"
                >
                    <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
                    <span>THE GRAND ARENA • 10 FINALIST SQUADS</span>
                </motion.div>

                <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-400 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    ROUND 3: GRAND FINAL SHOWDOWN
                </h2>

                <p className="text-sm sm:text-base font-sans text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    The top 10 finalist squads (from Track A & Track B Redemption) take the stage projector to pitch and demonstrate their engineered solutions before our esteemed jury.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div className="p-5 rounded-2xl bg-black/60 border border-yellow-500/30 space-y-2">
                        <div className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5">
                            <Mic2 size={14} /> Stage Presentation
                        </div>
                        <div className="text-sm font-bold text-white font-mono">Live Stage Pitch</div>
                        <p className="text-xs text-zinc-400">Defend your architectural decisions directly before academic leaders.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-yellow-500/30 space-y-2">
                        <div className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5">
                            <Crown size={14} /> Ultimate Honors
                        </div>
                        <div className="text-sm font-bold text-white font-mono">Champion Trophies</div>
                        <p className="text-xs text-zinc-400">Championship medals, certificates, and foundational society roles.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-yellow-500/30 space-y-2">
                        <div className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5">
                            <Award size={14} /> Maximum XP
                        </div>
                        <div className="text-sm font-bold text-white font-mono">+1000 S-Coins</div>
                        <p className="text-xs text-zinc-400">Massive S-Coins bonus permanently recorded on your Agent ID ledger.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
