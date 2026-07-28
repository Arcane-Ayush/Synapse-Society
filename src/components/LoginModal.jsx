import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, User, AtSign, ArrowRight, AlertCircle, CheckCircle, X } from 'lucide-react';
import { signIn, signUp, resetPassword } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';

const INPUT_STYLE = {
    background: 'rgba(12,12,20,0.8)',
    border: '1px solid rgba(124,58,237,0.2)',
    color: '#F5F3FF',
    fontFamily: 'Inter',
};
const INPUT_STYLE_FOCUS = {
    border: '1px solid rgba(168,85,247,0.5)',
    boxShadow: '0 0 0 3px rgba(124,58,237,0.1)',
};

function InputField({ label, type = 'text', value, onChange, icon: Icon, placeholder, showToggle, onToggle, showPassword }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'rgba(196,181,253,0.6)' }}>
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Icon size={15} style={{ color: 'rgba(168,85,247,0.6)' }} />
                    </div>
                )}
                <input
                    type={showToggle ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-[rgba(196,181,253,0.25)]"
                    style={INPUT_STYLE}
                    onFocus={e => Object.assign(e.target.style, INPUT_STYLE_FOCUS)}
                    onBlur={e => Object.assign(e.target.style, INPUT_STYLE)}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100 opacity-50"
                    >
                        {showPassword
                            ? <EyeOff size={15} style={{ color: '#A855F7' }} />
                            : <Eye size={15} style={{ color: '#A855F7' }} />}
                    </button>
                )}
            </div>
        </div>
    );
}

