import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Shield, Zap, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, login, register, loginAsDemo } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!isAuthModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || (mode === 'register' && !name)) {
            setError('Please fill in all fields.');
            return;
        }

        if (mode === 'login') {
            login(email, password);
        } else {
            register(name, email, password);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAuthModal}
                    className="absolute inset-0"
                    style={{ background: 'rgba(5, 5, 12, 0.85)', backdropFilter: 'blur(16px)' }}
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-md p-8 rounded-3xl overflow-hidden shadow-2xl z-10"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16, 12, 32, 0.95), rgba(8, 6, 18, 0.98))',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        boxShadow: '0 0 50px rgba(124, 58, 237, 0.25), inset 0 0 20px rgba(124, 58, 237, 0.05)'
                    }}
                >
                    {/* Glowing Accent Lines */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                         style={{ background: 'linear-gradient(90deg, transparent, #A855F7, #D946EF, transparent)' }} />

                    {/* Close Button */}
                    <button
                        onClick={closeAuthModal}
                        className="absolute top-5 right-5 p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Modal Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3"
                             style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                            <Shield className="w-6 h-6 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            {mode === 'login' ? 'Synapse Member Auth' : 'Create Member Identity'}
                        </h2>
                        <p className="text-xs text-purple-300/60 mt-1 font-mono">
                            AUTHENTICATION PROTOCOL • SYNAPSE SOCIETY
                        </p>
                    </div>

                    {/* Tab Selection */}
                    <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <button
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-300/60 hover:text-white'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { setMode('register'); setError(''); }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'register' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-300/60 hover:text-white'}`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Quick Demo Login Option */}
                    <div className="mb-6 p-3 rounded-2xl" style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px border rgba(124, 58, 237, 0.2)' }}>
                        <div className="flex items-center gap-2 mb-2 text-[11px] font-mono text-purple-300/80">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>QUICK DEMO AUTH (ONE-CLICK ACCESS)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            <button
                                onClick={() => loginAsDemo('member')}
                                className="py-2 px-2 text-[11px] font-mono rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 flex items-center justify-center gap-1 transition-all"
                            >
                                <Zap className="w-3 h-3 text-amber-400" />
                                Member
                            </button>
                            <button
                                onClick={() => loginAsDemo('lead')}
                                className="py-2 px-2 text-[11px] font-mono rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 flex items-center justify-center gap-1 transition-all"
                            >
                                <Zap className="w-3 h-3 text-fuchsia-400" />
                                Lead
                            </button>
                            <button
                                onClick={() => loginAsDemo('admin')}
                                className="py-2 px-2 text-[11px] font-mono rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-500/40 flex items-center justify-center gap-1 transition-all"
                            >
                                <Shield className="w-3 h-3 text-amber-400" />
                                Admin
                            </button>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="w-full border-t border-purple-900/40"></div>
                        <span className="absolute px-3 bg-[#0d091a] text-[10px] font-mono text-purple-400/50">OR USE CREDENTIALS</span>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs text-center">
                            {error}
                        </div>
                    )}

                    {/* Auth Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-mono text-purple-300/80 mb-1">FULL NAME</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-3 w-4 h-4 text-purple-400/50" />
                                    <input
                                        type="text"
                                        placeholder="Alex Mercer"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-white placeholder-purple-300/30 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-mono text-purple-300/80 mb-1">CAMPUS EMAIL</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-purple-400/50" />
                                <input
                                    type="email"
                                    placeholder="student@synapse.cu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-white placeholder-purple-300/30 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-purple-300/80 mb-1">SECURITY KEY / PASSWORD</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-purple-400/50" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-white placeholder-purple-300/30 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all mt-6"
                        >
                            <LogIn className="w-4 h-4" />
                            {mode === 'login' ? 'Access Synapse Network' : 'Initialize Identity'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
