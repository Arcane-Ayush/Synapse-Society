import { Skull, Crosshair, Award } from "lucide-react";
import { motion } from "framer-motion";

export function ArcadeKanban({ tasks }) {
    const columns = [
        { id: "Todo", title: "WANTED", icon: Skull, color: "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]", border: "border-red-500/50", bg: "bg-red-950/40" },
        { id: "In Progress", title: "IN PURSUIT", icon: Crosshair, color: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]", border: "border-yellow-400/50", bg: "bg-yellow-950/40" },
        { id: "Done", title: "CAPTURED", icon: Award, color: "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]", border: "border-green-400/50", bg: "bg-green-950/40" }
    ];

    return (
        <div className="mt-8 font-mono">
            <div className="relative mb-8 text-center">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 animate-pulse tracking-widest uppercase" style={{ textShadow: "0 0 20px rgba(0,255,100,0.5)" }}>
                    BOUNTY BOARD
                </h2>
                <div className="absolute top-1/2 left-0 w-full h-px bg-green-500/30 -z-10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map((col) => {
                    const colTasks = tasks.filter(t => t.status === col.id);
                    const ColIcon = col.icon;
                    return (
                        <div key={col.id} className={`p-4 rounded-lg border-2 border-dashed ${col.border} ${col.bg} relative overflow-hidden group`}>
                            {/* Scanline Effect - Reduced opacity for visibility */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-10"></div>

                            <div className="flex items-center justify-between mb-4 border-b border-inherit pb-2">
                                <h3 className={`text-xl font-bold flex items-center gap-2 ${col.color}`}>
                                    <ColIcon className="w-6 h-6" /> {col.title}
                                </h3>
                                <span className="text-xs bg-black/50 px-2 py-1 rounded border border-inherit text-inherit text-white font-bold">
                                    {colTasks.length}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {colTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        whileHover={{ scale: 1.02, rotate: 1 }}
                                        className={`bg-black/90 border ${col.border} p-4 relative shadow-[0_0_20px_rgba(0,0,0,0.6)]`}
                                    >
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-inherit border border-inherit transform rotate-45"></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">REWARD</span>
                                            <span className={`text-lg font-black ${col.color}`}>{task.points}</span>
                                        </div>
                                        <h4 className="font-bold text-white text-lg mb-2 leading-tight tracking-wide">{task.title}</h4>
                                        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-800 pt-2 mt-2 font-mono">
                                            {task.assignedTo === "All" ? (
                                                <span className="text-red-500 font-bold animate-pulse">⚠️ FACTION WAR</span>
                                            ) : Array.isArray(task.assignedTo) ? (
                                                <span className="text-yellow-400 font-bold">JOINT OP: {task.assignedTo.join(" / ")}</span>
                                            ) : task.assignedTo ? (
                                                <span className="text-gray-300">TARGET: {task.assignedTo}</span>
                                            ) : (
                                                <span className="text-green-400 font-bold animate-pulse">[ OPEN BOUNTY ]</span>
                                            )}
                                            <span className="opacity-50">ID: #{task.id.toString().padStart(4, '0')}</span>
                                        </div>
                                    </motion.div>
                                ))}
                                {colTasks.length === 0 && (
                                    <div className="text-center py-8 text-gray-600 font-bold italic opacity-50">
                                        NO TARGETS
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
