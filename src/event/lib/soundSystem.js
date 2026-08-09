import { supabase } from '../../lib/supabase';

const BROADCAST_CHANNEL_NAME = 'synapse_neural_nexus_2026';

/**
 * Web Audio API Sound Effects Synthesizer
 * Cleanly decoupled from UI and state logic.
 */
export function playEventSound(type = 'buzzer') {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (type === 'buzzer') {
            // Low-frequency esports buzzer for Time's Up
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.85);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.85);
        } else if (type === 'fanfare') {
            // Celebration fanfare
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            notes.forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = f;
                gain.gain.setValueAtTime(0, now + idx * 0.12);
                gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.7);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.12);
                osc.stop(now + idx * 0.12 + 0.7);
            });
        } else if (type === 'chime') {
            // Crisp transition chime
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.35);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'tick') {
            // Countdown tick
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    } catch (e) {}
}

/**
 * Broadcast sound effect across Supabase Realtime channel
 */
export async function broadcastPlaySound(soundType = 'buzzer') {
    playEventSound(soundType);
    try {
        const channel = supabase.channel(BROADCAST_CHANNEL_NAME);
        await channel.send({
            type: 'broadcast',
            event: 'play_sound',
            payload: { soundType }
        });
    } catch (e) {}
}
