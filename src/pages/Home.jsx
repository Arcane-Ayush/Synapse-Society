import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Zap, ExternalLink, Award, User, Sparkles } from "lucide-react";
import { SynapseCard } from "../components/SynapseCard";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BlackHole } from "../themes/basic/BlackHole";
import { useAuth } from "../contexts/AuthContext";
import { LoginModal } from "../components/LoginModal";

// ── Animated counter hook ──────────────────────────────────────────
function useCounter(target, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else { setCount(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target, duration]);

    return { count, ref };
}

// OrbitRings removed per user request, using BlackHole instead

// ── Stat counter card ──────────────────────────────────────────────
function StatCard({ value, label, suffix = "+" }) {
    const { count, ref } = useCounter(value);
    return (
        <div ref={ref} className="text-center">
            <div
                className="text-4xl md:text-5xl font-black mb-1"
                style={{
                    fontFamily: 'Space Grotesk',
                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {count}{suffix}
            </div>
            <div className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(var(--text-secondary-rgb), 0.45)', textTransform: 'uppercase' }}>
                {label}
            </div>
        </div>
    );
}

// ── Pillar card ────────────────────────────────────────────────────
function PillarCard({ icon, title, desc, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl p-7 group overflow-hidden"
            style={{ background: 'rgba(var(--bg-glass-rgb), 0.85)', border: `1px solid rgba(var(--synapse-violet-rgb), 0.12)` }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${color}40`;
                e.currentTarget.style.boxShadow = `0 12px 40px ${color}15`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(var(--synapse-violet-rgb), 0.12)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Top accent bar */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)`, opacity: 0 }}
            />
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${color}15`, border: `1px solid ${color}28` }}
            >
                <div style={{ color }}>{icon}</div>
            </div>
            {/* Pillar number (decorative) */}
            <div
                className="absolute top-5 right-5 text-5xl font-black opacity-5"
                style={{ fontFamily: 'Space Grotesk', color }}
            >
                {title[0]}
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk' }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(var(--text-secondary-rgb), 0.55)', fontFamily: 'Inter' }}>{desc}</p>

            {/* Bottom type annotation */}
            <div className="mt-6 tech-annotation" style={{ color: `${color}60` }}>
                SYNAPSE PILLAR · {title.toUpperCase()}
            </div>
        </motion.div>
    );
}

// ── Ecosystem card ────────────────────────────────────────────────
function EcosystemCard({ title, desc, url, icon, color, delay, isInternal = false }) {
    const Tag = isInternal ? Link : 'a';
    const linkProps = isInternal
        ? { to: url }
        : { href: url, target: "_blank", rel: "noopener noreferrer" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
            className="group"
        >
            <Tag
                {...linkProps}
                className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 block"
                style={{
                    background: 'rgba(var(--bg-glass-rgb), 0.8)',
                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.12)',
                    textDecoration: 'none',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${color}45`;
                    e.currentTarget.style.boxShadow = `0 8px 40px ${color}12`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(var(--synapse-violet-rgb), 0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <div className="flex items-start justify-between">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${color}12`, border: `1px solid ${color}22`, color: color }}
                    >
                        {icon}
                    </div>
                    <span
                        className="text-[10px] font-mono tracking-wider flex items-center gap-1"
                        style={{ color: `${color}80` }}
                    >
                        VISIT ↗
                    </span>
                </div>
                <div>
                    <h4 className="font-bold text-base mb-1.5" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>{title}</h4>
                    <p className="text-sm" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter', lineHeight: 1.6 }}>{desc}</p>
                </div>
            </Tag>
        </motion.div>
    );
}

// ══════════════════════════════════════════════════════════════════
export function Home() {
    const heroRef = useRef(null);
    const navigate = useNavigate();
    const { isAuthenticated, checkUnlockStatus } = useAuth();
    const { scrollYProgress } = useScroll({ target: heroRef });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

    const [previewCards, setPreviewCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    useEffect(() => {
        import("../lib/auth").then(({ getAllCards }) => {
            getAllCards().then(res => {
                if (res.data && res.data.length > 0) {
                    const cards = res.data;
                    setPreviewCards([
                        cards[0],
                        cards[Math.floor(cards.length / 2)] || cards[0],
                        cards[cards.length - 1] || cards[0]
                    ]);
                } else {
                    setPreviewCards([]);
                }
            });
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedCard(null);
            }
        };
        if (selectedCard) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedCard]);

    return (
        <div className="relative overflow-x-hidden">
            {/* ═══════════════════════ HERO ═══════════════════════ */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-4 md:pt-10 overflow-hidden bg-[var(--bg-base)]"
            >
                {/* 3D BlackHole Background */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 2.5, 6], fov: 60 }}>
                        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
                        <BlackHole scale={1.2} position={[0, 0.4, 0]} />
                    </Canvas>
                </div>

                <motion.div
                    style={{ y: heroY }}
                    className="relative z-10 max-w-7xl mx-auto w-full -mt-24 lg:-mt-32"
                >
                    {/* ── Top annotation strip ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex items-center justify-between mb-10"
                    >
                        <div className="flex items-center gap-3">
                            <span className="tech-annotation" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Student-Run Tech Collective</span>
                            <div className="w-8 h-[1px]" style={{ background: 'var(--border-bright)' }} />
                            <span className="tech-annotation" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Chandigarh University</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
                            <span className="tech-annotation" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Season 1 · Active</span>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* ── Text side ── */}
                        <div className="text-center md:text-left">
                            {/* Quick stats block — Trust-Donate inspired top metrics */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="flex items-center gap-4 mb-8 justify-center md:justify-start"
                            >
                                {[
                                    { val: '150+', label: 'Members' },
                                    { val: '8+', label: 'Projects' },
                                    { val: '12+', label: 'Events' },
                                ].map((s, i) => (
                                    <div key={s.label} className="flex items-center gap-3">
                                        {i > 0 && (
                                            <div className="w-[1px] h-6" style={{ background: 'var(--border-accent)' }} />
                                        )}
                                        <div>
                                            <div className="text-sm font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                                                {s.val}
                                            </div>
                                            <div className="text-[9px] font-mono tracking-widest" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                {s.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Main headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
                                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.92] mb-6"
                                style={{ fontFamily: 'Space Grotesk' }}
                            >
                                <span style={{ color: 'var(--text-primary)' }}>Where Ideas</span>
                                <br />
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, var(--synapse-violet-light) 0%, var(--synapse-pink-light) 40%, #818CF8 80%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient-x 4s linear infinite',
                                    }}
                                >
                                    SPARK
                                </span>
                                <span style={{ color: 'var(--text-primary)' }}> into</span>
                                <br />
                                <span style={{ color: 'var(--text-primary)' }}>Reality.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.45 }}
                                className="text-lg mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed"
                                style={{ color: 'rgba(216,180,254,0.85)', fontFamily: 'Inter' }}
                            >
                                Synapse Society is the student-run tech collective at Chandigarh University.
                                Build real projects. Learn together. Grow your network. Shape the future.
                            </motion.p>

                            {/* CTA buttons — glowing cyber style */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
                            >
                                {isAuthenticated ? (
                                    <Link
                                        to="/profile"
                                        className="btn-cyber flex items-center gap-2 group relative overflow-hidden"
                                        style={{
                                            boxShadow: '0 0 25px rgba(var(--synapse-violet-light-rgb), 0.5), 0 0 50px rgba(var(--synapse-violet-rgb), 0.3)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                        }}
                                    >
                                        <User size={15} className="text-purple-300" />
                                        <span>VIEW PROFILE</span>
                                        <span className="arrow transition-transform group-hover:translate-x-1">→</span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => setIsLoginOpen(true)}
                                        className="btn-cyber flex items-center gap-2 group cursor-pointer relative overflow-hidden"
                                        style={{
                                            boxShadow: '0 0 30px rgba(var(--synapse-violet-light-rgb), 0.6), 0 0 60px rgba(var(--synapse-violet-rgb), 0.35)',
                                            border: '1px solid rgba(255,255,255,0.35)',
                                        }}
                                    >
                                        <Sparkles size={15} className="animate-pulse text-amber-300" />
                                        <span>JOIN SYNAPSE</span>
                                        <span className="arrow transition-transform group-hover:translate-x-1">↗</span>
                                    </button>
                                )}
                                <Link to="/nexus" className="btn-cyber-outline">
                                    Explore Nexus
                                    <span className="arrow">→</span>
                                </Link>
                            </motion.div>

                            {/* Side annotation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                className="flex items-center gap-4 pt-4 mt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}
                            >
                                <div className="w-6 h-[1px]" style={{ background: 'var(--border-accent)' }} />
                                <span className="tech-annotation" style={{ color: 'var(--text-muted)' }}>Build · Learn · Elevate</span>
                            </motion.div>
                        </div>

                        {/* ── Visual side — floating logo + orbit rings ── */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.1, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
                            className="flex items-center justify-center relative"
                        >
                            {/* Outer accent rings */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {[320, 240, 170].map((size, i) => (
                                    <div
                                        key={i}
                                        className="absolute rounded-full"
                                        style={{
                                            width: size,
                                            height: size,
                                            border: `1px solid rgba(124,58,237,${0.07 + i * 0.04})`,
                                            animation: `float ${4 + i}s ease-in-out infinite`,
                                            animationDelay: `${i * 0.5}s`,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Floating logo */}
                            <div
                                className="relative z-10 animate-float translate-x-4 md:translate-x-12"
                                style={{
                                    filter: 'drop-shadow(0 0 40px rgba(var(--synapse-violet-rgb), 0.6)) drop-shadow(0 0 80px rgba(var(--synapse-violet-light-rgb), 0.25))',
                                }}
                            >
                                <img
                                    src="/Synapse-Society-Dark.png"
                                    alt="Synapse Society Emblem"
                                    className="w-full max-w-[300px] md:max-w-[420px]"
                                />
                            </div>

                            {/* Ambient glow blob behind logo */}
                            <div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                style={{ zIndex: 0 }}
                            >
                                <div
                                    style={{
                                        width: 280,
                                        height: 280,
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(var(--synapse-violet-rgb), 0.18) 0%, transparent 70%)',
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="section-label" style={{ color: 'rgba(var(--synapse-violet-light-rgb), 0.35)' }}>scroll</span>
                    <div className="w-[1px] h-8" style={{ background: 'linear-gradient(to bottom, rgba(var(--synapse-violet-light-rgb), 0.35), transparent)' }} />
                </motion.div>
            </section>

            {/* ═══════════════ MISSION PILLARS ═══════════════ */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="section-label mb-3">Our Mission</div>
                        <div className="flex items-end gap-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                                The Synapse{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    Ethos
                                </span>
                            </h2>
                            {/* Decorative line */}
                            <div className="hidden md:block flex-1 h-[1px] mb-2" style={{ background: 'linear-gradient(90deg, rgba(var(--synapse-violet-rgb), 0.3), transparent)' }} />
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <PillarCard
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 18 22 12 16 6"></polyline>
                                    <polyline points="8 6 2 12 8 18"></polyline>
                                </svg>
                            }
                            title="Learn"
                            desc="Master cutting-edge technologies through workshops, study jams, and peer-led sessions. Knowledge is your foundation."
                            color="#6366F1"
                            delay={0}
                        />
                        <PillarCard
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            }
                            title="Build"
                            desc="Turn ideas into reality. Ship real projects, hack at hackathons, contribute to open source. Your builds make an impact."
                            color="var(--synapse-violet-light)"
                            delay={0.1}
                        />
                        <PillarCard
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="5"></circle>
                                    <path d="M20 21a8 8 0 1 0-16 0"></path>
                                </svg>
                            }
                            title="Connect"
                            desc="A network that elevates everyone. Lead teams, mentor peers, and forge connections that outlast university."
                            color="var(--synapse-pink)"
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════════ CARD PREVIEW ═══════════════ */}
            <section
                className="py-24 px-4 relative overflow-hidden"
                style={{ background: 'rgba(var(--synapse-violet-rgb), 0.025)', borderTop: '1px solid rgba(var(--synapse-violet-rgb), 0.07)', borderBottom: '1px solid rgba(var(--synapse-violet-rgb), 0.07)' }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(var(--synapse-violet-rgb), 0.09) 0%, transparent 70%)' }} />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="section-label mb-3">Synapse Card System</div>
                        <div className="flex items-end gap-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                                Earn Your{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    Legend
                                </span>
                            </h2>
                            <div className="hidden md:block flex-1 h-[1px] mb-2" style={{ background: 'linear-gradient(90deg, rgba(var(--synapse-violet-rgb), 0.3), transparent)' }} />
                        </div>
                        <p className="text-base mt-4 max-w-xl" style={{ color: 'rgba(var(--text-secondary-rgb), 0.55)', fontFamily: 'Inter', lineHeight: 1.7 }}>
                            Every member starts with an Access Pass. Attend workshops, build projects, and lead teams to unlock higher-tier cards — each with unique character art, unique ID, and real physical hard copies.
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-12">
                        {previewCards.map((card, i) => {
                            const isClickable = checkUnlockStatus(card);
                            return (
                                <motion.div
                                    key={`${card.id}-${i}`}
                                    initial={{ opacity: 0, y: 40, rotate: (i - 1) * 6 }}
                                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                                    transition={{ duration: 0.7, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                                    viewport={{ once: true }}
                                    onClick={() => isClickable && setSelectedCard({ ...card, unlocked: true })}
                                    className={isClickable ? "cursor-pointer transition-transform hover:scale-105" : ""}
                                >
                                    <SynapseCard card={{ ...card, unlocked: isClickable }} size="md" />
                                </motion.div>
                            )
                        })}
                    </div>

                    <div className="flex justify-center">
                        <Link to="/nexus" className="btn-cyber">
                            <Award size={14} />
                            View All Cards in Nexus
                            <span className="arrow">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════ ECOSYSTEM ═══════════════ */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="section-label mb-3">Synapse Universe</div>
                        <div className="flex items-end gap-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                                Our{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    Ecosystem
                                </span>
                            </h2>
                            <div className="hidden md:block flex-1 h-[1px] mb-2" style={{ background: 'linear-gradient(90deg, rgba(var(--synapse-violet-rgb), 0.3), transparent)' }} />
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <EcosystemCard
                            title="Synapse Hub"
                            desc="The central platform for all things Synapse — resources, events, and community tools."
                            url="https://the-synapse-hub.vercel.app"
                            icon="⎈"
                            color="var(--synapse-violet-light)"
                            delay={0}
                        />
                        <EcosystemCard
                            title="Join Us"
                            desc="Ready to connect your neurons? Sign up and get your Synapse Access Pass."
                            url="https://synapse-form.vercel.app"
                            icon="⚲"
                            color="var(--synapse-pink)"
                            delay={0.1}
                        />
                        <EcosystemCard
                            title="Projects"
                            desc="Discover what Synapse members are building. Real projects, real impact."
                            url="/projects"
                            icon="⬡"
                            color="#6366F1"
                            delay={0.2}
                            isInternal
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════════ STATS BAR ═══════════════ */}
            <section
                className="py-20 px-4"
                style={{ background: 'rgba(var(--bg-glass-rgb), 0.6)', borderTop: '1px solid rgba(var(--synapse-violet-rgb), 0.07)' }}
            >
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <StatCard value={150} label="Members" />
                        <StatCard value={5} label="Projects" />
                        <StatCard value={8} label="Events" />
                        <StatCard value={3} label="Workshops" />
                    </div>
                </div>
            </section>

            {/* Card Overlay — Portaled to body */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedCard && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCard(null)}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 cursor-pointer"
                            style={{ background: 'rgba(var(--bg-glass-rgb), 0.92)', backdropFilter: 'blur(8px)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                onClick={e => e.stopPropagation()}
                                className="pointer-events-auto cursor-default relative"
                            >
                                <SynapseCard card={selectedCard} size="lg" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                initialMode="signup"
                titleOverride="Join Synapse Society"
                subtitleOverride="Create an account or sign in to complete your club registration form."
            />
        </div>
    );
}
