import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Music, ArrowLeft, RotateCcw, Zap } from 'lucide-react';

const AUDIO_TRACKS = [
    { id: 'AUDIO01',       label: 'Track 01',        file: '/audio/AUDIO01.mpeg' },
    { id: 'AUDO_02',       label: 'Track 02',        file: '/audio/AUDO_02.mpeg' },
    { id: 'AUDIO_03_low',  label: 'Track 03 (Low)',  file: '/audio/AUDIO_03_low.mpeg' },
    { id: 'AUDIO_04',      label: 'Track 04',        file: '/audio/AUDIO_04.mpeg' },
];

function TrackRow({ track, index }) {
    const audioRef = useRef(null);
    const [playing, setPlaying]   = useState(false);
    const [volume, setVolume]     = useState(0.7);
    const [muted, setMuted]       = useState(false);
    const [loaded, setLoaded]     = useState(false);

    useEffect(() => {
        const a = new Audio(track.file);
        a.loop = true;
        a.volume = 0.7;
        a.addEventListener('canplaythrough', () => setLoaded(true), { once: true });
        audioRef.current = a;
        return () => { a.pause(); audioRef.current = null; };
    }, [track.file]);

    const togglePlay = () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) { a.pause(); } else { a.play().catch(() => {}); }
        setPlaying(p => !p);
    };

    const handleVolume = (v) => {
        const val = parseFloat(v);
        setVolume(val);
        if (audioRef.current) audioRef.current.volume = muted ? 0 : val;
    };

    const toggleMute = () => {
        const next = !muted;
        setMuted(next);
        if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
    };

    const reset = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setPlaying(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                playing
                    ? 'bg-cyan-950/30 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                    : 'bg-black/30 border-white/8 hover:border-white/15'
            }`}
        >
            {/* Track number */}
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-500 font-mono">
                {String(index + 1).padStart(2, '0')}
            </div>

            {/* Play/Pause */}
            <button
                onClick={togglePlay}
                disabled={!loaded}
                className={`flex-shrink-0 p-2.5 rounded-xl cursor-pointer transition-all active:scale-95 disabled:opacity-40 ${
                    playing
                        ? 'bg-cyan-500 text-black shadow-[0_0_16px_#00F0FF60]'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                }`}
                title={playing ? 'Pause' : (loaded ? 'Play' : 'Loading...')}
            >
                {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Track Name + loading dot */}
            <div className="flex-shrink-0 w-32">
                <div className="text-xs font-mono text-white font-bold truncate">{track.label}</div>
                <div className={`text-[10px] font-mono mt-0.5 ${playing ? 'text-cyan-400' : 'text-zinc-600'}`}>
                    {playing ? '▶ Playing' : loaded ? 'Ready' : 'Loading…'}
                </div>
            </div>

            {/* Volume Slider */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={e => handleVolume(e.target.value)}
                    className="flex-1 h-1.5 accent-cyan-400 cursor-pointer"
                    style={{ accentColor: muted ? '#52525b' : '#00F0FF' }}
                />
                <span className="text-[10px] font-mono text-zinc-500 w-8 text-right flex-shrink-0">
                    {muted ? 'OFF' : `${Math.round(volume * 100)}%`}
                </span>
            </div>

            {/* Mute */}
            <button
                onClick={toggleMute}
                className={`flex-shrink-0 p-2 rounded-xl cursor-pointer transition-all ${
                    muted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                }`}
                title={muted ? 'Unmute' : 'Mute'}
            >
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            {/* Reset */}
            <button
                onClick={reset}
                className="flex-shrink-0 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-all"
                title="Stop & Reset"
            >
                <RotateCcw size={12} />
            </button>
        </motion.div>
    );
}

export function EventAudio() {
    return (
        <div className="min-h-screen bg-[#07070E] text-white font-mono relative overflow-hidden">
            {/* Ambient bg */}
            <div className="fixed inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="fixed -top-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                            <Music size={20} className="text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                Audio Mixer
                            </h1>
                            <p className="text-[11px] text-zinc-500">Neural Nexus · Event Sound Control</p>
                        </div>
                    </div>
                    <a
                        href="/event-admin"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all"
                    >
                        <ArrowLeft size={12} /> Mission Control
                    </a>
                </motion.div>

                {/* Info bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-yellow-500/8 border border-yellow-500/20 text-[11px] text-yellow-300/80"
                >
                    <Zap size={12} className="flex-shrink-0" />
                    Each track loops independently. Adjusting volume or muting does not affect other tracks.
                </motion.div>

                {/* Tracks */}
                <div className="space-y-2.5">
                    {AUDIO_TRACKS.map((track, i) => (
                        <TrackRow key={track.id} track={track} index={i} />
                    ))}
                </div>

                {/* Footer note */}
                <div className="text-[10px] text-zinc-700 text-center font-mono">
                    Tracks served from /public/audio · Add more .mpeg files and update AUDIO_TRACKS in EventAudio.jsx
                </div>
            </div>
        </div>
    );
}
