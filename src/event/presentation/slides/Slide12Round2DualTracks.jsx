import React from 'react';
import { motion } from 'framer-motion';
import { Split, Award, Shield, FileText, CheckCircle2, Layout, Smartphone } from 'lucide-react';

export function Slide12Round2DualTracks() {
    const apps = ['Instagram', 'Snapchat', 'Spotify', 'Netflix', 'LinkedIn', 'Zomato', 'Pinterest', 'Nykaa'];

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none font-mono">
            <div className="max-w-4xl mx-auto w-full space-y-5">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-400/40 text-purple-300 text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                    <span>ROUND 2 • PRODUCT INNOVATION & APP REIMAGINATION</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    ROUND 2: PRODUCT INNOVATION
                </h2>

                <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    Identify a major user pain point in your assigned application and propose an innovative AI feature or UI/UX improvement.
                </p>

                {/* Assigned Apps Pill List */}
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto py-1">
                    {apps.map(app => (
                        <span key={app} className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-bold shadow-md">
                            📱 {app}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                            <FileText size={12} /> Submission Format
                        </span>
                        <div className="text-sm font-bold text-white">One-Page Concept Sheet</div>
                        <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                            1. Target User Problem • 2. New Feature Name • 3. Concept Description & Wireframe sketch.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                            <Award size={12} /> Time & Progression
                        </span>
                        <div className="text-sm font-bold text-white">15 Minutes • Top 8 Advance</div>
                        <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                            Top 8 teams advance directly to Round 3 (+ 2 wildcard entries from Redemption Round).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
