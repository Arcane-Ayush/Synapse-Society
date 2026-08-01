import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getProfile, getUserCards } from '../lib/auth';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the entire app.
 * Provides: user (Supabase auth user), profile (profiles table row), loading, signOut
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [ownedCardIds, setOwnedCardIds] = useState([]);
    const [isFormRedeemed, setIsFormRedeemed] = useState(false);
    const [loading, setLoading] = useState(true);

    async function checkFormRedemption(authUser) {
        if (!authUser) { setIsFormRedeemed(false); return; }
        try {
            const { data: xpRecord } = await supabase
                .from('xp_history')
                .select('id')
                .eq('user_id', authUser.id)
                .eq('reason', 'Form Signup Reward')
                .maybeSingle();

            if (xpRecord) {
                setIsFormRedeemed(true);
                return;
            }

            const { data: cardRecord } = await supabase
                .from('user_cards')
                .select('id')
                .eq('user_id', authUser.id)
                .eq('card_id', 'SAP-001')
                .maybeSingle();

            setIsFormRedeemed(!!cardRecord);
        } catch (e) {
            console.error('Form redemption check error:', e);
            setIsFormRedeemed(false);
        }
    }

    async function loadCards(authUser) {
        if (!authUser) { setOwnedCardIds([]); return; }
        const cardsRes = await getUserCards(authUser.id);
        if (cardsRes.data) {
            setOwnedCardIds(cardsRes.data.map(item => item.cards.id));
        } else {
            setOwnedCardIds([]);
        }
        await checkFormRedemption(authUser);
    }

    async function loadProfile(authUser) {
        if (!authUser) {
            setProfile(null);
            setOwnedCardIds([]);
            setIsFormRedeemed(false);
            return;
        }
        
        const [profileRes, cardsRes] = await Promise.all([
            getProfile(authUser.id),
            getUserCards(authUser.id)
        ]);
        
        setProfile(profileRes.data || null);
        
        if (cardsRes.data) {
            setOwnedCardIds(cardsRes.data.map(item => item.cards.id));
        } else {
            setOwnedCardIds([]);
        }
        await checkFormRedemption(authUser);
    }

    useEffect(() => {
        let isMounted = true;

        // Safety fallback: force loading false after 2s max
        const timer = setTimeout(() => {
            if (isMounted) setLoading(false);
        }, 2000);

        // Get initial session
        supabase.auth.getSession()
            .then(async ({ data: { session } }) => {
                if (!isMounted) return;
                const authUser = session?.user ?? null;
                setUser(authUser);
                if (authUser) {
                    try {
                        await loadProfile(authUser);
                    } catch (e) {
                        console.error('Failed to load profile:', e);
                    }
                }
            })
            .catch(err => console.error('Auth session error:', err))
            .finally(() => {
                if (isMounted) setLoading(false);
                clearTimeout(timer);
            });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            const nextUser = session?.user ?? null;
            setUser(nextUser);
            if (nextUser) {
                loadProfile(nextUser).catch(e => console.error('Profile reload error:', e));
            } else {
                setProfile(null);
            }
        });

        return () => {
            isMounted = false;
            clearTimeout(timer);
            subscription.unsubscribe();
        };
    }, []);

    async function handleSignOut() {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    }

    const checkUnlockStatus = (card) => {
        if (!card) return false;
        if (!user) return false;
        if (ownedCardIds?.includes(card.id)) return true;
        const userXp = profile?.xp ?? 0;
        const reqXp = card.xpRequired ?? card.worth ?? 0;
        return userXp >= reqXp;
    };

    const value = {
        user,
        profile,
        ownedCardIds,
        isFormRedeemed,
        loading,
        isAuthenticated: !!user,
        isAdmin: profile?.club_role === 'administrator',
        isLead: profile?.club_role === 'lead' || profile?.club_role === 'administrator',
        signOut: handleSignOut,
        refreshProfile: () => loadProfile(user),
        refreshCards: () => loadCards(user),
        checkUnlockStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth — hook to consume auth context anywhere in the app.
 * Usage: const { user, profile, isAuthenticated, signOut } = useAuth();
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
}
