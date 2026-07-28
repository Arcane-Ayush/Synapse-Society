import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Zap, Shield, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserCards, getXpHistory } from '../lib/auth';
import { SynapseCard } from '../components/SynapseCard';
import { membershipCards } from '../data/mockData'; // fallback for visual until DB cards load

function XPBar({ xp, currentLevel, levels }) {
    // Find XP required for current and next level
    const levelData = levels?.find(l => l.level === currentLevel);
    const nextLevelData = levels?.find(l => l.level === currentLevel + 1);
    const xpForCurrent = levelData?.xp_required ?? 0;
    const xpForNext = nextLevelData?.xp_required ?? null;

    const progress = xpForNext
        ? Math.min(100, ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100)
        : 100;

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono" style={{ color: 'rgba(168,85,247,0.7)' }}>
                    Level {currentLevel} — {levelData?.label ?? 'Unknown'}
                </span>
                <span className="text-xs font-mono" style={{ color: 'rgba(196,181,253,0.45)' }}>
                    {xp.toLocaleString()} XP {xpForNext ? `/ ${xpForNext.toLocaleString()} XP` : '(MAX)'}
                </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.12)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{
                        background: 'linear-gradient(90deg, #7C3AED, #A855F7)',
                        boxShadow: '0 0 8px rgba(168,85,247,0.5)',
                    }}
                />
            </div>
            {xpForNext && (
                <div className="text-right mt-1">
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(196,181,253,0.3)' }}>
                        {(xpForNext - xp).toLocaleString()} XP to Level {currentLevel + 1}
                    </span>
                </div>
            )}
        </div>
    );
}

export function Profile() {
    const navigate = useNavigate();
    const { user, profile, loading, isAuthenticated, signOut } = useAuth();
    const [userCards, setUserCards] = useState([]);
    const [xpHistory, setXpHistory] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!user) return;
        Promise.all([
            getUserCards(user.id),
            getXpHistory(user.id, 10),
        ]).then(([cardsRes, historyRes]) => {
            setUserCards(cardsRes.data || []);
            setXpHistory(historyRes.data || []);
        }).finally(() => setDataLoading(false));
    }, [user]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Build a merged card list: owned cards are unlocked, others are locked
    const ownedCardIds = new Set(userCards.map(uc => uc.cards?.id));
    const displayCards = membershipCards.map(mc => ({
        ...mc,
        unlocked: ownedCardIds.has(mc.id),
    }));

    async function handleSignOut() {
        await signOut();
        navigate('/');
    }

    return (
        <div className="min-h-screen px-4 py-20">
            <div className="max-w-4xl mx-auto">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12"
                >
                    {/* Avatar */}
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.15))',
                            border: '2px solid rgba(168,85,247,0.35)',
                            boxShadow: '0 0 30px rgba(124,58,237,0.2)',
                            fontFamily: 'Space Grotesk',
                            color: '#A855F7',
                        }}
                    >
                        {profile.display_name?.[0]?.toUpperCase() ?? '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <h1
                                className="text-2xl font-black tracking-tight"
                                style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}
                            >
                                {profile.display_name}
                            </h1>
                            {profile.club_role !== 'member' && (
                                <span
                                    className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md"
                                    style={{
                                        background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                        color: '#fff',
                                    }}
                                >
                                    <Shield size={9} />
                                    {profile.club_role.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <p className="text-sm mb-3" style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Space Mono' }}>
                            @{profile.username}
                        </p>
                        <XPBar xp={profile.xp} currentLevel={profile.current_level} levels={[]} />
                    </div>

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
                        style={{
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#FCA5A5',
                            fontFamily: 'Space Grotesk',
                        }}
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </motion.div>

                {/* ── Stats ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="grid grid-cols-3 gap-4 mb-12"
                >
                    {[
                        { label: 'Total XP', value: profile.xp.toLocaleString(), icon: <Zap size={16} /> },
                        { label: 'Level',    value: profile.current_level,           icon: <ChevronUp size={16} /> },
                        { label: 'Cards',    value: profile.total_cards,             icon: '🃏' },
                    ].map(stat => (
                        <div
                            key={stat.label}
                            className="p-5 rounded-2xl text-center"
                            style={{
                                background: 'rgba(12,12,20,0.85)',
                                border: '1px solid rgba(124,58,237,0.12)',
                            }}
                        >
                            <div className="flex items-center justify-center gap-1 mb-1" style={{ color: '#A855F7' }}>
                                {stat.icon}
                            </div>
                            <div className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                                {stat.value}
                            </div>
                            <div className="text-[10px] font-mono tracking-widest mt-1" style={{ color: 'rgba(196,181,253,0.35)' }}>
                                {stat.label.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* ── Cards ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6" style={{ borderBottom: '1px solid rgba(124,58,237,0.1)', paddingBottom: '12px' }}>
                        <span className="section-label">My Cards</span>
                        <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                            style={{ background: 'rgba(124,58,237,0.15)', color: '#A855F7', border: '1px solid rgba(124,58,237,0.25)' }}
                        >
                            {profile.total_cards}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {displayCards.map(card => (
                            <SynapseCard key={card.id} card={card} size="sm" />
                        ))}
                    </div>
                </motion.div>

                {/* ── XP History ── */}
                {xpHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                    >
                        <div className="flex items-center gap-3 mb-6" style={{ borderBottom: '1px solid rgba(124,58,237,0.1)', paddingBottom: '12px' }}>
                            <span className="section-label">XP History</span>
                        </div>
                        <div className="space-y-2">
                            {xpHistory.map(entry => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between p-3 rounded-xl"
                                    style={{ background: 'rgba(12,12,20,0.6)', border: '1px solid rgba(124,58,237,0.08)' }}
                                >
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: '#E9D5FF', fontFamily: 'Inter' }}>
                                            {entry.reason}
                                        </p>
                                        <p className="text-[10px] font-mono" style={{ color: 'rgba(196,181,253,0.35)' }}>
                                            {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            {' · '}{entry.source.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <span
                                        className="text-sm font-black font-mono"
                                        style={{ color: entry.amount > 0 ? '#34D399' : '#F87171' }}
                                    >
                                        {entry.amount > 0 ? '+' : ''}{entry.amount} XP
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
