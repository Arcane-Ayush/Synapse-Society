import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Play, Pause, RotateCcw, PlusCircle } from 'lucide-react';

export function DualTimerController({
    roundDuration = 45 * 60,
    redBullDuration = 15 * 60,
    isAdmin = false,
    onTimerUpdate
}) {
    const [roundSeconds, setRoundSeconds] = useState(roundDuration);
    const [roundRunning, setRoundRunning] = useState(false);
    const [redBullSeconds, setRedBullSeconds] = useState(redBullDuration);
    const [redBullRunning, setRedBullRunning] = useState(false);

    // Round countdown tick
    useEffect(() => {
        let interval = null;
        if (roundRunning) {
            interval = setInterval(() => {
                setRoundSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [roundRunning]);

    // Red Bull countdown tick
    useEffect(() => {
        let interval = null;
        if (redBullRunning) {
            interval = setInterval(() => {
                setRedBullSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [redBullRunning]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* 1. Round Timer */}
            <div
                className="p-5 rounded-3xl backdrop-blur-xl relative overflow-hidden text-center"
                style={{
                    background: 'linear-gradient(145deg, rgba(13, 20, 35, 0.9) 0%, rgba(20, 10, 35, 0.9) 100%)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)'
                }}
            >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Clock size={14} /> ROUND TIME
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${roundRunning ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-zinc-400'}`}>
                        {roundRunning ? 'ACTIVE' : 'PAUSED'}
                    </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-widest my-2" style={{ textShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                    {formatTime(roundSeconds)}
                </div>

                {isAdmin && (
                    <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10">
                        <button
                            onClick={() => setRoundRunning(!roundRunning)}
                            className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                            {roundRunning ? <Pause size={14} /> : <Play size={14} />}
                            {roundRunning ? 'Pause' : 'Start'}
                        </button>
                        <button
                            onClick={() => setRoundSeconds(prev => prev + 300)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1 cursor-pointer"
                        >
                            <PlusCircle size={14} /> +5 Min
                        </button>
                        <button
                            onClick={() => { setRoundRunning(false); setRoundSeconds(roundDuration); }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-400 flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Red Bull Break Timer */}
            <div
                className="p-5 rounded-3xl backdrop-blur-xl relative overflow-hidden text-center"
                style={{
                    background: 'linear-gradient(145deg, rgba(35, 10, 15, 0.9) 0%, rgba(20, 10, 35, 0.9) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)'
                }}
            >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-red-400 font-bold flex items-center gap-1.5">
                        <Zap size={14} /> RED BULL BREAK
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${redBullRunning ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-white/5 text-zinc-400'}`}>
                        {redBullRunning ? 'ON AIR' : 'IDLE'}
                    </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black font-mono text-yellow-300 tracking-widest my-2" style={{ textShadow: '0 0 20px rgba(251,191,36,0.4)' }}>
                    {formatTime(redBullSeconds)}
                </div>

                {isAdmin && (
                    <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10">
                        <button
                            onClick={() => setRedBullRunning(!redBullRunning)}
                            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                            {redBullRunning ? <Pause size={14} /> : <Play size={14} />}
                            {redBullRunning ? 'Pause' : 'Start'}
                        </button>
                        <button
                            onClick={() => setRedBullSeconds(prev => prev + 300)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1 cursor-pointer"
                        >
                            <PlusCircle size={14} /> +5 Min
                        </button>
                        <button
                            onClick={() => { setRedBullRunning(false); setRedBullSeconds(redBullDuration); }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-400 flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
