import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Zap, Lock, LogIn, Users, Award, Radio } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from '../components/LoginModal';
import { AgentIdBadge } from './components/AgentIdBadge';
import { AudienceTapModule } from './components/AudienceTapModule';
import { TeamAllocationModule } from './components/TeamAllocationModule';
import { ReverseHackathonModule } from './components/ReverseHackathonModule';
import { RedBullBreakTimer } from './components/RedBullBreakTimer';
import { QualifierProposalModule } from './components/QualifierProposalModule';
import { RedemptionQuizModule } from './components/RedemptionQuizModule';
import {
    EVENT_PHASES,
    DEFAULT_EVENT_STATE,
    subscribeToEventState,
    getAssignedEventTeam,
    setAssignedEventTeam,
    getUserSCoins,
    addUserSCoins
} from './lib/eventState';

export function AttendeePortal() {
    const { user, profile, isAuthenticated } = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const [eventState, setEventState] = useState(DEFAULT_EVENT_STATE);
    const [assignedTeam, setAssignedTeam] = useState(null);
    const [sCoins, setSCoins] = useState(0);
    const [isEliminated, setIsEliminated] = useState(false); // For Round 2 branching

    // Subscribe to live broadcast from event_admin
    useEffect(() => {
        const unsubscribe = subscribeToEventState((newState) => {
            if (newState) setEventState(newState);
        });
        return () => unsubscribe();
    }, []);

    // Load team and S-Coins for this user
    useEffect(() => {
        if (user?.id) {
            const team = getAssignedEventTeam(user.id);
            if (team) setAssignedTeam(team);
            const coins = getUserSCoins(user.id);
            setSCoins(coins);
        }
    }, [user?.id]);

    const handleTeamAssigned = (team) => {
        setAssignedTeam(team);
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
        <div className="min-h-screen px-3 sm:px-4 py-8 pb-24 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Always Rendered Agent ID: Full Card during Phase 0, Docked Top HUD during Phase 1+ */}
            <AgentIdBadge
                user={user}
                profile={profile}
                isDocked={isDocked}
                assignedTeam={assignedTeam}
                sCoins={sCoins}
            />

            {/* Dynamic Event Phase Body */}
            <div className="max-w-xl mx-auto mt-6">
                <AnimatePresence mode="wait">
                    {/* Phase 0: Identity Check-In (Full Card is shown above) */}
                    {eventState.phase === EVENT_PHASES.PHASE_0_CHECKIN && (
                        <motion.div
                            key="p0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center mt-6"
                        >
                            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-xs font-mono text-cyan-200">
                                📡 Check-in active! Keep this screen ready for on-site scanning.
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

                    {/* Phase 1: Team Allocation */}
                    {eventState.phase === EVENT_PHASES.PHASE_1_TEAMS && (
                        <motion.div
                            key="p1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <TeamAllocationModule
                                user={user}
                                assignedTeam={assignedTeam}
                                onTeamSelected={handleTeamAssigned}
                            />
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
                                onSubmitted={() => setSCoins(prev => prev + 100)}
                            />
                        </motion.div>
                    )}

                    {/* Phase 3: Red Bull Break */}
                    {eventState.phase === EVENT_PHASES.PHASE_3_RED_BULL && (
                        <motion.div
                            key="p3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <RedBullBreakTimer durationSeconds={eventState.redBullTimerDurationSec} />
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
                            {/* Toggle between Qualifier Proposal vs Redemption Quiz */}
                            <div className="flex items-center justify-center gap-2 mb-4 p-1 rounded-2xl bg-black/40 border border-white/10 w-fit mx-auto">
                                <button
                                    onClick={() => setIsEliminated(false)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${!isEliminated ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Qualifier Proposal
                                </button>
                                <button
                                    onClick={() => setIsEliminated(true)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${isEliminated ? 'bg-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Round of Redemption (Quiz)
                                </button>
                            </div>

                            {!isEliminated ? (
                                <QualifierProposalModule
                                    user={user}
                                    prompt={eventState.round2Prompt}
                                    assignedTeam={assignedTeam}
                                    onSubmitted={() => setSCoins(prev => prev + 200)}
                                />
                            ) : (
                                <RedemptionQuizModule
                                    user={user}
                                    questions={eventState.quizQuestions}
                                    onFinished={({ earnedCoins }) => setSCoins(prev => prev + earnedCoins)}
                                />
                            )}
                        </motion.div>
                    )}

                    {/* Phase 5: Finale & Winner Celebration */}
                    {eventState.phase === EVENT_PHASES.PHASE_5_FINALE && (
                        <motion.div
                            key="p5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-black/60 border border-yellow-500/40 text-center"
                        >
                            <Award size={48} className="text-yellow-400 mx-auto mb-3 animate-bounce" />
                            <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                                Neural Nexus Finale!
                            </h3>
                            <p className="text-xs font-mono text-zinc-300 mb-4">
                                Congratulations on completing the gauntlet. Total S-Coins earned have been converted into your permanent Synapse Profile XP!
                            </p>
                            <div className="text-xl font-black font-mono text-yellow-300">
                                {sCoins} S-Coins Earned
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
