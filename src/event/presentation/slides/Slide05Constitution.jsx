import React from 'react';
import { motion } from 'framer-motion';
import { Scroll, Shield, CheckCircle, Scale, Sparkles, PenTool } from 'lucide-react';

export function Slide05Constitution() {
    const clauses = [
        {
            num: '01',
            title: 'Meritocracy & Shipped Code',
            desc: 'Authority within Synapse is earned through technical contribution, verifiable commits, and mentoring—never through seniority or titles.'
        },
        {
            num: '02',
            title: 'Open Source First',
            desc: 'We contribute back to the global developer ecosystem. Our tools and solutions are shared to elevate our peers across campus.'
        },
        {
            num: '03',
            title: 'Zero Ego & Radical Transparency',
            desc: 'Constructive code reviews, honest technical critiques, and supportive mentorship form the foundation of our engineering culture.'
        },
        {
            num: '04',
            title: 'Continuous Innovation',
            desc: 'We refuse complacency. Every semester, each guild commits to architecting and shipping at least one major production product.'
        }
    ];

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-5xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/50 border border-yellow-500/40 text-yellow-300 font-mono text-xs shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                >
                    <PenTool className="w-3.5 h-3.5 text-yellow-400" />
                    <span>SOLEMN CHARTER • SYNAPSE CONSTITUTION</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    THE SYNAPSE CONSTITUTION
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {clauses.map((c, idx) => (
                        <motion.div
                            key={c.num}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + idx * 0.1 }}
                            className="p-5 rounded-2xl bg-black/60 border border-yellow-500/20 backdrop-blur-xl relative overflow-hidden space-y-2 flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-black text-yellow-400 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30">
                                    ARTICLE {c.num}
                                </span>
                                <CheckCircle size={14} className="text-emerald-400" />
                            </div>

                            <h3 className="text-base font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                {c.title}
                            </h3>

                            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                                {c.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono text-yellow-200 flex items-center justify-center gap-2">
                    <Scroll size={16} className="text-yellow-400 flex-shrink-0" />
                    <span>Signed and ratified by the Dignitaries, Faculty Mentors & Student Core of Chandigarh University.</span>
                </div>
            </div>
        </div>
    );
}
