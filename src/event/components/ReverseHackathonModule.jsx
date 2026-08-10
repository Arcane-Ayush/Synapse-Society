import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Clock, Zap, Coins, ExternalLink, ShieldCheck, Lightbulb } from 'lucide-react';
import { addUserSCoins } from '../lib/eventState';

export function ReverseHackathonModule({ user, prompt, assignedTeam, onSubmitted }) {
    const [repoUrl, setRepoUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!repoUrl.trim()) return;

        setLoading(true);
        setTimeout(() => {
            addUserSCoins(user?.id, 100);
            setSubmitted(true);
            setLoading(false);
            if (onSubmitted) onSubmitted({ repoUrl, notes });
        }, 800);
    };

    return (
        <div className="w-full max-w-xl mx-auto font-mono select-none">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(14, 12, 28, 0.95) 0%, rgba(20, 10, 35, 0.95) 100%)',
                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.4)',
                    boxShadow: '0 0 50px rgba(var(--synapse-violet-rgb), 0.25)'
                }}
            >
                {/* Header with Reward */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Lightbulb size={18} className="text-cyan-400" />
                        <h3 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            {prompt?.title || 'Round 1 · Problem Discovery'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono font-bold text-yellow-300">
                        <Coins size={12} className="text-yellow-400" />
                        +{prompt?.rewardSCoins || 300} S
                    </div>
                </div>

                {/* Challenge Card */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-6 space-y-2">
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {prompt?.description || 'Identify a real-world problem within your assigned domain, justify why it matters, and pitch how AI fits as the solution.'}
                    </p>
                    <div className="text-[11px] font-mono text-cyan-300 font-bold flex items-center justify-between">
                        <span>🎯 Assigned Domain: <strong className="text-yellow-300">{assignedTeam?.motto || 'Assigned by Ground Crew'}</strong></span>
                        <span>60s Live Pitch</span>
                    </div>
                </div>

                {/* Submission Form or Under Review */}
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center"
                    >
                        <ShieldCheck size={36} className="text-emerald-400 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-emerald-200 uppercase font-mono tracking-wider">
                            Solution Submitted • Live Jury Evaluation
                        </h4>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1">
                            Your presentation link has been synced with the jury deliberation panel. Standby for live pitch announcement!
                        </p>
                        <div className="mt-4 text-xs font-mono text-cyan-300 truncate bg-black/40 p-2 rounded-xl border border-white/5">
                            {repoUrl}
                        </div>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-mono text-purple-300/70 uppercase tracking-wider mb-1.5">
                                Presentation Deck / Pitch Document URL *
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://docs.google.com/presentation/d/..."
                                value={repoUrl}
                                onChange={e => setRepoUrl(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-purple-400/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-purple-300/70 uppercase tracking-wider mb-1.5">
                                Text output (Optional)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Summary / notes..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-purple-400/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #00F0FF 0%, #7C3AED 100%)',
                                color: '#FFFFFF',
                                boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)'
                            }}
                        >
                            <Send size={14} />
                            {loading ? 'Submitting Solution...' : 'Submit Round 1 Solution'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
