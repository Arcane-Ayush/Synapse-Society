import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Radio, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AudienceTapModule({ onTriggerComplete }) {
    const [clicks, setClicks] = useState(0);
    const [cps, setCps] = useState(0);
    const [clickTimestamps, setClickTimestamps] = useState([]);
    const [ripples, setRipples] = useState([]);

    const handleTap = (e) => {
        // Haptic feedback
        if (navigator.vibrate) {
            try { navigator.vibrate(35); } catch (err) {}
        }

        const now = Date.now();
        setClicks(prev => prev + 1);

        // Calculate click rate (CPS)
        setClickTimestamps(prev => {
            const updated = [...prev, now];
            const recent = updated.filter(ts => now - ts <= 1000);
            setCps(recent.length);
            return updated;
        });

        // Create animated ripple on click position
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Math.random(), x, y };
        setRipples(prev => [...prev.slice(-8), newRipple]);

        // Broadcast to main stage arc reactor
        try {
            const channel = supabase.channel('synapse_inauguration_v8');
            channel.send({ type: 'broadcast', event: 'audience_click' });
        } catch (err) {}

        try {
            const localBc = new BroadcastChannel('synapse_inauguration_v8_local');
            localBc.postMessage({ type: 'click' });
            localBc.close();
        } catch (err) {}
    };

    const powerPercentage = Math.min(100, Math.floor((clicks / 50) * 100));

    return (
        <div className="w-full max-w-md mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(8, 20, 30, 0.95) 0%, rgba(15, 8, 30, 0.95) 100%)',
                    border: '1px solid rgba(0, 240, 255, 0.35)',
                    boxShadow: '0 0 50px rgba(0, 240, 255, 0.2)'
                }}
            >
                {/* Neon Header */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest mb-4">
                    <Radio size={12} className="animate-pulse text-cyan-400" />
                    AUDIENCE POWER MATRIX
                </div>

                <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Tap to Charge Stage Arc Reactor
                </h3>
                <p className="text-xs font-mono text-cyan-200/70 mb-6">
                    Spam-tap the reactor below to channel crowd kinetic power to the main stage widescreen projector!
                </p>

                {/* Big Arc Reactor Button */}
                <div className="relative my-6 flex items-center justify-center">
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={handleTap}
                        className="w-48 h-48 sm:w-56 sm:h-56 rounded-full relative flex flex-col items-center justify-center cursor-pointer transition-all duration-150 select-none overflow-hidden"
                        style={{
                            background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(124,58,237,0.3) 50%, rgba(6,10,20,0.95) 100%)',
                            border: '3px solid rgba(0, 240, 255, 0.7)',
                            boxShadow: `0 0 ${25 + cps * 8}px rgba(0, 240, 255, ${0.4 + cps * 0.05}), inset 0 0 35px rgba(0, 240, 255, 0.4)`
                        }}
                    >
                        {/* Spinning Outer Ring */}
                        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/50 animate-spin" style={{ animationDuration: '8s' }} />

                        {/* Ripples */}
                        {ripples.map(r => (
                            <motion.span
                                key={r.id}
                                initial={{ scale: 0, opacity: 0.8 }}
                                animate={{ scale: 3, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute w-12 h-12 rounded-full bg-cyan-400/40 pointer-events-none"
                                style={{ left: r.x - 24, top: r.y - 24 }}
                            />
                        ))}

                        <Zap size={44} className="text-cyan-300 drop-shadow-[0_0_15px_#00F0FF] mb-1" />
                        <span className="text-3xl font-black font-mono text-white tracking-wider">
                            {clicks}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase">
                            POWER SURGES
                        </span>
                    </motion.button>
                </div>

                {/* CPS & Power Level */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-400/20">
                        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Speed</div>
                        <div className="text-xl font-bold font-mono text-white flex items-center justify-center gap-1">
                            <Flame size={16} className="text-yellow-400" />
                            {cps} <span className="text-xs text-zinc-400">CPS</span>
                        </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-400/20">
                        <div className="text-[10px] font-mono text-purple-300 uppercase tracking-widest">Stage Output</div>
                        <div className="text-xl font-bold font-mono text-cyan-300">
                            {powerPercentage}%
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
