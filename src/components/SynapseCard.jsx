import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const RARITY_LABELS = {
    0: "COMMON",
    1: "UNCOMMON",
    2: "RARE",
    3: "EPIC",
    4: "LEGENDARY",
    5: "MYTHIC",
};

const LEVEL_NAMES = {
    0: "Access Pass",
    1: "Spark",
    2: "Scholar",
    3: "Builder",
    4: "Architect",
    5: "Elite",
};

function getCardBackground(card) {
    if (card.level === 5) {
        return `
            radial-gradient(ellipse at 20% 20%, rgba(var(--synapse-violet-rgb), 0.9) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(var(--synapse-pink-rgb), 0.8) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 50%, rgba(79,70,229,0.5) 0%, transparent 80%),
            linear-gradient(135deg, #0D0D14 0%, #1a0a2e 50%, #0D0D14 100%)
        `;
    }
    if (card.level === 4) {
        return `
            radial-gradient(ellipse at 30% 30%, rgba(239,68,68,0.5) 0%, transparent 60%),
            linear-gradient(135deg, #0D0D14 0%, #1a0505 100%)
        `;
    }
    return `
        radial-gradient(ellipse at 30% 30%, ${card.colors.primary}22 0%, transparent 60%),
        linear-gradient(135deg, #0D0D14 0%, #0C0C20 100%)
    `;
}

function HolographicSheen({ active, mousePos }) {
    if (!active) return null;
    return (
        <div
            className="absolute inset-0 rounded-[20px] pointer-events-none"
            style={{
                background: `
                    radial-gradient(
                        circle at ${mousePos.x}% ${mousePos.y}%,
                        rgba(255,255,255,0.15) 0%,
                        rgba(var(--synapse-violet-light-rgb), 0.12) 20%,
                        rgba(var(--synapse-pink-rgb), 0.08) 40%,
                        transparent 70%
                    )
                `,
                mixBlendMode: 'screen',
                zIndex: 20,
            }}
        />
    );
}

function FoilEffect({ card, active, mousePos }) {
    const colors = card.foilColors || ["var(--synapse-violet-light)", "var(--synapse-pink)"];
    if (!active) return null;

    const gradStr = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(", ");

    return (
        <div
            className="absolute inset-0 rounded-[20px] pointer-events-none"
            style={{
                background: `linear-gradient(${(mousePos.x / 100) * 360}deg, ${gradStr})`,
                opacity: 0.12,
                mixBlendMode: 'color-dodge',
                zIndex: 19,
            }}
        />
    );
}

