import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn, signUp, resetPassword, signInWithGoogle } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';

const INPUT_STYLE = {
    background: 'rgba(var(--bg-glass-rgb), 0.8)',
    border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)',
    color: 'var(--text-primary)',
    fontFamily: 'Inter',
};
const INPUT_STYLE_FOCUS = {
    border: '1px solid rgba(var(--synapse-violet-light-rgb), 0.5)',
    boxShadow: '0 0 0 3px rgba(var(--synapse-violet-rgb), 0.1)',
};

function InputField({ label, type = 'text', value, onChange, icon: Icon, placeholder, showToggle, onToggle, showPassword }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)' }}>
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Icon size={15} style={{ color: 'rgba(var(--synapse-violet-light-rgb), 0.6)' }} />
                    </div>
                )}
                <input
                    type={showToggle ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-[rgba(var(--text-secondary-rgb), 0.25)]"
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
                            ? <EyeOff size={15} style={{ color: 'var(--synapse-violet-light)' }} />
                            : <Eye size={15} style={{ color: 'var(--synapse-violet-light)' }} />}
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
    background: 'rgba(var(--bg-glass-rgb), 0.95)',
    border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(var(--synapse-violet-rgb), 0.05)',
    backdropFilter: 'blur(24px)',
};

export function Login() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({ email: '', password: '', displayName: '' });
    const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    // Already logged in → redirect home
    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error: err } = await signIn(form.email, form.password);
                if (err) { setError(err.message); return; }
                navigate('/');
            } else if (mode === 'signup') {
                if (!form.displayName.trim()) { setError('Display name is required.'); return; }
                const { error: err } = await signUp(form.email, form.password, form.displayName);
                if (err) { setError(err.message); return; }
                setSuccess('Account created! Check your email to verify, then log in.');
                setMode('login');
            } else if (mode === 'reset') {
                const { error: err } = await resetPassword(form.email);
                if (err) { setError(err.message); return; }
                setSuccess('Password reset email sent! Check your inbox.');
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setLoading(true);
        setError('');
        try {
            const { error: err } = await signInWithGoogle();
            if (err) setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const titles = {
        login:  { heading: 'Welcome Back', sub: 'Sign in to your Synapse account' },
        signup: { heading: 'Join Synapse', sub: 'Create your account and start earning XP' },
        reset:  { heading: 'Reset Password', sub: 'Enter your email to receive a reset link' },
    };
    const { heading, sub } = titles[mode];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-md"
            >
                {/* Logo + heading */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                            style={{
                                background: 'rgba(var(--synapse-violet-rgb), 0.1)',
                                border: '1px solid rgba(var(--synapse-violet-rgb), 0.3)',
                                boxShadow: '0 0 20px rgba(var(--synapse-violet-rgb), 0.2)',
                            }}
                        >
                            <img src="/S_ofSynapseDark.png" alt="Synapse" className="w-full h-full object-contain" />
                        </div>
                    </Link>

                    <motion.h1
                        key={heading}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black tracking-tight mb-2"
                        style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}
                    >
                        {heading}
                    </motion.h1>
                    <p className="text-sm" style={{ color: 'rgba(var(--text-secondary-rgb), 0.55)', fontFamily: 'Inter' }}>
                        {sub}
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl p-8" style={CARD_STYLE}>
                    {/* Mode tabs (login / signup) */}
                    {mode !== 'reset' && (
                        <div
                            className="flex gap-1 p-1 rounded-xl mb-6"
                            style={{ background: 'rgba(var(--synapse-violet-rgb), 0.06)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.12)' }}
                        >
                            {['login', 'signup'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        background: mode === m ? 'rgba(var(--synapse-violet-rgb), 0.35)' : 'transparent',
                                        color: mode === m ? '#fff' : 'rgba(var(--text-secondary-rgb), 0.5)',
                                        border: mode === m ? '1px solid rgba(var(--synapse-violet-light-rgb), 0.3)' : '1px solid transparent',
                                    }}
                                >
                                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>
                    )}

                    {mode !== 'reset' && (
                        <div className="mb-6 flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: 'rgba(var(--text-primary-rgb, 255, 255, 255), 0.05)',
                                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'Inter'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="h-[1px] flex-1" style={{ background: 'rgba(var(--synapse-violet-rgb), 0.15)' }} />
                                <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)' }}>Or</span>
                                <div className="h-[1px] flex-1" style={{ background: 'rgba(var(--synapse-violet-rgb), 0.15)' }} />
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-4"
                            >
                                {mode === 'signup' && (
                                    <InputField
                                        label="Display Name"
                                        type="text"
                                        value={form.displayName}
                                        onChange={update('displayName')}
                                        icon={User}
                                        placeholder="Your name in the society"
                                    />
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

                        {/* Forgot password link */}
                        {mode === 'login' && (
                            <button
                                type="button"
                                onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                                className="text-xs text-right transition-colors hover:opacity-80"
                                style={{ color: 'rgba(var(--synapse-violet-light-rgb), 0.7)', fontFamily: 'Inter' }}
                            >
                                Forgot password?
                            </button>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                fontFamily: 'Space Grotesk',
                                background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                                color: 'var(--text-primary)',
                                boxShadow: loading ? 'none' : '0 0 24px rgba(var(--synapse-violet-rgb), 0.4)',
                            }}
                        >
                            {loading ? (
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? <><Zap size={14} /> Sign In</> :
                                     mode === 'signup' ? <><Zap size={14} /> Create Account</> :
                                     <><ArrowRight size={14} /> Send Reset Email</>}
                                </>
                            )}
                        </button>

                        {/* Back link from reset mode */}
                        {mode === 'reset' && (
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                className="text-xs text-center mt-1 transition-colors hover:opacity-80"
                                style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}
                            >
                                ← Back to Sign In
                            </button>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs mt-6" style={{ color: 'rgba(var(--text-secondary-rgb), 0.3)', fontFamily: 'Inter' }}>
                    Synapse Society · Chandigarh University
                </p>
            </motion.div>
        </div>
    );
}
