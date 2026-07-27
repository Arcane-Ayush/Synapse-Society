import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

// --- ANIME THEME: Guild Quest Card ---
export function AnimeActivityCard({ activity, index }) {
    const isCompleted = activity.status === "Completed";
    const colors = [
        "border-pink-300", "border-blue-300", "border-purple-300", "border-yellow-300", "border-green-300"
    ];
    const borderColor = isCompleted ? "border-slate-300" : colors[activity.id % colors.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative w-full max-w-4xl mx-auto mb-8 rounded-xl shadow-md border-l-8 ${borderColor} p-6 md:p-8 flex flex-col md:flex-row gap-6 transition-all group ${isCompleted
                ? "bg-slate-100 opacity-75 shadow-none"
                : "bg-white hover:shadow-xl"
                }`}
        >
            {/* "Stamp" Effect */}
            <div className="absolute top-4 right-6 transform rotate-12 opacity-80 pointer-events-none z-10">
                <div className={`border-4 border-dashed rounded-full px-4 py-1 font-black text-xl uppercase tracking-widest ${isCompleted
                    ? "border-slate-400 text-slate-500 opacity-50"
                    : activity.status === "Upcoming" ? "border-green-400 text-green-500" : "border-slate-300 text-slate-400"
                    }`}>
                    {isCompleted ? "CLOSED" : activity.status === "Upcoming" ? "OPEN" : "CLOSED"}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className={isCompleted ? "text-slate-400" : "text-yellow-400"} />
                    <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Quest Rank B</span>
                </div>

                <h3 className={`text-3xl font-black mb-4 font-serif transition-colors ${isCompleted ? "text-slate-500 line-through decoration-slate-400" : "text-slate-800 group-hover:text-pink-600"
                    }`}>
                    {activity.title}
                </h3>

                <p className={`mb-6 p-4 rounded-lg italic border-l-2 ${isCompleted ? "bg-slate-200/50 text-slate-400 border-slate-300" : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}>
                    "{activity.description}"
                </p>

                <div className={`flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold ${isCompleted ? "text-slate-400" : "text-slate-500"}`}>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className={isCompleted ? "text-slate-400" : "text-pink-400"} /> {formatDate(activity.date)}
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col justify-end">
                {isCompleted ? (
                    <button disabled className="bg-slate-300 text-slate-500 font-bold py-3 px-8 rounded-lg cursor-not-allowed">
                        Completed
                    </button>
                ) : activity.status === "Planned" ? (
                    <button disabled className="bg-slate-100 text-slate-400 font-bold py-3 px-8 rounded-lg cursor-not-allowed">
                        Coming Soon
                    </button>
                ) : (
                    <a href={activity.link || "#"} target="_blank" rel="noopener noreferrer">
                        <button className="bg-slate-800 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-pink-500 hover:shadow-lg hover:-translate-y-1 transition-all w-full md:w-auto">
                            Accept Quest
                        </button>
                    </a>
                )}
            </div>
        </motion.div>
    );
}
