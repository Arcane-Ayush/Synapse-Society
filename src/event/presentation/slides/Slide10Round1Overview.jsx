import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Award, CheckCircle2, ArrowRight, Lightbulb, Clock, Target, Layers } from 'lucide-react';

export function Slide10Round1Overview() {
    const domains = [
        'Healthcare', 'Transport', 'Agriculture', 'Education',
        'Cybersecurity', 'Waste Management', 'Tourism', 'Public Safety'
    ];

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none font-mono py-4">
            <div className="max-w-4xl mx-auto w-full space-y-5">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ROUND 1 • PROBLEM DISCOVERY</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    ROUND 1: PROBLEM DISCOVERY
                </h2>

                <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    Identify a real-world problem within your assigned domain, justify why it matters, and pitch how AI fits in as the core solution.
                </p>

                {/* 8 Domains Grid */}
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto py-1">
                    {domains.map(d => (
                        <span key={d} className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-bold shadow-md">
                            🎯 {d}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
                    <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-1.5">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                            <Clock size={12} /> Format & Timing
                        </span>
                        <div className="text-sm font-bold text-white">10 Mins Prep • 60s Pitch</div>
                        <p className="text-[11px] text-zinc-400 font-sans">60 seconds live pitch per team on stage.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 space-y-1.5">
                        <span className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1">
                            <Award size={12} /> Scoring (30 Pts)
                        </span>
                        <div className="text-sm font-bold text-white">Rubric Breakdown</div>
                        <p className="text-[11px] text-zinc-400 font-sans">Problem (10) • Originality (5) • Feasibility (10) • Creativity (5).</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                            <Target size={12} /> Advancement
                        </span>
                        <div className="text-sm font-bold text-white">Top 16 Teams</div>
                        <p className="text-[11px] text-zinc-400 font-sans">2 top teams from each domain advance to Round 2!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
