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
        } else if (type === 'thock') {
            // Dull mechanical keyboard switch "thock" for slide key presses
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(130, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(280, now);
            filter.frequency.exponentialRampToValueAtTime(100, now + 0.06);

            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.07);
        } else if (type === 'reactor') {
            // Pacific Rim / Iron Man Arc-Reactor charging & mechanical rotation turbine sound
            const osc = ctx.createOscillator();
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(55, now);
            osc.frequency.exponentialRampToValueAtTime(380, now + 1.6);

            // Sub-harmonic mechanical pulse modulation (rotation effect)
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(4, now);
            lfo.frequency.linearRampToValueAtTime(28, now + 1.6);
            lfoGain.gain.setValueAtTime(30, now);
            lfoGain.gain.linearRampToValueAtTime(80, now + 1.6);
            lfo.connect(osc.frequency);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.exponentialRampToValueAtTime(1400, now + 1.6);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            lfo.start(now);
            osc.start(now);
            lfo.stop(now + 1.8);
            osc.stop(now + 1.8);
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