function MythicParticles() {
    return (
        <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none" style={{ zIndex: 18 }}>
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        left: `${10 + (i * 7) % 80}%`,
                        top: `${15 + (i * 11) % 70}%`,
                        background: i % 3 === 0 ? '#F0ABFC' : i % 3 === 1 ? 'var(--synapse-violet-light)' : 'var(--synapse-pink-light)',
                        boxShadow: `0 0 6px ${i % 3 === 0 ? '#F0ABFC' : 'var(--synapse-violet-light)'}`,
                        animation: `twinkle ${1.5 + (i * 0.3) % 2}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                    }}
                />
            ))}
        </div>
    );
}

export function SynapseCard({ card, size = "md", showBack = false, className = "" }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [hovered, setHovered] = useState(false);

    const sizeMap = {
        sm: { width: 200, height: 280 },
        md: { width: 280, height: 392 },
        lg: { width: 340, height: 476 },
    };
    const { width, height } = sizeMap[size] || sizeMap.md;

    const handleMouseMove = useCallback((e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = e.clientX - cx;
        const y = e.clientY - cy;
        const maxTilt = 15;
        setTilt({
            x: (y / (rect.height / 2)) * maxTilt,
            y: -(x / (rect.width / 2)) * maxTilt,
        });
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTilt({ x: 0, y: 0 });
        setMousePos({ x: 50, y: 50 });
        setHovered(false);
    }, []);

    const { profile, ownedCardIds, isAuthenticated } = useAuth();
    
    if (!card) return null;

    // Use unified unlocking rule, but allow explicitly overriding via card.unlocked
    const isUnlocked = card.unlocked ?? (
        isAuthenticated && (
            (ownedCardIds?.includes(card.id)) ||
            ((profile?.xp ?? 0) >= (card.xpRequired ?? card.worth ?? 0))
        )
    );

    const isMythic = card.level === 5;
    const isLegendary = card.level === 4;
    const rarityLabel = card.type === 'event' ? 'EVENT EXCLUSIVE' : (RARITY_LABELS[card.level] || 'SPECIAL');

    const borderGlow = isMythic
        ? 'rgba(var(--synapse-violet-light-rgb), 0.8), rgba(var(--synapse-pink-rgb), 0.6), rgba(var(--synapse-violet-light-rgb), 0.8)'
        : isLegendary
            ? 'rgba(239,68,68,0.7), rgba(245,158,11,0.5)'
            : `${card.colors?.glow || 'rgba(var(--synapse-violet-rgb), 0.5)'}`;

    return (
        <div
            ref={cardRef}
            className={`relative select-none ${className}`}
            style={{
                width,
                height,
                perspective: '1000px',
                cursor: 'pointer',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                    scale: hovered ? 1.04 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                }}
            >
                {/* Card Shell */}
                <div
                    className="absolute inset-0 rounded-[20px] overflow-hidden"
                    style={{
                        background: getCardBackground(card),
                        boxShadow: hovered
                            ? `0 30px 80px rgba(0,0,0,0.8), 0 0 40px ${card.colors?.glow || 'rgba(var(--synapse-violet-rgb), 0.5)'}`
                            : `0 8px 30px rgba(0,0,0,0.6)`,
                        transition: 'box-shadow 0.3s ease',
                    }}
                >
                    {/* Animated border */}
                    <div
                        className="absolute inset-0 rounded-[20px]"
                        style={{
                            padding: '1.5px',
                            background: isMythic
                                ? `linear-gradient(${mousePos.x * 3.6}deg, ${borderGlow})`
                                : `linear-gradient(135deg, ${card.colors?.primary || 'var(--synapse-violet)'}88, ${card.colors?.secondary || 'var(--synapse-violet-light)'}44, ${card.colors?.primary || 'var(--synapse-violet)'}88)`,
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                        }}
                    />

                    {/* Full Card Image Overlay if display_mode === 'full_card' or card.fullImage is true */}
                    {((card.display_mode === 'full_card' || card.fullImage || card.isFullCard) && (card.imageUrl || card.image)) && (
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img
                                src={card.imageUrl || card.image}
                                alt={card.name || card.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        </div>
                    )}

                    {/* Holographic layers */}
                    <FoilEffect card={card} active={hovered} mousePos={mousePos} />
                    <HolographicSheen active={hovered} mousePos={mousePos} />
                    {isMythic && <MythicParticles />}

                    {/* === CARD CONTENT === */}
                    <div className="relative z-10 flex flex-col h-full p-4">
                        {/* New / Claim Indicator */}
                        {isUnlocked && card.isNewClaim && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider animate-bounce shadow-xl whitespace-nowrap"
                                style={{
                                    background: 'linear-gradient(135deg, var(--synapse-pink), var(--synapse-violet-light))',
                                    color: '#FFF',
                                    boxShadow: '0 0 20px rgba(236,72,153,0.9)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                }}
                            >
                                <Sparkles size={11} className="text-amber-300 animate-spin" />
                                <span>NEW · TAP TO CLAIM</span>
                            </motion.div>
                        )}
                        {/* Top bar — ID + Rarity */}
                        <div className="flex items-center justify-between mb-3">
                            <span
                                className="font-mono text-[10px] tracking-widest font-bold drop-shadow-md"
                                style={{ color: card.colors?.secondary || 'var(--synapse-violet-light)' }}
                            >
                                #{card.id}
                            </span>
                            <span
                                className="font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-full drop-shadow-md"
                                style={{
                                    color: card.colors?.secondary || 'var(--synapse-violet-light)',
                                    border: `1px solid ${card.colors?.primary || 'var(--synapse-violet)'}55`,
                                    background: `${card.colors?.primary || 'var(--synapse-violet)'}30`,
                                    backdropFilter: 'blur(4px)',
                                }}
                            >
                                {rarityLabel}
                            </span>
                        </div>

                        {/* Character Art / Image Area (if not fullImage) */}
                        {!card.fullImage && (
                            <div
                                className="relative flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center mb-3 group"
                                style={{
                                    height: height * 0.4,
                                    background: `
                                        radial-gradient(ellipse at 50% 50%, ${card.colors?.primary || 'var(--synapse-violet)'}22 0%, transparent 70%),
                                        rgba(0,0,0,0.5)
                                    `,
                                    border: `1px solid ${card.colors?.primary || 'var(--synapse-violet)'}33`,
                                }}
                            >
                                {/* Circuit corner accents */}
                                {['tl', 'tr', 'bl', 'br'].map(corner => (
                                    <div key={corner} className={`absolute z-10 ${corner.includes('t') ? 'top-2' : 'bottom-2'} ${corner.includes('l') ? 'left-2' : 'right-2'}`}>
                                        <svg width="12" height="12" viewBox="0 0 12 12">
                                            <path
                                                d={corner === 'tl' ? 'M0 8 L0 0 L8 0' : corner === 'tr' ? 'M4 0 L12 0 L12 8' : corner === 'bl' ? 'M0 4 L0 12 L8 12' : 'M4 12 L12 12 L12 4'}
                                                fill="none"
                                                stroke={card.colors?.primary || 'var(--synapse-violet)'}
                                                strokeWidth="1.5"
                                                opacity="0.6"
                                            />
                                        </svg>
                                    </div>
                                ))}

                                {(card.imageUrl || card.image) ? (
                                    <img
                                        src={card.imageUrl || card.image}
                                        alt={card.name || card.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div
                                        className="text-center"
                                        style={{
                                            fontSize: size === 'sm' ? '3rem' : size === 'lg' ? '5rem' : '4rem',
                                            filter: `drop-shadow(0 0 16px ${card.colors?.glow || 'rgba(var(--synapse-violet-rgb), 0.7)'})`,
                                            animation: isMythic ? 'float 4s ease-in-out infinite' : 'float 6s ease-in-out infinite',
                                        }}
                                    >
                                        {card.characterEmoji || '⚡'}
                                    </div>
                                )}

                                {/* Scan line effect */}
                                {hovered && (
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                                            opacity: 0.4,
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Card Name */}
                        <div className="mb-2">
                            {card.level !== null && card.level !== undefined && (
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="text-[10px] font-mono tracking-widest"
                                        style={{ color: card.colors?.secondary || 'var(--synapse-violet-light)', opacity: 0.6 }}
                                    >
                                        {card.type === 'event' ? 'EVENT CARD' : `LEVEL ${card.level}`}
                                    </span>
                                </div>
                            )}
                            <h3
                                className="font-bold leading-tight"
                                style={{
                                    fontFamily: 'Space Grotesk',
                                    fontSize: size === 'sm' ? '0.85rem' : '1.05rem',
                                    color: '#fff',
                                    textShadow: hovered ? `0 0 12px ${card.colors?.glow || 'rgba(var(--synapse-violet-light-rgb), 0.6)'}` : 'none',
                                }}
                            >
                                {card.name}
                            </h3>
                        </div>

                        {/* Description */}
                        <p
                            className="text-[11px] leading-relaxed mb-3 flex-grow"
                            style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)', fontFamily: 'Inter' }}
                        >
                            {card.description}
                        </p>

                        {/* XP Bar (membership cards) */}
                        {card.type === 'membership' && card.xpRequired !== undefined && (
                            <div className="mb-3">
                                <div className="flex justify-between text-[9px] font-mono mb-1" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)' }}>
                                    <span>XP REQUIRED</span>
                                    <span>{card.xpRequired >= 0 ? `${card.xpRequired} XP` : '∞'}</span>
                                </div>
                                <div className="h-1 rounded-full" style={{ background: 'rgba(var(--synapse-violet-rgb), 0.15)' }}>
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: card.level === 0 ? '100%' : '0%',
                                            background: `linear-gradient(90deg, ${card.colors?.primary || 'var(--synapse-violet)'}, ${card.colors?.secondary || 'var(--synapse-violet-light)'})`,
                                            boxShadow: `0 0 6px ${card.colors?.glow || 'rgba(var(--synapse-violet-rgb), 0.5)'}`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Event card worth */}
                        {card.type === 'event' && card.worth && (
                            <div
                                className="flex items-center justify-between text-[10px] font-mono mb-2 px-2 py-1.5 rounded-lg"
                                style={{ background: `${card.colors?.primary || 'var(--synapse-violet)'}15`, border: `1px solid ${card.colors?.primary || 'var(--synapse-violet)'}25` }}
                            >
                                <span style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)' }}>TOKEN VALUE</span>
                                <span style={{ color: card.colors?.secondary || 'var(--synapse-violet-light)', fontWeight: 700 }}>
                                    {card.worth} ◈
                                </span>
                            </div>
                        )}

                        {/* Bottom — QR area + supply */}
                        <div
                            className="flex items-center justify-between pt-2"
                            style={{ borderTop: `1px solid ${card.colors?.primary || 'var(--synapse-violet)'}20` }}
                        >
                            {/* QR placeholder */}
                            <div
                                className="rounded flex items-center justify-center"
                                style={{
                                    width: 28,
                                    height: 28,
                                    background: `${card.colors?.primary || 'var(--synapse-violet)'}15`,
                                    border: `1px solid ${card.colors?.primary || 'var(--synapse-violet)'}30`,
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <rect x="1" y="1" width="4" height="4" rx="0.5" stroke={card.colors?.secondary || 'var(--synapse-violet-light)'} strokeWidth="0.8" opacity="0.5" />
                                    <rect x="9" y="1" width="4" height="4" rx="0.5" stroke={card.colors?.secondary || 'var(--synapse-violet-light)'} strokeWidth="0.8" opacity="0.5" />
                                    <rect x="1" y="9" width="4" height="4" rx="0.5" stroke={card.colors?.secondary || 'var(--synapse-violet-light)'} strokeWidth="0.8" opacity="0.5" />
                                    <rect x="2.5" y="2.5" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                    <rect x="10.5" y="2.5" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                    <rect x="2.5" y="10.5" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                    <rect x="8" y="7" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                    <rect x="10" y="7" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                    <rect x="12" y="7" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                    <rect x="9" y="9" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                    <rect x="11" y="11" width="1" height="1" fill={card.colors?.secondary || 'var(--synapse-violet-light)'} opacity="0.5" />
                                </svg>
                            </div>

                            <div className="text-center">
                                {isMythic && (
                                    <span className="text-[9px] font-mono" style={{ color: 'var(--synapse-violet-light)', opacity: 0.6 }}>
                                        MYTHIC TIER
                                    </span>
                                )}
                            </div>

                            <div className="text-right">
                                {card.maxSupply && (
                                    <div className="text-[9px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.3)' }}>
                                        /{card.maxSupply}
                                    </div>
                                )}
                                <div className="text-[9px] font-mono" style={{ color: 'rgba(var(--text-secondary-rgb), 0.25)' }}>
                                    SYNAPSE©
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Locked State Overlay */}
                    {!isUnlocked && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[20px]"
                            style={{
                                background: 'rgba(var(--bg-glass-rgb), 0.75)',
                                backdropFilter: 'blur(3px)',
                                zIndex: 30,
                            }}
                        >
                            <div
                                className="mb-2"
                                style={{ filter: 'drop-shadow(0 0 8px rgba(var(--synapse-violet-rgb), 0.5))', color: 'rgba(var(--synapse-violet-rgb), 0.8)' }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <p
                                className="text-xs font-mono text-center px-6"
                                style={{ color: 'rgba(var(--synapse-violet-light-rgb), 0.6)', letterSpacing: '0.1em' }}
                            >
                                {card.type === 'membership'
                                    ? `EARN ${card.xpRequired} XP`
                                    : 'SEASON 1'}
                            </p>
                            <p className="text-[9px] font-mono mt-1" style={{ color: 'rgba(var(--synapse-violet-light-rgb), 0.3)' }}>
                                TO UNLOCK
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
