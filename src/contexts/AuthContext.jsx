import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getProfile } from '../lib/auth';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the entire app.
 * Provides: user (Supabase auth user), profile (profiles table row), loading, signOut
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadProfile(authUser) {
        if (!authUser) {
            setProfile(null);
            return;
        }
        const { data } = await getProfile(authUser.id);
        setProfile(data || null);
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

    const value = {
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isAdmin: profile?.club_role === 'administrator',
        isLead: profile?.club_role === 'lead' || profile?.club_role === 'administrator',
        signOut: handleSignOut,
        refreshProfile: () => loadProfile(user),
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
