import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Award, Shield, Sparkles, Building2, UserCheck } from 'lucide-react';

export function Slide06Leadership() {
    const leaders = [
        {
            role: 'Chief Patron',
            title: 'Honorable President',
            desc: 'Visionary mentorship guiding Synapse Society as the flagship technical forum at Chandigarh University.',
            icon: Crown,
            color: 'from-amber-400 to-yellow-600',
            border: 'border-yellow-500/40'
        },
        {
            role: 'Patron',
            title: 'Pro-Vice Chancellor',
            desc: 'Inspiring academic excellence, research integration, and industry-readiness across computing guilds.',
            icon: Award,
            color: 'from-purple-500 to-indigo-600',
            border: 'border-purple-500/40'
        },
        {
            role: 'Faculty Mentor',
            title: 'Dean & Head of Department (CSE)',
            desc: 'Nurturing technical infrastructure, lab resources, and continuous technical curriculum empowerment.',
            icon: Building2,
            color: 'from-cyan-400 to-blue-600',
            border: 'border-cyan-500/40'
        },
        {
            role: 'Executive Core',
            title: 'Student Technical Leadership',
            desc: 'Society Leads, Guild Masters, and Engineering Managers orchestrating hackathons and open-source sprints.',
            icon: UserCheck,
            color: 'from-pink-500 to-rose-600',
            border: 'border-pink-500/40'
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
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PATRON LEADERSHIP • ACADEMIC MENTORSHIP</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    PATRON LEADERSHIP & MENTORSHIP
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
                    {leaders.map((l, idx) => {
                        const Icon = l.icon;
                        return (
                            <motion.div
                                key={l.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.1 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                className={`p-5 rounded-2xl bg-black/50 border ${l.border} backdrop-blur-xl flex flex-col justify-between space-y-3`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${l.color} flex items-center justify-center text-white`}>
                                            <Icon size={18} />
                                        </div>
                                        <span className="text-[10px] font-mono text-zinc-400 font-bold">{l.role}</span>
                                    </div>

                                    <h3 className="text-sm font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                        {l.title}
                                    </h3>

                                    <p className="text-[11px] font-sans text-zinc-400 leading-relaxed mt-2">
                                        {l.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
