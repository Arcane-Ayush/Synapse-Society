import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Sparkles, Coins, Flame, Shield, Users, Zap, CheckCircle2, HelpCircle } from 'lucide-react';
import { fetchEventTeamsFromDb } from '../lib/eventState';
import { getTeamNumberBadge } from '../lib/eventTeamsData';
import { supabase } from '../../lib/supabase';

export function StageLeaderboard({ currentPhase = 'phase_2_round_1' }) {
    const [teams, setTeams] = useState([]);
    const [viewTrack, setViewTrack] = useState('main'); // 'main' | 'redemption'

    const loadTeams = () => {
        fetchEventTeamsFromDb().then(dbTeams => {
            if (dbTeams && dbTeams.length > 0) setTeams(dbTeams);
        });
    };

    useEffect(() => {
        loadTeams();

        // Subscribe to live team updates
        const channel = supabase.channel('synapse_neural_nexus_2026_leaderboard', {
            config: { broadcast: { self: true } }
        });

        channel
            .on('broadcast', { event: 'team_status_changed' }, () => loadTeams())
            .on('broadcast', { event: 'team_scoins_awarded' }, () => loadTeams())
            .on('broadcast', { event: 'team_quiz_updated' }, () => loadTeams())
            .on('broadcast', { event: 'team_member_assigned' }, () => loadTeams())
            .on('broadcast', { event: 'team_active_changed' }, () => loadTeams())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Filter by registered/active status
    // A team is active if is_active === true or has members or has earned points
    const activeTeams = teams.filter(t => t.is_active === true || (Array.isArray(t.members) && t.members.length > 0) || (t.s_coins > 0));
    
    // Fallback if no team is marked active yet, show all to avoid blank screen during setup
    const displayPool = activeTeams.length > 0 ? activeTeams : teams;

    // Counts
    const totalRegisteredCount = displayPool.length;
    const standingCount = displayPool.filter(t => !t.is_eliminated).length;
    const eliminatedCount = displayPool.filter(t => t.is_eliminated).length;

    // Main Qualifier Track (Standing squads sorted by S-Coins first, eliminated squads greyed out at bottom)
    const standingSquads = displayPool
        .filter(t => !t.is_eliminated)
        .sort((a, b) => (b.s_coins || 0) - (a.s_coins || 0));

    const eliminatedSquads = displayPool
        .filter(t => t.is_eliminated)
        .sort((a, b) => (b.s_coins || 0) - (a.s_coins || 0));

    const mainRanked = [...standingSquads, ...eliminatedSquads];

    // Round of Redemption Track (Eliminated squads sorted by quiz_score / S-Coins)
    const redemptionRanked = displayPool
        .filter(t => t.is_eliminated)
        .sort((a, b) => ((b.quiz_score || 0) * 100 + (b.s_coins || 0)) - ((a.quiz_score || 0) * 100 + (a.s_coins || 0)));

    // Active displayed list based on track
    const activeRanked = viewTrack === 'redemption' ? redemptionRanked : mainRanked;

    // Is Round 2 active? Toggle ONLY visible during Round 2!
    const isRound2 = currentPhase === 'phase_4_round_2';

    return (
        <div className="w-full select-none">
            {/* Header & Counts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-400/30 flex items-center justify-center">
                        <Trophy size={20} className="text-yellow-400 animate-bounce" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            {viewTrack === 'redemption' ? 'Round of Redemption Standings' : 'Live Qualifier Standings'}
                        </h2>
                        <p className="text-xs font-mono text-zinc-400">
                            Real-time merit matrix • S-Coins & elimination ledger
                        </p>
                    </div>
                </div>

                {/* Status Counter Badges */}
                <div className="flex items-center flex-wrap gap-2">
                    <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                        <span className="text-zinc-400">REGISTERED: </span>
                        <strong className="text-cyan-300">{totalRegisteredCount}</strong>
                    </div>

                    <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
                        <span className="text-emerald-400">STANDING: </span>
                        <strong className="text-emerald-300">{standingCount}</strong>
                    </div>

                    <div className="px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono">
                        <span className="text-red-400">ELIMINATED: </span>
                        <strong className="text-red-300">{eliminatedCount}</strong>
                    </div>
                </div>
            </div>

            {/* Round 2 Track Switcher Toggle (ONLY VISIBLE DURING ROUND 2!) */}
            {isRound2 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-2 rounded-2xl bg-black/60 border border-purple-500/30 mb-6 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewTrack('main')}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                viewTrack === 'main'
                                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Trophy size={13} /> Main Qualifiers ({standingCount})
                        </button>

                        <button
                            onClick={() => setViewTrack('redemption')}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                viewTrack === 'redemption'
                                    ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Zap size={13} /> Round of Redemption ({eliminatedCount})
                        </button>
                    </div>

                    <span className="text-[10px] font-mono text-purple-300 px-3 hidden sm:inline-block">
                        ROUND 2 DUAL TRACK ON AIR
                    </span>
                </motion.div>
            )}

            {/* Podium Top 3 (if squads exist) */}
            {activeRanked.length > 0 ? (
                <div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 items-end">
                        {/* 2nd Place */}
                        {activeRanked[1] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-4 sm:p-5 rounded-3xl text-center relative overflow-hidden backdrop-blur-xl"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(200,200,200,0.12) 0%, rgba(20,20,30,0.95) 100%)',
                                    border: '1.5px solid #C0C0C0',
                                    boxShadow: '0 0 25px rgba(192,192,192,0.15)'
                                }}
                            >
                                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs font-bold">#{getTeamNumberBadge(activeRanked[1])}</span>
                                <div className="text-[10px] font-mono font-bold text-zinc-300 mt-1">#2 RANK</div>
                                <h4 className="text-xs sm:text-sm font-black text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                                    {activeRanked[1].name}
                                </h4>
                                <div className="mt-1.5 text-sm sm:text-lg font-mono font-bold text-yellow-300">
                                    {viewTrack === 'redemption' ? `${activeRanked[1].quiz_score || 0} pts` : `${activeRanked[1].s_coins || 0} S`}
                                </div>
                            </motion.div>
                        )}

                        {/* 1st Place (Center Champion) */}
                        {activeRanked[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 sm:p-6 rounded-3xl text-center relative overflow-hidden backdrop-blur-2xl -mt-3"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(251,191,36,0.2) 0%, rgba(30,20,10,0.98) 100%)',
                                    border: '2px solid #FBBF24',
                                    boxShadow: '0 0 40px rgba(251,191,36,0.3)'
                                }}
                            >
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-400 text-black font-mono text-[8px] font-black uppercase">
                                    TOP SQUAD
                                </div>
                                <span className="px-3 py-1 rounded-md bg-yellow-400/20 text-yellow-300 font-mono text-sm font-black border border-yellow-400/40">#{getTeamNumberBadge(activeRanked[0])}</span>
                                <div className="text-[11px] font-mono font-bold text-yellow-400 mt-1">🏆 #1 LEADER</div>
                                <h3 className="text-sm sm:text-base font-black text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                                    {activeRanked[0].name}
                                </h3>
                                <div className="mt-1.5 text-lg sm:text-2xl font-mono font-black text-yellow-300">
                                    {viewTrack === 'redemption' ? `${activeRanked[0].quiz_score || 0} pts` : `${activeRanked[0].s_coins || 0} S`}
                                </div>
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {activeRanked[2] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-4 sm:p-5 rounded-3xl text-center relative overflow-hidden backdrop-blur-xl"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(205,127,50,0.12) 0%, rgba(20,20,30,0.95) 100%)',
                                    border: '1.5px solid #CD7F32',
                                    boxShadow: '0 0 25px rgba(205,127,50,0.15)'
                                }}
                            >
                                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs font-bold">#{getTeamNumberBadge(activeRanked[2])}</span>
                                <div className="text-[10px] font-mono font-bold text-amber-500 mt-1">#3 RANK</div>
                                <h4 className="text-xs sm:text-sm font-black text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>
                                    {activeRanked[2].name}
                                </h4>
                                <div className="mt-1.5 text-sm sm:text-lg font-mono font-bold text-yellow-300">
                                    {viewTrack === 'redemption' ? `${activeRanked[2].quiz_score || 0} pts` : `${activeRanked[2].s_coins || 0} S`}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Ranks 4+ List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                        {activeRanked.slice(3).map((t, idx) => {
                            const isElim = Boolean(t.is_eliminated);
                            return (
                                <div
                                    key={t.id}
                                    className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                                        isElim
                                            ? 'bg-red-950/20 border border-red-500/30 opacity-50 grayscale'
                                            : 'bg-black/40 border border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-5 font-mono text-xs font-bold text-zinc-500 text-center">
                                            #{idx + 4}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">#{getTeamNumberBadge(t)}</span>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-white truncate flex items-center gap-1.5" style={{ fontFamily: 'Space Grotesk' }}>
                                                <span>{t.name}</span>
                                                {isElim && (
                                                    <span className="px-1.5 py-0.2 rounded bg-red-500/30 text-red-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                                                        ELIMINATED
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[9px] font-mono text-zinc-400">
                                                {t.code}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono font-bold text-yellow-300 flex-shrink-0">
                                        {viewTrack === 'redemption' ? `${t.quiz_score || 0} pts` : `${t.s_coins || 0} S`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="p-8 rounded-3xl bg-black/40 border border-white/10 text-center">
                    <Shield size={36} className="text-zinc-500 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                        {viewTrack === 'redemption' ? 'No Squads in Round of Redemption' : 'Awaiting Squad Registration & Score Sync'}
                    </h4>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                        Squads will populate live as ground crew registers members and awards round bounties.
                    </p>
                </div>
            )}
        </div>
    );
}
