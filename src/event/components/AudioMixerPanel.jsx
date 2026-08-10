import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

const AUDIO_TRACKS = [
    { id: 'AUDIO01', label: 'Track 01', file: '/audio/AUDIO01.mpeg' },
    { id: 'AUDO_02', label: 'Track 02', file: '/audio/AUDO_02.mpeg' },
    { id: 'AUDIO_03_low', label: 'Track 03 (Low)', file: '/audio/AUDIO_03_low.mpeg' },
    { id: 'AUDIO_04', label: 'Track 04', file: '/audio/AUDIO_04.mpeg' },
];

function TrackRow({ track }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(track.file);
            audioRef.current.loop = true;
        }
        audioRef.current.volume = muted ? 0 : volume;
    }, [volume, muted]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setPlaying(prev => !prev);
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

    return (
        <div className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
            playing
                ? 'bg-cyan-950/30 border-cyan-500/40'
                : 'bg-black/30 border-white/5'
        }`}>
            {/* Play/Pause */}
            <button
                onClick={togglePlay}
                className={`flex-shrink-0 p-2 rounded-lg cursor-pointer transition-all ${
                    playing
                        ? 'bg-cyan-500 text-black shadow-[0_0_12px_#00F0FF60]'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                }`}
                title={playing ? 'Pause' : 'Play'}
            >
                {playing ? <Pause size={13} /> : <Play size={13} />}
            </button>

            {/* Track Name */}
            <span className="text-xs font-mono text-zinc-300 w-28 truncate flex-shrink-0">
                {track.label}
            </span>

            {/* Volume Slider */}
            <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => handleVolume(e.target.value)}
                className="flex-1 h-1 accent-cyan-400 cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
            />

            {/* Volume % */}
            <span className="text-[10px] font-mono text-zinc-500 w-7 text-right flex-shrink-0">
                {Math.round(volume * 100)}
            </span>

            {/* Mute */}
            <button
                onClick={toggleMute}
                className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 cursor-pointer"
                title={muted ? 'Unmute' : 'Mute'}
            >
                {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
        </div>
    );
}

export function AudioMixerPanel() {
    return (
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-cyan-500/20 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Music size={14} /> Audio Mixer
                <span className="text-zinc-500 font-normal normal-case tracking-normal ml-1">
                    · {AUDIO_TRACKS.length} tracks from /public/audio
                </span>
            </div>
            <div className="space-y-1.5">
                {AUDIO_TRACKS.map(track => (
                    <TrackRow key={track.id} track={track} />
                ))}
            </div>
        </div>
    );
}
