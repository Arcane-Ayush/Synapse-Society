import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { membershipCards, eventCards, missions, teams } from "../data/mockData";
import { SynapseCard } from "../components/SynapseCard";
import { Zap, Target, Users, Trophy, Lock, Calendar, ChevronRight, QrCode, Plus, Shield, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { LoginModal } from "../components/LoginModal";

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
    { id: 'qr', label: 'QR Vault', icon: <QrCode size={14} /> },
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
            const { data: qr, error: qrErr } = await supabase
                .from('qr_codes')
                .select('*')
                .eq('code', qrCodeInput.trim().toUpperCase())
                .single();

            if (qrErr || !qr) {
                setMessage({ type: 'error', text: 'Invalid or unrecognized QR code token.' });
                return;
            }

            if (!qr.is_active) {
                setMessage({ type: 'error', text: 'This QR code is no longer active.' });
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
                    background: 'rgba(12,12,20,0.85)',
                    border: '1px solid rgba(168,85,247,0.25)',
                    boxShadow: '0 0 30px rgba(124,58,237,0.1)'
                }}
            >
                <div className="max-w-xl mx-auto text-center mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
                        style={{
                            background: 'rgba(124,58,237,0.12)',
                            border: '1px solid rgba(168,85,247,0.3)',
                            color: '#A855F7'
                        }}
                    >
                        <QrCode size={28} />
                    </div>
                    <h3 className="text-2xl font-black mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                        Redeem Event QR Code
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Inter' }}>
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
                            background: 'rgba(5,5,8,0.9)',
                            border: '1px solid rgba(124,58,237,0.3)',
                            color: '#F5F3FF'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                        style={{
                            fontFamily: 'Space Grotesk',
                            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                            color: '#FFFFFF',
                            boxShadow: '0 0 20px rgba(124,58,237,0.3)'
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
                        background: 'rgba(8,8,14,0.95)',
                        border: '1px solid rgba(236,72,153,0.3)',
                        boxShadow: '0 0 40px rgba(236,72,153,0.1)'
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl" style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899' }}>
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                                Admin QR Code Generator
                            </h3>
                            <p className="text-xs" style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Inter' }}>
                                Privileged tool for Leads &amp; Administrators to issue live QR codes for events &amp; workshops.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateQR} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(196,181,253,0.6)' }}>
                                QR Code Token (String)
                            </label>
                            <input
                                type="text"
                                value={newQr.code}
                                onChange={e => setNewQr({ ...newQr, code: e.target.value })}
                                placeholder="e.g. REACT-JAM-2026-XP150"
                                className="w-full px-4 py-2.5 rounded-xl text-sm font-mono uppercase outline-none"
                                style={{ background: 'rgba(12,12,20,0.8)', border: '1px solid rgba(124,58,237,0.2)', color: '#FFF' }}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(196,181,253,0.6)' }}>
                                Label / Title
                            </label>
                            <input
                                type="text"
                                value={newQr.label}
                                onChange={e => setNewQr({ ...newQr, label: e.target.value })}
                                placeholder="e.g. React Workshop Attendance"
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                style={{ background: 'rgba(12,12,20,0.8)', border: '1px solid rgba(124,58,237,0.2)', color: '#FFF' }}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(196,181,253,0.6)' }}>
                                Reward XP
                            </label>
                            <input
                                type="number"
                                value={newQr.rewardXp}
                                onChange={e => setNewQr({ ...newQr, rewardXp: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none"
                                style={{ background: 'rgba(12,12,20,0.8)', border: '1px solid rgba(124,58,237,0.2)', color: '#FFF' }}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(196,181,253,0.6)' }}>
                                Reward Card Unlock (Optional)
                            </label>
                            <select
                                value={newQr.rewardCardId}
                                onChange={e => setNewQr({ ...newQr, rewardCardId: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                style={{ background: 'rgba(12,12,20,0.8)', border: '1px solid rgba(124,58,237,0.2)', color: '#FFF' }}
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
                            <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: 'rgba(196,181,253,0.8)' }}>
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
                                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                                    color: '#FFF',
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
                            style={{ background: 'rgba(12,12,20,0.9)', border: '1px dashed rgba(236,72,153,0.4)' }}
                        >
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#F5F3FF' }}>
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
                <div className="text-center py-6 px-4 rounded-2xl" style={{ background: 'rgba(12,12,20,0.5)', border: '1px solid rgba(124,58,237,0.1)' }}>
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
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedCard(null);
                setIsLoginOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))',
                            border: '1px solid rgba(168,85,247,0.3)',
                            boxShadow: '0 0 20px rgba(124,58,237,0.15)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-amber-400 animate-pulse flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold" style={{ color: '#F5F3FF', fontFamily: 'Space Grotesk' }}>
                                    Member Vault Preview
                                </h4>
                                <p className="text-xs" style={{ color: 'rgba(196,181,253,0.7)', fontFamily: 'Inter' }}>
                                    Sign in to claim your Level 0 Access Pass, earn XP, and unlock exclusive event cards!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className="px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                            style={{
                                fontFamily: 'Space Grotesk',
                                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                color: '#FFF',
                                boxShadow: '0 0 15px rgba(124,58,237,0.3)',
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
                        {activeTab === 'qr' && <QRVaultTab onOpenLogin={() => setIsLoginOpen(true)} />}
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

            {/* Login Modal */}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
}
