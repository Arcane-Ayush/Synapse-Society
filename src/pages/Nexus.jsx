import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { membershipCards, eventCards, missions, teams } from "../data/mockData";
import { SynapseCard } from "../components/SynapseCard";
import { Zap, Target, Users, Trophy, Lock, Calendar, ChevronRight, Shield, LogIn, Sparkles, KeyRound, QrCode, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AdminQRGeneratorModal } from "../components/AdminQRGeneratorModal";
import { QRScannerModal } from "../components/QRScannerModal";

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
function CardsTab({ onCardClick }) {
    const { user, isAuthenticated } = useAuth();

    return (
        <div>
            {/* User XP Profile Banner (If Logged In) */}
            {isAuthenticated && user && (
                <div className="mb-8 p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4"
                     style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(217,70,239,0.08))', backdropFilter: 'blur(12px)' }}>
                    <div className="flex items-center gap-4">
                        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-purple-400/50 shadow-lg shadow-purple-500/20 object-cover" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{user.name}</h3>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30">
                                    @{user.handle}
                                </span>
                            </div>
                            <p className="text-xs text-purple-300/70 font-mono mt-1">ROLE: {user.role} • DOMAIN: {user.domain}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-500/20">
                            <span className="block text-[10px] font-mono text-purple-400/70 tracking-widest">LEVEL</span>
                            <span className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>LVL {user.level}</span>
                        </div>
                        <div className="text-center px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-500/20">
                            <span className="block text-[10px] font-mono text-amber-400/70 tracking-widest">XP BALANCE</span>
                            <span className="text-xl font-black text-amber-400" style={{ fontFamily: 'Space Grotesk' }}>{user.xp} XP</span>
                        </div>
                    </div>
                </div>
            )}

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
                        const userLevel = user ? user.level : 0;
                        const isUnlocked = isAuthenticated ? (card.level <= userLevel) : (card.level === 0);
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                onClick={() => onCardClick(card)}
                                className="cursor-pointer transition-transform hover:scale-105"
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
                            border: '1px solid rgba(217,70,239,0.2)',
                            clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                        }}
                    >
                        EXCLUSIVE REWARDS
                    </span>
                </div>
                <p className="text-sm mb-8" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Inter' }}>
                    Unlocked by winning hackathons, hosting workshops, or achieving top sprint standing.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                    {eventCards.map((card, i) => {
                        const isUnlocked = isAuthenticated && user && user.level >= 2 && i === 0;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                onClick={() => onCardClick(card)}
                                className="cursor-pointer transition-transform hover:scale-105"
                            >
                                <SynapseCard card={{ ...card, unlocked: isUnlocked }} size="sm" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Missions Tab ──────────────────────────────────────────────────
function MissionsTab({ onItemInteract }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Active Quests &amp; Bounties</h3>
                    <p className="text-sm" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Inter' }}>
                        Complete missions to earn XP and level up your Synapse Card.
                    </p>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
                    SEASON 1 BOUNTIES
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        onClick={onItemInteract}
                        className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/20 hover:border-purple-500/40 transition-all cursor-pointer group"
                    >
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <span className="text-[10px] font-mono text-purple-400 tracking-wider uppercase">{mission.category}</span>
                                <h4 className="text-lg font-bold text-white mt-1 group-hover:text-purple-300 transition-colors" style={{ fontFamily: 'Space Grotesk' }}>{mission.title}</h4>
                            </div>
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                                +{mission.xp} XP
                            </span>
                        </div>
                        <p className="text-xs text-purple-200/60 mb-4" style={{ fontFamily: 'Inter' }}>{mission.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-purple-900/30">
                            <span className="text-[10px] font-mono text-purple-300/50">DEADLINE: {mission.deadline}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onItemInteract(); }}
                                className="px-3 py-1.5 rounded-lg bg-purple-600/30 group-hover:bg-purple-600 text-purple-200 text-xs font-mono transition-all cursor-pointer"
                            >
                                Claim Quest
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Factions Tab ──────────────────────────────────────────────────
function FactionsTab({ onItemInteract }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Domain Factions</h3>
                    <p className="text-sm" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Inter' }}>
                        Join your specialized team faction and compete for seasonal standing.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        onClick={onItemInteract}
                        className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/20 text-center hover:border-purple-500/40 transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 text-purple-300 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors" style={{ fontFamily: 'Space Grotesk' }}>{team.name}</h4>
                        <p className="text-xs text-purple-300/60 mb-4">{team.description}</p>
                        <div className="text-xs font-mono text-amber-400 bg-amber-400/10 py-1.5 px-3 rounded-xl border border-amber-400/20">
                            TOTAL FACTION XP: {team.totalXp} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════
export function Nexus() {
    const [activeTab, setActiveTab] = useState('cards');
    const [selectedCard, setSelectedCard] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const { isAuthenticated, isAdmin, openAuthModal } = useAuth();

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

    const handleItemInteract = () => {
        if (!isAuthenticated) {
            openAuthModal();
        }
    };

    const handleCardClick = (card) => {
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            setSelectedCard(card);
        }
    };

    return (
        <div className="min-h-screen px-4 py-16">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header with QR Action Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <div className="section-label mb-3">The Hub</div>
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
                        <p className="text-base mt-2 max-w-xl" style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Inter' }}>
                            Your card collection. Active quests. Faction standings. Scan QR codes to claim rewards.
                        </p>
                    </div>

                    {/* QR Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
                            style={{ fontFamily: 'Space Grotesk' }}
                        >
                            <QrCode className="w-4 h-4 text-purple-200" />
                            SCAN SYNAPSE QR
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => setIsGeneratorOpen(true)}
                                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
                                style={{ fontFamily: 'Space Grotesk' }}
                            >
                                <PlusCircle className="w-4 h-4" />
                                GENERATE QR (ADMIN)
                            </button>
                        )}
                    </div>
                </motion.div>


                {/* Unauthenticated Preview Banner */}
                {!isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(217,70,239,0.12))',
                            border: '1px solid rgba(124,58,237,0.35)',
                            boxShadow: '0 0 25px rgba(124,58,237,0.15)'
                        }}
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                    Preview Mode • Authentication Required
                                </h4>
                                <p className="text-xs text-purple-200/70">
                                    Click any Card, Quest, or Faction to log in and unlock full XP progression.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={openAuthModal}
                            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 flex-shrink-0 cursor-pointer"
                        >
                            <LogIn className="w-4 h-4" />
                            Sign In Now
                        </button>
                    </motion.div>
                )}

                {/* Tab Bar — cyber slanted */}
                <div className="flex items-center gap-2 mb-10 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex items-center justify-center gap-2 py-2.5 px-6 text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
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
                        {activeTab === 'cards' && <CardsTab onCardClick={handleCardClick} />}
                        {activeTab === 'missions' && <MissionsTab onItemInteract={handleItemInteract} />}
                        {activeTab === 'factions' && <FactionsTab onItemInteract={handleItemInteract} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Card Overlay — Portaled to body */}
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

            {/* QR Modals */}
            <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
            <AdminQRGeneratorModal isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} />
        </div>
    );
}

