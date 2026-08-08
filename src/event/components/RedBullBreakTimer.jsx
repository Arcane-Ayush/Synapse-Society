import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Clock, Sparkles } from 'lucide-react';

export function RedBullBreakTimer({ durationSeconds = 15 * 60, isStage = false }) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className={`w-full ${isStage ? 'max-w-4xl' : 'max-w-xl'} mx-auto text-center`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-[2.5rem] ${isStage ? 'p-10 md:p-14' : 'p-6 md:p-8'} relative overflow-hidden backdrop-blur-2xl`}
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.25) 0%, rgba(30, 58, 138, 0.4) 60%, rgba(10, 10, 20, 0.98) 100%)',
                    border: '2px solid rgba(239, 68, 68, 0.5)',
                    boxShadow: '0 0 60px rgba(239, 68, 68, 0.3), inset 0 0 40px rgba(59, 130, 246, 0.2)'
                }}
            >
                {/* Lightning & Energy Rays */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-500/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Energy Drink Header */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-xs font-mono font-black text-red-300 uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    <Zap size={14} className="text-yellow-400 animate-bounce" />
                    RED BULL ENERGY BREAK • INTERMISSION
                </div>

                <h2 className={`${isStage ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'} font-black text-white tracking-tight mb-3`} style={{ fontFamily: 'Space Grotesk' }}>
                    Recharge Neural Cores
                </h2>
                <p className={`${isStage ? 'text-base' : 'text-xs'} font-mono text-zinc-300 max-w-lg mx-auto mb-8`}>
                    Grab a refreshment, recalibrate your models, and prepare for Round 2 & The Round of Redemption!
                </p>

                {/* Big Cyber Countdown Clock */}
                <div className="inline-block p-6 md:p-8 rounded-3xl bg-black/60 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] mb-6">
                    <div
                        className={`${isStage ? 'text-6xl sm:text-8xl' : 'text-5xl sm:text-6xl'} font-black font-mono tracking-widest`}
                        style={{
                            background: 'linear-gradient(180deg, #FFFFFF 0%, #FBBF24 50%, #EF4444 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 40px rgba(251, 191, 36, 0.5)'
                        }}
                    >
                        {formatted}
                    </div>
                    <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-red-300/80 mt-2">
                        BREAK TIMER REMAINING
                    </div>
                </div>

                {/* Esports Sponsor Footer */}
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-red-400 font-bold">
                        <Flame size={14} /> GIVES YOU WINGS
                    </span>
                    <span>•</span>
                    <span className="text-cyan-300">SYNAPSE SOCIETY ESPORTS ARENA</span>
                </div>
            </motion.div>
        </div>
    );
}
