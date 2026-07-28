import { useEffect, useRef } from "react";

// Generates an animated circuit board SVG background using Canvas
export function CircuitBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animationId;
        let nodes = [];
        let pulses = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initNodes();
        };

        const initNodes = () => {
            nodes = [];
            pulses = [];
            const cols = Math.floor(canvas.width / 120);
            const rows = Math.floor(canvas.height / 120);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (Math.random() > 0.55) {
                        nodes.push({
                            x: i * 120 + Math.random() * 60,
                            y: j * 120 + Math.random() * 60,
                            radius: Math.random() * 2 + 1,
                            pulsePhase: Math.random() * Math.PI * 2,
                            connections: [],
                        });
                    }
                }
            }

            // Build connections
            nodes.forEach((node, idx) => {
                const nearest = nodes
                    .map((other, i) => ({ i, dist: Math.hypot(other.x - node.x, other.y - node.y) }))
                    .filter(o => o.i !== idx && o.dist < 200)
                    .sort((a, b) => a.dist - b.dist)
                    .slice(0, Math.floor(Math.random() * 2) + 1);
                node.connections = nearest.map(n => n.i);
            });

            // Seed some pulses
            for (let i = 0; i < 8; i++) {
                spawnPulse();
            }
        };

        const spawnPulse = () => {
            if (nodes.length === 0) return;
            const startIdx = Math.floor(Math.random() * nodes.length);
            const startNode = nodes[startIdx];
            if (!startNode || startNode.connections.length === 0) return;
            const endIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
            pulses.push({
                startIdx,
                endIdx,
                progress: 0,
                speed: 0.003 + Math.random() * 0.004,
                color: Math.random() > 0.5 ? [168, 85, 247] : [217, 70, 239],
            });
        };

        let frame = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            // Draw connections (lines)
            nodes.forEach((node, idx) => {
                node.connections.forEach(connIdx => {
                    const other = nodes[connIdx];
                    if (!other) return;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = "rgba(var(--synapse-violet-rgb), 0.07)";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            });

            // Draw nodes
            const time = frame * 0.02;
            nodes.forEach(node => {
                const pulse = 0.5 + 0.5 * Math.sin(time + node.pulsePhase);
                const alpha = 0.12 + pulse * 0.15;
                const r = node.radius * (1 + pulse * 0.4);

                ctx.beginPath();
                ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(124,58,237,${alpha * 0.3})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168,85,247,${alpha})`;
                ctx.fill();
            });

            // Draw & animate pulses
            pulses = pulses.filter(pulse => pulse.progress <= 1);
            pulses.forEach(pulse => {
                pulse.progress += pulse.speed;
                const start = nodes[pulse.startIdx];
                const end = nodes[pulse.endIdx];
                if (!start || !end) return;

                const x = start.x + (end.x - start.x) * pulse.progress;
                const y = start.y + (end.y - start.y) * pulse.progress;

                const [r, g, b] = pulse.color;
                const alpha = 1 - Math.abs(pulse.progress - 0.5) * 2;

                // Glow
                const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
                grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.8})`);
                grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Dot
                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.fill();
            });

            // Spawn new pulses
            if (frame % 80 === 0 && pulses.length < 15) {
                spawnPulse();
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0.9,
            }}
        />
    );
}
