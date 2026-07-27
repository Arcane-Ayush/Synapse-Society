import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ArcadeDeck({ projects }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 5;

    const totalPages = Math.ceil(projects.length / PAGE_SIZE);
    const currentProjects = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const nextPage = () => {
        if (page < totalPages - 1) {
            setPage(p => p + 1);
            setActiveIndex(0);
        }
    };

    const prevPage = () => {
        if (page > 0) {
            setPage(p => p - 1);
            setActiveIndex(0);
        }
    };

    return (
        <div
            className="relative w-full max-w-6xl h-[800px] md:h-[450px] flex items-center px-4 md:px-4 py-12 md:py-0"
            style={{
                backgroundImage: "linear-gradient(#000, #000), linear-gradient(90deg, #00ff00, #ff00ff)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                border: "2px solid transparent",
                boxShadow: "0 0 15px rgba(200, 0, 255, 0.4)"
            }}
        >
            {/* Previous Button - Adaptive */}
            <button
                onClick={prevPage}
                disabled={page === 0}
                className={`
                    absolute z-20 
                    md:left-0 md:top-0 md:bottom-0 md:w-12 md:h-full md:border-r
                    left-0 right-0 top-0 h-10 w-full border-b
                    flex items-center justify-center
                    bg-black/60 border-[#df00ff]/30
                    text-[#df00ff] 
                    hover:bg-[#df00ff]/10 hover:border-[#df00ff] hover:text-[#df00ff]
                    transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none
                    opacity-50 hover:opacity-100 group/btn
                `}
            >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:scale-125 transition-transform rotate-90 md:rotate-0" />
            </button>

            {/* Deck Area */}
            <div className="flex-1 w-full h-full flex flex-col md:flex-row gap-2 overflow-hidden px-2 md:px-14 py-2 md:py-4">
                {currentProjects.map((project, index) => {
                    const isActive = index === activeIndex;
                    const displayTitle = project.title || "UNTITLED_PROJECT";
                    const displayStack = project.stack || [];

                    return (
                        <div
                            key={project.id}
                            className={`
                                relative h-full transition-all duration-500 ease-in-out cursor-pointer overflow-hidden
                                border-2 ${isActive ? 'border-[#df00ff] flex-[3]' : 'border-neutral-700 flex-1 hover:flex-[1.5] hover:border-[#ff00ff]'}
                                bg-black/80 backdrop-blur-sm group
                            `}
                            onClick={() => setActiveIndex(index)}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            {/* Vertical/Horizontal "Spine" (Inactive) */}
                            <div className={`
                                absolute inset-0 flex items-center justify-center 
                                transition-opacity duration-300 delay-100
                                ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                            `}>
                                <div className="hidden md:block writing-vertical-rl text-lg font-mono tracking-widest text-neutral-500 uppercase group-hover:text-[#ff00ff] transition-colors">
                                    {displayTitle.slice(0, 15)}
                                </div>
                                {/* Mobile Spine (Horizontal Text) */}
                                <div className="md:hidden text-sm font-mono tracking-widest text-neutral-500 uppercase group-hover:text-[#ff00ff] transition-colors rotate-0">
                                    {displayTitle.slice(0, 20)}
                                </div>
                            </div>

                            {/* Active Content */}
                            <div className={`
                                absolute inset-0 w-full h-full flex flex-col p-4
                                transition-all duration-500
                                ${isActive ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4 pointer-events-none'}
                            `}>
                                <div className="font-mono text-xs text-[#df00ff] mb-2 border-b border-[#df00ff]/30 pb-1">
                                    SYS.ID_0{(page * PAGE_SIZE) + index + 1}
                                </div>

                                <div className="relative w-full h-48 bg-neutral-900 mb-4 overflow-hidden border border-neutral-800 group-hover:border-[#df00ff]/50 transition-colors">
                                    <img
                                        src={project.image}
                                        alt={displayTitle}
                                        className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
                                </div>

                                <h3 className="text-2xl font-bold text-white font-mono mb-2 truncate">
                                    {displayTitle}
                                </h3>
                                <p className="text-xs text-neutral-400 font-mono mb-4 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="mt-auto flex gap-2 flex-wrap">
                                    {displayStack.slice(0, 3).map(tech => (
                                        <span key={tech} className="px-2 py-1 text-[10px] uppercase font-mono border border-[#ff00ff] text-[#ff00ff]">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Decor Corners */}
                            <div className={`absolute top-0 right-0 p-1 transition-colors ${isActive ? 'bg-[#df00ff]' : 'bg-neutral-800 group-hover:bg-[#ff00ff]'}`} />
                            <div className={`absolute bottom-0 left-0 p-1 transition-colors ${isActive ? 'bg-[#df00ff]' : 'bg-neutral-800 group-hover:bg-[#ff00ff]'}`} />
                        </div>
                    );
                })}
            </div>

            {/* Next Button - Full Height Strip */}
            <button
                onClick={nextPage}
                disabled={page === totalPages - 1}
                className={`
                    absolute z-20 
                    md:right-0 md:top-0 md:bottom-0 md:w-12 md:h-full md:border-l
                    left-0 right-0 bottom-8 h-10 w-full border-t
                    flex items-center justify-center
                    bg-black/60 border-[#df00ff]/30
                    text-[#df00ff] 
                    hover:bg-[#df00ff]/10 hover:border-[#df00ff] hover:text-[#df00ff]
                    transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none
                    opacity-50 hover:opacity-100 group/btn
                `}
            >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:scale-125 transition-transform rotate-90 md:rotate-0" />
            </button>
            {/* Footer Strip Extension */}
            <div
                className="absolute -bottom-8 left-0 right-0 h-8 flex items-center justify-between px-4 backdrop-blur-sm"
                style={{
                    backgroundImage: "linear-gradient(#00000099, #00000099), linear-gradient(90deg, #00ff00, #ff00ff)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    border: "2px solid transparent",
                    borderTop: "0",
                    boxShadow: "0 5px 15px rgba(200, 0, 255, 0.2)"
                }}
            >
                <div className="font-mono text-xs text-[#df00ff]">
                    PAGE {page + 1} / {totalPages}
                </div>
                <a
                    href="https://github.com/Arcane-Ayush"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[#df00ff]/70 hover:text-[#ff00ff] cursor-pointer transition-colors"
                >
                    ~Made with Love(WORKING)
                </a>
            </div>

            <style>{`
                .writing-vertical-rl {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </div>
    );
}
