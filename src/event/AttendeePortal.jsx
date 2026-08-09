import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Zap, Lock, LogIn, Users, Award, Radio, Clock, Coffee, Play, Flame, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/LoginModal';
import { AgentIdBadge } from './components/AgentIdBadge';
import { AudienceTapModule } from './components/AudienceTapModule';
import { TeamAllocationModule } from './components/TeamAllocationModule';
import { ReverseHackathonModule } from './components/ReverseHackathonModule';
import { QualifierProposalModule } from './components/QualifierProposalModule';
import { RedemptionQuizModule } from './components/RedemptionQuizModule';
import {
    EVENT_PHASES,
    DEFAULT_EVENT_STATE,
    subscribeToEventState,
    getAssignedEventTeam,
    setAssignedEventTeam,
    getUserSCoins,
    addUserSCoins,
    fetchQuizQuestionsFromDb
} from './lib/eventState';
import { supabase } from '../lib/supabase';

export function AttendeePortal() {
    const { user, profile, isAuthenticated } = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const [eventState, setEventState] = useState(DEFAULT_EVENT_STATE);
    const [assignedTeam, setAssignedTeam] = useState(null);
    const [sCoins, setSCoins] = useState(0);
    const [isEliminated, setIsEliminated] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [hasStartedRedemption, setHasStartedRedemption] = useState(false);

    // Subscribe to live broadcast from event_admin
    useEffect(() => {
        const unsubscribe = subscribeToEventState((newState) => {
            if (newState) setEventState(newState);
        });
        return () => unsubscribe();
    }, []);

    // Load quiz questions from DB
    useEffect(() => {
        fetchQuizQuestionsFromDb().then(qs => {
            if (qs && qs.length > 0) setQuizQuestions(qs);
        });
    }, []);

    // Load team and S-Coins for this user
    useEffect(() => {
        if (user?.id) {
            getAssignedEventTeam(user.id).then(team => {
                if (team) {
                    setAssignedTeam(team);
                    setIsEliminated(Boolean(team.is_eliminated));
                }
            });
            getUserSCoins(user.id).then(coins => setSCoins(coins));
        }
    }, [user?.id]);

    // Realtime listener for team assignments and points
    useEffect(() => {
        const channel = supabase.channel('attendee_portal_realtime', {
            config: { broadcast: { self: true } }
        });

        channel
            .on('broadcast', { event: 'team_status_changed' }, ({ payload }) => {
                if (assignedTeam && payload?.teamId === assignedTeam.id) {
                    setIsEliminated(payload.isEliminated);
                }
            })
            .on('broadcast', { event: 'team_scoins_awarded' }, ({ payload }) => {
                if (assignedTeam && payload?.teamId === assignedTeam.id) {
                    setSCoins(prev => prev + (payload.delta || 0));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [assignedTeam]);

    const handleTeamAssigned = (team) => {
        setAssignedTeam(team);
        setIsEliminated(Boolean(team?.is_eliminated));
        if (user?.id) setAssignedEventTeam(user.id, team);
    };

    // If user is not authenticated, prompt sleek login view
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen px-4 py-20 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg, rgba(14, 14, 25, 0.95) 0%, rgba(25, 15, 40, 0.95) 100%)',
                        border: '1px solid rgba(var(--synapse-violet-rgb), 0.35)',
                        boxShadow: '0 0 60px rgba(var(--synapse-violet-rgb), 0.25)'
                    }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center mx-auto mb-4 text-purple-300">
                        <Lock size={28} />
                    </div>

                    <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold mb-2">
                        ATTENDEE ACCESS REQUIRED
                    </div>

                    <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                        Neural Nexus Pass
                    </h2>

                    <p className="text-xs font-mono text-zinc-400 mb-6 leading-relaxed">
                        Sign in to generate your unique <strong className="text-cyan-300">AGENT ID</strong>, align with one of the 40 event squads, and receive live stage quest broadcasts.
                    </p>

                    <button
                        onClick={() => setLoginOpen(true)}
                        className="w-full py-3.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(135deg, var(--synapse-violet), #00F0FF)',
                            color: '#FFFFFF',
                            boxShadow: '0 0 25px rgba(var(--synapse-violet-rgb), 0.4)'
                        }}
                    >
                        <LogIn size={15} />
                        Sign In / Claim Agent Pass
                    </button>
                </motion.div>

                {loginOpen && (
                    <LoginModal
                        isOpen={loginOpen}
                        onClose={() => setLoginOpen(false)}
                    />
                )}
            </div>
        );
    }

    // Determine if ID card should be docked (Phase 1+)
    const isDocked = eventState.phase !== EVENT_PHASES.PHASE_0_CHECKIN;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-3 sm:px-4 py-8 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Docked Top HUD Badge (Fixed at top of viewport during Phase 1+) */}
            {isDocked && (
                <div className="fixed top-3 left-0 right-0 z-40 px-3 flex justify-center pointer-events-auto">
                    <div className="w-full max-w-xl">
                        <AgentIdBadge
                            user={user}
                            profile={profile}
                            isDocked={true}
                            assignedTeam={assignedTeam}
                            sCoins={sCoins}
                        />
                    </div>
                </div>
            )}

            {/* Viewport-Centered Interactive Module Container */}
            <div className={`w-full max-w-xl flex flex-col items-center justify-center z-10 ${isDocked ? 'pt-16' : ''}`}>
                {!isDocked && (
                    <div className="w-full mb-4">
                        <AgentIdBadge
                            user={user}
                            profile={profile}
                            isDocked={false}
                            assignedTeam={assignedTeam}
                            sCoins={sCoins}
                        />
                    </div>
                )}

                {/* Dynamic Event Phase Body */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                    {/* Phase 0: Identity Check-In */}
                    {eventState.phase === EVENT_PHASES.PHASE_0_CHECKIN && (
                        <motion.div
                            key="p0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center mt-6"
                        >
                            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-xs font-mono text-cyan-200">
                                📡 Check-in active! Keep this pass ready for on-site scanning.
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 0.5: Audience Tap Arc Reactor Power Surge */}
                    {eventState.phase === EVENT_PHASES.PHASE_0_5_AUDIENCE_TAP && (
                        <motion.div
                            key="p0.5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <AudienceTapModule />
                        </motion.div>
                    )}

                    {/* Phase 1: Team Allocation (Assigned by Volunteers/Admins via Agent ID) */}
                    {eventState.phase === EVENT_PHASES.PHASE_1_TEAMS && (
                        <motion.div
                            key="p1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-xl mx-auto"
                        >
                            {assignedTeam ? (
                                <div
                                    className="p-6 sm:p-8 rounded-3xl backdrop-blur-2xl text-center space-y-4 relative overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, ${assignedTeam.color}15 0%, rgba(10, 8, 20, 0.95) 100%)`,
                                        border: `1.5px solid ${assignedTeam.color}66`,
                                        boxShadow: `0 0 40px ${assignedTeam.color}25`
                                    }}
                                >
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-4xl shadow-xl" style={{ background: `${assignedTeam.color}25`, border: `1px solid ${assignedTeam.color}50` }}>
                                        {assignedTeam.badge}
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: assignedTeam.color }}>
                                            SQUAD DEPLOYED • {assignedTeam.code}
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-white mt-1" style={{ fontFamily: 'Space Grotesk' }}>
                                            {assignedTeam.name}
                                        </h3>
                                        <p className="text-xs font-mono text-zinc-400 mt-1 italic">
                                            "{assignedTeam.motto || 'Synchronized for neural mastery.'}"
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-emerald-300 flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Status: Verified & Ready for Round 1 Launch</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-purple-500/30 backdrop-blur-2xl text-center space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center mx-auto text-purple-400">
                                        <Users size={28} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                            Squad Allocation in Progress
                                        </h3>
                                        <p className="text-xs font-mono text-zinc-300 mt-2 leading-relaxed max-w-md mx-auto">
                                            Please show your <strong className="text-purple-300">AGENT ID</strong> (displayed in the top HUD) to an Event Official or Volunteer to be officially registered into your squad.
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs font-mono text-purple-200">
                                        ⏳ Real-time synchronization active — your squad badge will unlock automatically.
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Phase 2: Round 1 Reverse Hackathon */}
                    {eventState.phase === EVENT_PHASES.PHASE_2_ROUND_1 && (
                        <motion.div
                            key="p2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <ReverseHackathonModule
                                user={user}
                                prompt={eventState.round1Prompt}
                                assignedTeam={assignedTeam}
                                onSubmitted={() => setSCoins(prev => prev + 100)}
                            />
                        </motion.div>
                    )}

                    {/* Phase 3: Intermission / Energy Break */}
                    {(eventState.phase === EVENT_PHASES.PHASE_3_BREAK || eventState.phase === 'phase_3_red_bull') && (
                        <motion.div
                            key="p3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl text-center space-y-4"
                            style={{
                                background: 'linear-gradient(145deg, rgba(30, 10, 15, 0.95) 0%, rgba(20, 10, 30, 0.95) 100%)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                boxShadow: '0 0 50px rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                                <Coffee size={28} />
                            </div>

                            <h3 className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                {eventState.breakTitle || 'Intermission & Energy Break'}
                            </h3>

                            <p className="text-xs font-mono text-zinc-300 leading-relaxed max-w-md mx-auto">
                                Take a breather! Refreshments and drinks are available outside the auditorium. Ground crew & judges are verifying Round 1 commits to compile qualifier rankings.
                            </p>

                            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between text-xs font-mono max-w-sm mx-auto">
                                <span className="text-zinc-400">YOUR SQUAD:</span>
                                <strong className="text-cyan-300">{assignedTeam?.name || 'Assigned Squad'}</strong>
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 4: Round 2 & Redemption */}
                    {eventState.phase === EVENT_PHASES.PHASE_4_ROUND_2 && (
                        <motion.div
                            key="p4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* If squad is eliminated / in redemption track */}
                            {isEliminated ? (
                                !hasStartedRedemption ? (
                                    /* Encouraging Redemption Starter Card */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl text-center space-y-4"
                                        style={{
                                            background: 'linear-gradient(145deg, rgba(30, 10, 25, 0.95) 0%, rgba(40, 10, 20, 0.95) 100%)',
                                            border: '1.5px solid rgba(236, 72, 153, 0.5)',
                                            boxShadow: '0 0 50px rgba(236, 72, 153, 0.25)'
                                        }}
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400">
                                            <Flame size={28} className="animate-bounce" />
                                        </div>

                                        <div className="text-[10px] font-mono tracking-widest text-pink-300 uppercase font-black">
                                            REDEMPTION PROTOCOL • COMEBACK GAUNTLET
                                        </div>

                                        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                            Don't Be Disheartened!
                                        </h3>

                                        <p className="text-xs font-mono text-zinc-200 leading-relaxed max-w-md mx-auto">
                                            You have a full opportunity to fight your way back! Answer rapid-fire computer science and architecture questions in the Redemption Quiz to reclaim S-Coins and climb the rankings.
                                        </p>

                                        <div className="text-[11px] font-mono text-yellow-300 font-bold">
                                            ⚡ +100 S-Coins per correct answer (= +10 XP each)
                                        </div>

                                        <button
                                            onClick={() => setHasStartedRedemption(true)}
                                            className="w-full py-3.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(236,72,153,0.4)]"
                                            style={{
                                                background: 'linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)',
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            <Play size={15} /> Start Round of Redemption
                                        </button>
                                    </motion.div>
                                ) : (
                                    <RedemptionQuizModule
                                        user={user}
                                        questions={quizQuestions}
                                        onFinished={({ earnedCoins }) => setSCoins(prev => prev + earnedCoins)}
                                    />
                                )
                            ) : (
                                /* Qualified Proposal Module */
                                <QualifierProposalModule
                                    user={user}
                                    prompt={eventState.round2Prompt}
                                    assignedTeam={assignedTeam}
                                    onSubmitted={() => setSCoins(prev => prev + 200)}
                                />
                            )}
                        </motion.div>
                    )}

                    {/* Phase 5: Round 3 Grand Final Showdown */}
                    {eventState.phase === EVENT_PHASES.PHASE_5_ROUND_3 && (
                        <motion.div
                            key="p5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl text-center space-y-4"
                            style={{
                                background: 'linear-gradient(145deg, rgba(30, 20, 10, 0.95) 0%, rgba(40, 25, 10, 0.98) 100%)',
                                border: '1.5px solid rgba(251, 191, 36, 0.5)',
                                boxShadow: '0 0 50px rgba(251, 191, 36, 0.25)'
                            }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto text-yellow-400">
                                <Trophy size={28} className="animate-bounce" />
                            </div>

                            <div className="text-[10px] font-mono tracking-widest text-yellow-300 uppercase font-black">
                                ROUND 3 • GRAND FINAL SHOWDOWN
                            </div>

                            <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                {eventState.round3Prompt?.title || 'Grand Finalist Showdown'}
                            </h3>

                            <p className="text-xs font-mono text-zinc-200 leading-relaxed max-w-md mx-auto">
                                {eventState.round3Prompt?.description || 'Finalist stage deliberation: Present your system architecture & live prototype directly on the main auditorium screen!'}
                            </p>

                            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-cyan-300">
                                📡 Follow live on the main auditorium screen!
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 6: Finale & Winner Celebration */}
                    {(eventState.phase === EVENT_PHASES.PHASE_6_FINALE || eventState.phase === 'phase_5_finale') && (
                        <motion.div
                            key="p6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-black/60 border border-yellow-500/40 text-center"
                        >
                            <Award size={48} className="text-yellow-400 mx-auto mb-3 animate-bounce" />
                            <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                Neural Nexus Finale!
                            </h3>
                            <p className="text-xs font-mono text-zinc-300 mb-4 leading-relaxed">
                                Congratulations on completing the gauntlet. Total S-Coins earned have been converted into your permanent Synapse Profile XP!
                            </p>
                            <div className="text-xl font-black font-mono text-yellow-300">
                                {sCoins} S-Coins Earned ({Math.floor(sCoins / 10)} XP)
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
