import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Heart, Globe, ArrowRight, Zap } from 'lucide-react';
import { playEventSound } from '../../lib/soundSystem';

export function Slide15GrandFinale() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-4xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-3xl bg-yellow-500/10 border border-yellow-400/40 flex items-center justify-center mx-auto text-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.4)]"
                >
                    <Trophy size={40} className="animate-bounce" />
                </motion.div>

                <h2 className="text-4xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-cyan-300 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    SYNAPSE SOCIETY IS LIVE!
                </h2>

                <p className="text-sm sm:text-base font-sans text-zinc-300 max-w-xl mx-auto leading-relaxed">
                    Thank you to our Honorable Dignitaries, Faculty Mentors, and all 40 combatant squads. The bridge of knowledge has been forged.
                </p>

                <div className="p-5 rounded-3xl bg-black/60 border border-white/10 max-w-lg mx-auto space-y-2">
                    <div className="text-xs font-mono text-cyan-300 font-bold">
                        JOIN THE SYNAPSE TECHNICAL GUILDS
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                        Portal: synapse-society.cu • Discord & GitHub Repositories Active
                    </p>
                </div>
            </div>
        </div>
    );
}
