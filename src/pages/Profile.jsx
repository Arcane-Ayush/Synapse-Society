import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Zap, Shield, ChevronUp, Trophy, Award, Mail, CheckCircle2, AlertCircle, Edit3, User, Sparkles, QrCode, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserCards, getXpHistory, updateProfile, getUserRank, getAllCards } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { SynapseCard } from '../components/SynapseCard';
import { LoginModal } from '../components/LoginModal';

const LEVEL_TITLES = {
    0: 'Synapse Initiate',
    1: 'Neural Spark',
    2: 'Cyber Scholar',
    3: 'Systems Builder',
    4: 'Quantum Architect',
    5: 'Synapse Elite',
};

const DEFAULT_TITLES = [
    { id: 't1', name: 'Genesis Pioneer', category: 'Season 1', icon: '✦', color: 'var(--synapse-violet-light)', desc: 'Joined during Season 1 Launch' },
    { id: 't2', name: 'Access Holder', category: 'Membership', icon: '⎈', color: '#3B82F6', desc: 'Hold a valid Synapse Access Pass' },
    { id: 't3', name: 'Neural Spark', category: 'Level', icon: '⚡', color: '#10B981', desc: 'Reached Level 1 threshold' },
];

function XPBar({ xp = 0, currentLevel = 0 }) {
    const levelRequirements = [0, 100, 300, 700, 1500, 3000];
    const safeXp = xp ?? 0;
    const safeLevel = currentLevel ?? 0;
    const xpForCurrent = levelRequirements[safeLevel] || 0;
    const xpForNext = levelRequirements[safeLevel + 1] || null;

    const progress = xpForNext
        ? Math.min(100, Math.max(0, ((safeXp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100))
        : 100;

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--synapse-violet-light)' }}>
                    Level {safeLevel} · {LEVEL_TITLES[safeLevel] || 'Member'}
                </span>
                <span className="text-xs font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)' }}>
                    {safeXp.toLocaleString()} XP {xpForNext ? `/ ${xpForNext.toLocaleString()} XP` : '(MAX LEVEL)'}
                </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden p-0.5" style={{ background: 'rgba(var(--synapse-violet-rgb), 0.12)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{
                        background: 'linear-gradient(90deg, var(--synapse-violet) 0%, var(--synapse-violet-light) 50%, var(--synapse-pink) 100%)',
                        boxShadow: '0 0 10px rgba(var(--synapse-violet-light-rgb), 0.5)',
                    }}
                />
            </div>
            {xpForNext && (
                <div className="text-right mt-1.5">
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)' }}>
                        {(xpForNext - safeXp).toLocaleString()} XP until next level unlock
                    </span>
                </div>
            )}
        </div>
    );
}

