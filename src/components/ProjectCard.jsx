import { Link } from "react-router-dom";
import { ArrowRight, Play, Pause, Users, MoreVertical, Clock } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "../utils/cn";
import { useTheme, themes } from "../context/ThemeContext";

export function ProjectCard({ project, index, is3D = false }) {
    const { theme } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        if (project.demoUrl) {
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        setIsPlaying(false);
    };

    // 3D Carousel Card (Anime Theme Specific)
    if (is3D) {
        return (
            <div
                className="w-full h-full relative group overflow-hidden bg-card/40 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col pt-0 transition-all duration-500"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent z-0" />
                <div className="relative w-[90%] mx-auto mt-4 aspect-video rounded-xl overflow-hidden shadow-sm border border-white/10 z-10 bg-black/5">
                    {isPlaying && project.demoUrl ? (
                        <img
                            src={project.demoUrl}
                            alt="Demo"
                            className="w-full h-full object-cover animate-in fade-in duration-300"
                        />
                    ) : (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )}
                    {project.demoUrl && (
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-3 h-3 fill-white" />
                        </div>
                    )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3 shadow-sm">
                            <Users className="w-3 h-3" />
                            {project.team}
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-secondary/50 border border-secondary text-secondary-foreground rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] text-center shadow-sm ${theme === themes.ANIME
                                    ? "bg-slate-800 text-white hover:bg-pink-500 hover:shadow-lg hover:-translate-y-1"
                                    : "bg-gray-900 text-white hover:bg-gray-800"
                                }`}
                        >
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // STANDARD CARD (YOUTUBE LIST STYLE)
    return (
        <div
            className={cn(
                "group flex flex-col sm:flex-row gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200 cursor-pointer animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards",
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Thumbnail Section */}
            <div className="relative w-full sm:w-[320px] aspect-video flex-shrink-0 rounded-xl overflow-hidden bg-muted border border-white/5">
                {isPlaying && project.demoUrl ? (
                    <img
                        src={project.demoUrl}
                        alt="Demo"
                        className="w-full h-full object-cover animate-in fade-in duration-300"
                    />
                ) : (
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}

                {/* Duration/Type Badge (Fake metadata for the look) */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-medium text-white/90">
                    Project
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 py-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
                        {project.title}
                    </h3>
                    <button className="p-1 hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Metadata Line */}
                <div className={cn("flex items-center gap-2 text-xs mb-3", theme === themes.BASIC ? "text-gray-400" : "text-muted-foreground")}>
                    <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Users className="w-3 h-3" />
                        {project.team}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Spring 2024
                    </span>
                    <span>•</span>
                    <span>{project.tags[0]}</span>
                </div>

                {/* Description */}
                <p className={cn("text-sm line-clamp-2 mb-3", theme === themes.BASIC ? "text-gray-300" : "text-muted-foreground/80")}>
                    {project.description}
                </p>

                {/* Tags (Chips) */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-full border border-border/50">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
