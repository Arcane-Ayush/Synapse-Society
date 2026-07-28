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
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            loadProfile(session?.user ?? null).finally(() => setLoading(false));
        });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextUser = session?.user ?? null;
            setUser(nextUser);
            loadProfile(nextUser);
        });

        return () => subscription.unsubscribe();
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
