import { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../data/mockData";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";

// Reskinned ArcadeDeck in Synapse purple aesthetic
function SynapseDeck({ projects }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 5;

    const totalPages = Math.ceil(projects.length / PAGE_SIZE);
    const currentProjects = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const nextPage = () => {
        if (page < totalPages - 1) { setPage(p => p + 1); setActiveIndex(0); }
    };
    const prevPage = () => {
        if (page > 0) { setPage(p => p - 1); setActiveIndex(0); }
    };

    return (
        <div className="relative w-full max-w-6xl" style={{ height: 'clamp(400px, 60vh, 520px)' }}>
            {/* Main deck frame */}
            <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                    background: 'rgba(8,8,14,0.95)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    boxShadow: '0 0 60px rgba(124,58,237,0.1)',
                }}
            >
                {/* Prev button */}
                <button
                    onClick={prevPage}
                    disabled={page === 0}
                    className="absolute left-0 right-0 top-0 h-10 md:h-auto md:bottom-0 md:w-12 z-20 flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
                    style={{
                        background: 'rgba(124,58,237,0.05)',
                        borderBottom: '1px solid rgba(124,58,237,0.1)', // for mobile
                        color: '#A855F7',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.05)'}
                >
                    {/* Rotate icon on mobile */}
                    <ChevronLeft size={24} className="md:block hidden" />
                    <ChevronLeft size={24} className="md:hidden rotate-90" />
                </button>

                {/* Cards area */}
                <div className="absolute inset-0 flex flex-col md:flex-row gap-2 overflow-hidden px-4 py-12 md:px-14 md:py-4">
                    {currentProjects.map((project, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={project.id}
                                className="relative h-full transition-all duration-500 ease-in-out cursor-pointer overflow-hidden rounded-xl group"
                                style={{
                                    flex: isActive ? '3' : '1',
                                    background: 'rgba(12,12,20,0.9)',
                                    border: `1px solid ${isActive ? 'rgba(168,85,247,0.4)' : 'rgba(124,58,237,0.1)'}`,
                                    boxShadow: isActive ? '0 0 30px rgba(124,58,237,0.2)' : 'none',
                                }}
                                onClick={() => setActiveIndex(index)}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                {/* Spine (inactive) */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                                    style={{ opacity: isActive ? 0 : 1 }}
                                >
                                    <div
                                        className="text-[10px] md:text-xs font-mono tracking-widest uppercase transition-colors whitespace-nowrap"
                                        style={{ 
                                            color: isActive ? '#D8B4FE' : 'rgba(168,85,247,0.75)',
                                            writingMode: 'horizontal-tb'
                                        }}
                                    >
                                        <span className="md:hidden">{project.title?.slice(0, 24) || 'PROJECT'}</span>
                                        <span className="hidden md:block" style={{ writingMode: 'vertical-rl' }}>{project.title?.slice(0, 14) || 'PROJECT'}</span>
                                    </div>
                                </div>

                                {/* Active content */}
                                <div
                                    className="absolute inset-0 flex flex-col p-4 transition-all duration-400"
                                    style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translateY(0)' : 'translateY(12px)' }}
                                >
                                    {/* ID */}
                                    <div className="font-mono text-[10px] mb-2 pb-1" style={{ color: '#D8B4FE', borderBottom: '1px solid rgba(168,85,247,0.3)' }}>
                                        SYN.{String((page * PAGE_SIZE) + index + 1).padStart(3, '0')}
                                    </div>

                                    {/* Image */}
                                    <div className="relative w-full mb-3 rounded-lg overflow-hidden bg-purple-950/30 h-[100px] md:h-[45%] shrink-0">
                                        <div
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.15))' }}
                                        >
                                            <span className="font-mono text-[10px] text-purple-300/50 uppercase tracking-widest">{project.title}</span>
                                        </div>
                                        {project.image || project.image_url ? (
                                            <img
                                                src={project.image || project.image_url}
                                                alt={project.title}
                                                onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                                                className="relative z-10 w-full h-full object-cover transition-opacity duration-300"
                                                style={{ filter: 'saturate(0.9) brightness(0.9)' }}
                                            />
                                        ) : null}
                                        <div
                                            className="absolute inset-0 z-20"
                                            style={{ background: 'linear-gradient(to top, rgba(8,8,14,0.9), transparent 60%)' }}
                                        />
                                        {/* Scan lines */}
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                                            }}
                                        />
                                    </div>

                                    <h3
                                        className="font-bold text-base mb-1 truncate"
                                        style={{ fontFamily: 'Space Grotesk', color: '#F5F3FF' }}
                                    >
                                        {project.title}
                                    </h3>
                                    <p
                                        className="text-[11px] leading-relaxed mb-3 line-clamp-3"
                                        style={{ color: 'rgba(216,180,254,0.85)', fontFamily: 'Inter' }}
                                    >
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
                                        {(project.tags || []).slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                                                style={{
                                                    background: 'rgba(168,85,247,0.15)',
                                                    color: '#E9D5FF',
                                                    border: '1px solid rgba(168,85,247,0.3)',
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-2">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg transition-all duration-200"
                                                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#D8B4FE' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.35)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
                                            >
                                                <Github size={10} /> GitHub
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg transition-all duration-200"
                                                style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#E9D5FF' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.3)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.15)'}
                                            >
                                                <ExternalLink size={10} /> Demo
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Corner accents */}
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-sm" style={{ background: isActive ? '#A855F7' : 'rgba(124,58,237,0.2)' }} />
                                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-sm" style={{ background: isActive ? '#7C3AED' : 'rgba(124,58,237,0.2)' }} />
                            </div>
                        );
                    })}
                </div>

                {/* Next button */}
                <button
                    onClick={nextPage}
                    disabled={page === totalPages - 1}
                    className="absolute left-0 right-0 bottom-0 h-10 md:h-auto md:top-0 md:left-auto md:w-12 z-20 flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
                    style={{
                        background: 'rgba(124,58,237,0.05)',
                        borderTop: '1px solid rgba(124,58,237,0.1)', // for mobile
                        color: '#A855F7',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.05)'}
                >
                    <ChevronRight size={24} className="md:block hidden" />
                    <ChevronRight size={24} className="md:hidden rotate-90" />
                </button>
            </div>

            {/* Footer strip */}
            <div
                className="absolute -bottom-10 left-0 right-0 h-9 rounded-b-xl flex items-center justify-between px-5"
                style={{
                    background: 'rgba(8,8,14,0.9)',
                    border: '1px solid rgba(124,58,237,0.15)',
                    borderTop: 'none',
                }}
            >
                <span className="font-mono text-[10px]" style={{ color: 'rgba(168,85,247,0.5)' }}>
                    PAGE {page + 1} / {totalPages}
                </span>
                <span className="font-mono text-[10px]" style={{ color: 'rgba(168,85,247,0.3)' }}>
                    {projects.length} PROJECTS
                </span>
            </div>
        </div>
    );
}

export function Projects() {
    return (
        <div className="min-h-screen flex flex-col px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <div className="section-label mb-4">Student Builds</div>
                <h1
                    className="text-5xl md:text-6xl font-black tracking-tight mb-4"
                    style={{ fontFamily: 'Space Grotesk' }}
                >
                    Project{" "}
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #A855F7, #E879F9)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Forge
                    </span>
                </h1>
                <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(196,181,253,0.55)', fontFamily: 'Inter' }}>
                    Real projects built by Synapse Society members. Hover to explore, click to expand.
                </p>
            </motion.div>

            <div className="flex-1 flex items-start justify-center pb-16">
                <SynapseDeck projects={projects} />
            </div>
        </div>
    );
}
