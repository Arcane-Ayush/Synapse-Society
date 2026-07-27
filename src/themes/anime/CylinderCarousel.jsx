import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Code } from "lucide-react";
import { ProjectCard } from "../../components/ProjectCard";

export function CylinderCarousel({ projects }) {
    const count = projects.length;
    // Responsive Dimensions
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cardWidth = isMobile ? 240 : 300;
    const cardHeight = isMobile ? 320 : 400;
    const gap = isMobile ? 20 : 40;
    const thickness = 16;

    // Dynamic Radius & Z-Adjustment
    let radius = Math.round((cardWidth + gap) / (2 * Math.tan(Math.PI / count)));
    radius = Math.max(radius, isMobile ? 200 : 320); // Allow tighter radius on mobile

    // Assuming viewing distance for a card is when it's at Z ~ +350-400 relative to center of view (perspective 1500)
    // If center is 0, front card is at +radius.
    // We want (+radius) + (cylinderOffset) = 400
    // => cylinderOffset = 400 - radius
    const cylinderOffsetZ = 400 - radius;

    const angleStep = 360 / count;
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Animation Refs
    const rotationRef = useRef(0);
    const speedRef = useRef(0.2);
    const isSnappingRef = useRef(false);
    const targetRotationRef = useRef(0);

    // Drag/Swipe Refs
    const isDraggingRef = useRef(false);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);

    useEffect(() => {
        let animationFrameId;
        const animate = () => {
            if (isDraggingRef.current) {
                // While dragging, rotation is handled by move events
                // We just update lastTime to calculate velocity on release
                lastTimeRef.current = Date.now();
            } else if (isSnappingRef.current) {
                const diff = targetRotationRef.current - rotationRef.current;
                if (Math.abs(diff) < 0.5) {
                    rotationRef.current = targetRotationRef.current;
                    isSnappingRef.current = false;
                    speedRef.current = 0.2; // Resume auto-spin
                } else {
                    rotationRef.current += diff * 0.1;
                }
            } else {
                // Momentum & Auto-Rotation
                // If speed is high (from a flick), decay it.
                // If speed is low, drift back to 0.2 (auto-spin).
                const targetSpeed = 0.2;

                // Friction
                if (Math.abs(speedRef.current) > 0.25) {
                    speedRef.current *= 0.95;
                } else {
                    // Smoothly return to cruising speed
                    speedRef.current += (targetSpeed - speedRef.current) * 0.05;
                }
                rotationRef.current += speedRef.current;
            }

            if (containerRef.current) {
                containerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered]); // Keeping isHovered dep if needed, though dragging overrides it

    // --- Pointer Events (Mouse + Touch) ---
    const handlePointerDown = (e) => {
        isDraggingRef.current = true;
        isSnappingRef.current = false;
        // Unite Mouse/Touch X
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        lastXRef.current = x;
        speedRef.current = 0; // Stop auto-spin immediately
    };

    const handlePointerMove = (e) => {
        if (!isDraggingRef.current) return;

        // Prevent default scroll on touch (if mostly horizontal)
        // e.preventDefault(); // Don't do this rigidly or page can't scroll vertical

        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const delta = x - lastXRef.current;
        lastXRef.current = x;

        // Apply rotation directly (Reversed for Natural feel)
        // Sensitivity: 0.5 deg per pixel
        rotationRef.current += delta * 0.5;

        // Store velocity for momentum throw
        speedRef.current = delta * 0.5;
    };

    const handlePointerUp = () => {
        isDraggingRef.current = false;
        // speedRef.current tracks the last delta, so momentum initiates automatically in animate()
    };

    // --- Trackpad / Wheel Support ---
    const handleWheel = (e) => {
        // If user is scrolling horizontally (trackpad swipe)
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault(); // Lock vertical scroll while swiping sideways

            // Apply rotation based on scroll delta
            const scrollDelta = e.deltaX * 0.5;

            rotationRef.current -= scrollDelta; // Natural scroll direction
            speedRef.current = -scrollDelta * 0.1; // Small momentum
            isSnappingRef.current = false; // Cancel any snap
        }
    };

    const handleDoubleClick = (index) => {
        const cardAngle = index * angleStep;
        let loops = Math.round(rotationRef.current / 360);
        let target = (loops * 360) - cardAngle;
        if (target - rotationRef.current > 180) target -= 360;
        if (target - rotationRef.current < -180) target += 360;
        targetRotationRef.current = target;
        isSnappingRef.current = true;
    };

    const handleNavigation = (direction) => {
        const step = direction === 1 ? angleStep : -angleStep;
        const currentSlotRound = Math.round(rotationRef.current / angleStep) * angleStep;
        targetRotationRef.current = currentSlotRound + step;
        isSnappingRef.current = true;
    };

    const layers = [];
    const layersCount = 3;
    const step = thickness / (layersCount + 1);
    for (let i = 1; i <= layersCount; i++) {
        layers.push((thickness / 2) - (i * step));
    }

    return (
        <div
            className="relative w-full h-full flex items-center justify-center touch-pan-y"
            style={{ perspective: "1500px" }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            onWheel={handleWheel}
        >
            {/* Left Button (Hidden on Mobile) */}
            <button
                onClick={(e) => { e.stopPropagation(); handleNavigation(-1); }}
                className="hidden md:block absolute left-4 z-50 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 transition-all text-gray-800 shadow-lg hover:scale-110"
                aria-label="Previous Project"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            {/* 
               Wrapper to apply Z-Depth compensation. 
               This wrapper stays still (rotation-wise) but moves in Z.
            */}
            <div
                className="relative preserve-3d transition-transform duration-1000 ease-out pointer-events-none"
                style={{
                    transform: `translateZ(${cylinderOffsetZ}px)`,
                    transformStyle: "preserve-3d"
                }}
            >
                <div
                    ref={containerRef}
                    className="relative w-[300px] h-full preserve-3d flex items-center justify-center transition-transform duration-300 pointer-events-auto"
                    style={{
                        transformStyle: "preserve-3d",
                        cursor: isDraggingRef.current ? 'grabbing' : 'grab'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {projects.map((project, index) => {
                        const angle = index * angleStep;
                        return (
                            <div
                                key={project.id}
                                className="absolute"
                                style={{
                                    width: `${cardWidth}px`,
                                    height: `${cardHeight}px`,
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                    transformStyle: 'preserve-3d'
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    handleDoubleClick(index);
                                }}
                                // Prevent drag from getting swallowed by children
                                onDragStart={(e) => e.preventDefault()}
                            >
                                {layers.map((zOffset, i) => (
                                    <div
                                        key={i}
                                        className="absolute inset-x-0 inset-y-0 rounded-2xl border-2"
                                        style={{
                                            transform: `translateZ(${zOffset}px)`,
                                            backfaceVisibility: 'hidden',
                                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                            borderColor: 'rgba(0,0,0,0.1)',
                                            // backdropFilter: 'blur(8px)'
                                            // backdrop-filter removed for performance/optimization
                                        }}
                                    />
                                ))}

                                <div
                                    className="absolute inset-0 backface-hidden rounded-2xl border-2 border-black overflow-hidden"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        transform: `translateZ(${thickness / 2 + 1}px)`,
                                    }}
                                >
                                    <ProjectCard project={project} index={index} is3D={true} />
                                </div>

                                <div
                                    className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center rounded-2xl border-2 border-black overflow-hidden"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        transform: `rotateY(180deg) translateZ(${thickness / 2 + 1}px)`,
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                                    <div className="relative z-10 p-4 bg-white/40 rounded-full mb-3 shadow-sm border border-white/30 backdrop-blur-md">
                                        <Code className="w-8 h-8 text-gray-800" />
                                    </div>
                                    <h3 className="relative z-10 text-lg font-bold text-gray-800">Google Club</h3>
                                    <p className="relative z-10 text-xs text-gray-600 font-medium tracking-wide">Student Project</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right Button (Hidden on Mobile) */}
            <button
                onClick={(e) => { e.stopPropagation(); handleNavigation(1); }}
                className="hidden md:block absolute right-4 z-50 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 transition-all text-gray-800 shadow-lg hover:scale-110"
                aria-label="Next Project"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            <style>{`
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
            `}</style>
        </div>
    )
}