export function Profile() {
    const navigate = useNavigate();
    const { user, profile, loading, isAuthenticated, signOut, refreshProfile, checkUnlockStatus } = useAuth();
    const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'cards' | 'titles' | 'settings'
    const [userCards, setUserCards] = useState([]);
    const [xpHistory, setXpHistory] = useState([]);
    const [userRank, setUserRank] = useState(1);
    const [selectedCard, setSelectedCard] = useState(null);

    // Profile Editing
    const [editForm, setEditForm] = useState({ displayName: '', username: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editMessage, setEditMessage] = useState(null);

    // Resend Email Verification
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState(null);

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const [allCards, setAllCards] = useState([]);

    useEffect(() => {
        if (!user) return;
        if (profile) {
            setEditForm({ displayName: profile.display_name || '', username: profile.username || '' });
        }

        Promise.all([
            getUserCards(user.id),
            getXpHistory(user.id, 15),
            getUserRank(user.id),
            getAllCards(),
        ]).then(([cardsRes, historyRes, rankRes, allCardsRes]) => {
            setUserCards(cardsRes?.data || []);
            setXpHistory(historyRes?.data || []);
            setUserRank(rankRes?.data || 1);
            setAllCards(allCardsRes?.data || []);
        }).catch(err => {
            console.error("Failed to load profile data:", err);
        });
    }, [user, profile]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    const effectiveProfile = profile || (user ? {
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Member',
        username: user.email?.split('@')[0] || 'user',
        club_role: 'member',
        xp: 0,
        current_level: 0,
        total_cards: 1
    } : null);

    if (!isAuthenticated || !effectiveProfile) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                        <User className="text-purple-300" size={28} />
                    </div>
                    <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                        Member Profile Access
                    </h2>
                    <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)', fontFamily: 'Inter' }}>
                        Please sign in to view your member card collection, XP history, dynamic rank, and title achievements.
                    </p>
                    <button
                        onClick={() => setIsLoginOpen(true)}
                        className="w-full py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                        style={{ background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))', color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}
                    >
                        Sign In / Join Synapse
                    </button>
                </motion.div>
                <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </div>
        );
    }

    const isEmailVerified = !!user?.email_confirmed_at;

    // Build complete card collection list safely
    const allCardsMerged = allCards.map(c => ({
        ...c,
        unlocked: checkUnlockStatus(c),
    }));
    const unlockedCardsCount = allCardsMerged.filter(c => c.unlocked).length;

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setEditLoading(true);
        setEditMessage(null);

        try {
            const { error } = await updateProfile(user.id, {
                display_name: editForm.displayName,
                username: editForm.username.replace('@', '').trim()
            });

            if (error) {
                setEditMessage({ type: 'error', text: error.message });
            } else {
                setEditMessage({ type: 'success', text: 'Profile updated successfully!' });
                await refreshProfile();
            }
        } catch (err) {
            setEditMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setEditLoading(false);
        }
    }

    async function handleResendVerification() {
        setResendLoading(true);
        setResendMessage(null);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user.email
            });
            if (error) {
                setResendMessage({ type: 'error', text: error.message });
            } else {
                setResendMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
            }
        } catch (err) {
            setResendMessage({ type: 'error', text: 'Failed to resend verification email.' });
        } finally {
            setResendLoading(false);
        }
    }

    async function handleSignOut() {
        await signOut();
        navigate('/');
    }

    const SUB_TABS = [
        { id: 'overview', label: 'Overview', icon: <Zap size={14} /> },
        { id: 'cards', label: 'Vault', icon: <CreditCard size={14} /> },
        { id: 'titles', label: 'Titles & Badges', icon: <Trophy size={14} /> },
        { id: 'settings', label: 'Account & Safety', icon: <Shield size={14} /> },
    ];

    const cardInspectPortal = typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
            {selectedCard && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedCard(null)}
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 cursor-pointer"
                    style={{ background: 'rgba(var(--bg-glass-rgb), 0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={e => e.stopPropagation()}
                        className="pointer-events-auto cursor-default relative flex flex-col items-center gap-4"
                    >
                        <SynapseCard card={selectedCard} size="lg" />

                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-widest uppercase"
                            style={{
                                background: 'rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.35)',
                                color: '#34D399',
                                boxShadow: '0 0 20px rgba(16,185,129,0.2)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <CheckCircle2 size={14} />
                            <span>CLAIMED &amp; ACTIVE IN VAULT</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    ) : null;

    return (
        <div className="min-h-screen px-4 py-20">
            {cardInspectPortal}
            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header Profile Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden"
                    style={{
                        background: 'rgba(var(--bg-glass-rgb), 0.95)',
                        border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.3)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(var(--synapse-violet-rgb), 0.15)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-6 flex-1 w-full">
                            {/* Avatar Circle */}
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black flex-shrink-0 relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.4), rgba(236,72,153,0.2))',
                                    border: '2px solid rgba(var(--synapse-violet-light-rgb), 0.4)',
                                    boxShadow: '0 0 25px rgba(var(--synapse-violet-rgb), 0.3)',
                                    fontFamily: 'Space Grotesk',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {effectiveProfile.display_name?.[0]?.toUpperCase() ?? '?'}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent" />
                            </div>

                            {/* User details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1
                                        className="text-xl sm:text-3xl font-black tracking-tight truncate"
                                        style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}
                                    >
                                        {effectiveProfile.display_name}
                                    </h1>
                                    {effectiveProfile.club_role !== 'member' && (
                                        <span
                                            className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider whitespace-nowrap"
                                            style={{
                                                background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-pink))',
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            <Shield size={10} />
                                            {effectiveProfile.club_role}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-3" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                                    <span>@{effectiveProfile.username}</span>
                                    <span>·</span>
                                    <span style={{ color: 'var(--synapse-violet-light)', fontWeight: 600 }}>{LEVEL_TITLES[effectiveProfile.current_level]}</span>
                                </div>

                                <div className="w-full">
                                    <XPBar xp={effectiveProfile.xp} currentLevel={effectiveProfile.current_level} />
                                </div>
                            </div>
                        </div>

                        {/* Sign Out Button */}
                        <button
                            onClick={handleSignOut}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                color: '#FCA5A5',
                                fontFamily: 'Space Grotesk',
                            }}
                        >
                            <LogOut size={13} />
                            Sign Out
                        </button>
                    </div>
                </motion.div>

                {/* Sub Navigation Bar — responsive 2x2 grid on mobile */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 mb-8">
                    {SUB_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap cursor-pointer"
                            style={{
                                fontFamily: 'Space Grotesk',
                                background: activeSubTab === tab.id
                                    ? 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.5), rgba(var(--synapse-violet-light-rgb), 0.4))'
                                    : 'rgba(var(--bg-glass-rgb), 0.8)',
                                color: activeSubTab === tab.id ? '#FFF' : 'rgba(var(--text-secondary-rgb), 0.45)',
                                border: `1px solid ${activeSubTab === tab.id ? 'rgba(var(--synapse-violet-light-rgb), 0.4)' : 'rgba(var(--synapse-violet-rgb), 0.12)'}`,
                                boxShadow: activeSubTab === tab.id ? '0 0 16px rgba(var(--synapse-violet-rgb), 0.2)' : 'none',
                            }}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            {tab.badge !== undefined && (
                                <span
                                    className="px-1.5 py-0.2 rounded-full text-[9px] font-mono"
                                    style={{ background: 'rgba(var(--synapse-violet-rgb), 0.3)', color: 'var(--synapse-violet-light)' }}
                                >
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Sub Tab Contents */}
                <AnimatePresence mode="wait">
                    {activeSubTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Key Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total XP', value: (effectiveProfile.xp ?? 0).toLocaleString(), icon: <Zap size={16} />, color: 'var(--synapse-violet-light)' },
                                    { label: 'Level', value: effectiveProfile.current_level, icon: <ChevronUp size={16} />, color: '#34D399' },
                                    { label: 'Cards Unlocked', value: unlockedCardsCount, icon: <CreditCard size={16} />, color: 'var(--synapse-pink)' },
                                    { label: 'Society Rank', value: `#${userRank}`, icon: <Trophy size={16} />, color: '#F59E0B' },
                                ].map(s => (
                                    <div
                                        key={s.label}
                                        className="p-5 rounded-2xl text-center relative overflow-hidden"
                                        style={{ background: 'rgba(var(--bg-glass-rgb), 0.85)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)' }}
                                    >
                                        <div className="flex items-center justify-center mb-1" style={{ color: s.color }}>
                                            {s.icon}
                                        </div>
                                        <div className="text-2xl font-black mb-1" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                            {s.value}
                                        </div>
                                        <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)' }}>
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent XP Audit Trail */}
                            <div className="p-6 rounded-3xl" style={{ background: 'rgba(var(--bg-glass-rgb), 0.85)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)' }}>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                    Recent XP Log &amp; Activity
                                </h3>
                                {xpHistory.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {xpHistory.map(entry => (
                                            <div
                                                key={entry.id}
                                                className="flex items-center justify-between p-3.5 rounded-xl"
                                                style={{ background: 'rgba(var(--bg-glass-rgb), 0.7)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.08)' }}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: '#E9D5FF', fontFamily: 'Inter' }}>
                                                        {entry.reason}
                                                    </p>
                                                    <p className="text-[10px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.35)' }}>
                                                        {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {entry.source}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-black font-mono" style={{ color: entry.amount >= 0 ? '#34D399' : '#F87171' }}>
                                                    {entry.amount >= 0 ? '+' : ''}{entry.amount} XP
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs font-mono text-purple-300/40 text-center py-6">
                                        No recent XP transactions yet. Redeem a QR code in Nexus to gain your first XP!
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeSubTab === 'cards' && (
                        <motion.div
                            key="cards"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                                {allCardsMerged.map(card => {
                                    const isClaimed = typeof window !== 'undefined' && (localStorage.getItem('synapse_claimed_cards') || '').includes(card.id);
                                    const isNewClaim = card.unlocked && !isClaimed;

                                    return (
                                        <div
                                            key={card.id}
                                            onClick={() => {
                                                if (card.unlocked) {
                                                    try {
                                                        const current = JSON.parse(localStorage.getItem('synapse_claimed_cards') || '[]');
                                                        if (!current.includes(card.id)) {
                                                            current.push(card.id);
                                                            localStorage.setItem('synapse_claimed_cards', JSON.stringify(current));
                                                        }
                                                    } catch (e) { }
                                                    setSelectedCard({ ...card, isNewClaim: false });
                                                }
                                            }}
                                            className={card.unlocked ? "cursor-pointer transition-transform hover:scale-105" : "opacity-60"}
                                        >
                                            <SynapseCard card={{ ...card, isNewClaim }} size="sm" />
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeSubTab === 'titles' && (
                        <motion.div
                            key="titles"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-3 gap-4"
                        >
                            {DEFAULT_TITLES.map(title => (
                                <div
                                    key={title.id}
                                    className="p-5 rounded-2xl flex items-start gap-4 relative overflow-hidden"
                                    style={{ background: 'rgba(var(--bg-glass-rgb), 0.85)', border: `1px solid ${title.color}40` }}
                                >
                                    <div className="text-2xl p-2 rounded-xl" style={{ background: `${title.color}15`, color: title.color }}>
                                        {title.icon}
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${title.color}20`, color: title.color }}>
                                            {title.category}
                                        </span>
                                        <h4 className="font-bold text-sm mt-1.5 mb-1" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                            {title.name}
                                        </h4>
                                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}>
                                            {title.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeSubTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {/* Profile Information Editor */}
                            <div className="p-6 rounded-3xl" style={{ background: 'rgba(var(--bg-glass-rgb), 0.85)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)' }}>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                    Edit Public Profile
                                </h3>

                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.displayName}
                                            onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                            style={{ background: 'rgba(var(--bg-glass-rgb), 0.9)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--text-primary)' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                                            Username Tag (@)
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none"
                                            style={{ background: 'rgba(var(--bg-glass-rgb), 0.9)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--text-primary)' }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                                        style={{
                                            fontFamily: 'Space Grotesk',
                                            background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                                            color: 'var(--text-primary)',
                                        }}
                                    >
                                        {editLoading ? 'Saving...' : 'Save Profile Changes'}
                                    </button>
                                </form>

                                {editMessage && (
                                    <div className="mt-3 p-2.5 rounded-xl text-xs text-center" style={{ background: editMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: editMessage.type === 'success' ? '#6EE7B7' : '#FCA5A5' }}>
                                        {editMessage.text}
                                    </div>
                                )}
                            </div>

                            {/* Optional Email Verification Status */}
                            <div className="p-6 rounded-3xl flex flex-col gap-6" style={{ background: 'rgba(var(--bg-glass-rgb), 0.85)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)' }}>
                                
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                        Email &amp; Security
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: 'rgba(var(--bg-glass-rgb), 0.8)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.1)' }}>
                                            <div>
                                                <p className="text-[10px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)' }}>Account Email</p>
                                                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.email || 'No email registered'}</p>
                                            </div>
                                            {isEmailVerified ? (
                                                <span className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }}>
                                                    <CheckCircle2 size={11} /> Verified
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase" style={{ background: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.3)' }}>
                                                    <AlertCircle size={11} /> Optional
                                                </span>
                                            )}
                                        </div>

                                        {!isEmailVerified && (
                                            <div className="p-4 rounded-2xl" style={{ background: 'rgba(var(--synapse-violet-rgb), 0.06)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)' }}>
                                                <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(var(--text-secondary-rgb), 0.7)', fontFamily: 'Inter' }}>
                                                    Email verification is optional for basic member features, but recommended for account recovery and exclusive reward notifications.
                                                </p>
                                                <button
                                                    onClick={handleResendVerification}
                                                    disabled={resendLoading}
                                                    className="px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                                    style={{
                                                        fontFamily: 'Space Grotesk',
                                                        background: 'rgba(var(--synapse-violet-light-rgb), 0.2)',
                                                        border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.4)',
                                                        color: '#E9D5FF',
                                                    }}
                                                >
                                                    {resendLoading ? 'Sending...' : 'Send Verification Email'}
                                                </button>
                                            </div>
                                        )}

                                        {resendMessage && (
                                            <div className="p-2.5 rounded-xl text-xs text-center" style={{ background: resendMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: resendMessage.type === 'success' ? '#6EE7B7' : '#FCA5A5' }}>
                                                {resendMessage.text}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 mt-auto" style={{ borderTop: '1px solid rgba(var(--synapse-violet-rgb), 0.15)' }}>
                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                        Theme Engine
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => {
                                                document.documentElement.removeAttribute('data-theme');
                                                localStorage.setItem('synapse_theme', 'dark');
                                            }}
                                            className="p-3 rounded-xl border transition-all text-left group hover:scale-105 active:scale-95 cursor-pointer"
                                            style={{
                                                background: 'rgba(var(--bg-glass-rgb), 0.9)',
                                                borderColor: document.documentElement.getAttribute('data-theme') !== 'orange' ? 'var(--synapse-violet-light)' : 'rgba(var(--synapse-violet-rgb), 0.2)'
                                            }}
                                        >
                                            <div className="flex gap-2 mb-2">
                                                <div className="w-4 h-4 rounded-full" style={{ background: '#020202' }} />
                                                <div className="w-4 h-4 rounded-full" style={{ background: '#7C3AED' }} />
                                            </div>
                                            <p className="text-xs font-bold" style={{ color: '#F5F3FF' }}>Dark Nebula</p>
                                            <p className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(196,181,253, 0.6)' }}>Default Skin</p>
                                        </button>

                                        <button 
                                            onClick={() => {
                                                document.documentElement.setAttribute('data-theme', 'orange');
                                                localStorage.setItem('synapse_theme', 'orange');
                                            }}
                                            className="p-3 rounded-xl border transition-all text-left group hover:scale-105 active:scale-95 cursor-pointer"
                                            style={{
                                                background: '#FFF7ED',
                                                borderColor: document.documentElement.getAttribute('data-theme') === 'orange' ? '#F97316' : 'rgba(234,88,12,0.2)'
                                            }}
                                        >
                                            <div className="flex gap-2 mb-2">
                                                <div className="w-4 h-4 rounded-full" style={{ background: '#FFEDD5' }} />
                                                <div className="w-4 h-4 rounded-full" style={{ background: '#EA580C' }} />
                                            </div>
                                            <p className="text-xs font-bold" style={{ color: '#431407' }}>Solar Flare</p>
                                            <p className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(154,52,18,0.6)' }}>Orange & Beige</p>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
