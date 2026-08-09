import React, { useEffect, useRef } from 'react';

export function PresentationCircuitCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Particle nodes
        const nodes = [];
        const nodeCount = Math.min(55, Math.floor((width * height) / 22000));
        const colors = ['#A855F7', '#7C3AED', '#E086FF', '#00F0FF', '#38BDF8'];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        // Circuit energy pulses
        const pulses = [];
        let mouseX = width / 2;
        let mouseY = height / 2;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Subtle mouse radial glow
            const radialGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
            radialGlow.addColorStop(0, 'rgba(168, 85, 247, 0.09)');
            radialGlow.addColorStop(0.5, 'rgba(0, 240, 255, 0.03)');
            radialGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = radialGlow;
            ctx.fillRect(0, 0, width, height);

            // Connect nodes with Manhattan right-angle circuit trace lines
            for (let i = 0; i < nodes.length; i++) {
                const n1 = nodes[i];
                n1.x += n1.vx;
                n1.y += n1.vy;

                if (n1.x < 0 || n1.x > width) n1.vx *= -1;
                if (n1.y < 0 || n1.y > height) n1.vy *= -1;

                // Draw node point
                ctx.beginPath();
                ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
                ctx.fillStyle = n1.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = n1.color;
                ctx.fill();
                ctx.shadowBlur = 0;

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 190) {
                        ctx.beginPath();
                        // Manhattan right-angle circuit trace
                        const midX = n1.x;
                        const midY = n2.y;
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(midX, midY);
                        ctx.lineTo(n2.x, n2.y);

                        const lineAlpha = (1 - dist / 190) * 0.16;
                        ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        // Spawn energy pulse along trace
                        if (Math.random() < 0.0012 && pulses.length < 18) {
                            pulses.push({
                                startX: n1.x,
                                startY: n1.y,
                                endX: n2.x,
                                endY: n2.y,
                                progress: 0,
                                speed: 0.012 + Math.random() * 0.02,
                                color: n1.color,
                            });
                        }
                    }
                }
            }

            // Update & render energy pulses
            for (let p = pulses.length - 1; p >= 0; p--) {
                const pulse = pulses[p];
                pulse.progress += pulse.speed;

                const curX = pulse.startX + (pulse.endX - pulse.startX) * pulse.progress;
                const curY = pulse.startY + (pulse.endY - pulse.startY) * pulse.progress;

                ctx.beginPath();
                ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowBlur = 14;
                ctx.shadowColor = pulse.color;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (pulse.progress >= 1) {
                    pulses.splice(p, 1);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
