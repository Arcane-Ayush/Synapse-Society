import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Zap, Shield, ChevronUp, Trophy, Award, Mail, CheckCircle2, AlertCircle, Edit3, User, Sparkles, QrCode, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserCards, getXpHistory, updateProfile, getUserRank } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { SynapseCard } from '../components/SynapseCard';
import { membershipCards, eventCards } from '../data/mockData';

const LEVEL_TITLES = {
    0: 'Synapse Initiate',
    1: 'Neural Spark',
    2: 'Cyber Scholar',
    3: 'Systems Builder',
    4: 'Quantum Architect',
    5: 'Synapse Elite',
};

const DEFAULT_TITLES = [
    { id: 't1', name: 'Genesis Pioneer', category: 'Season 1', icon: '✦', color: '#A855F7', desc: 'Joined during Season 1 Launch' },
    { id: 't2', name: 'Access Holder', category: 'Membership', icon: '⎈', color: '#3B82F6', desc: 'Hold a valid Synapse Access Pass' },
    { id: 't3', name: 'Neural Spark', category: 'Level', icon: '⚡', color: '#10B981', desc: 'Reached Level 1 threshold' },
];

function XPBar({ xp, currentLevel }) {
    const levelRequirements = [0, 100, 300, 700, 1500, 3000];
    const xpForCurrent = levelRequirements[currentLevel] || 0;
    const xpForNext = levelRequirements[currentLevel + 1] || null;

    const progress = xpForNext
        ? Math.min(100, ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100)
        : 100;

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-semibold" style={{ color: '#A855F7' }}>
                    Level {currentLevel} · {LEVEL_TITLES[currentLevel] || 'Member'}
                </span>
                <span className="text-xs font-mono" style={{ color: 'rgba(196,181,253,0.5)' }}>
                    {xp.toLocaleString()} XP {xpForNext ? `/ ${xpForNext.toLocaleString()} XP` : '(MAX LEVEL)'}
                </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden p-0.5" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{
                        background: 'linear-gradient(90deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                        boxShadow: '0 0 10px rgba(168,85,247,0.5)',
                    }}
                />
            </div>
            {xpForNext && (
                <div className="text-right mt-1.5">
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(196,181,253,0.4)' }}>
                        {(xpForNext - xp).toLocaleString()} XP until next level unlock
                    </span>
                </div>
            )}
        </div>
    );
}

