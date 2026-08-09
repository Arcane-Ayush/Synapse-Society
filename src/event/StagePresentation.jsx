import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Radio, Trophy, Zap, Presentation, Activity, Maximize, Minimize } from 'lucide-react';
import { PresentationDeck } from './presentation/PresentationDeck';
import { StageSessionView } from './components/StageSessionView';
import { DEFAULT_EVENT_STATE, subscribeToEventState } from './lib/eventState';

export function StagePresentation() {
    const [viewMode, setViewMode] = useState('presentation'); // 'presentation' | 'session'
    const [eventState, setEventState] = useState(DEFAULT_EVENT_STATE);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToEventState((newState) => {
            if (newState) setEventState(newState);
        });
        return () => unsubscribe();
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => {});
        }
    };

    return (
        <div className="h-screen w-screen max-h-screen bg-[#07070E] text-white flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Stage Header */}
            <div className="flex items-center justify-between z-20 pb-2 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                        <Sparkles size={16} className="text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-base font-black tracking-tight leading-none" style={{ fontFamily: 'Space Grotesk' }}>
                            SYNAPSE SOCIETY • NEURAL NEXUS 2026
                        </h1>
                        <p className="text-[9px] font-mono text-cyan-300 tracking-widest uppercase mt-0.5">
                            MAIN AUDITORIUM PROJECTOR STAGE • CHANDIGARH UNIVERSITY
                        </p>
                    </div>
                </div>

                {/* View Switcher Controls (Presentation | Session) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('presentation')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            viewMode === 'presentation'
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_#00F0FF]'
                                : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Presentation size={13} /> Keynote Deck
                    </button>

                    <button
                        onClick={() => setViewMode('session')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            viewMode === 'session'
                                ? 'bg-purple-600 text-white shadow-[0_0_15px_#A855F7]'
                                : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Trophy size={13} /> Arena Session
                    </button>

                    <button
                        onClick={toggleFullScreen}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 cursor-pointer"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                    </button>
                </div>
            </div>

            {/* Stage Center Display (Flex-1) */}
            <div className="flex-1 w-full my-auto py-2 z-10 flex flex-col justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    {viewMode === 'presentation' ? (
                        <motion.div
                            key="presentation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full h-full flex flex-col justify-between"
                        >
                            <PresentationDeck onSwitchToSession={() => setViewMode('session')} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="session"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full h-full overflow-y-auto custom-scrollbar"
                        >
                            <StageSessionView eventState={eventState} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stage Footer (Only shown during Session mode, since PresentationDeck has its own sleek HUD) */}
            {viewMode === 'session' && (
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-2 border-t border-white/10 z-20 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>BROADCAST SYNC: ACTIVE</span>
                    </div>
                    <span>REAL-TIME 3:7 MISSION CONTROL HUD</span>
                </div>
            )}
        </div>
    );
}
