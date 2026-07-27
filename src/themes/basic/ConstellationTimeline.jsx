import { useRef, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';


export function ConstellationTimeline({ projects }) {
    const [activeId, setActiveId] = useState(null);
    const containerRef = useRef(null);

    // Vertical Spacing
    const ITEM_HEIGHT = 250; // Increased spacing to reduce overlap
    const TOTAL_HEIGHT = projects.length * ITEM_HEIGHT + 400; // Extra padding

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate positions for Vertical Constellation
    const points = useMemo(() => {
        return projects.map((_, index) => {
            // Organic "Star Map" Layout
            // Mobile: Tighter sway (10%) to keep cards on screen
            // Desktop: Wide sway (25%) for immersive feel
            const amplitude = isMobile ? 10 : 25;

            // Using Cosine to start at extrema, scaled to amplitude
            const x = 50 - Math.cos(index * 0.7) * amplitude;

            // Y: Linear progression
            const y = 200 + (index * ITEM_HEIGHT);

            return { x, y, id: projects[index].id };
        });
    }, [projects, isMobile]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[75vh] overflow-y-auto perspective-1000 no-scrollbar"
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div className="relative w-full" style={{ height: `${TOTAL_HEIGHT}px` }}>

                {/* 1. Connecting Lines (SVG Layer) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    {points.map((p1, i) => {
                        if (i === points.length - 1) return null;
                        const p2 = points[i + 1];
                        return (
                            <line
                                key={`line-${i}`}
                                x1={`${p1.x}%`}
                                y1={p1.y}
                                x2={`${p2.x}%`}
                                y2={p2.y}
                                stroke="rgba(255, 255, 255, 0.3)" // Solid White Nodal Line
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>

                {/* 2. Star Nodes & Cards */}
                {projects.map((project, index) => {
                    const point = points[index];
                    const isActive = activeId === project.id;
                    // Place card on opposite side of center for balance
                    const isLeft = point.x < 50;

                    return (
                        <div
                            key={project.id}
                            className="absolute transition-all duration-500"
                            style={{
                                left: `${point.x}%`, // Note: On mobile we might want to override this to 50% via CSS class if possible, but valid dynamic style. 
                                // Actually, let's keep the organic line on mobile too? 
                                // With width 80vw centered below, it might be safer to force points to center on mobile?
                                // I'll add a 'md:left-[...]' class logic? No, style overrides classes.
                                top: `${point.y}px`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: isActive ? 100 : 10 // Fix Overlapping: Hovered item pops to top
                            }}
                            onMouseEnter={() => setActiveId(project.id)}
                        >
                            {/* The Star Node (Shiny White/Cyan) */}
                            <motion.div
                                className={`
                                    relative cursor-pointer rounded-full flex items-center justify-center
                                    transition-all duration-300
                                `}
                                animate={{
                                    width: isActive ? 16 : 8, // Smaller, star-like dots
                                    height: isActive ? 16 : 8,
                                    backgroundColor: isActive ? '#00ffff' : '#ffffff',
                                    boxShadow: isActive ? '0 0 20px #00ffff' : '0 0 10px #ffffff'
                                }}
                            >
                                {isActive && <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-50" />}
                            </motion.div>

                            {/* Project Information Card */}
                            <div
                                className={`
                                    absolute 
                                    /* Mobile: Center below the dot */
                                    top-8 left-1/2 -translate-x-1/2
                                    /* Desktop: Side positioning */
                                    md:top-1/2 md:-translate-y-1/2 md:translate-x-0
                                    ${isLeft ? 'md:right-full md:mr-6 md:left-auto' : 'md:left-full md:ml-6'}
                                    
                                    w-[80vw] max-w-[280px] md:w-[350px] md:max-w-none
                                    transition-all duration-500 ease-out
                                    ${isActive ? 'scale-105 opacity-100 z-50' : 'scale-95 opacity-60 hover:opacity-100'}
                                `}
                            >
                                <div className={`
                                    bg-black/90 backdrop-blur-xl border 
                                    ${isActive ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]' : 'border-white/10'}
                                    rounded-lg overflow-hidden p-0 group
                                `}>
                                    {/* Mobile: Hidden (card floats below) or Vertical? Let's hide on mobile to simplify */}
                                    <div className={`
                                        hidden md:block absolute top-1/2 w-6 h-[1px] bg-white/20
                                        ${isLeft ? '-right-6' : '-left-6'}
                                    `} />

                                    {/* Header Image */}
                                    <div className="relative h-32 w-full overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className={`
                                                w-full h-full object-cover transition-all duration-500
                                                ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}
                                            `}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                        <div className="absolute bottom-2 left-4">
                                            <h3 className={`font-mono font-bold text-lg ${isActive ? 'text-cyan-300' : 'text-gray-200'}`}>
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <div className="px-4 py-3 space-y-2">
                                        <p className={`text-xs line-clamp-3 font-mono ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {project.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded border ${isActive ? 'border-cyan-500/30 text-cyan-200' : 'border-white/10 text-gray-600'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className={`flex gap-3 pt-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white text-xs flex items-center font-mono font-bold">
                                                    <Github className="w-3 h-3 mr-1" /> GITHUB
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll Indicator */}
            <div className="fixed bottom-8 left-8 text-cyan-500/50 font-mono text-xs animate-pulse pointer-events-none">
                SCROLL TO EXPLORE :: SYSTEM.READY
            </div>
        </div>
    );
}