export function Profile() {
    const navigate = useNavigate();
    const { user, profile, loading, isAuthenticated, signOut, refreshProfile } = useAuth();
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

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!user) return;
        if (profile) {
            setEditForm({ displayName: profile.display_name || '', username: profile.username || '' });
        }

        Promise.all([
            getUserCards(user.id),
            getXpHistory(user.id, 15),
            getUserRank(user.id),
        ]).then(([cardsRes, historyRes, rankRes]) => {
            setUserCards(cardsRes.data || []);
            setXpHistory(historyRes.data || []);
            setUserRank(rankRes.data || 1);
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
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative z-10">
                <div className="p-8 rounded-3xl max-w-md w-full" style={{ background: 'rgba(12,12,20,0.9)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                        Member Profile Access
                    </h2>
                    <p className="text-sm mb-6" style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Inter' }}>
                        Please sign in to view your member card collection, XP history, and title achievements.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-transform hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#FFF', fontFamily: 'Space Grotesk' }}
                    >
                        Sign In / Join
                    </Link>
                </div>
            </div>
        );
    }

    const isEmailVerified = !!user?.email_confirmed_at;

    // Build complete card collection list
    const ownedCardIds = new Set(userCards.map(uc => uc.cards?.id));
    const allCardsMerged = [...membershipCards, ...eventCards].map(c => ({
        ...c,
        unlocked: ownedCardIds.has(c.id) || c.level === 0,
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
        { id: 'overview', label: 'Overview', icon: <User size={14} /> },
        { id: 'cards', label: 'My Cards', icon: <CreditCard size={14} />, badge: unlockedCardsCount },
        { id: 'titles', label: 'Achievements', icon: <Trophy size={14} /> },
        { id: 'settings', label: 'Account & Safety', icon: <Shield size={14} /> },
    ];

    return (
        <div className="min-h-screen px-4 py-20">
            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header Profile Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden"
                    style={{
                        background: 'rgba(8,8,14,0.95)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(124,58,237,0.15)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-6 flex-1 w-full">
                            {/* Avatar Circle */}
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black flex-shrink-0 relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(236,72,153,0.2))',
                                    border: '2px solid rgba(168,85,247,0.4)',
                                    boxShadow: '0 0 25px rgba(124,58,237,0.3)',
                                    fontFamily: 'Space Grotesk',
                                    color: '#F5F3FF',
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
                                        style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}
                                    >
                                        {effectiveProfile.display_name}
                                    </h1>
                                    {effectiveProfile.club_role !== 'member' && (
                                        <span
                                            className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider whitespace-nowrap"
                                            style={{
                                                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                                color: '#FFF',
                                            }}
                                        >
                                            <Shield size={10} />
                                            {effectiveProfile.club_role}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-3" style={{ color: 'rgba(196,181,253,0.6)' }}>
                                    <span>@{effectiveProfile.username}</span>
                                    <span>·</span>
                                    <span style={{ color: '#A855F7', fontWeight: 600 }}>{LEVEL_TITLES[effectiveProfile.current_level]}</span>
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
                                    ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.4))'
                                    : 'rgba(12,12,20,0.8)',
                                color: activeSubTab === tab.id ? '#FFF' : 'rgba(196,181,253,0.45)',
                                border: `1px solid ${activeSubTab === tab.id ? 'rgba(168,85,247,0.4)' : 'rgba(124,58,237,0.12)'}`,
                                boxShadow: activeSubTab === tab.id ? '0 0 16px rgba(124,58,237,0.2)' : 'none',
                            }}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            {tab.badge !== undefined && (
                                <span
                                    className="px-1.5 py-0.2 rounded-full text-[9px] font-mono"
                                    style={{ background: 'rgba(124,58,237,0.3)', color: '#A855F7' }}
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
                                    { label: 'Total XP', value: effectiveProfile.xp.toLocaleString(), icon: <Zap size={16} />, color: '#A855F7' },
                                    { label: 'Level', value: effectiveProfile.current_level, icon: <ChevronUp size={16} />, color: '#34D399' },
                                    { label: 'Cards Unlocked', value: unlockedCardsCount, icon: <CreditCard size={16} />, color: '#EC4899' },
                                    { label: 'Society Rank', value: `#${userRank}`, icon: <Trophy size={16} />, color: '#F59E0B' },
                                ].map(s => (
                                    <div
                                        key={s.label}
                                        className="p-5 rounded-2xl text-center relative overflow-hidden"
                                        style={{ background: 'rgba(12,12,20,0.85)', border: '1px solid rgba(124,58,237,0.15)' }}
                                    >
                                        <div className="flex items-center justify-center mb-1" style={{ color: s.color }}>
                                            {s.icon}
                                        </div>
                                        <div className="text-2xl font-black mb-1" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                                            {s.value}
                                        </div>
                                        <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(196,181,253,0.4)' }}>
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent XP Audit Trail */}
                            <div className="p-6 rounded-3xl" style={{ background: 'rgba(12,12,20,0.85)', border: '1px solid rgba(124,58,237,0.15)' }}>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                                    Recent XP Log &amp; Activity
                                </h3>
                                {xpHistory.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {xpHistory.map(entry => (
                                            <div
                                                key={entry.id}
                                                className="flex items-center justify-between p-3.5 rounded-xl"
                                                style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(124,58,237,0.08)' }}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: '#E9D5FF', fontFamily: 'Inter' }}>
                                                        {entry.reason}
                                                    </p>
                                                    <p className="text-[10px] font-mono" style={{ color: 'rgba(196,181,253,0.35)' }}>
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
                                                    } catch (e) {}
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
                                    style={{ background: 'rgba(12,12,20,0.85)', border: `1px solid ${title.color}40` }}
                                >
                                    <div className="text-2xl p-2 rounded-xl" style={{ background: `${title.color}15`, color: title.color }}>
                                        {title.icon}
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${title.color}20`, color: title.color }}>
                                            {title.category}
                                        </span>
                                        <h4 className="font-bold text-sm mt-1.5 mb-1" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                                            {title.name}
                                        </h4>
                                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Inter' }}>
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
                            <div className="p-6 rounded-3xl" style={{ background: 'rgba(12,12,20,0.85)', border: '1px solid rgba(124,58,237,0.15)' }}>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                                    Edit Public Profile
                                </h3>

                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(196,181,253,0.6)' }}>
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.displayName}
                                            onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                            style={{ background: 'rgba(5,5,8,0.9)', border: '1px solid rgba(124,58,237,0.2)', color: '#FFF' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-mono tracking-widest uppercase mb-1 block" style={{ color: 'rgba(196,181,253,0.6)' }}>
                                            Username Tag (@)
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none"
                                            style={{ background: 'rgba(5,5,8,0.9)', border: '1px solid rgba(124,58,237,0.2)', color: '#FFF' }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                                        style={{
                                            fontFamily: 'Space Grotesk',
                                            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                            color: '#FFF',
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
                            <div className="p-6 rounded-3xl" style={{ background: 'rgba(12,12,20,0.85)', border: '1px solid rgba(124,58,237,0.15)' }}>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}>
                                    Email &amp; Security
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(124,58,237,0.1)' }}>
                                        <div>
                                            <p className="text-xs font-mono" style={{ color: 'rgba(196,181,253,0.5)' }}>Account Email</p>
                                            <p className="text-sm font-medium" style={{ color: '#F5F3FF' }}>{user.email}</p>
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
                                        <div className="p-4 rounded-2xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                                            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(196,181,253,0.7)', fontFamily: 'Inter' }}>
                                                Email verification is optional for basic member features, but recommended for account recovery and exclusive reward notifications.
                                            </p>
                                            <button
                                                onClick={handleResendVerification}
                                                disabled={resendLoading}
                                                className="px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                                style={{
                                                    fontFamily: 'Space Grotesk',
                                                    background: 'rgba(168,85,247,0.2)',
                                                    border: '1px solid rgba(168,85,247,0.4)',
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3D Card Inspect Modal Overlay */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedCard && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCard(null)}
                            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 cursor-pointer"
                            style={{ background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
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
            )}
        </div>
    );
}
