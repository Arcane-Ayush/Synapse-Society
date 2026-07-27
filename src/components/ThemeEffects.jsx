import { useEffect, useRef, useState } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const CLICK_SOUND_FREQ = 300; // Arcade blip frequency

export function ThemeEffects() {
    const { theme } = useTheme();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]);

    // Audio Context Ref
    const audioContextRef = useRef(null);

    // --- SOUND EFFECTS (Arcade) ---
    const playClickSound = () => {
        if (theme !== themes.ARCADE) return;

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(CLICK_SOUND_FREQ, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', playClickSound);
        return () => window.removeEventListener('mousedown', playClickSound);
    }, [theme]);


    // --- CURSOR TRAIL LOGIC (Global) ---
    useEffect(() => {
        // Track mouse for all themes that need trails
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            const newPoint = {
                x: e.clientX,
                y: e.clientY,
                id: Date.now(),
                // Random offset for space dust scatter
                offsetX: (Math.random() - 0.5) * 10,
                offsetY: (Math.random() - 0.5) * 10
            };

            // Limit trail length based on theme for performance/esthetics
            const limit = theme === themes.ARCADE ? 8 : 15;
            setTrail(prev => [...prev.slice(-limit), newPoint]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [theme]);

    // Cleanup old trail points
    useEffect(() => {
        const interval = setInterval(() => {
            setTrail(prev => prev.filter(p => Date.now() - p.id < 500));
        }, 50);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <AnimatePresence>
                {/* ANIME: Pink Sparkles */}
                {theme === themes.ANIME && trail.map((point) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute rounded-full bg-pink-400"
                        //CSS----
                        style={{
                            left: point.x,
                            top: point.y,
                            width: '8px',
                            height: '8px',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 10px #ff69b4'
                        }}
                    />
                ))}

                {/* BASIC (SPACE): Stardust */}
                {theme === themes.BASIC && trail.map((point, i) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: point.x + (point.offsetX || 0),
                            top: point.y + (point.offsetY || 0),
                            width: i % 2 === 0 ? '4px' : '2px', // Varied star sizes
                            height: i % 2 === 0 ? '4px' : '2px',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 8px cyan' // Space glow
                        }}
                    />
                ))}

                {/* ARCADE: Pixel Squares */}
                {theme === themes.ARCADE && trail.map((point, i) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 1, scale: 1, rotate: 0 }}
                        animate={{ opacity: 0, scale: 0, rotate: 45 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute"
                        style={{
                            left: point.x,
                            top: point.y,
                            width: '10px',
                            height: '10px',
                            backgroundColor: i % 2 === 0 ? '#00ffff' : '#ff00ff', // Alt Cyan/Magenta
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 4px currentColor',
                            imageRendering: 'pixelated'
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
