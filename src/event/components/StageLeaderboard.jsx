import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Sparkles, Coins, Flame } from 'lucide-react';
import { fetchEventTeamsFromDb } from '../lib/eventState';

export function StageLeaderboard({ teams: initialTeams, sCoinsMap = {} }) {
    const [teams, setTeams] = useState(initialTeams || []);

    useEffect(() => {
        fetchEventTeamsFromDb().then(dbTeams => {
            if (dbTeams && dbTeams.length > 0) setTeams(dbTeams);
        });
    }, []);

    // Generate realistic live scores or sort by S-Coins
    const rankedTeams = teams.map((team, idx) => {
        const extraCoins = sCoinsMap[team.id] || (40 - idx) * 50 + 100;
        return { ...team, score: extraCoins };
    }).sort((a, b) => b.score - a.score);

    return (
        <div className="w-full max-w-5xl mx-auto select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Trophy size={24} className="text-yellow-400 animate-bounce" />
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Esports Live Faction Standings
                        </h2>
                        <p className="text-xs font-mono text-zinc-400">
                            Neural Nexus 2026 • Real-Time S-Coin Matrix & Qualifier Leaderboard
                        </p>
                    </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-1 text-xs font-mono font-bold text-yellow-300">
                    <Flame size={14} className="text-yellow-400" />
                    LIVE RANK SHIFTS
                </div>
            </div>

            {/* Podium Top 3 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 items-end">
                {/* 2nd Place */}
                {rankedTeams[1] && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 sm:p-6 rounded-3xl text-center relative overflow-hidden backdrop-blur-xl"
                        style={{
                            background: 'linear-gradient(180deg, rgba(200,200,200,0.15) 0%, rgba(20,20,30,0.95) 100%)',
                            border: '2px solid #C0C0C0',
                            boxShadow: '0 0 30px rgba(192,192,192,0.2)'
                        }}
                    >
                        <span className="text-3xl sm:text-4xl">{rankedTeams[1].badge}</span>
                        <div className="text-xs font-mono font-bold text-zinc-300 mt-2">#2 RANK</div>
                        <h4 className="text-sm sm:text-base font-black text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                            {rankedTeams[1].name}
                        </h4>
                        <div className="mt-2 text-base sm:text-xl font-mono font-bold text-yellow-300">
                            {rankedTeams[1].score} S
                        </div>
                    </motion.div>
                )}

                {/* 1st Place (Center Champion) */}
                {rankedTeams[0] && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 sm:p-8 rounded-3xl text-center relative overflow-hidden backdrop-blur-2xl -mt-4"
                        style={{
                            background: 'linear-gradient(180deg, rgba(251,191,36,0.25) 0%, rgba(30,20,10,0.98) 100%)',
                            border: '2px solid #FBBF24',
                            boxShadow: '0 0 50px rgba(251,191,36,0.4)'
                        }}
                    >
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-400 text-black font-mono text-[9px] font-black uppercase">
                            LEADER
                        </div>
                        <span className="text-4xl sm:text-5xl">{rankedTeams[0].badge}</span>
                        <div className="text-xs font-mono font-bold text-yellow-400 mt-2">🏆 #1 CHAMPION</div>
                        <h3 className="text-base sm:text-xl font-black text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                            {rankedTeams[0].name}
                        </h3>
                        <div className="mt-2 text-xl sm:text-3xl font-mono font-black text-yellow-300">
                            {rankedTeams[0].score} S
                        </div>
                    </motion.div>
                )}

                {/* 3rd Place */}
                {rankedTeams[2] && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 sm:p-6 rounded-3xl text-center relative overflow-hidden backdrop-blur-xl"
                        style={{
                            background: 'linear-gradient(180deg, rgba(205,127,50,0.15) 0%, rgba(20,20,30,0.95) 100%)',
                            border: '2px solid #CD7F32',
                            boxShadow: '0 0 30px rgba(205,127,50,0.2)'
                        }}
                    >
                        <span className="text-3xl sm:text-4xl">{rankedTeams[2].badge}</span>
                        <div className="text-xs font-mono font-bold text-amber-500 mt-2">#3 RANK</div>
                        <h4 className="text-sm sm:text-base font-black text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                            {rankedTeams[2].name}
                        </h4>
                        <div className="mt-2 text-base sm:text-xl font-mono font-bold text-yellow-300">
                            {rankedTeams[2].score} S
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Ranks 4 to 20 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {rankedTeams.slice(3, 20).map((t, idx) => (
                    <div
                        key={t.id}
                        className="p-3 rounded-2xl flex items-center justify-between gap-3 bg-black/40 border border-white/10"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 font-mono text-xs font-bold text-zinc-500 text-center">
                                #{idx + 4}
                            </span>
                            <span className="text-xl">{t.badge}</span>
                            <span className="text-xs font-bold text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                                {t.name}
                            </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-yellow-300 flex-shrink-0">
                            {t.score} S
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
