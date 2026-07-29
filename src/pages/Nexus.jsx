import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SynapseCard } from "../components/SynapseCard";
import { Zap, Target, Users, Trophy, Lock, Calendar, ChevronRight, QrCode, Plus, Shield, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { LoginModal } from "../components/LoginModal";

const TABS = [
    {
        id: 'cards', label: 'Cards', icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
        )
    },
    {
        id: 'missions', label: 'Quests', icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
            </svg>
        )
    },
    {
        id: 'factions', label: 'Factions', icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        )
    },
    { id: 'qr', label: 'QR Vault', icon: <QrCode size={14} /> },
];

// ── Cards Tab ─────────────────────────────────────────────────────
function CardsTab({ setSelectedCard, membershipCards, eventCards }) {
    const { checkUnlockStatus } = useAuth();
    
    return (
        <div>
            {/* Season badge */}
            <div className="flex items-center gap-4 mb-12">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2"
                    style={{
                        background: 'rgba(var(--synapse-violet-rgb), 0.08)',
                        border: '1px solid rgba(var(--synapse-violet-rgb), 0.22)',
                        clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest" style={{ color: 'var(--synapse-violet-light)' }}>
                        SEASON 1 — ACTIVE
                    </span>
                </div>
                <p className="text-sm hidden md:block" style={{ color: 'rgba(var(--text-secondary-rgb), 0.45)', fontFamily: 'Inter' }}>
                    Every member starts with an{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>Access Pass</strong>.
                    Earn XP to level up.
                </p>
            </div>

            {/* Membership Cards */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk' }}>Membership Cards</h3>
                    <span
                        className="text-[9px] font-mono px-2 py-0.5 tracking-widest"
                        style={{
                            background: 'rgba(var(--synapse-violet-rgb), 0.1)',
                            color: 'var(--synapse-violet-light)',
                            border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)',
                            clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                        }}
                    >
                        LEVEL 0 → 5
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                    {membershipCards.map((card, i) => {
                        const isUnlocked = checkUnlockStatus(card);
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                onClick={() => isUnlocked && setSelectedCard({ ...card, unlocked: true })}
                                className={isUnlocked ? "cursor-pointer transition-transform hover:scale-105" : ""}
                            >
                                <SynapseCard card={card} size="sm" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Event Cards */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk' }}>Event &amp; Achievement Cards</h3>
                    <span
                        className="text-[9px] font-mono px-2 py-0.5 tracking-widest"
                        style={{
                            background: 'rgba(var(--synapse-pink-rgb), 0.1)',
                            color: 'var(--synapse-pink)',
                            border: '1px solid rgba(var(--synapse-pink-rgb), 0.22)',
                            clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                        }}
                    >
                        LIMITED
                    </span>
                </div>
                <p className="text-sm mb-8" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)', fontFamily: 'Inter' }}>
                    Exclusive cards awarded for attending specific events and achieving milestones. Virtual only.
                </p>

                <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                    {eventCards.map((card, i) => {
                        const isUnlocked = checkUnlockStatus(card);
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                onClick={() => isUnlocked && setSelectedCard({ ...card, unlocked: true })}
                                className={isUnlocked ? "cursor-pointer transition-transform hover:scale-105" : ""}
                            >
                                <SynapseCard card={card} size="sm" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Earn XP explainer */}
            <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ background: 'rgba(var(--bg-glass-rgb), 0.8)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.14)' }}
            >
                <div
                    className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(var(--synapse-violet-rgb), 0.07) 0%, transparent 70%)' }}
                />
                <h4 className="text-xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                    How to Earn{' '}
                    <span style={{ background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        XP &amp; Tokens
                    </span>
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { label: 'Workshops & Sessions', xp: '50–200', icon: '▤', desc: 'Attend and participate actively' },
                        { label: 'Hackathons', xp: '200–1000', icon: '⟁', desc: 'Compete and place in hackathons' },
                        { label: 'Projects & Open Source', xp: '100–500', icon: '⬢', desc: 'Build and contribute publicly' },
                        { label: 'Volunteering', xp: '50–150', icon: '⋈', desc: 'Help run club events' },
                        { label: 'Leadership Roles', xp: '300+', icon: '⎔', desc: 'Lead teams and departments' },
                        { label: 'Mentoring', xp: '100–300', icon: '⌘', desc: 'Guide junior members' },
                    ].map(item => (
                        <div
                            key={item.label}
                            className="flex gap-3 p-3 rounded-xl"
                            style={{ background: 'rgba(var(--synapse-violet-rgb), 0.05)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.09)' }}
                        >
                            <div className="text-xl flex-shrink-0">{item.icon}</div>
                            <div>
                                <div className="text-sm font-semibold mb-0.5" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-secondary)' }}>
                                    {item.label}
                                </div>
                                <div className="text-[10px] font-mono mb-1" style={{ color: 'var(--synapse-violet-light)' }}>+{item.xp} XP</div>
                                <div className="text-[11px]" style={{ color: 'rgba(var(--text-secondary-rgb), 0.38)' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: 'rgba(var(--text-secondary-rgb), 0.35)', fontFamily: 'Space Mono' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--synapse-violet-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    XP tracking &amp; digital profiles launching with Season 1 database
                </div>
            </div>
        </div>
    );
}

// ── Missions Tab — Sakura QuestBoard style ──────────────────────
const MISSION_TYPE_COLORS = {
    Tech: '#6366F1',
    Learning: 'var(--synapse-violet-light)',
    'Open Source': '#10B981',
    Competition: '#EF4444',
    Design: 'var(--synapse-pink)',
    Content: '#F59E0B',
    Community: '#3B82F6',
};

function MissionsTab({ missions = [], userMissions = [], user, refreshMissions }) {
    const [acceptingId, setAcceptingId] = useState(null);

    const handleAcceptQuest = async (missionId) => {
        if (!user) return;
        setAcceptingId(missionId);
        const { acceptMission } = await import('../lib/auth');
        const res = await acceptMission(missionId, user.id);
        if (!res.error && refreshMissions) {
            await refreshMissions();
        }
        setAcceptingId(null);
    };

    const worldEvent = missions.find(m => m.assigned_to === 'All');
    const coopMissions = missions.filter(m => m.assigned_to === 'Teams');
    const openMissions = missions.filter(m => m.assigned_to === 'Open');
    const teamMissions = missions.filter(m => !['All', 'Teams', 'Open'].includes(m.assigned_to));

    const QuestCard = ({ mission, i }) => {
        const typeColor = MISSION_TYPE_COLORS[mission.type] || 'var(--synapse-violet-light)';
        const isWorld = mission.assignedTo === 'All';
        const isCoop = mission.assignedTo === 'Teams';
        
        const participantCount = mission.user_missions?.[0]?.count || 0;
        const maxParticipants = mission.max_participants;
        const isFull = maxParticipants !== null && participantCount >= maxParticipants;
        
        const myUserMission = userMissions.find(um => um.mission_id === mission.id);
        const hasAccepted = !!myUserMission;
        const isAccepting = acceptingId === mission.id;
        
        // For now, allow accepting if it's open/all, not full, and not already accepted
        // Later this can be expanded for specific Team assignments
        const canAccept = !hasAccepted && !isFull && (mission.assigned_to === 'Open' || mission.assigned_to === 'All');

        return (
            <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className={`quest-card p-6 group ${hasAccepted ? 'border-green-500/30' : ''}`}
            >
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-2 flex-wrap">
                        {isWorld && (
                            <span
                                className="text-[9px] font-black tracking-widest px-2.5 py-1"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.3), rgba(var(--synapse-pink-rgb), 0.3))',
                                    color: 'var(--synapse-pink-light)',
                                    border: '1px solid rgba(var(--synapse-pink-rgb), 0.4)',
                                    clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                                    animation: 'node-pulse 2s ease-in-out infinite',
                                }}
                            >
                                🌍 WORLD EVENT
                            </span>
                        )}
                        {isCoop && (
                            <span
                                className="text-[9px] font-bold tracking-widest px-2 py-0.5"
                                style={{
                                    background: 'rgba(59,130,246,0.1)',
                                    color: '#60A5FA',
                                    border: '1px solid rgba(59,130,246,0.3)',
                                    clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                                }}
                            >
                                CO-OP
                            </span>
                        )}
                        <span
                            className="text-[9px] font-bold tracking-widest px-2 py-0.5"
                            style={{
                                background: `${typeColor}12`,
                                color: typeColor,
                                clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                            }}
                        >
                            {mission.type.toUpperCase()}
                        </span>
                    </div>
                    <span
                        className="text-3xl font-black opacity-10 group-hover:opacity-20 transition-opacity"
                        style={{ fontFamily: 'Space Grotesk', color: typeColor }}
                    >
                        #{String(i + 1).padStart(2, '0')}
                    </span>
                </div>

                {/* Assigned */}
                {!isWorld && (
                    <div className="text-xs mb-4" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)', fontFamily: 'Inter' }}>
                        {isCoop ? (
                            <span
                                className="font-bold px-2 py-0.5 rounded-md text-blue-400"
                                style={{ background: 'rgba(59,130,246,0.1)' }}
                            >
                                {mission.assignedTo}
                            </span>
                        ) : mission.assignedTo === 'Open' ? (
                            <span
                                className="font-bold px-2 py-0.5 text-purple-300 animate-pulse"
                                style={{ background: 'rgba(var(--synapse-violet-rgb), 0.1)', borderRadius: '6px' }}
                            >
                                ✨ Open Quest
                            </span>
                        ) : (
                            <>Assigned to{' '}
                                <span style={{ color: 'var(--synapse-violet-light)', background: 'rgba(var(--synapse-violet-rgb), 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                                    {mission.assignedTo}
                                </span>
                            </>
                        )}
                    </div>
                )}

                <h4
                    className="text-base font-bold mb-4 leading-snug"
                    style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}
                >
                    {mission.title}
                </h4>

                <div
                    className="pt-4 flex items-center justify-between"
                    style={{ borderTop: `1px solid rgba(var(--synapse-violet-rgb), 0.09)` }}
                >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.35)' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {mission.deadline}
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1.5 font-black text-sm"
                        style={{
                            background: 'rgba(245,158,11,0.1)',
                            border: '1px solid rgba(245,158,11,0.25)',
                            clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
                            color: '#FCD34D',
                            fontFamily: 'Space Grotesk',
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                            <path d="M4 22h16"></path>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                        </svg>
                        {mission.xp || mission.tokens || 0}
                        <span className="text-[9px] font-mono tracking-widest ml-0.5" style={{ color: 'rgba(252,211,77,0.6)' }}>XP</span>
                    </div>
                </div>

                {/* Quest Acceptance Actions */}
                <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: `1px dashed rgba(var(--synapse-violet-rgb), 0.15)` }}>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        {maxParticipants === null ? 'Unlimited spots' : (
                            <span><span style={{ color: isFull ? 'var(--synapse-pink)' : 'var(--text-primary)' }}>{participantCount}</span> / {maxParticipants} filled</span>
                        )}
                    </div>
                    
                    <button
                        onClick={() => handleAcceptQuest(mission.id)}
                        disabled={!canAccept || isAccepting}
                        className="px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all"
                        style={{
                            background: hasAccepted ? 'rgba(16, 185, 129, 0.1)' : (canAccept ? 'rgba(var(--synapse-violet-rgb), 0.15)' : 'rgba(var(--bg-glass-rgb), 0.5)'),
                            color: hasAccepted ? '#10B981' : (canAccept ? 'var(--text-primary)' : 'rgba(var(--text-secondary-rgb), 0.4)'),
                            border: `1px solid ${hasAccepted ? 'rgba(16, 185, 129, 0.3)' : (canAccept ? 'rgba(var(--synapse-violet-rgb), 0.3)' : 'transparent')}`,
                            cursor: (canAccept && !isAccepting) ? 'pointer' : 'not-allowed',
                            opacity: isAccepting ? 0.7 : 1
                        }}
                    >
                        {isAccepting ? 'ACCEPTING...' : (hasAccepted ? 'IN PROGRESS' : (isFull ? 'FULL' : (canAccept ? 'ACCEPT QUEST' : 'LOCKED')))}
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>Active Quests</h3>
                    <p className="text-sm" style={{ color: 'rgba(var(--text-secondary-rgb), 0.45)', fontFamily: 'Inter' }}>
                        Complete quests to earn tokens and XP for your card progression.
                    </p>
                </div>
                <div
                    className="text-center px-4 py-3"
                    style={{
                        background: 'rgba(var(--synapse-violet-rgb), 0.08)',
                        border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)',
                        clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    }}
                >
                    <div className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--synapse-violet-light)' }}>
                        {missions.filter(m => m.status === 'Active').length}
                    </div>
                    <div className="text-[9px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.35)' }}>ACTIVE</div>
                </div>
            </div>

            {/* World event — full width */}
            {worldEvent && (
                <div className="mb-8">
                    <div className="section-label mb-4">World Event</div>
                    <QuestCard mission={worldEvent} i={0} />
                </div>
            )}

            {/* Open quests */}
            {openMissions.length > 0 && (
                <div className="mb-8">
                    <div className="section-label mb-4">Open Quests</div>
                    <div className="flex flex-wrap gap-6 justify-start">
                        {openMissions.map((m, i) => (
                            <div key={m.id} className="flex-1 min-w-[280px] max-w-xl">
                                <QuestCard mission={m} i={i + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Co-op quests */}
            {coopMissions.length > 0 && (
                <div className="mb-8">
                    <div className="section-label mb-4">Co-op &amp; Team Quests</div>
                    <div className="flex flex-wrap gap-6">
                        {[...coopMissions, ...teamMissions].map((m, i) => (
                            <div key={m.id} className="flex-1 min-w-[280px] max-w-xl">
                                <QuestCard mission={m} i={i + openMissions.length + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Factions Tab ──────────────────────────────────────────────────
function FactionsTab({ teams = [], userTeam = null, user, isLead, hackathonRegistrationOpen, refreshTeams, refreshAppSettings }) {
    const [inviteCode, setInviteCode] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null); // { type, text }

    // Register Modal State
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [newFactionName, setNewFactionName] = useState('');
    const [newFactionEmoji, setNewFactionEmoji] = useState('🔥');
    const [newFactionColor, setNewFactionColor] = useState('#7C3AED');
    
    const handleToggleRegistration = async () => {
        setActionLoading(true);
        setActionMessage(null);
        const { toggleHackathonRegistration } = await import('../lib/auth');
        const res = await toggleHackathonRegistration(!hackathonRegistrationOpen);
        if (res.error) {
            const isMissingTable = res.error?.code === 'PGRST205';
            const isRLS = res.error?.code === '42501';
            setActionMessage({ 
                type: 'error', 
                text: isMissingTable 
                    ? 'DB table missing — run the app_settings migration in Supabase.' 
                    : isRLS 
                    ? 'Permission denied — add RLS policy for app_settings in Supabase.'
                    : 'Failed to toggle registration.' 
            });
        } else {
            if (refreshAppSettings) await refreshAppSettings();
            setActionMessage({ type: 'success', text: `Registration is now ${!hackathonRegistrationOpen ? 'OPEN' : 'CLOSED'}` });
        }
        setActionLoading(false);
    };


    const handleJoin = async () => {
        if (!inviteCode.trim() || !user) return;
        setActionLoading(true);
        setActionMessage(null);
        const { joinTeam } = await import('../lib/auth');
        const res = await joinTeam(user.id, inviteCode);
        if (res.error) {
            setActionMessage({ type: 'error', text: res.error.message || 'Invalid invite code' });
        } else {
            if (refreshTeams) await refreshTeams();
            setActionMessage({ type: 'success', text: 'Successfully joined faction!' });
        }
        setActionLoading(false);
    };

    const handleLeave = async () => {
        if (!user || !userTeam) return;
        
        // If it's not custom, mock the request logic.
        if (!userTeam.teams.is_custom) {
            setActionMessage({ type: 'success', text: 'Request to leave submitted to Faction Lead.' });
            return;
        }

        setActionLoading(true);
        setActionMessage(null);
        const { leaveTeam } = await import('../lib/auth');
        const res = await leaveTeam(user.id, userTeam.teams.id);
        if (res.error) {
            setActionMessage({ type: 'error', text: 'Error leaving faction' });
        } else {
            if (refreshTeams) await refreshTeams();
            setActionMessage({ type: 'success', text: 'Successfully left the faction.' });
        }
        setActionLoading(false);
    };

    const handleRegister = async () => {
        if (!user || !newFactionName.trim()) return;
        setActionLoading(true);
        setActionMessage(null);
        
        const { createTeam } = await import('../lib/auth');
        const res = await createTeam(user.id, newFactionName, newFactionColor, newFactionEmoji);
        
        if (res.error) {
            setActionMessage({ type: 'error', text: res.error.message || 'Error creating faction' });
        } else {
            if (refreshTeams) await refreshTeams();
            setActionMessage({ type: 'success', text: 'Faction registered successfully!' });
            setIsRegisterOpen(false);
            setNewFactionName('');
        }
        setActionLoading(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>Synapse Factions</h3>
                    <p className="text-sm" style={{ color: 'rgba(var(--text-secondary-rgb), 0.45)', fontFamily: 'Inter' }}>
                        Compete as a faction. Top teams earn exclusive event cards and XP multipliers.
                    </p>
                </div>
                <div className="text-2xl">⚔️</div>
            </div>

            {/* Faction Action Area */}
            {user ? (
                <div className="mb-10 p-6 rounded-2xl" style={{ background: 'rgba(var(--bg-glass-rgb), 0.4)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)' }}>
                    {userTeam ? (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl">{userTeam.teams.badge_emoji}</div>
                                <div>
                                    <div className="text-[10px] font-mono tracking-widest" style={{ color: 'var(--synapse-violet-light)' }}>MY FACTION</div>
                                    <h4 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{userTeam.teams.name}</h4>
                                    
                                    {userTeam.teams.is_custom && userTeam.teams.invite_code && (
                                        <div className="mt-2 text-xs font-mono px-3 py-1.5 rounded bg-black/30 inline-block border border-purple-500/20">
                                            Invite Code: <span className="text-purple-300 select-all">{userTeam.teams.invite_code}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleLeave}
                                disabled={actionLoading}
                                className="px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap disabled:opacity-50"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#EF4444',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}
                            >
                                {actionLoading ? 'PROCESSING...' : (userTeam.teams.is_custom ? 'LEAVE FACTION' : 'REQUEST TO LEAVE')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'var(--synapse-violet-light)' }}>JOIN FACTION</div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Invite Code"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-black/30 border border-purple-500/30 text-sm font-mono focus:outline-none focus:border-purple-400"
                                    />
                                    <button
                                        onClick={handleJoin}
                                        disabled={actionLoading || !inviteCode.trim()}
                                        className="px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-50"
                                        style={{ background: 'var(--synapse-violet)', color: 'white' }}
                                    >
                                        JOIN
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-end">
                                <button
                                    onClick={() => setIsRegisterOpen(true)}
                                    disabled={!hackathonRegistrationOpen}
                                    className="w-full px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all"
                                    style={{
                                        background: 'rgba(var(--bg-glass-rgb), 0.5)',
                                        color: hackathonRegistrationOpen ? 'var(--text-primary)' : 'rgba(var(--text-secondary-rgb), 0.4)',
                                        border: '1px dashed rgba(var(--synapse-violet-rgb), 0.3)',
                                        cursor: hackathonRegistrationOpen ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {hackathonRegistrationOpen ? 'REGISTER FACTION' : 'REGISTRATION CLOSED'}
                                </button>
                            </div>
                        </div>
                    )}
                    {actionMessage && (
                        <div className="mt-4 p-3 rounded-lg text-xs text-center font-mono" style={{ background: actionMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: actionMessage.type === 'success' ? '#6EE7B7' : '#FCA5A5' }}>
                            {actionMessage.text}
                        </div>
                    )}
                    {isLead && (
                        <div className="mt-6 pt-4 border-t border-purple-500/20 flex justify-end">
                            <button
                                onClick={handleToggleRegistration}
                                disabled={actionLoading}
                                className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all"
                                style={{
                                    background: 'rgba(236, 72, 153, 0.1)',
                                    color: '#F472B6',
                                    border: '1px solid rgba(236, 72, 153, 0.3)'
                                }}
                            >
                                {actionLoading ? 'PROCESSING...' : (hackathonRegistrationOpen ? 'CLOSE CUSTOM REGISTRATION' : 'OPEN CUSTOM REGISTRATION')}
                            </button>
                        </div>
                    )}
                </div>
            ) : null}

            <div className="space-y-4">
                {[...teams].sort((a, b) => (b.total_tokens || 0) - (a.total_tokens || 0)).map((team, index) => {
                    const rank = index + 1;
                    const isFirst = rank === 1;
                    const sortedTeams = [...teams].sort((a, b) => (b.total_tokens || 0) - (a.total_tokens || 0));
                    const maxTokens = sortedTeams[0]?.tokens || 1;

                    return (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="relative flex items-center gap-5 p-5 rounded-2xl overflow-hidden transition-all duration-300"
                            style={{
                                background: isFirst
                                    ? 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.15), rgba(var(--bg-glass-rgb), 0.9))'
                                    : 'rgba(var(--bg-glass-rgb), 0.8)',
                                border: `1px solid ${isFirst ? 'rgba(var(--synapse-violet-light-rgb), 0.35)' : 'rgba(var(--synapse-violet-rgb), 0.1)'}`,
                                boxShadow: isFirst ? '0 8px 40px rgba(var(--synapse-violet-rgb), 0.1)' : 'none',
                            }}
                        >
                            {/* Rank */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                                style={{
                                    fontFamily: 'Space Grotesk',
                                    background: isFirst ? 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))' : 'rgba(var(--synapse-violet-rgb), 0.1)',
                                    color: isFirst ? '#fff' : 'rgba(var(--synapse-violet-light-rgb), 0.6)',
                                    boxShadow: isFirst ? '0 0 20px rgba(var(--synapse-violet-rgb), 0.4)' : 'none',
                                }}
                            >
                                {rank === 1 ? '👑' : `#${rank}`}
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{team.badge}</span>
                                    <h4 className="font-bold" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>{team.name}</h4>
                                    {isFirst && (
                                        <span
                                            className="text-[9px] font-mono px-2 py-0.5 tracking-widest"
                                            style={{
                                                background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                                                color: 'white',
                                                clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                                            }}
                                        >
                                            LEADING
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)', fontFamily: 'Space Mono' }}>
                                    {team.members} members
                                </p>
                                <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(var(--synapse-violet-rgb), 0.1)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${(team.tokens / maxTokens) * 100}%`,
                                            background: `linear-gradient(90deg, ${team.color}, ${team.color}88)`,
                                            boxShadow: `0 0 6px ${team.color}55`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <div
                                    className="text-2xl font-black"
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        background: isFirst ? 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))' : 'none',
                                        WebkitBackgroundClip: isFirst ? 'text' : 'unset',
                                        WebkitTextFillColor: isFirst ? 'transparent' : 'rgba(var(--synapse-violet-light-rgb), 0.7)',
                                    }}
                                >
                                    {team.tokens.toLocaleString()}
                                </div>
                                <div className="text-[9px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.3)' }}>TOKENS</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Season CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 p-6 rounded-2xl text-center"
                style={{ background: 'rgba(var(--bg-glass-rgb), 0.7)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.12)' }}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--synapse-violet-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
                <h4 className="font-bold text-base mb-2" style={{ fontFamily: 'Space Grotesk' }}>Season 1 Rankings</h4>
                <p className="text-sm mb-5" style={{ color: 'rgba(var(--text-secondary-rgb), 0.45)', fontFamily: 'Inter' }}>
                    Top faction at Season 1 close earns the exclusive{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>Faction Champion</strong> event card for all members.
                </p>
                <button
                    disabled
                    className="btn-cyber btn-cyber-sm opacity-50 cursor-not-allowed"
                    title="Backend registration system is currently under construction"
                >
                    Registration Opens Soon
                </button>
            </motion.div>

            {/* Registration Modal Overlay */}
            {createPortal(
                <AnimatePresence>
                    {isRegisterOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                            style={{ background: 'rgba(var(--bg-glass-rgb), 0.92)', backdropFilter: 'blur(8px)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-sm rounded-2xl p-6 relative overflow-hidden"
                                style={{
                                    background: 'var(--bg-glass)',
                                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.3)',
                                    boxShadow: '0 24px 60px rgba(0,0,0,0.8)'
                                }}
                            >
                                <button 
                                    onClick={() => setIsRegisterOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                                
                                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Register Faction</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-[10px] font-mono tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>FACTION NAME</label>
                                        <input
                                            type="text"
                                            value={newFactionName}
                                            onChange={(e) => setNewFactionName(e.target.value)}
                                            placeholder="E.g. Code Ninjas"
                                            className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-purple-500/20 focus:border-purple-400 focus:outline-none text-white"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-mono tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>EMOJI</label>
                                            <input
                                                type="text"
                                                maxLength={2}
                                                value={newFactionEmoji}
                                                onChange={(e) => setNewFactionEmoji(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-purple-500/20 text-center text-xl focus:border-purple-400 focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-mono tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>COLOR</label>
                                            <input
                                                type="color"
                                                value={newFactionColor}
                                                onChange={(e) => setNewFactionColor(e.target.value)}
                                                className="w-full h-12 rounded-lg bg-black/40 border border-purple-500/20 p-1 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleRegister}
                                    disabled={actionLoading || !newFactionName.trim()}
                                    className="w-full py-3 rounded-lg font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                                        color: 'white'
                                    }}
                                >
                                    {actionLoading ? 'REGISTERING...' : 'CREATE FACTION'}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

// ── QR Vault Tab ──────────────────────────────────────────────────
function QRVaultTab({ onOpenLogin }) {
    const { user, profile, isAuthenticated, isLead } = useAuth();
    const [qrCodeInput, setQrCodeInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Admin QR Creator
    const [newQr, setNewQr] = useState({
        code: '',
        label: '',
        rewardXp: 150,
        rewardCardId: '',
        isReusable: false
    });
    const [createdQr, setCreatedQr] = useState(null);
    const [adminLoading, setAdminLoading] = useState(false);
    const [adminMessage, setAdminMessage] = useState(null);

    // Redeem handler
    async function handleRedeem(e) {
        e.preventDefault();
        if (!isAuthenticated) {
            onOpenLogin();
            return;
        }
        if (!qrCodeInput.trim()) return;

        setLoading(true);
        setMessage(null);

        try {
            // First check if this is their unique Form Code
            const { generateFormCode } = await import('../lib/auth');
            const expectedFormCode = await generateFormCode(user.email);
            
            if (qrCodeInput.trim().toUpperCase() === expectedFormCode) {
                // Verify they haven't claimed it yet
                const { data: existing } = await supabase
                    .from('xp_history')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('reason', 'Form Signup Reward')
                    .maybeSingle();

                if (existing) {
                    setMessage({ type: 'error', text: 'You have already claimed your form reward!' });
                    setLoading(false);
                    return;
                }

                // Award 10 XP
                const { data: xpRes, error: xpErr } = await supabase.rpc('award_xp', {
                    p_user_id: user.id,
                    p_amount: 10,
                    p_reason: 'Form Signup Reward',
                    p_source: 'qr_scan',
                    p_reference_id: 'FORM-SIGNUP-REWARD'
                });

                if (xpErr) throw xpErr;

                // Award SAP-001 card
                const { error: cardErr } = await supabase.rpc('award_card', {
                    p_user_id: user.id,
                    p_card_id: 'SAP-001'
                });

                if (cardErr && cardErr.code !== '23505') { // Ignore unique violation if they somehow already have it
                    throw cardErr;
                }

                setMessage({ type: 'success', text: '🎉 Form Reward Claimed! +10 XP and Synapse Access Pass unlocked!' });
                setQrCodeInput('');
                setLoading(false);
                return;
            }

            // Normal QR Code Flow
            const { data: qr, error: qrErr } = await supabase
                .from('qr_codes')
                .select('*')
                .eq('code', qrCodeInput.trim().toUpperCase())
                .single();

            if (qrErr || !qr) {
                setMessage({ type: 'error', text: 'Invalid or unrecognized QR code token.' });
                setLoading(false);
                return;
            }

            if (!qr.is_active) {
                setMessage({ type: 'error', text: 'This QR code is no longer active.' });
                setLoading(false);
                return;
            }

            if (!qr.is_reusable) {
                const { data: existing } = await supabase
                    .from('qr_scan_history')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('qr_id', qr.id)
                    .eq('success', true)
                    .maybeSingle();

                if (existing) {
                    setMessage({ type: 'error', text: 'You have already redeemed this QR code!' });
                    setLoading(false);
                    return;
                }
            }

            const { data: xpRes, error: xpErr } = await supabase.rpc('award_xp', {
                p_user_id: user.id,
                p_amount: qr.reward_xp,
                p_reason: `QR Code: ${qr.label || qr.code}`,
                p_source: 'qr_scan',
                p_reference_id: qr.id
            });

            if (xpErr) {
                setMessage({ type: 'error', text: 'Failed to credit XP. Try again.' });
                return;
            }

            if (qr.reward_card_id) {
                await supabase.from('user_cards').insert({
                    user_id: user.id,
                    card_id: qr.reward_card_id,
                    source: 'qr_scan'
                }).onConflict('user_id, card_id').ignore();
            }

            await supabase.from('qr_scan_history').insert({
                user_id: user.id,
                qr_id: qr.id,
                success: true
            });

            setMessage({
                type: 'success',
                text: `🎉 Redeemed! +${qr.reward_xp} XP credited to your profile!`
            });
            setQrCodeInput('');
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred during verification.' });
        } finally {
            setLoading(false);
        }
    }

    // Admin Create QR handler
    async function handleCreateQR(e) {
        e.preventDefault();
        if (!newQr.code.trim() || !newQr.label.trim()) return;

        setAdminLoading(true);
        setAdminMessage(null);

        try {
            const { data, error } = await supabase
                .from('qr_codes')
                .insert({
                    code: newQr.code.trim().toUpperCase(),
                    label: newQr.label.trim(),
                    reward_xp: parseInt(newQr.rewardXp) || 0,
                    reward_card_id: newQr.rewardCardId || null,
                    is_reusable: newQr.isReusable,
                    is_active: true,
                    created_by: user?.id
                })
                .select()
                .single();

            if (error) {
                setAdminMessage({ type: 'error', text: error.message });
                return;
            }

            setCreatedQr(data);
            setAdminMessage({ type: 'success', text: 'QR Code created & live on Supabase!' });
        } catch (err) {
            setAdminMessage({ type: 'error', text: 'Failed to create QR code.' });
        } finally {
            setAdminLoading(false);
        }
    }

    return (
        <div className="space-y-12">
            {/* Member Redeem Panel */}
            <div
                className="p-8 rounded-3xl relative overflow-hidden"
                style={{
                    background: 'rgba(var(--bg-glass-rgb), 0.85)',
                    border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.25)',
                    boxShadow: '0 0 30px rgba(var(--synapse-violet-rgb), 0.1)'
                }}
            >
                <div className="max-w-xl mx-auto text-center mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
                        style={{
                            background: 'rgba(var(--synapse-violet-rgb), 0.12)',
                            border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.3)',
                            color: 'var(--synapse-violet-light)'
                        }}
                    >
                        <QrCode size={28} />
                    </div>
                    <h3 className="text-2xl font-black mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                        Redeem Event QR Code
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}>
                        Enter the secret code or token from event slides, workshops, or posters to claim your XP and special card unlocks!
                    </p>
                </div>

                <form onSubmit={handleRedeem} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={qrCodeInput}
                        onChange={e => setQrCodeInput(e.target.value)}
                        placeholder="e.g. SYNAPSE-LAUNCH-2026"
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-mono uppercase outline-none transition-all"
                        style={{
                            background: 'rgba(var(--bg-glass-rgb), 0.9)',
                            border: '1px solid rgba(var(--synapse-violet-rgb), 0.3)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                        style={{
                            fontFamily: 'Space Grotesk',
                            background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                            color: 'var(--text-primary)',
                            boxShadow: '0 0 20px rgba(var(--synapse-violet-rgb), 0.3)'
                        }}
                    >
                        {loading ? 'Verifying...' : 'Redeem Code'}
                    </button>
                </form>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto mt-4 p-3 rounded-xl text-sm flex items-center gap-2 justify-center"
                        style={{
                            background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                            color: message.type === 'success' ? '#6EE7B7' : '#FCA5A5'
                        }}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span>{message.text}</span>
                    </motion.div>
                )}
            </div>

            {/* Admin / Lead QR Generator Section */}
            {isLead ? (
                <div
                    className="p-8 rounded-3xl relative"
                    style={{
                        background: 'rgba(var(--bg-glass-rgb), 0.95)',
                        border: '1px solid rgba(236,72,153,0.3)',
                        boxShadow: '0 0 40px rgba(236,72,153,0.1)'
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl" style={{ background: 'rgba(236,72,153,0.15)', color: 'var(--synapse-pink)' }}>
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                Admin QR Code Generator
                            </h3>
                            <p className="text-xs" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}>
                                Privileged tool for Leads &amp; Administrators to issue live QR codes for events &amp; workshops.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateQR} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                                QR Code Token (String)
                            </label>
                            <input
                                type="text"
                                value={newQr.code}
                                onChange={e => setNewQr({ ...newQr, code: e.target.value })}
                                placeholder="e.g. REACT-JAM-2026-XP150"
                                className="w-full px-4 py-2.5 rounded-xl text-sm font-mono uppercase outline-none"
                                style={{ background: 'rgba(var(--bg-glass-rgb), 0.8)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                                Label / Title
                            </label>
                            <input
                                type="text"
                                value={newQr.label}
                                onChange={e => setNewQr({ ...newQr, label: e.target.value })}
                                placeholder="e.g. React Workshop Attendance"
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                style={{ background: 'rgba(var(--bg-glass-rgb), 0.8)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                                Reward XP
                            </label>
                            <input
                                type="number"
                                value={newQr.rewardXp}
                                onChange={e => setNewQr({ ...newQr, rewardXp: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none"
                                style={{ background: 'rgba(var(--bg-glass-rgb), 0.8)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                                Reward Card Unlock (Optional)
                            </label>
                            <select
                                value={newQr.rewardCardId}
                                onChange={e => setNewQr({ ...newQr, rewardCardId: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                style={{ background: 'rgba(var(--bg-glass-rgb), 0.8)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--text-primary)' }}
                            >
                                <option value="">None (XP Only)</option>
                                <option value="SAP-001">Synapse Access Pass (Level 0)</option>
                                <option value="SSC-L1">Synapse Spark (Level 1)</option>
                                <option value="SSC-L2">Synapse Scholar (Level 2)</option>
                                <option value="EVC-LAUNCH-001">Genesis Card (Event Exclusive)</option>
                                <option value="EVC-HACK-001">Hackathon Conqueror (Event Exclusive)</option>
                                <option value="EVC-OS-001">Open Source Pioneer (Achievement)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: 'rgba(var(--text-secondary-rgb), 0.8)' }}>
                                <input
                                    type="checkbox"
                                    checked={newQr.isReusable}
                                    onChange={e => setNewQr({ ...newQr, isReusable: e.target.checked })}
                                    className="accent-purple-500 w-4 h-4"
                                />
                                Allow Multi-scans (Repeatable for everyone)
                            </label>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={adminLoading}
                                className="w-full py-3 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:scale-[1.01] active:scale-95 cursor-pointer"
                                style={{
                                    fontFamily: 'Space Grotesk',
                                    background: 'linear-gradient(135deg, var(--synapse-pink), #8B5CF6)',
                                    color: 'var(--text-primary)',
                                    boxShadow: '0 0 20px rgba(236,72,153,0.3)'
                                }}
                            >
                                {adminLoading ? 'Generating...' : 'Publish Live QR Code'}
                            </button>
                        </div>
                    </form>

                    {adminMessage && (
                        <div className="mt-4 p-3 rounded-xl text-xs text-center" style={{ background: adminMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: adminMessage.type === 'success' ? '#6EE7B7' : '#FCA5A5' }}>
                            {adminMessage.text}
                        </div>
                    )}

                    {/* Display Generated QR Image for Admin */}
                    {createdQr && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 p-6 rounded-2xl text-center"
                            style={{ background: 'rgba(var(--bg-glass-rgb), 0.9)', border: '1px dashed rgba(236,72,153,0.4)' }}
                        >
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>
                                Ready to Display / Project:
                            </h4>
                            <div className="inline-block p-4 rounded-2xl bg-white shadow-2xl my-3">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(createdQr.code)}`}
                                    alt={createdQr.code}
                                    className="w-48 h-48 mx-auto"
                                />
                            </div>
                            <p className="font-mono text-sm font-bold text-pink-400">{createdQr.code}</p>
                            <p className="text-xs text-purple-300/70 mt-1">{createdQr.label} — +{createdQr.reward_xp} XP</p>
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6 px-4 rounded-2xl" style={{ background: 'rgba(var(--bg-glass-rgb), 0.5)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.1)' }}>
                    <p className="text-xs text-purple-300/50 font-mono">
                        🔒 Admin QR Generator is restricted to Club Leads &amp; Administrators.
                    </p>
                </div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════
export function Nexus() {
    const [activeTab, setActiveTab] = useState('cards');
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isAuthenticated, user, isLead } = useAuth();
    
    // DB Data State
    const [membershipCards, setMembershipCards] = useState([]);
    const [eventCards, setEventCards] = useState([]);
    const [missions, setMissions] = useState([]);
    const [userMissions, setUserMissions] = useState([]);
    const [userTeam, setUserTeam] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [hackathonRegistrationOpen, setHackathonRegistrationOpen] = useState(false);

    const refreshMissions = async () => {
        if (!user) return;
        const { getUserMissions } = await import('../lib/auth');
        const res = await getUserMissions(user.id);
        if (res.data) setUserMissions(res.data);
    };

    const refreshTeams = async () => {
        if (!user) return;
        const { getUserTeam, getTeams } = await import('../lib/auth');
        const [myTeamRes, allTeamsRes] = await Promise.all([
            getUserTeam(user.id),
            getTeams()
        ]);
        if (myTeamRes.data) setUserTeam(myTeamRes.data);
        else setUserTeam(null);
        if (allTeamsRes.data) setTeams(allTeamsRes.data);
    };

    const refreshAppSettings = async () => {
        const { getAppSettings } = await import('../lib/auth');
        const res = await getAppSettings();
        if (res.data) {
            setHackathonRegistrationOpen(!!res.data['hackathon_registration_open']);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedCard(null);
                setIsLoginOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        
        // Fetch app settings unconditionally
        refreshAppSettings();
        
        if (isAuthenticated && user) {
            setLoadingData(true);
            import('../lib/auth').then(({ getAllCards, getMissions, getTeams, getUserMissions, getUserTeam }) => {
                Promise.all([
                    getAllCards(),
                    getMissions(),
                    getTeams(),
                    getUserMissions(user.id),
                    getUserTeam(user.id)
                ]).then(([cardsRes, missionsRes, teamsRes, userMissionsRes, userTeamRes]) => {
                    if (cardsRes.data) {
                        setMembershipCards(cardsRes.data.filter(c => c.type === 'membership'));
                        setEventCards(cardsRes.data.filter(c => c.type === 'event' || c.type === 'achievement'));
                    }
                    if (missionsRes.data) setMissions(missionsRes.data);
                    if (teamsRes.data) setTeams(teamsRes.data);
                    if (userMissionsRes.data) setUserMissions(userMissionsRes.data);
                    if (userTeamRes.data) setUserTeam(userTeamRes.data);
                    setLoadingData(false);
                });
            });
        }
        
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-8 md:p-12 rounded-3xl max-w-md w-full relative overflow-hidden"
                    style={{
                        background: 'rgba(var(--bg-glass-rgb), 0.92)',
                        border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.3)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(var(--synapse-violet-rgb), 0.25)',
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.3), rgba(236,72,153,0.2))',
                            border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.4)',
                            boxShadow: '0 0 25px rgba(var(--synapse-violet-rgb), 0.3)',
                        }}
                    >
                        <Lock className="text-purple-300" size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                        NEXUS VAULT RESTRICTED
                    </h2>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)', fontFamily: 'Inter' }}>
                        Nexus is exclusive to Synapse Society members. Please sign in or join to access your digital card collection, active quests, and QR rewards vault.
                    </p>
                    <button
                        onClick={() => setIsLoginOpen(true)}
                        className="w-full py-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                            color: 'var(--text-primary)',
                            fontFamily: 'Space Grotesk',
                            boxShadow: '0 0 25px rgba(var(--synapse-violet-rgb), 0.5)',
                        }}
                    >
                        Sign In / Join Synapse
                    </button>
                </motion.div>
                <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-16">
            <div className="max-w-6xl mx-auto relative z-10">

                {/* Unauthenticated Banner Notification */}
                {!isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.15), rgba(236,72,153,0.15))',
                            border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.3)',
                            boxShadow: '0 0 20px rgba(var(--synapse-violet-rgb), 0.15)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-amber-400 animate-pulse flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>
                                    Member Vault Preview
                                </h4>
                                <p className="text-xs" style={{ color: 'rgba(var(--text-secondary-rgb), 0.7)', fontFamily: 'Inter' }}>
                                    Sign in to claim your Level 0 Access Pass, earn XP, and unlock exclusive event cards!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className="px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                            style={{
                                fontFamily: 'Space Grotesk',
                                background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                                color: 'var(--text-primary)',
                                boxShadow: '0 0 15px rgba(var(--synapse-violet-rgb), 0.3)',
                            }}
                        >
                            Sign In / Join
                        </button>
                    </motion.div>
                )}

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-12"
                >
                    <div className="section-label mb-3">The Hub</div>
                    <div className="flex items-end gap-4">
                        <h1
                            className="text-5xl md:text-7xl font-black tracking-tight"
                            style={{ fontFamily: 'Space Grotesk' }}
                        >
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light), #818CF8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                NEXUS
                            </span>
                        </h1>
                        <div className="hidden md:block flex-1 h-[1px] mb-3" style={{ background: 'linear-gradient(90deg, rgba(var(--synapse-violet-rgb), 0.3), transparent)' }} />
                    </div>
                    <p className="text-base mt-4 max-w-xl" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}>
                        Your card collection. Active quests. Faction standings. This is where Synapse Society comes alive.
                    </p>
                </motion.div>

                {/* Tab Bar — responsive grid on mobile (no scroll), flex on desktop */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 mb-10">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex items-center justify-center gap-2 py-2.5 px-3 sm:px-6 text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
                            style={{
                                fontFamily: 'Space Grotesk',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                                background: activeTab === tab.id
                                    ? 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.5), rgba(var(--synapse-violet-light-rgb), 0.4))'
                                    : 'rgba(var(--bg-glass-rgb), 0.8)',
                                color: activeTab === tab.id ? '#fff' : 'rgba(var(--text-secondary-rgb), 0.45)',
                                border: `1px solid ${activeTab === tab.id ? 'rgba(var(--synapse-violet-light-rgb), 0.4)' : 'rgba(var(--synapse-violet-rgb), 0.12)'}`,
                                boxShadow: activeTab === tab.id ? '0 0 16px rgba(var(--synapse-violet-rgb), 0.2)' : 'none',
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                    >
                        {loadingData ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                {activeTab === 'cards' && <CardsTab setSelectedCard={setSelectedCard} membershipCards={membershipCards} eventCards={eventCards} />}
                                {activeTab === 'missions' && <MissionsTab missions={missions} userMissions={userMissions} user={user} refreshMissions={refreshMissions} />}
                                {activeTab === 'factions' && <FactionsTab 
                                    teams={teams} 
                                    userTeam={userTeam} 
                                    user={user} 
                                    isLead={isLead}
                                    hackathonRegistrationOpen={hackathonRegistrationOpen}
                                    refreshTeams={refreshTeams}
                                    refreshAppSettings={refreshAppSettings}
                                />}
                                {activeTab === 'qr' && <QRVaultTab onOpenLogin={() => setIsLoginOpen(true)} />}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Card Overlay */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedCard && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCard(null)}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 cursor-pointer"
                            style={{ background: 'rgba(var(--bg-glass-rgb), 0.92)', backdropFilter: 'blur(8px)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                onClick={e => e.stopPropagation()}
                                className="pointer-events-auto cursor-default relative"
                            >
                                <SynapseCard card={selectedCard} size="lg" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Login Modal */}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
}
