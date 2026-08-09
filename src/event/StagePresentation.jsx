import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, Trophy, Maximize, Minimize } from 'lucide-react';
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
        <div className="h-screen w-screen max-h-screen bg-[#07070E] text-white flex flex-col justify-between p-3 sm:p-5 select-none relative overflow-hidden font-mono">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle Floating Corner Overlay Controls (Zero Top-Bar Clutter) */}
            <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 p-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl opacity-40 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setViewMode('presentation')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewMode === 'presentation'
                            ? 'bg-cyan-500 text-black shadow-[0_0_12px_#00F0FF]'
                            : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                    title="Keynote Deck View"
                >
                    <Presentation size={13} /> Deck
                </button>

                <button
                    onClick={() => setViewMode('session')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewMode === 'session'
                            ? 'bg-purple-600 text-white shadow-[0_0_12px_#A855F7]'
                            : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                    title="Live Arena Session View"
                >
                    <Trophy size={13} /> Arena
                </button>

                <button
                    onClick={toggleFullScreen}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 cursor-pointer"
                    title="Toggle Fullscreen (F)"
                >
                    {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
                </button>
            </div>

            {/* Stage Center Display (100% Full Viewport) */}
            <div className="flex-1 w-full h-full my-auto z-10 flex flex-col justify-center overflow-hidden">
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
                            className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col justify-between"
                        >
                            <StageSessionView eventState={eventState} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
