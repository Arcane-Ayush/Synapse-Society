import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ShieldAlert, Globe, Swords, Terminal, CheckCircle2 } from 'lucide-react';

export function Slide04Guilds() {
    const guilds = [
        {
            title: 'Neural AI & ML Guild',
            icon: BrainCircuit,
            focus: 'Transformer models, autonomous agents, computer vision, PyTorch, LangChain, GPU acceleration.',
            color: 'from-pink-500 to-purple-600',
            border: 'border-pink-500/40',
            badge: 'AI / ML'
        },
        {
            title: 'Systems & Cyber Guild',
            icon: ShieldAlert,
            focus: 'Reverse engineering, Linux kernel internals, cryptography, network protocols, CTF competitions.',
            color: 'from-cyan-400 to-blue-600',
            border: 'border-cyan-500/40',
            badge: 'CYBER & SYSTEMS'
        },
        {
            title: 'Full-Stack & Cloud Guild',
            icon: Globe,
            focus: 'High-scale web applications, microservices, cloud deployments, React/Next.js, Go/Rust microservices.',
            color: 'from-emerald-400 to-teal-600',
            border: 'border-emerald-500/40',
            badge: 'CLOUD DEV'
        },
        {
            title: 'Competitive Coding Guild',
            icon: Swords,
            focus: 'Advanced data structures & algorithms, dynamic programming, graph theory, Codeforces/LeetCode & ICPC.',
            color: 'from-amber-400 to-orange-600',
            border: 'border-amber-500/40',
            badge: 'DSA & ICPC'
        }
    ];

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-5xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SPECIALIZED TECHNICAL FACTIONS • JOIN YOUR GUILD</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    FOUR CORE TECHNICAL GUILDS
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {guilds.map((g, idx) => {
                        const Icon = g.icon;
                        return (
                            <motion.div
                                key={g.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + idx * 0.1 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className={`p-6 rounded-3xl bg-black/50 border ${g.border} backdrop-blur-xl relative overflow-hidden flex flex-col justify-between space-y-4`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${g.color} flex items-center justify-center text-white shadow-lg`}>
                                        <Icon size={22} />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                                        {g.badge}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                        {g.title}
                                    </h3>
                                    <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                                        {g.focus}
                                    </p>
                                </div>

                                <div className="text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 pt-2 border-t border-white/10">
                                    <CheckCircle2 size={12} className="text-emerald-400" />
                                    <span>Active Projects & Weekly Guild Sprints</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
