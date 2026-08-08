import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, Award, Coins, QrCode, User, CheckCircle2 } from 'lucide-react';
import { generateAgentNumber, sCoinsToXp } from '../lib/eventState';

export function AgentIdBadge({ user, profile, isDocked = false, assignedTeam = null, sCoins = 0 }) {
    const agentNo = generateAgentNumber(user, profile);
    const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Neural Agent';
    const username = profile?.username || user?.email?.split('@')[0] || 'agent';
    const level = profile?.current_level ?? 1;
    const xp = profile?.xp ?? 0;
    const avatarUrl = profile?.avatar_url;
    const convertedXp = sCoinsToXp(sCoins);

    // ── DOCKED COMPACT HUD BADGE (Phase 1+) ──────────────────────────────────────
    if (isDocked) {
        return (
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full sticky top-3 z-40 px-3"
            >
                <div
                    className="max-w-xl mx-auto rounded-2xl p-3 px-4 flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(13, 13, 22, 0.95) 0%, rgba(20, 15, 35, 0.95) 100%)',
                        border: assignedTeam ? `1px solid ${assignedTeam.color}66` : '1px solid rgba(var(--synapse-violet-rgb), 0.35)',
                        boxShadow: assignedTeam ? `0 0 25px ${assignedTeam.color}22` : '0 0 25px rgba(var(--synapse-violet-rgb), 0.2)'
                    }}
                >
                    {/* Left: Avatar + Agent # */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} className="w-9 h-9 rounded-xl object-cover border border-purple-400/40" />
                            ) : (
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs"
                                    style={{
                                        background: assignedTeam ? `${assignedTeam.color}25` : 'rgba(var(--synapse-violet-rgb), 0.25)',
                                        color: assignedTeam ? assignedTeam.color : 'var(--synapse-violet-light)',
                                        border: `1px solid ${assignedTeam ? assignedTeam.color : 'var(--synapse-violet-light)'}44`
                                    }}
                                >
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                            </span>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-400">
                                    AGENT #{agentNo}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-purple-200/60">
                                    LVL {level}
                                </span>
                            </div>
                            <h4 className="text-xs font-bold truncate text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                {displayName}
                            </h4>
                        </div>
                    </div>

                    {/* Right: Team Tag & S-Coins */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {assignedTeam ? (
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold font-mono"
                                style={{
                                    background: `${assignedTeam.color}15`,
                                    border: `1px solid ${assignedTeam.color}44`,
                                    color: assignedTeam.color
                                }}
                            >
                                <span>{assignedTeam.badge}</span>
                                <span className="truncate max-w-[100px] text-[11px]">{assignedTeam.code}</span>
                            </motion.div>
                        ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse">
                                Unassigned
                            </span>
                        )}

                        {sCoins > 0 && (
                            <div className="px-2 py-1 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center gap-1 text-[11px] font-mono font-bold text-purple-200">
                                <Coins size={11} className="text-yellow-400" />
                                <span>{sCoins} S</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── FULL CYBERNETIC AGENT ID CARD (Phase 0 Check-In) ──────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-md mx-auto"
        >
            <div
                className="relative rounded-[2rem] p-6 md:p-8 overflow-hidden backdrop-blur-2xl transition-all duration-500"
                style={{
                    background: 'linear-gradient(145deg, rgba(14, 14, 25, 0.95) 0%, rgba(22, 14, 40, 0.95) 100%)',
                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.35)',
                    boxShadow: '0 0 50px rgba(var(--synapse-violet-rgb), 0.25), inset 0 0 30px rgba(var(--synapse-violet-rgb), 0.05)'
                }}
            >
                {/* Neon Background Circuit Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Top Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-300 font-bold">
                            SYNAPSE SOCIETY • NEURAL NEXUS
                        </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] text-purple-200/80">
                        LIVE PASS
                    </span>
                </div>

                {/* Agent Number Prominent Hero */}
                <div className="text-center py-4 mb-6 relative">
                    <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-purple-300/60 mb-1">
                        CONFIRMED ATTENDEE SEQUENCE
                    </div>
                    <div
                        className="text-4xl sm:text-5xl font-black font-mono tracking-tight"
                        style={{
                            background: 'linear-gradient(135deg, #00F0FF 0%, #A855F7 50%, #EC4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 30px rgba(0,240,255,0.4)'
                        }}
                    >
                        AGENT #{agentNo}
                    </div>
                    <p className="text-[11px] font-mono text-purple-200/50 mt-1">
                        Issued for Neural Nexus 2026 • Seminar Hall Block E
                    </p>
                </div>

                {/* Identity Center Box */}
                <div className="rounded-2xl bg-black/40 border border-white/10 p-4 mb-6 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/40" />
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border-2 border-cyan-400/40 flex items-center justify-center text-xl font-bold text-cyan-300">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-black truncate text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            {displayName}
                        </h3>
                        <p className="text-xs font-mono text-purple-300/70 truncate">@{username}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 font-bold border border-purple-400/30">
                                Level {level}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">
                                {xp} XP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Team Status Card / Awaiting Signal */}
                <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-purple-300/60 uppercase tracking-wider text-[10px]">Assigned Faction</span>
                        <span className="text-cyan-400 text-[10px] flex items-center gap-1">
                            <Sparkles size={10} /> Auto-Sync
                        </span>
                    </div>

                    {assignedTeam ? (
                        <div
                            className="p-3 rounded-xl flex items-center gap-3"
                            style={{
                                background: `${assignedTeam.color}15`,
                                border: `1px solid ${assignedTeam.color}44`
                            }}
                        >
                            <span className="text-2xl">{assignedTeam.badge}</span>
                            <div>
                                <h4 className="font-bold text-sm" style={{ color: assignedTeam.color }}>
                                    {assignedTeam.name}
                                </h4>
                                <p className="text-[10px] font-mono text-zinc-400">{assignedTeam.motto}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center">
                            <p className="text-xs text-purple-200 font-mono">
                                ⏳ Waiting for Admin Team Alignment Signal...
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                                Ground crew will broadcast team assignments shortly
                            </p>
                        </div>
                    )}
                </div>

                {/* S-Coins Balance Bar */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <Coins size={14} className="text-yellow-400" />
                        <span className="text-yellow-200 font-bold">Event S-Coins:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-yellow-300">{sCoins} S-Coins</span>
                        <span className="text-[10px] text-zinc-400">(= +{convertedXp} XP)</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
