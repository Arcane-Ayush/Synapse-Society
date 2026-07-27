import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, QrCode, ScanLine, Ticket } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

// --- SPACE THEME: Holographic Boarding Pass ---
export function SpaceActivityPass({ activity, index }) {
    const isCompleted = activity.status === "Completed";

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`relative w-full max-w-4xl mx-auto mb-8 flex flex-col md:flex-row bg-black/40 border backdrop-blur-md overflow-hidden group transition-all duration-300 ${isCompleted
                ? "border-slate-800/50 grayscale opacity-60"
                : "border-cyan-500/30 hover:border-cyan-400/60"
                }`}
        >
            {/* Holographic Overlay - disabled if completed */}
            {!isCompleted && (
                <>
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine pointer-events-none"></div>
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>
                </>
            )}

            <div className={`flex-1 p-6 md:p-8 relative ${isCompleted && "text-slate-500"}`}>
                <div className={`absolute top-2 left-2 w-3 h-3 border-t border-l ${isCompleted ? "border-slate-700" : "border-cyan-500/50"}`}></div>
                <div className={`absolute bottom-2 left-2 w-3 h-3 border-b border-l ${isCompleted ? "border-slate-700" : "border-cyan-500/50"}`}></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className={`border px-3 py-1 text-xs font-mono flex items-center gap-2 ${isCompleted ? "bg-slate-900 border-slate-700 text-slate-500" : "bg-cyan-950/50 border-cyan-500/30 text-cyan-400"
                        }`}>
                        <ScanLine size={12} />
                        PASS_ID // {activity.id.toString().padStart(4, '0')}
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 border ${isCompleted ? "text-slate-500 border-slate-700" :
                        activity.status === "Upcoming" ? "text-green-400 bg-green-950/30 border-green-500/30" : "text-gray-500 border-gray-500/30"
                        }`}>
                        [{activity.status}]
                    </div>
                </div>

                <h3 className={`text-2xl md:text-3xl font-black mb-4 tracking-tight ${isCompleted ? "text-slate-600 uppercase" : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-blue-200"
                    }`}>
                    {activity.title}
                </h3>

                <div className={`grid grid-cols-2 gap-4 text-sm font-mono mb-6 ${isCompleted ? "text-slate-600" : "text-cyan-300/80"}`}>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className={isCompleted ? "text-slate-600" : "text-cyan-500"} />
                        <span>DATE: {formatDate(activity.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className={isCompleted ? "text-slate-600" : "text-cyan-500"} />
                        <span>TIME: {activity.time}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                        <MapPin size={14} className={isCompleted ? "text-slate-600" : "text-cyan-500"} />
                        <span>SECTOR: {activity.location}</span>
                    </div>
                </div>

                <p className={`text-sm leading-relaxed font-light border-l-2 pl-4 ${isCompleted ? "text-slate-600 border-slate-700" : "text-cyan-100/60 border-cyan-500/20"
                    }`}>
                    {activity.description}
                </p>
            </div>

            <div className={`relative w-full md:w-px h-px md:h-auto ${isCompleted ? "bg-slate-800" : "bg-cyan-900/50"}`}>
                <div className="absolute inset-0 flex md:flex-col justify-between items-center overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black rounded-full my-1 mx-1"></div>
                    ))}
                </div>
            </div>

            <div className={`w-full md:w-64 p-6 flex flex-col items-center justify-center relative border-l ${isCompleted ? "bg-slate-900/50 border-slate-800" : "bg-cyan-950/20 border-cyan-500/20"
                }`}>
                <div className="text-center space-y-4">
                    <div className={`w-24 h-24 rounded-lg border flex items-center justify-center ${isCompleted ? "bg-slate-900 border-slate-700" : "bg-white/10 border-cyan-500/30"
                        }`}>
                        <QrCode size={48} className={`opacity-80 ${isCompleted ? "text-slate-700" : "text-cyan-400"}`} />
                    </div>
                    <div className={`font-mono text-[10px] text-center tracking-widest opacity-70 ${isCompleted ? "text-slate-600" : "text-cyan-500"}`}>
                        {isCompleted ? "EXPIRED_PASS" : "SCAN_FOR_ENTRY"}
                    </div>

                    {isCompleted ? (
                        <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-slate-500 text-xs font-bold uppercase py-2 px-4 rounded cursor-not-allowed">
                            <Ticket size={14} /> EXPIRED
                        </button>
                    ) : activity.status === "Planned" ? (
                        <button disabled className="w-full flex items-center justify-center gap-2 bg-cyan-950/30 border border-cyan-500/10 text-cyan-500/50 text-xs font-bold uppercase py-2 px-4 rounded cursor-not-allowed">
                            <Ticket size={14} /> TBA_SOON
                        </button>
                    ) : (
                        <a href={activity.link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <button className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase py-2 px-4 rounded transition-all">
                                <Ticket size={14} /> RSVP_NOW
                            </button>
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
