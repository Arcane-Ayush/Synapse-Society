// import { leaderboard, currentSprint } from "../data/mockData"; // 🗑️ Deleted
import { useData } from "../hooks/useData"; // 🆕 Hook
import { useTheme, themes } from "../context/ThemeContext";
import { SpaceTelemetry } from "../themes/basic/SpaceTelemetry";
import { ArcadeKanban } from "../themes/arcade/ArcadeKanban";
import { AnimePodium } from "../themes/anime/AnimePodium";
import { AnimeQuestBoard } from "../themes/anime/AnimeQuestBoard";

export function Sprints() {
    const { theme } = useTheme();
    const { leaderboard, currentSprint } = useData(); // 🎣 Hook

    // specific sorting and ranking logic
    const sortedLeaderboard = [...leaderboard]
        .sort((a, b) => b.points - a.points)
        .map((team, index) => ({ ...team, rank: index + 1 }));

    return (
        <div className="container mx-auto px-4 py-12">

            {/* Conditional Rendering */}
            {theme === themes.ARCADE ? (
                <div className="space-y-12">
                    {/* Arcade Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-black text-green-400 tracking-tighter drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                            SPRINT_LOG_V.0.4
                        </h1>
                        <p className="text-green-400 font-mono text-sm max-w-2xl mx-auto border-l-2 border-r-2 border-green-500/50 px-4 bg-green-950/30 py-2">
                            CURRENT OBJECTIVE: <span className="text-white font-bold">{currentSprint.title}</span>
                            <br />
                            DEADLINE: <span className="text-white font-bold">{currentSprint.deadline}</span>
                        </p>
                    </div>

                    <ArcadeKanban tasks={currentSprint.tasks} />

                    {/* Arcade Leaderboard */}
                    <div className="max-w-4xl mx-auto border-4 border-double border-purple-500/50 p-6 bg-black/90 relative shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black px-6 py-1 text-purple-400 font-bold tracking-widest border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                            TOP TEAMS
                        </div>
                        <div className="space-y-3 font-mono mt-2">
                            {sortedLeaderboard.map((team, index) => (
                                <div key={team.name} className="flex items-center justify-between border-b border-purple-900/30 pb-2 hover:bg-purple-900/20 transition px-2 rounded">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xl font-bold ${index === 0 ? "text-yellow-400 drop-shadow-md" : "text-gray-500"}`}>
                                            #{team.rank}
                                        </span>
                                        <span className="text-gray-300 font-bold">{team.name}</span>
                                    </div>
                                    <span className="text-purple-400 font-bold tracking-wider">{team.points} <span className="text-xs opacity-50 text-white">XP</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : theme === themes.ANIME ? (
                <div className="space-y-16">
                    {/* Anime Header */}
                    <div className="text-center">
                        <span className="inline-block px-5 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-bold tracking-widest mb-6 border border-pink-200 shadow-sm">
                            LEADERBOARD
                        </span>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-800 drop-shadow-sm mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                            Hall of Fame <span className="inline-block animate-bounce">👑</span>
                        </h2>
                        <p className="text-slate-500 font-medium text-lg">Celebrate our top achievers!</p>
                    </div>

                    <AnimePodium leaderboard={sortedLeaderboard} />

                    {/* Current Quest */}
                    <AnimeQuestBoard currentSprint={currentSprint} />
                </div>
            ) : (
                <SpaceTelemetry leaderboard={sortedLeaderboard} currentSprint={currentSprint} />
            )}
        </div>
    );
}
