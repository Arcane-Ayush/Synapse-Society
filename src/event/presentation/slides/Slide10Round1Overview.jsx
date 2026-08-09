import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Award, CheckCircle2, ArrowRight, Code } from 'lucide-react';

export function Slide10Round1Overview() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-4xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-mono text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CHALLENGE 01 • DECONSTRUCT & REBUILD</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    ROUND 1: REVERSE HACKATHON
                </h2>

                <p className="text-sm sm:text-base font-sans text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    You are provided with an obfuscated neural algorithm repository containing structural bugs and security vulnerabilities. Deconstruct the logic, repair the architecture, and push your GitHub solution.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Max Reward</span>
                        <div className="text-xl font-bold font-mono text-white">+500 S-Coins</div>
                        <p className="text-xs text-zinc-400">Equivalent to +50 Synapse XP for each team member.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Time Limit</span>
                        <div className="text-xl font-bold font-mono text-white">45:00 Minutes</div>
                        <p className="text-xs text-zinc-400">Live countdown on the main auditorium stage screen.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Progression</span>
                        <div className="text-xl font-bold font-mono text-white">Top 16 Qualify</div>
                        <p className="text-xs text-zinc-400">Top 16 squads directly advance to Round 2 Track A!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
