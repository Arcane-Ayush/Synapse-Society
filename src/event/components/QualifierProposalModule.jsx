import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Send, CheckCircle2, Coins, Sparkles, FileText, Globe } from 'lucide-react';
import { addUserSCoins } from '../lib/eventState';

export function QualifierProposalModule({ user, prompt, assignedTeam, onSubmitted }) {
    const [proposalText, setProposalText] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!proposalText.trim()) return;

        setLoading(true);
        setTimeout(() => {
            addUserSCoins(user?.id, 200);
            setSubmitted(true);
            setLoading(false);
            if (onSubmitted) onSubmitted({ proposalText, demoUrl });
        }, 800);
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(10, 20, 30, 0.95) 0%, rgba(20, 10, 40, 0.95) 100%)',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Award size={18} className="text-yellow-400" />
                        <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            {prompt?.title || 'Round 2 · Qualifier Proposal'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono font-bold text-yellow-300">
                        <Coins size={12} className="text-yellow-400" />
                        +{prompt?.rewardSCoins || 500} S (= {Math.floor((prompt?.rewardSCoins || 500) / 10)} XP)
                    </div>
                </div>

                {assignedTeam && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                        <span className="text-lg">{assignedTeam.badge}</span>
                        <span className="text-cyan-300 font-bold">{assignedTeam.name}</span>
                    </div>
                )}

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-6">
                    <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                        {prompt?.description || 'Top 16 squads: Draft scalable cloud deployment architecture. Eliminated squads play the Redemption Quiz to reclaim points.'}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-cyan-300">
                        ⚡ Top finalists advance to Round 3 Grand Final. 10 S-Coins = 1 XP.
                    </div>
                </div>

                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center"
                    >
                        <CheckCircle2 size={36} className="text-cyan-400 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-cyan-200 uppercase font-mono tracking-wider">
                            Proposal Dispatched to Stage Judges!
                        </h4>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1">
                            Your submission is locked in for the finale deliberation.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-mono text-cyan-300/70 uppercase tracking-wider mb-1.5">
                                Executive Summary & Architecture Strategy *
                            </label>
                            <textarea
                                rows={4}
                                required
                                placeholder="Detail your team's technical approach and competitive edge..."
                                value={proposalText}
                                onChange={e => setProposalText(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-400/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-cyan-300/70 uppercase tracking-wider mb-1.5">
                                Live Demo / Slide Pitch Link
                            </label>
                            <input
                                type="url"
                                placeholder="https://demo.synapse.society or Canva / Figma link"
                                value={demoUrl}
                                onChange={e => setDemoUrl(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-cyan-400/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #00F0FF 0%, #3B82F6 100%)',
                                color: '#000000',
                                boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)'
                            }}
                        >
                            <Send size={14} />
                            {loading ? 'Transmitting Proposal...' : 'Lock In Proposal'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
