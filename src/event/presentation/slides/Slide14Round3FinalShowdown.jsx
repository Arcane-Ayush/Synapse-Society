import React from 'react';
import { motion } from 'framer-motion';
import { Building2, AlertTriangle, ShieldCheck, MapPin, Zap, Coins, Clock } from 'lucide-react';

export function Slide14Round3FinalShowdown() {
    const facilities = [
        { name: 'Data Centre', cost: '₹700 Cr' },
        { name: 'Hospital', cost: '₹600 Cr' },
        { name: 'Port', cost: '₹550 Cr' },
        { name: 'AI Control Centre', cost: '₹500 Cr' },
        { name: 'Industrial Zone', cost: '₹450 Cr' },
        { name: 'Residential Area', cost: '₹400 Cr' },
        { name: 'Solar Plant', cost: '₹350 Cr' },
        { name: 'Metro Route & Station', cost: '₹300 Cr' },
        { name: 'School', cost: '₹250 Cr' },
        { name: 'Police Station', cost: '₹200 Cr' },
        { name: 'Green Zones / Park', cost: '₹150 Cr' },
        { name: 'Farms & Fields', cost: '₹100 Cr' },
    ];

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 relative select-none font-mono py-4">
            <div className="max-w-5xl mx-auto w-full space-y-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-950/80 border border-yellow-500/50 text-yellow-300 text-xs shadow-[0_0_25px_rgba(234,179,8,0.4)]"
                >
                    <Building2 className="w-3.5 h-3.5 text-yellow-400" />
                    <span>FINAL ROUND • SMART CITY DESIGN</span>
                </motion.div>

                <div>
                    <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-400 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                        ROUND 3: SMART CITY DESIGN
                    </h2>
                    <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-2xl mx-auto mt-1 leading-relaxed">
                        Design a sustainable, efficient, and AI-powered smart city layout within fixed budget &amp; geographical constraints.
                    </p>
                </div>

                {/* City Brief & Constraints */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs">
                    <div className="p-2.5 rounded-xl bg-black/60 border border-yellow-500/30">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Population</span>
                        <strong className="text-white text-sm">100,000</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-yellow-500/30">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total Budget</span>
                        <strong className="text-yellow-400 text-sm">₹6,000 Cr</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-yellow-500/30">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total Area</span>
                        <strong className="text-white text-sm">25 sq km</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-yellow-500/30">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Risks &amp; Climate</span>
                        <strong className="text-red-400 text-xs">Flood &amp; Quake Risk</strong>
                    </div>
                </div>

                {/* Facility Costs Grid */}
                <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-yellow-300">
                        <span>FACILITY COSTS (Place All Facilities Logically)</span>
                        <span>20 Mins Designing</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-[11px]">
                        {facilities.map((f, idx) => (
                            <div key={idx} className="p-1.5 rounded bg-white/5 border border-white/5 flex items-center justify-between gap-1">
                                <span className="text-zinc-300 truncate">{f.name}</span>
                                <strong className="text-amber-300 flex-shrink-0">{f.cost}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Tasks */}
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-left text-xs space-y-1">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase flex items-center gap-1">
                        <MapPin size={12} /> Key Requirements
                    </span>
                    <p className="text-[11px] text-zinc-300 font-sans leading-snug">
                        • Use all given facilities within ₹6,000 Cr budget<br />
                        • Ensure sustainable energy &amp; green zone protection<br />
                        • Ensure emergency safety access &amp; justify placement of every facility on A4 map
                    </p>
                </div>
            </div>
        </div>
    );
}
