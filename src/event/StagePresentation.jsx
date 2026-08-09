import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Radio, Trophy, Zap, Presentation, Activity, Maximize } from 'lucide-react';
import { StageKeynoteDeck } from './components/StageKeynoteDeck';
import { StageSessionView } from './components/StageSessionView';
import { DEFAULT_EVENT_STATE, subscribeToEventState } from './lib/eventState';

export function StagePresentation() {
    const [viewMode, setViewMode] = useState('presentation'); // 'presentation' | 'session'
    const [eventState, setEventState] = useState(DEFAULT_EVENT_STATE);

    useEffect(() => {
        const unsubscribe = subscribeToEventState((newState) => {
            if (newState) setEventState(newState);
        });
        return () => unsubscribe();
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {});
        } else {
            document.exitFullscreen().catch(err => {});
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#07070E] text-white flex flex-col justify-between p-6 sm:p-10 select-none relative overflow-hidden">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Stage Bar */}
            <div className="flex items-center justify-between z-20 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                        <Sparkles size={20} className="text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            SYNAPSE SOCIETY • NEURAL NEXUS
                        </h1>
                        <p className="text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
                            MAIN AUDITORIUM PROJECTOR STAGE • CHANDIGARH UNIVERSITY
                        </p>
                    </div>
                </div>

                {/* View Switcher Controls (Presentation | Session) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('presentation')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            viewMode === 'presentation'
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_#00F0FF]'
                                : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Presentation size={14} /> Presentation
                    </button>

                    <button
                        onClick={() => setViewMode('session')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            viewMode === 'session'
                                ? 'bg-purple-600 text-white shadow-[0_0_15px_#A855F7]'
                                : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Trophy size={14} /> Session
                    </button>

                    <button
                        onClick={toggleFullScreen}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 cursor-pointer"
                        title="Toggle Fullscreen"
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            </div>

            {/* Stage Center Display */}
            <div className="my-auto py-6 z-10 w-full">
                <AnimatePresence mode="wait">
                    {viewMode === 'presentation' ? (
                        <motion.div
                            key="presentation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StageKeynoteDeck currentPhase={eventState.phase} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="session"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StageSessionView eventState={eventState} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Stage Footer */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-4 border-t border-white/10 z-20">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>BROADCAST SYNC: ACTIVE</span>
                </div>
                <span>
                    {viewMode === 'presentation'
                        ? 'PRESS [LEFT / RIGHT ARROW] TO SWITCH SLIDES'
                        : 'REAL-TIME 3:7 MISSION CONTROL HUD'}
                </span>
            </div>
        </div>
    );
}
