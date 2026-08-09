import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Terminal, Search } from 'lucide-react';
import { fetchEventTeamsFromDb } from '../../lib/eventState';

export function Slide09SquadMatrix() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchEventTeamsFromDb().then(data => {
            if (data && data.length > 0) setTeams(data);
        });
    }, []);

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 relative select-none">
            <div className="max-w-6xl mx-auto w-full space-y-5">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>THE COMBATANTS • 40 REGISTERED SQUADS</span>
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    SQUAD MATRIX & PASS ALLOCATION
                </h2>

                <p className="text-xs sm:text-sm font-mono text-zinc-400">
                    Live Database Rosters • Real-Time Registered Squad Matrix ({teams.length} Teams Synchronized)
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {teams.map((t, idx) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                            className="p-2.5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl transition-all duration-200 hover:scale-105"
                            style={{
                                background: `${t.color || '#00F0FF'}10`,
                                border: `1px solid ${t.color || '#00F0FF'}44`,
                                boxShadow: `0 0 15px ${t.color || '#00F0FF'}15`
                            }}
                        >
                            <span className="text-2xl mb-1">{t.badge}</span>
                            <span className="text-[11px] font-bold text-white truncate w-full font-mono">
                                {t.code}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-400 truncate w-full mt-0.5">
                                {(t.name || '').split('·')[1]?.trim() || t.name || ''}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
