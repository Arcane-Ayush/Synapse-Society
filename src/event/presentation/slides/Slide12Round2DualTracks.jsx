import React from 'react';
import { motion } from 'framer-motion';
import { Split, Award, Shield, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export function Slide12Round2DualTracks() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-4xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-400/40 text-purple-300 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <Split className="w-3.5 h-3.5 text-purple-400" />
                    <span>CHALLENGE 02 • THE DUAL TRACK SPLIT</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    ROUND 2: DUAL TRACKS
                </h2>

                <p className="text-sm sm:text-base font-sans text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    The tournament diverges into two concurrent battle tracks designed to test deployment readiness and algorithmic depth.
                </p>

                <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 backdrop-blur-2xl text-left space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                TRACK A: 16 QUALIFIERS PROPOSAL GAUNTLET
                            </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-yellow-300 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                            +1000 S-Coins
                        </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        The top 16 qualifying squads from Round 1 draft a complete deployment proposal, microservice topology, and latency optimization roadmap for the reverse-engineered system.
                    </p>

                    <div className="text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 pt-2 border-t border-white/10">
                        <CheckCircle2 size={13} />
                        <span>Top squads from Track A directly qualify for the Round 3 Stage Finale.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
