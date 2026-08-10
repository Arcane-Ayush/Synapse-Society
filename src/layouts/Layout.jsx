import { useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CircuitBackground } from "../components/CircuitBackground";
import { ScrollToTop } from "../components/ScrollToTop";

export function Layout({ children }) {
    const location = useLocation();
    const path = location.pathname.toLowerCase();
    const isEventRoute =
        path.includes('/inauguration') ||
        path.includes('/hod') ||
        path.includes('/dean') ||
        path.includes('/president') ||
        path.includes('/audience') ||
        path.includes('/ucn/') ||
        path.includes('/users') ||
        path.includes('/event-admin') ||
        path.includes('/stage') ||
        path.includes('/presentation') ||
        path.includes('/hiddenportal');

    return (
        <div className="min-h-screen text-foreground flex flex-col relative overflow-x-hidden"
             style={{ background: 'var(--bg-base)' }}>
            {/* Global atmospheric background */}
            <CircuitBackground />

            {/* Global ambient glow orbs */}
            <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(var(--synapse-violet-rgb), 0.08) 0%, transparent 70%)', zIndex: 0 }} />
            <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(var(--synapse-pink-rgb), 0.06) 0%, transparent 70%)', zIndex: 0 }} />

            {!isEventRoute && <Navbar />}
            <main className={`flex-grow ${isEventRoute ? 'pt-0' : 'pt-20'} relative`} style={{ zIndex: 2 }}>
                {children}
            </main>

            <ScrollToTop />

            {/* Footer — hidden on standalone event screens */}
            {!isEventRoute && (
                <footer className="relative py-8 px-6" style={{ zIndex: 2, borderTop: '1px solid var(--border-subtle)' }}>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img src="/dark_synapse.png" alt="Synapse Society" className="h-8 w-auto" />
                            <span style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Synapse Society — Chandigarh University
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="https://the-synapse-hub.vercel.app" target="_blank" rel="noopener noreferrer"
                               style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'Space Mono' }}
                               className="hover:text-purple-400 transition-colors">
                                Synapse Hub ↗
                            </a>
                            <a href="https://synapse-form.vercel.app" target="_blank" rel="noopener noreferrer"
                               style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'Space Mono' }}
                               className="hover:text-purple-400 transition-colors">
                                Join Us ↗
                            </a>
                        </div>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'Space Mono' }}>
                            © {new Date().getFullYear()} Synapse Society. Built by Students.
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
}
