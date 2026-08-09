import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lightbulb, Crown, HeartHandshake, Sparkles, ArrowRight, Activity } from 'lucide-react';
import { playEventSound } from '../../lib/soundSystem';

export function Slide03Pillars() {
    const [activeNode, setActiveNode] = useState(0);

    const pillars = [
        {
            id: 0,
            title: 'KNOWLEDGE',
            subtitle: 'Continuous Technical Learning',
            desc: 'Mastering algorithm design, machine learning models, system architecture, and cutting-edge software development methodologies at Chandigarh University.',
            icon: BookOpen,
            color: 'from-purple-500 via-indigo-500 to-purple-700',
            borderColor: 'border-purple-500/50',
            glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
            textColor: 'text-purple-400',
            stat: '100% Mastery Track',
        },
        {
            id: 1,
            title: 'INNOVATION',
            subtitle: 'Building Without Boundaries',
            desc: 'Transforming wild hackathon concepts into production products, open-source libraries, AI agents, and patent-ready tech solutions.',
            icon: Lightbulb,
            color: 'from-cyan-400 via-blue-500 to-cyan-600',
            borderColor: 'border-cyan-500/50',
            glowColor: 'shadow-[0_0_30px_rgba(34,211,238,0.4)]',
            textColor: 'text-cyan-400',
            stat: '7+ Production Shipped',
        },
        {
            id: 2,
            title: 'LEADERSHIP',
            subtitle: 'Empowering Future Founders',
            desc: 'Cultivating engineering managers, team leads, and visionary tech founders ready to lead high-impact engineering squads worldwide.',
            icon: Crown,
            color: 'from-amber-400 via-orange-500 to-amber-600',
            borderColor: 'border-amber-500/50',
            glowColor: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]',
            textColor: 'text-amber-400',
            stat: '15+ Active Leads',
        },
        {
            id: 3,
            title: 'IMPACT',
            subtitle: 'Societal & Campus Growth',
            desc: 'Creating software that simplifies student life, solves real societal challenges, and elevates career trajectories for everyone in the society.',
            icon: HeartHandshake,
            color: 'from-pink-500 via-rose-500 to-purple-600',
            borderColor: 'border-pink-500/50',
            glowColor: 'shadow-[0_0_30px_rgba(236,72,153,0.4)]',
            textColor: 'text-pink-400',
            stat: '5+ Annual Events',
        },
    ];

    const currentPillar = pillars[activeNode];
    const IconComp = currentPillar.icon;

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-5xl mx-auto w-full space-y-6">
                {/* Header Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>FOUNDATIONAL BEDROCK • FOUR PILLARS</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    OUR FOUR PILLARS OF EXCELLENCE
                </h2>

                {/* 4 Clickable Pillar Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pillars.map((node) => {
                        const NodeIcon = node.icon;
                        const isActive = activeNode === node.id;
                        return (
                            <motion.button
                                key={node.id}
                                onClick={() => {
                                    playEventSound('chime');
                                    setActiveNode(node.id);
                                }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                whileTap={{ scale: 0.97 }}
                                className={`p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-36 ${
                                    isActive
                                        ? `bg-purple-950/80 ${node.borderColor} ${node.glowColor} border-2`
                                        : 'bg-black/40 border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${node.color} flex items-center justify-center text-white`}>
                                        <NodeIcon size={18} />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-400 font-bold">0{node.id + 1}</span>
                                </div>
                                <div>
                                    <div className={`text-sm font-black ${node.textColor}`} style={{ fontFamily: 'Space Grotesk' }}>
                                        {node.title}
                                    </div>
                                    <div className="text-[10px] font-mono text-zinc-400 truncate">{node.stat}</div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Detailed Inspector Panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPillar.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className={`p-6 sm:p-8 rounded-3xl bg-black/60 border ${currentPillar.borderColor} backdrop-blur-2xl text-left relative overflow-hidden shadow-2xl`}
                    >
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentPillar.color}`} />
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono font-bold text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                                {currentPillar.subtitle}
                            </span>
                            <span className="text-xs font-mono text-zinc-400 font-bold">{currentPillar.stat}</span>
                        </div>
                        <h3 className={`text-2xl font-black text-white mb-2`} style={{ fontFamily: 'Space Grotesk' }}>
                            {currentPillar.title} PILLAR
                        </h3>
                        <p className="text-sm font-sans text-zinc-300 leading-relaxed max-w-3xl">
                            {currentPillar.desc}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
