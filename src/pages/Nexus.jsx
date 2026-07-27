import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { membershipCards, eventCards, missions, teams } from "../data/mockData";
import { SynapseCard } from "../components/SynapseCard";
import { Zap, Target, Users, Trophy, Lock, Calendar, ChevronRight } from "lucide-react";

const TABS = [
    { id: 'cards', label: 'Cards', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    ) },
    { id: 'missions', label: 'Quests', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
        </svg>
    ) },
    { id: 'factions', label: 'Factions', icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ) },
];

// ── Cards Tab ─────────────────────────────────────────────────────
function CardsTab({ setSelectedCard }) {
    return (
        <div>
            {/* Season badge */}
            <div className="flex items-center gap-4 mb-12">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2"
                    style={{
                        background: 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(124,58,237,0.22)',
                        clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest" style={{ color: '#A855F7' }}>
                        SEASON 1 — ACTIVE
                    </span>
                </div>
                <p className="text-sm hidden md:block" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Inter' }}>
                    Every member starts with an{' '}
                    <strong style={{ color: '#C4B5FD' }}>Access Pass</strong>.
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
                            background: 'rgba(124,58,237,0.1)',
                            color: '#A855F7',
                            border: '1px solid rgba(124,58,237,0.2)',
                            clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                        }}
                    >
                        LEVEL 0 → 5
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                    {membershipCards.map((card, i) => {
                        const isUnlocked = card.level === 0;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                onClick={() => isUnlocked && setSelectedCard({ ...card, unlocked: true })}
                                className={isUnlocked ? "cursor-pointer transition-transform hover:scale-105" : ""}
                            >
                                <SynapseCard card={{ ...card, unlocked: isUnlocked }} size="sm" />
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
                            background: 'rgba(217,70,239,0.1)',
                            color: '#D946EF',
                            border: '1px solid rgba(217,70,239,0.22)',
                            clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                        }}
                    >
                        LIMITED
                    </span>
                </div>
                <p className="text-sm mb-8" style={{ color: 'rgba(196,181,253,0.4)', fontFamily: 'Inter' }}>
                    Exclusive cards awarded for attending specific events and achieving milestones. Virtual only.
                </p>

                <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                    {eventCards.map((card, i) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            onClick={() => setSelectedCard(card)}
                            className="cursor-pointer transition-transform hover:scale-105"
                        >
                            <SynapseCard card={card} size="sm" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Earn XP explainer */}
            <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ background: 'rgba(12,12,20,0.8)', border: '1px solid rgba(124,58,237,0.14)' }}
            >
                <div
                    className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }}
                />
                <h4 className="text-xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                    How to Earn{' '}
                    <span style={{ background: 'linear-gradient(135deg, #A855F7, #E879F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                            style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.09)' }}
                        >
                            <div className="text-xl flex-shrink-0">{item.icon}</div>
                            <div>
                                <div className="text-sm font-semibold mb-0.5" style={{ fontFamily: 'Space Grotesk', color: '#C4B5FD' }}>
                                    {item.label}
                                </div>
                                <div className="text-[10px] font-mono mb-1" style={{ color: '#A855F7' }}>+{item.xp} XP</div>
                                <div className="text-[11px]" style={{ color: 'rgba(196,181,253,0.38)' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: 'rgba(196,181,253,0.35)', fontFamily: 'Space Mono' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    Learning: '#A855F7',
    'Open Source': '#10B981',
    Competition: '#EF4444',
    Design: '#D946EF',
    Content: '#F59E0B',
    Community: '#3B82F6',
};

function MissionsTab() {
    const worldEvent = missions.find(m => m.assignedTo === 'All');
    const coopMissions = missions.filter(m => m.assignedTo === 'Teams');
    const openMissions = missions.filter(m => m.assignedTo === 'Open');
    const teamMissions = missions.filter(m => !['All', 'Teams', 'Open'].includes(m.assignedTo));

    const QuestCard = ({ mission, i }) => {
        const typeColor = MISSION_TYPE_COLORS[mission.type] || '#A855F7';
        const isWorld = mission.assignedTo === 'All';
        const isCoop = mission.assignedTo === 'Teams';

        return (
            <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="quest-card p-6 group"
            >
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-2 flex-wrap">
                        {isWorld && (
                            <span
                                className="text-[9px] font-black tracking-widest px-2.5 py-1"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(217,70,239,0.3))',
                                    color: '#E879F9',
                                    border: '1px solid rgba(217,70,239,0.4)',
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
                        #{String(mission.id).padStart(2, '0')}
                    </span>
                </div>

                {/* Assigned */}
                {!isWorld && (
                    <div className="text-xs mb-4" style={{ color: 'rgba(196,181,253,0.4)', fontFamily: 'Inter' }}>
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
                                style={{ background: 'rgba(124,58,237,0.1)', borderRadius: '6px' }}
                            >
                                ✨ Open Quest
                            </span>
                        ) : (
                            <>Assigned to{' '}
                                <span style={{ color: '#A855F7', background: 'rgba(124,58,237,0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                                    {mission.assignedTo}
                                </span>
                            </>
                        )}
                    </div>
                )}

                <h4
                    className="text-base font-bold mb-4 leading-snug"
                    style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}
                >
                    {mission.title}
                </h4>

                <div
                    className="pt-4 flex items-center justify-between"
                    style={{ borderTop: `1px solid rgba(124,58,237,0.09)` }}
                >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'rgba(196,181,253,0.35)' }}>
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
                        {mission.tokens}
                        <span className="text-[9px] font-mono tracking-widest ml-0.5" style={{ color: 'rgba(252,211,77,0.6)' }}>XP</span>
                    </div>
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
                    <p className="text-sm" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Inter' }}>
                        Complete quests to earn tokens and XP for your card progression.
                    </p>
                </div>
                <div
                    className="text-center px-4 py-3"
                    style={{
                        background: 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(124,58,237,0.15)',
                        clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    }}
                >
                    <div className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk', color: '#A855F7' }}>
                        {missions.filter(m => m.status === 'Active').length}
                    </div>
                    <div className="text-[9px] font-mono" style={{ color: 'rgba(196,181,253,0.35)' }}>ACTIVE</div>
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
function FactionsTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>Synapse Factions</h3>
                    <p className="text-sm" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Inter' }}>
                        Compete as a faction. Top teams earn exclusive event cards and XP multipliers.
                    </p>
                </div>
                <div className="text-2xl">⚔️</div>
            </div>

            <div className="space-y-4">
                {[...teams].sort((a, b) => b.tokens - a.tokens).map((team, index) => {
                    const rank = index + 1;
                    const isFirst = rank === 1;

                    return (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="relative flex items-center gap-5 p-5 rounded-2xl overflow-hidden transition-all duration-300"
                            style={{
                                background: isFirst
                                    ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(12,12,20,0.9))'
                                    : 'rgba(12,12,20,0.8)',
                                border: `1px solid ${isFirst ? 'rgba(168,85,247,0.35)' : 'rgba(124,58,237,0.1)'}`,
                                boxShadow: isFirst ? '0 8px 40px rgba(124,58,237,0.1)' : 'none',
                            }}
                        >
                            {/* Rank */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                                style={{
                                    fontFamily: 'Space Grotesk',
                                    background: isFirst ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : 'rgba(124,58,237,0.1)',
                                    color: isFirst ? '#fff' : 'rgba(168,85,247,0.6)',
                                    boxShadow: isFirst ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
                                }}
                            >
                                {rank === 1 ? '👑' : `#${rank}`}
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{team.badge}</span>
                                    <h4 className="font-bold" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>{team.name}</h4>
                                    {isFirst && (
                                        <span
                                            className="text-[9px] font-mono px-2 py-0.5 tracking-widest"
                                            style={{
                                                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                                color: 'white',
                                                clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                                            }}
                                        >
                                            LEADING
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs" style={{ color: 'rgba(196,181,253,0.4)', fontFamily: 'Space Mono' }}>
                                    {team.members} members
                                </p>
                                <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(124,58,237,0.1)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${(team.tokens / teams[0].tokens) * 100}%`,
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
                                        background: isFirst ? 'linear-gradient(135deg, #A855F7, #E879F9)' : 'none',
                                        WebkitBackgroundClip: isFirst ? 'text' : 'unset',
                                        WebkitTextFillColor: isFirst ? 'transparent' : 'rgba(168,85,247,0.7)',
                                    }}
                                >
                                    {team.tokens.toLocaleString()}
                                </div>
                                <div className="text-[9px] font-mono" style={{ color: 'rgba(196,181,253,0.3)' }}>TOKENS</div>
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
                style={{ background: 'rgba(12,12,20,0.7)', border: '1px solid rgba(124,58,237,0.12)' }}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                            <path d="M4 22h16"></path>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
                <h4 className="font-bold text-base mb-2" style={{ fontFamily: 'Space Grotesk' }}>Season 1 Rankings</h4>
                <p className="text-sm mb-5" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Inter' }}>
                    Top faction at Season 1 close earns the exclusive{' '}
                    <strong style={{ color: '#C4B5FD' }}>Faction Champion</strong> event card for all members.
                </p>
                <button
                    disabled
                    className="btn-cyber btn-cyber-sm opacity-50 cursor-not-allowed"
                    title="Backend registration system is currently under construction"
                >
                    Registration Opens Soon
                </button>
            </motion.div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════
export function Nexus() {
    const [activeTab, setActiveTab] = useState('cards');
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedCard(null);
            }
        };
        if (selectedCard) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedCard]);

    return (
        <div className="min-h-screen px-4 py-16">
            <div className="max-w-6xl mx-auto relative z-10">
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
                                    background: 'linear-gradient(135deg, #A855F7, #E879F9, #818CF8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                NEXUS
                            </span>
                        </h1>
                        <div className="hidden md:block flex-1 h-[1px] mb-3" style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.3), transparent)' }} />
                    </div>
                    <p className="text-base mt-4 max-w-xl" style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Inter' }}>
                        Your card collection. Active quests. Faction standings. This is where Synapse Society comes alive.
                    </p>
                </motion.div>

                {/* Tab Bar — cyber slanted */}
                <div className="flex items-center gap-2 mb-10 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex items-center justify-center gap-2 py-2.5 px-6 text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                            style={{
                                fontFamily: 'Space Grotesk',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                                background: activeTab === tab.id
                                    ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.4))'
                                    : 'rgba(12,12,20,0.8)',
                                color: activeTab === tab.id ? '#fff' : 'rgba(196,181,253,0.45)',
                                border: `1px solid ${activeTab === tab.id ? 'rgba(168,85,247,0.4)' : 'rgba(124,58,237,0.12)'}`,
                                boxShadow: activeTab === tab.id ? '0 0 16px rgba(124,58,237,0.2)' : 'none',
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
                        {activeTab === 'cards' && <CardsTab setSelectedCard={setSelectedCard} />}
                        {activeTab === 'missions' && <MissionsTab />}
                        {activeTab === 'factions' && <FactionsTab />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Card Overlay — Portaled to body to completely escape all CSS containing blocks from transforms/filters */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedCard && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCard(null)}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 cursor-pointer"
                            style={{ background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(8px)' }}
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
        </div>
    );
}
