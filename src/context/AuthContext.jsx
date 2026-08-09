import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = {
    member: {
        id: 'user_001',
        name: 'Aarav Sharma',
        email: 'aarav@synapse.cu',
        handle: 'aarav_dev',
        role: 'Member',
        domain: 'Fullstack Dev',
        xp: 350,
        level: 2,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        joinedDate: 'Aug 2024',
        claimedQrIds: []
    },
    lead: {
        id: 'user_002',
        name: 'Ayush Kumar',
        email: 'ayush@synapse.cu',
        handle: 'arcane_ayush',
        role: 'Tech Lead',
        domain: 'AI & Web3',
        xp: 1200,
        level: 4,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        joinedDate: 'Jan 2024',
        claimedQrIds: []
    },
    admin: {
        id: 'user_admin_001',
        name: 'Dr. Sarah Vance',
        email: 'admin@synapse.cu',
        handle: 'synapse_admin',
        role: 'Admin',
        domain: 'Club Admin & Operations',
        xp: 5000,
        level: 5,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        joinedDate: 'Nov 2023',
        claimedQrIds: []
    }
};

function calculateLevel(xp) {
    if (xp >= 1500) return 5;
    if (xp >= 1000) return 4;
    if (xp >= 600) return 3;
    if (xp >= 300) return 2;
    if (xp >= 100) return 1;
    return 0;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('synapse_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem('synapse_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('synapse_user');
        }
    }, [user]);

    const login = (email, password) => {
        const isAdmin = email.toLowerCase().includes('admin');
        const newUser = {
            id: `user_${Date.now()}`,
            name: email.split('@')[0].replace('.', ' '),
            email,
            handle: email.split('@')[0],
            role: isAdmin ? 'Admin' : 'Synapse Member',
            domain: isAdmin ? 'Club Admin' : 'Core Member',
            xp: isAdmin ? 5000 : 100,
            level: isAdmin ? 5 : 1,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            claimedQrIds: []
        };
        setUser(newUser);
        setIsAuthModalOpen(false);
        return { success: true };
    };

    const loginAsDemo = (type = 'member') => {
        const demoUser = DEMO_USERS[type] || DEMO_USERS.member;
        setUser({ ...demoUser, claimedQrIds: demoUser.claimedQrIds || [] });
        setIsAuthModalOpen(false);
    };

    const register = (name, email, password) => {
        const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            handle: name.toLowerCase().replace(/\s+/g, '_'),
            role: 'New Initiate',
            domain: 'General',
            xp: 50,
            level: 0,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            claimedQrIds: []
        };
        setUser(newUser);
        setIsAuthModalOpen(false);
        return { success: true };
    };

    const claimQrReward = (qrData) => {
        if (!user) return { success: false, error: 'Authentication required' };
        
        const claimed = user.claimedQrIds || [];
        if (claimed.includes(qrData.id)) {
            return { success: false, error: 'This QR code reward has already been claimed by your account!' };
        }

        const addedXp = parseInt(qrData.amount, 10) || 0;
        const newXp = (user.xp || 0) + addedXp;
        const newLevel = calculateLevel(newXp);

        const updatedUser = {
            ...user,
            xp: newXp,
            level: Math.max(user.level || 0, newLevel),
            claimedQrIds: [...claimed, qrData.id]
        };

        setUser(updatedUser);
        return {
            success: true,
            xpGained: addedXp,
            newTotalXp: newXp,
            newLevel,
            levelUp: newLevel > (user.level || 0)
        };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'Admin',
            login,
            loginAsDemo,
            register,
            claimQrReward,
            logout,
            isAuthModalOpen,
            openAuthModal: () => setIsAuthModalOpen(true),
            closeAuthModal: () => setIsAuthModalOpen(false)
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