function Alert({ type, message }) {
    if (!message) return null;
    const isError = type === 'error';
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl text-sm"
            style={{
                background: isError ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${isError ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
                color: isError ? '#FCA5A5' : '#6EE7B7',
                fontFamily: 'Inter',
            }}
        >
            {isError ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
            {message}
        </motion.div>
    );
}

const CARD_STYLE = {
    background: 'rgba(8,8,14,0.96)',
    border: '1px solid rgba(168,85,247,0.3)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.2)',
    backdropFilter: 'blur(24px)',
};

export function LoginModal({ isOpen, onClose, initialMode = 'login', titleOverride, subtitleOverride }) {
    const { isAuthenticated } = useAuth();
    const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'reset'
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({ email: '', password: '', displayName: '', username: '' });
    const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    // Reset mode on reopen
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError('');
            setSuccess('');
        }
    }, [isOpen, initialMode]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // If authenticated while modal open, close it automatically
    useEffect(() => {
        if (isAuthenticated && isOpen) {
            onClose();
        }
    }, [isAuthenticated, isOpen, onClose]);

    if (!isOpen || typeof document === 'undefined') return null;

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error: err } = await signIn(form.email, form.password);
                if (err) {
                    if (err.message.includes('Email not confirmed')) {
                        setError('Email not confirmed -- check your mail');
                    } else {
                        setError(err.message);
                    }
                    return;
                }
                onClose();
            } else if (mode === 'signup') {
                if (!form.displayName.trim()) { setError('Display name is required.'); return; }
                const { error: signUpErr } = await signUp(form.email, form.password, form.displayName);
                if (signUpErr) {
                    setError(signUpErr.message);
                    return;
                }

                // Attempt auto-login
                const { error: signInErr } = await signIn(form.email, form.password);
                if (signInErr) {
                    if (signInErr.message.includes('Email not confirmed')) {
                        setSuccess('Account created! Please check your email to confirm your account.');
                    } else {
                        setError(signInErr.message);
                    }
                    return;
                }

                setSuccess('Account created! Logging you in...');
                setTimeout(() => onClose(), 1200);
            } else if (mode === 'reset') {
                const { error: err } = await resetPassword(form.email);
                if (err) { setError(err.message); return; }
                setSuccess('Password reset email sent! Check your inbox.');
            }
        } finally {
            setLoading(false);
        }
    }

    const titles = {
        login: { heading: titleOverride || 'Sign In to Synapse', sub: subtitleOverride || 'Log in to access your card deck, quests & factions.' },
        signup: { heading: 'Join Synapse Society', sub: 'Create your account and claim your Level 0 Access Pass!' },
        reset: { heading: 'Reset Password', sub: 'Enter your email to receive a recovery link.' },
    };
    const { heading, sub } = titles[mode];

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose} // Tapping dark backdrop dismisses the modal
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 cursor-pointer overflow-y-auto"
                style={{
                    background: 'rgba(5, 5, 8, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                }}
            >
                {/* Modal Container — prevent click propagation inside card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-md rounded-3xl p-8 relative cursor-default my-8"
                    style={CARD_STYLE}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full transition-all duration-200 hover:bg-white/10 text-purple-300/70 hover:text-white"
                        title="Close (Esc)"
                    >
                        <X size={18} />
                    </button>

                    {/* Logo & Header */}
                    <div className="text-center mb-6 pr-6 pl-2">
                        <div
                            className="w-12 h-12 rounded-full mx-auto flex items-center justify-center overflow-hidden mb-4"
                            style={{
                                background: 'rgba(124,58,237,0.12)',
                                border: '1px solid rgba(168,85,247,0.3)',
                                boxShadow: '0 0 24px rgba(124,58,237,0.25)',
                            }}
                        >
                            <img src="/S_ofSynapseDark.png" alt="Synapse" className="w-full h-full object-contain" />
                        </div>

                        <h2
                            className="text-2xl font-black tracking-tight mb-1"
                            style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}
                        >
                            {heading}
                        </h2>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(196,181,253,0.55)', fontFamily: 'Inter' }}>
                            {sub}
                        </p>
                    </div>

                    {/* Mode Tabs */}
                    {mode !== 'reset' && (
                        <div
                            className="flex gap-1 p-1 rounded-xl mb-6"
                            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
                        >
                            {['login', 'signup'].map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                                    className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 uppercase"
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        background: mode === m ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.3))' : 'transparent',
                                        color: mode === m ? '#fff' : 'rgba(196,181,253,0.45)',
                                        border: mode === m ? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent',
                                        boxShadow: mode === m ? '0 0 12px rgba(124,58,237,0.2)' : 'none',
                                    }}
                                >
                                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-3.5"
                            >
                                {mode === 'signup' && (
                                    <>
                                        <InputField
                                            label="Display Name"
                                            type="text"
                                            value={form.displayName}
                                            onChange={update('displayName')}
                                            icon={User}
                                            placeholder="Your full name"
                                        />
                                        <InputField
                                            label="Username (Optional)"
                                            type="text"
                                            value={form.username}
                                            onChange={update('username')}
                                            icon={AtSign}
                                            placeholder="handle (e.g. cyber_samurai)"
                                        />
                                    </>
                                )}
                                <InputField
                                    label="Email Address"
                                    type="email"
                                    value={form.email}
                                    onChange={update('email')}
                                    icon={Mail}
                                    placeholder="you@example.com"
                                />
                                {mode !== 'reset' && (
                                    <InputField
                                        label="Password"
                                        value={form.password}
                                        onChange={update('password')}
                                        icon={Lock}
                                        placeholder="••••••••"
                                        showToggle
                                        showPassword={showPassword}
                                        onToggle={() => setShowPassword(p => !p)}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <Alert type="error" message={error} />
                        <Alert type="success" message={success} />

                        {mode === 'login' && (
                            <button
                                type="button"
                                onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                                className="text-xs text-right transition-colors hover:opacity-80"
                                style={{ color: 'rgba(168,85,247,0.7)', fontFamily: 'Inter' }}
                            >
                                Forgot password?
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 cursor-pointer"
                            style={{
                                fontFamily: 'Space Grotesk',
                                background: 'linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)',
                                color: '#fff',
                                boxShadow: '0 0 28px rgba(168,85,247,0.4)',
                            }}
                        >
                            {loading ? (
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? <><Zap size={14} /> Sign In</> :
                                        mode === 'signup' ? <><Zap size={14} /> Create Account</> :
                                            <><ArrowRight size={14} /> Send Reset Link</>}
                                </>
                            )}
                        </button>

                        {mode === 'reset' && (
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                className="text-xs text-center mt-1 transition-colors hover:opacity-80"
                                style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Inter' }}
                            >
                                ← Back to Sign In
                            </button>
                        )}
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
