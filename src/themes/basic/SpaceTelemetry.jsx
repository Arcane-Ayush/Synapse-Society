import { Radar, Target, Activity, Cpu, Signal } from "lucide-react";
import { motion } from "framer-motion";

export function SpaceTelemetry({ leaderboard, currentSprint }) {
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points);
    const maxPoints = sortedLeaderboard[0]?.points || 1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-cyan-500">
            {/* Fleet Status (Leaderboard) */}
            <div className="border border-cyan-900/50 rounded-md bg-black/60 backdrop-blur-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-[10px] text-cyan-700 border-l border-b border-cyan-900/50">SYSTEM_MONITOR_V2</div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
                    <Radar className="animate-spin-slow" /> FLEET_STATUS
                </h2>

                <div className="space-y-4">
                    {sortedLeaderboard.map((team, index) => (
                        <motion.div
                            key={team.name}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative border-b border-cyan-900/30 pb-2"
                        >
                            <div className="flex items-center justify-between mb-1 z-10 relative">
                                <div className="flex items-center gap-3">
                                    <span className="text-cyan-600 font-bold text-sm">[{String(index + 1).padStart(2, '0')}]</span>
                                    <span className="text-cyan-100 font-bold">{team.name}</span>
                                </div>
                                <span className="text-cyan-400">{team.points} SU</span>
                            </div>
                            {/* Signal Bar Visual */}
                            <div className="h-1 bg-cyan-950 w-full mt-1 relative overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(team.points / maxPoints) * 100}%` }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mission Relay (Current Sprint) */}
            <div className="border border-cyan-900/50 rounded-md bg-black/60 backdrop-blur-sm p-6 relative">
                <div className="flex justify-between items-start mb-6 border-b border-cyan-900/50 pb-4">
                    <div>
                        <div className="text-[10px] text-cyan-600 tracking-widest mb-1">MISSION_OBJECTIVE</div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target size={18} className="text-red-500" /> {currentSprint.title}
                        </h3>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-cyan-600 tracking-widest mb-1">T-MINUS</div>
                        <span className="text-cyan-300 font-bold border border-cyan-500/30 px-2 py-1 bg-cyan-950/30">{currentSprint.deadline}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {currentSprint.tasks.map((task, i) => (
                        <div key={task.id} className="bg-cyan-950/10 border border-cyan-900/30 p-3 flex items-center justify-between group hover:border-cyan-500/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-black border border-cyan-900/50 text-cyan-400">
                                    {task.status === "Done" ? <Activity size={16} className="text-green-500" />
                                        : task.status === "In Progress" ? <Cpu size={16} className="text-cyan-400 animate-pulse" />
                                            : <Signal size={16} className="text-gray-500" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${task.status === "Done" ? "border-green-500/50 text-green-400" :
                                            task.status === "In Progress" ? "border-cyan-500/50 text-cyan-400" :
                                                "border-gray-500/50 text-gray-400"
                                            }`}>
                                            {task.status === "Done" ? "OPTIMAL" : task.status === "In Progress" ? "PROCESSING" : "STANDBY"}
                                        </span>
                                        <span className="text-xs text-cyan-800">ID: {task.id}</span>
                                    </div>
                                    <h4 className="text-sm font-medium text-cyan-100">{task.title}</h4>
                                    <div className="text-xs text-cyan-400 mt-1 uppercase tracking-wider font-semibold">
                                        {task.assignedTo === "All" ? (
                                            <span className="text-white font-bold animate-pulse">&gt;&gt; BROADCAST: FLEET WIDE &lt;&lt;</span>
                                        ) : Array.isArray(task.assignedTo) ? (
                                            <span className="text-orange-400 font-bold">MULTIPLE SIGNALS: {task.assignedTo.join(" + ")}</span>
                                        ) : task.assignedTo ? (
                                            `LOCKED ON: ${task.assignedTo}`
                                        ) : (
                                            <span className="text-cyan-400 animate-pulse opacity-70">&gt;&gt; UNCLAIMED SIGNAL &lt;&lt;</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-cyan-700">PAYLOAD</div>
                                <div className="text-cyan-300 font-bold">{task.points}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
