import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Coins, ShieldCheck, Lightbulb, FileText } from 'lucide-react';
import { addUserSCoins } from '../lib/eventState';
import { supabase } from '../../lib/supabase';

export function ReverseHackathonModule({ user, prompt, assignedTeam, onSubmitted }) {
    const [pitchScript, setPitchScript] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const domain = (assignedTeam?.motto || '')
        .replace('Domain: ', '')
        .replace('App: ', '')
        .trim() || 'Assigned by Ground Crew';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pitchScript.trim()) {
            setError('Pitch script cannot be empty.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            // Store submission in event_submissions table
            if (assignedTeam?.id && user?.id) {
                await supabase.from('event_submissions').upsert({
                    team_id: assignedTeam.id,
                    user_id: user.id,
                    round: 1,
                    notes: pitchScript.trim(),
                    s_coins_awarded: prompt?.rewardSCoins || 300,
                    submitted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'team_id,round' });
            }
            addUserSCoins(user?.id, prompt?.rewardSCoins || 300);
            setSubmitted(true);
            if (onSubmitted) onSubmitted({ pitchScript });
        } catch (err) {
            setError('Submission failed. Try again.');
        } finally {
            setLoading(false);
        }
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
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Lightbulb size={18} className="text-cyan-400" />
                        <h3 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Round 1 · Problem Discovery
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono font-bold text-yellow-300">
                        <Coins size={12} className="text-yellow-400" />
                        +{prompt?.rewardSCoins || 300} S
                    </div>
                </div>

                {/* Challenge Card */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 mb-5 space-y-1.5">
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        Identify one real-world problem within your assigned domain. Explain why it matters, and explain why AI is the right solution.
                    </p>
                    <div className="text-[11px] font-mono text-cyan-300 font-bold flex items-center justify-between">
                        <span>🎯 Domain: <strong className="text-yellow-300">{domain}</strong></span>
                        <span>10 Min Prep · 60s Pitch</span>
                    </div>
                </div>

                {/* Submitted State */}
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center"
                    >
                        <ShieldCheck size={36} className="text-emerald-400 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-emerald-200 uppercase font-mono tracking-wider">
                            Script Locked In · Standby for Live Pitch
                        </h4>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1">
                            Your pitch script has been saved. Prepare for your 60-second stage presentation.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-mono text-purple-300/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <FileText size={11} /> Pitch Script *
                            </label>
                            <textarea
                                rows={7}
                                required
                                placeholder="Write your full pitch script here — problem statement, why it matters, how AI solves it..."
                                value={pitchScript}
                                onChange={e => { setPitchScript(e.target.value); setError(null); }}
                                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-purple-400/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed"
                            />
                            <div className="text-[10px] text-zinc-500 font-mono mt-1 text-right">
                                {pitchScript.length} chars
                            </div>
                        </div>

                        {error && (
                            <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !pitchScript.trim()}
                            className="w-full py-3.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #00F0FF 0%, #7C3AED 100%)',
                                color: '#FFFFFF',
                                boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)'
                            }}
                        >
                            <Send size={14} />
                            {loading ? 'Saving...' : 'Submit Round 1 Script'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
