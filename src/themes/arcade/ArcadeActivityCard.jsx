import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

// --- ARCADE THEME: Retro Game Ticket ---
export function ArcadeActivityCard({ activity, index }) {
    const isCompleted = activity.status === "Completed";

    return (
        <motion.div
            initial={{ opacity: 0, x: -50, rotate: isCompleted ? 0 : -1 }}
            animate={{ opacity: 1, x: 0, rotate: isCompleted ? 0 : 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={!isCompleted ? { scale: 1.02, rotate: 1 } : {}}
            className={`relative w-full max-w-4xl mx-auto mb-8 flex flex-col md:flex-row border-2 border-dashed shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden group font-mono ${isCompleted
                ? "bg-slate-800 border-slate-600 grayscale opacity-80"
                : "bg-slate-900 border-pink-500 shadow-[4px_4px_0px_rgba(236,72,153,1)]"
                }`}
        >
            {/* Left Stub */}
            <div className={`hidden md:flex w-16 items-center justify-center border-r-2 border-dashed relative ${isCompleted ? "bg-slate-700 border-slate-600" : "bg-pink-500 border-slate-900"
                }`}>
                <span className={`transform -rotate-90 font-black tracking-[0.2em] whitespace-nowrap text-xl ${isCompleted ? "text-slate-500" : "text-slate-900"
                    }`}>
                    {isCompleted ? "USED" : "ADMIT ONE"}
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 relative">
                <div className={`absolute top-2 right-2 text-[10px] font-bold border px-2 rounded ${isCompleted ? "text-slate-500 border-slate-500" : "text-pink-500 border-pink-500"
                    }`}>
                    CREDITS: {isCompleted ? "0" : "FREE"}
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <Gamepad2 className={isCompleted ? "text-slate-600" : "text-yellow-400 animate-bounce"} size={24} />
                    <span className={`font-bold text-sm tracking-widest ${isCompleted ? "text-slate-500" : "text-green-400"}`}>
                        LEVEL {activity.id}
                    </span>
                </div>

                <h3 className={`text-2xl md:text-4xl font-black mb-4 uppercase tracking-tighter ${isCompleted ? "text-slate-500 line-through decoration-2" : "text-white"
                    }`} style={!isCompleted ? { textShadow: "2px 2px 0px #ec4899" } : {}}>
                    {activity.title}
                </h3>

                <div className={`flex flex-wrap gap-4 text-sm mb-6 font-bold ${isCompleted ? "text-slate-600" : "text-cyan-300"}`}>
                    <span className="bg-slate-800/50 px-2 py-1">📅 {formatDate(activity.date)}</span>
                    <span className="bg-slate-800/50 px-2 py-1">⏰ {activity.time}</span>
                </div>

                {isCompleted ? (
                    <div className="font-black text-3xl text-slate-700 uppercase tracking-widest border-4 border-slate-700 inline-block px-4 py-2 transform -rotate-6 mask-image-grunge">
                        GAME OVER
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {activity.tags?.map(tag => (
                            <span key={tag} className="text-xs text-pink-500 border border-pink-500/50 px-2 py-1 rounded hover:bg-pink-500 hover:text-white transition-colors cursor-pointer">
                                #{tag.toUpperCase()}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Action */}
            <div className={`w-full md:w-32 border-l-2 border-dashed flex items-center justify-center p-4 ${isCompleted ? "bg-slate-800 border-slate-600" : "bg-slate-800 border-pink-500"
                }`}>
                {isCompleted ? (
                    <button disabled className="w-full h-full border-2 border-slate-600 text-slate-600 font-black uppercase text-xl cursor-not-allowed">
                        DONE
                    </button>
                ) : activity.status === "Planned" ? (
                    <button disabled className="w-full h-full border-2 border-slate-700 text-slate-500 font-black uppercase text-xl cursor-not-allowed opacity-50">
                        LOCKED
                    </button>
                ) : (
                    <a href={activity.link || "#"} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                        <button className="w-full h-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-slate-900 font-black uppercase text-xl transition-all shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,1)]">
                            JOIN
                        </button>
                    </a>
                )}
            </div>
        </motion.div>
    );
}
