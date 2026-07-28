import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, User, LogOut, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LoginModal } from "./LoginModal";

const navItems = [
    { name: "Home", path: "/" },
    { name: "Activities", path: "/activities" },
    { name: "Projects", path: "/projects" },
    { name: "Nexus", path: "/nexus" },
    { name: "About", path: "/about" },
];

const externalLinks = [
    { name: "HUB", url: "https://the-synapse-hub.vercel.app", label: "Synapse Hub" },
    { name: "JOIN", url: "https://synapse-form.vercel.app", label: "Apply Now" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, profile, signOut } = useAuth();

    async function handleSignOut() {
        await signOut();
        navigate('/');
    }

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => { setIsOpen(false); }, [location]);

    return (
        <>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
            >
                <div
                    className="w-full max-w-7xl flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-300"
                    style={{
                        background: scrolled
                            ? 'rgba(5, 5, 8, 0.92)'
                            : 'rgba(5, 5, 8, 0.72)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: `1px solid ${scrolled ? 'rgba(124,58,237,0.28)' : 'rgba(124,58,237,0.12)'}`,
                        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.08)' : 'none',
                    }}
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105"
                                style={{
                                    background: 'rgba(124,58,237,0.08)',
                                    border: '1px solid rgba(124,58,237,0.25)',
                                    boxShadow: '0 0 15px rgba(124,58,237,0.15)',
                                    padding: '4px'
                                }}
                            >
                                <img
                                    src="/S_ofSynapseDark.png"
                                    alt="Synapse Society"
                                    className="h-full w-full object-contain rounded-full"
                                    style={{
                                        filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.5))'
                                    }}
                                />
                            </div>
                            {/* Online Indicator Dot */}
                            <div
                                className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                                style={{
                                    background: '#10B981', // Emerald green
                                    border: '2px solid rgba(5,5,8,0.92)',
                                    boxShadow: '0 0 8px rgba(16,185,129,0.5)'
                                }}
                            />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const isNexus = item.name === "Nexus";
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        color: isActive ? '#fff' : (isNexus ? '#D946EF' : 'rgba(196,181,253,0.65)'),
                                        textShadow: isNexus && !isActive ? '0 0 10px rgba(217,70,239,0.4)' : 'none',
                                    }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 rounded-xl"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(124,58,237,0.4) 0%, rgba(168,85,247,0.3) 100%)',
                                                border: '1px solid rgba(168,85,247,0.3)',
                                            }}
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side — status + external links + mobile toggle */}
                    <div className="flex items-center gap-2">
                        {/* Auth Button */}
                        {isAuthenticated ? (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105"
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                                        background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))',
                                        border: '1px solid rgba(168,85,247,0.4)',
                                        color: '#E9D5FF',
                                        boxShadow: '0 0 15px rgba(124,58,237,0.2)',
                                    }}
                                >
                                    <User size={13} className="text-purple-400" />
                                    <span>{profile?.display_name ?? 'My Profile'}</span>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 transition-all duration-200 hover:opacity-80"
                                    title="Sign Out"
                                    style={{
                                        clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                                        background: 'rgba(239,68,68,0.12)',
                                        border: '1px solid rgba(239,68,68,0.25)',
                                        color: '#FCA5A5',
                                    }}
                                >
                                    <LogOut size={13} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="hidden lg:flex items-center gap-2 px-5 py-2 text-xs font-black tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden group"
                                style={{
                                    fontFamily: 'Space Grotesk',
                                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                                    background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                                    color: '#FFFFFF',
                                    boxShadow: '0 0 24px rgba(168,85,247,0.4)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                }}
                            >
                                <Sparkles size={13} className="animate-pulse text-amber-300" />
                                <span>LOGIN</span>
                                <LogIn size={13} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                        )}

                        {/* External links — cyber slanted style (desktop) */}
                        <div className="hidden md:flex items-center gap-2">
                            <a
                                href="https://the-synapse-hub.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-[10px] font-bold tracking-widest transition-all duration-300"
                                style={{
                                    fontFamily: 'Space Mono',
                                    color: '#fff',
                                    background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                    padding: '6px 16px',
                                    clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                                    textDecoration: 'none',
                                    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                    e.currentTarget.style.boxShadow = '0 0 30px rgba(168,85,247,0.6)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.filter = 'brightness(1)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)';
                                }}
                            >
                                HUB
                                <span style={{ transition: 'transform 0.2s ease', display: 'inline-block' }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                    ↗
                                </span>
                            </a>
                            <a
                                href="https://synapse-form.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-[10px] font-bold tracking-widest transition-all duration-300 relative overflow-hidden"
                                style={{
                                    fontFamily: 'Space Mono',
                                    color: '#fff',
                                    background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                    padding: '6px 16px',
                                    clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                                    textDecoration: 'none',
                                    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                    e.currentTarget.style.boxShadow = '0 0 30px rgba(168,85,247,0.6)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.filter = 'brightness(1)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)';
                                }}
                            >
                                <Zap size={10} />
                                JOIN
                                <span style={{ transition: 'transform 0.2s ease', display: 'inline-block' }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                    ↗
                                </span>
                            </a>
                        </div>

                        {/* Mobile Auth Button (glowing user icon on header) */}
                        <div className="flex lg:hidden items-center">
                            {isAuthenticated ? (
                                <Link
                                    to="/profile"
                                    className="p-2 rounded-xl flex items-center justify-center transition-all duration-200"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
                                        border: '1px solid rgba(168,85,247,0.4)',
                                        boxShadow: '0 0 15px rgba(168,85,247,0.4)',
                                        color: '#E9D5FF',
                                    }}
                                    title="My Profile"
                                >
                                    <User size={16} className="text-purple-300" />
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="p-2 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                                    style={{
                                        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        boxShadow: '0 0 18px rgba(168,85,247,0.5)',
                                        color: '#FFFFFF',
                                    }}
                                    title="Login / Join"
                                >
                                    <User size={16} />
                                </button>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-xl transition-all duration-200"
                            style={{
                                background: 'rgba(124,58,237,0.1)',
                                border: '1px solid rgba(124,58,237,0.2)',
                                color: '#A855F7',
                            }}
                        >
                            {isOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[72px] left-4 right-4 z-50 rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(8, 8, 14, 0.97)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(124,58,237,0.25)',
                            boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
                        }}
                    >
                        <div className="p-3 flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                const isNexus = item.name === "Nexus";
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150"
                                        style={{
                                            fontFamily: 'Space Grotesk',
                                            background: isActive ? 'rgba(124,58,237,0.25)' : (isNexus ? 'rgba(217,70,239,0.1)' : 'transparent'),
                                            color: isActive ? '#fff' : (isNexus ? '#D946EF' : 'rgba(196,181,253,0.7)'),
                                            border: isActive ? '1px solid rgba(168,85,247,0.3)' : (isNexus ? '1px solid rgba(217,70,239,0.2)' : '1px solid transparent'),
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}

                            {/* Mobile Drawer Auth Item */}
                            {isAuthenticated ? (
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all"
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
                                        border: '1px solid rgba(168,85,247,0.4)',
                                        color: '#E9D5FF',
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <User size={15} className="text-purple-300" />
                                        <span>{profile?.display_name ?? 'My Profile'}</span>
                                    </div>
                                    <span className="text-xs font-mono text-purple-300/60">→</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => { setIsOpen(false); setIsLoginOpen(true); }}
                                    className="px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer"
                                    style={{
                                        fontFamily: 'Space Grotesk',
                                        background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                        color: '#FFF',
                                        boxShadow: '0 0 15px rgba(124,58,237,0.3)',
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={15} className="text-amber-300" />
                                        <span>Sign In / Join Synapse</span>
                                    </div>
                                    <LogIn size={15} />
                                </button>
                            )}

                            <div className="mt-2 pt-2 flex gap-2" style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
                                {externalLinks.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold tracking-widest transition-all duration-150"
                                        style={{
                                            fontFamily: 'Space Mono',
                                            color: 'rgba(168,85,247,0.85)',
                                            background: 'rgba(124,58,237,0.08)',
                                            border: '1px solid rgba(124,58,237,0.2)',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        {link.label} ↗
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Login Modal */}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}