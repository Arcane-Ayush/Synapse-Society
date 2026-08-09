import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ShieldCheck, Award, Lock, Unlock, X, Sparkles, UserCheck, Cpu, Layers, Video, Palette, FileText, Megaphone } from 'lucide-react';

export function Slide06Leadership() {
    // President card (index 0) unlocked by default, others locked
    const [unlockedCards, setUnlockedCards] = useState({ 0: true });
    const [expandedMember, setExpandedMember] = useState(null);

    const teamMembers = [
        {
            title: 'SOCIETY PRESIDENT',
            name: 'Pragya Shukla',
            role: 'President & Executive Director',
            desc: 'Directing strategic vision, tech architecture, department execution, and university hackathons.',
            image: '/leadership/pragya-shukla-president.png',
            icon: Crown,
            color: 'from-amber-400 to-yellow-500',
            borderColor: 'border-amber-400/60',
            bgGlow: 'rgba(251,191,36,0.2)'
        },
        {
            title: 'VICE PRESIDENT',
            name: 'Ankit Kumar Mishra',
            role: 'Vice President & Executive Lead',
            desc: 'Overseeing operational execution, technical divisions, and strategic member initiatives.',
            image: '/leadership/ankit-kumar-mishra-vice-president.jpg',
            icon: ShieldCheck,
            color: 'from-indigo-400 to-blue-600',
            borderColor: 'border-indigo-400/60',
            bgGlow: 'rgba(99,102,241,0.2)'
        },
        {
            title: 'TREASURER',
            name: 'Paras Tiwari',
            role: 'Treasury & Finance Director',
            desc: 'Managing financial allocations, event budgets, and hackathon prize logistics.',
            image: '/leadership/treasurer.png',
            icon: Award,
            color: 'from-emerald-400 to-green-600',
            borderColor: 'border-emerald-400/60',
            bgGlow: 'rgba(52,211,153,0.2)'
        },
        {
            title: 'TECH HEAD',
            name: 'Ayush Kumar Singh',
            role: 'Head of Engineering & Systems',
            desc: 'Architecting full-stack event infrastructure, real-time engines, and member web portals.',
            image: '/leadership/ayush-kumar-singh-tech-head.jpg',
            icon: Cpu,
            color: 'from-cyan-400 to-blue-500',
            borderColor: 'border-cyan-400/60',
            bgGlow: 'rgba(34,211,238,0.2)'
        },
        {
            title: 'PROJECT SUPERVISOR',
            name: 'Vansh Kumar Chandel',
            role: 'Project Supervisor & Systems Lead',
            desc: 'Supervising open-source software projects, code audits, and repository quality standards.',
            image: '/leadership/vansh-kumar-chandel.jpg',
            icon: Layers,
            color: 'from-purple-400 to-indigo-500',
            borderColor: 'border-purple-400/60',
            bgGlow: 'rgba(168,85,247,0.2)'
        },
        {
            title: 'MEDIA HEAD',
            name: 'Vaishnavi Srivastava',
            role: 'Head of Media & Production',
            desc: 'Directing video production, stage motion graphics, and event media broadcasting.',
            image: '/leadership/vaishnavi-srivastava-media-head.png',
            icon: Video,
            color: 'from-pink-400 to-rose-500',
            borderColor: 'border-pink-400/60',
            bgGlow: 'rgba(244,63,94,0.2)'
        },
        {
            title: 'DESIGN HEAD',
            name: 'Kishan Verma',
            role: 'Head of Visual & UI/UX Design',
            desc: 'Crafting brand aesthetics, visual identities, design systems, and UI components.',
            image: '/leadership/kishan-verma-design-head.jpg',
            icon: Palette,
            color: 'from-amber-400 to-orange-500',
            borderColor: 'border-amber-400/60',
            bgGlow: 'rgba(251,146,60,0.2)'
        },
        {
            title: 'CONTENT HEAD',
            name: 'Vaishnavi Gupta',
            role: 'Head of Technical Content',
            desc: 'Authoring hackathon briefs, technical documentation, and event workshop guides.',
            image: '/leadership/vaishnavi-gupta-content-head.png',
            icon: FileText,
            color: 'from-emerald-400 to-teal-500',
            borderColor: 'border-emerald-400/60',
            bgGlow: 'rgba(45,212,191,0.2)'
        },
        {
            title: 'PR & OUTREACH HEAD',
            name: 'Prateek Kumar',
            role: 'Head of PR & Public Relations',
            desc: 'Managing university outreach, external partnerships, and speaker invitations.',
            image: '/leadership/prateek-kumar-pr-head.jpg',
            icon: Megaphone,
            color: 'from-blue-400 to-indigo-500',
            borderColor: 'border-blue-400/60',
            bgGlow: 'rgba(96,165,250,0.2)'
        }
    ];

    const handleCardClick = (idx, member) => {
        if (!unlockedCards[idx]) {
            // Unlock with 3D flip animation
            setUnlockedCards(prev => ({ ...prev, [idx]: true }));
        } else {
            // Unlocked -> Expand 3D element overlay
            setExpandedMember(member);
        }
    };

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 relative select-none font-mono py-8">
            <div className="max-w-6xl mx-auto w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SYNAPSE LEADERSHIP MATRIX • MEMBER INTRO</span>
                </motion.div>

                <div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                        EXECUTIVE & DEPARTMENT LEADERSHIP
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto mt-2">
                        President card is unlocked. Tap any locked card to trigger 3D Flip Unlock, then tap again to inspect full 3D Profile.
                    </p>
                </div>

                {/* Member Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                    {teamMembers.map((m, idx) => {
                        const Icon = m.icon;
                        const isUnlocked = unlockedCards[idx];

                        return (
                            <motion.div
                                key={m.name}
                                onClick={() => handleCardClick(idx, m)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className={`relative rounded-2xl p-4 border cursor-pointer backdrop-blur-xl transition-all duration-500 min-h-[160px] flex flex-col justify-between overflow-hidden group ${
                                    isUnlocked
                                        ? `${m.borderColor} bg-black/60 shadow-[0_0_25px_rgba(0,0,0,0.5)]`
                                        : 'border-white/10 bg-zinc-950/80 hover:border-purple-500/40'
                                }`}
                                style={{
                                    perspective: 1000
                                }}
                            >
                                <motion.div
                                    animate={{ rotateY: isUnlocked ? 0 : 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full h-full flex flex-col justify-between"
                                >
                                    {!isUnlocked ? (
                                        /* LOCKED CARD FRONT */
                                        <div className="flex flex-col items-center justify-center text-center my-auto py-6 space-y-2">
                                            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
                                                <Lock size={20} />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase">
                                                {m.title}
                                            </span>
                                            <span className="text-xs text-purple-300 font-bold">
                                                Click to Unlock Card
                                            </span>
                                        </div>
                                    ) : (
                                        /* UNLOCKED CARD BACK */
                                        <>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${m.color} flex items-center justify-center text-white shadow-md`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] font-mono font-bold text-cyan-300 tracking-wider">
                                                            {m.title}
                                                        </div>
                                                        <h3 className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
                                                            {m.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <Unlock size={14} className="text-emerald-400 flex-shrink-0" />
                                            </div>

                                            <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 font-sans">
                                                {m.desc}
                                            </p>

                                            <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-purple-300">
                                                <span>Tap for 3D Profile</span>
                                                <span className="text-cyan-400 font-bold">UNLOCKED</span>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 3D EXPANDED MEMBER MODAL OVERLAY */}
            <AnimatePresence>
                {expandedMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0, rotateX: 15 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.85, opacity: 0, rotateX: -15 }}
                            transition={{ type: 'spring', damping: 20 }}
                            className={`w-full max-w-lg p-6 rounded-3xl bg-zinc-950 border-2 ${expandedMember.borderColor} shadow-[0_0_50px_rgba(0,0,0,0.9)] relative space-y-4 text-left overflow-hidden`}
                        >
                            {/* Background Glow */}
                            <div
                                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                                style={{ background: expandedMember.bgGlow }}
                            />

                            <button
                                onClick={() => setExpandedMember(null)}
                                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-20"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                                <div className="w-28 h-36 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-purple-950 flex-shrink-0">
                                    <img
                                        src={expandedMember.image}
                                        alt={expandedMember.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-bold">
                                        {expandedMember.title}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                        {expandedMember.name}
                                    </h3>
                                    <p className="text-xs font-mono text-amber-300 font-bold">
                                        {expandedMember.role}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5 text-xs text-zinc-300 leading-relaxed font-sans relative z-10">
                                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Executive Scope</span>
                                <p>{expandedMember.desc}</p>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold border-t border-white/10 relative z-10">
                                <span>SYNAPSE LEADERSHIP 2026</span>
                                <span>VERIFIED EXECUTIVE</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
