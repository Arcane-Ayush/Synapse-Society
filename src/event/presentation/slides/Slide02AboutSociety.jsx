import React from 'react';
import { motion } from 'framer-motion';
import { Network, Terminal, Code2, Users, Cpu, ShieldCheck } from 'lucide-react';

export function Slide02AboutSociety() {
    const features = [
        {
            icon: Code2,
            title: 'Production Engineering',
            desc: 'We do not build toy projects. We ship high-throughput systems, developer tools, and full-stack software directly to campus and industry users.',
            tag: 'SHIPPED TO PROD',
            color: 'from-purple-500 to-indigo-600',
            border: 'border-purple-500/40'
        },
        {
            icon: Cpu,
            title: 'Artificial Intelligence & Systems',
            desc: 'Deep exploration into transformer architectures, agentic autonomous workflows, low-latency microservices, and distributed computing.',
            tag: 'DEEP TECH',
            color: 'from-cyan-400 to-blue-600',
            border: 'border-cyan-500/40'
        },
        {
            icon: Users,
            title: 'Peer-to-Peer Elite Network',
            desc: 'A thriving community of passionate coders, competitive programmers, and designers collaborating through active peer reviews and hackathons.',
            tag: 'COMMUNITY FIRST',
            color: 'from-amber-400 to-orange-600',
            border: 'border-amber-500/40'
        }
    ];

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-5xl mx-auto w-full space-y-8">
                {/* Header Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <Network className="w-3.5 h-3.5 text-cyan-400" />
                    <span>WHO WE ARE • THE SYNAPSE MISSION</span>
                </motion.div>

                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                >
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                        BRIDGING THEORY WITH SYSTEM MASTERY
                    </h2>
                    <p className="text-sm sm:text-base font-sans text-zinc-300 max-w-2xl mx-auto">
                        Synapse Society transforms curious minds into battle-tested engineers through hands-on technical guilds and real-world execution.
                    </p>
                </motion.div>

                {/* 3 Pillar Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {features.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + idx * 0.15 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className={`p-6 rounded-3xl bg-black/50 border ${f.border} backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between h-72`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${f.color} flex items-center justify-center text-white shadow-lg`}>
                                            <Icon size={22} />
                                        </div>
                                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                                            {f.tag}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white leading-snug" style={{ fontFamily: 'Space Grotesk' }}>
                                        {f.title}
                                    </h3>

                                    <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>

                                <div className="text-[10px] font-mono text-zinc-500 pt-3 border-t border-white/10 flex items-center gap-1.5">
                                    <ShieldCheck size={12} className="text-cyan-400" />
                                    <span>SYNAPSE VERIFIED PILLAR</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
