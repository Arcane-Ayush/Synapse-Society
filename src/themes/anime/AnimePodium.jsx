import { motion } from "framer-motion";

export function AnimePodium({ leaderboard }) {
    const sorted = [...leaderboard].sort((a, b) => b.points - a.points);
    const top3 = [sorted[1], sorted[0], sorted[2]].filter(Boolean);
    const others = sorted.slice(3);

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex justify-center items-end gap-4 md:gap-8 h-[450px] mb-12">
                {top3.map((team, index) => {
                    const isFirst = index === 1;
                    const isSecond = index === 0;
                    const isThird = index === 2;
                    let height = isFirst ? "h-72 md:h-96" : isSecond ? "h-56 md:h-72" : "h-40 md:h-56";
                    let color = isFirst ? "bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-400 border-yellow-200"
                        : isSecond ? "bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-slate-200"
                            : "bg-gradient-to-b from-orange-300 via-orange-400 to-red-400 border-orange-200";
                    let glow = isFirst ? "shadow-[0_20px_50px_rgba(250,204,21,0.4)]" : "shadow-xl";
                    let delay = isFirst ? 0.4 : isSecond ? 0.2 : 0.6;
                    let rankColor = isFirst ? "text-yellow-600" : isSecond ? "text-slate-600" : "text-orange-700";

                    return (
                        <motion.div
                            key={team.name}
                            initial={{ y: 200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay, type: "spring", stiffness: 80, damping: 15 }}
                            className={`relative flex flex-col items-center justify-end w-1/3 max-w-[200px] rounded-t-3xl border-t-4 border-x border-white/40 ${height} ${color} ${glow} group`}
                        >
                            <motion.div
                                initial={{ y: 20 }}
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: delay }}
                                className="absolute -top-20 flex flex-col items-center w-full"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50"></div>
                                    <img src={team.avatar} alt={team.name} className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
                                    <div className={`absolute -bottom-3 -right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-xl shadow-lg ${rankColor}`}>
                                        {team.rank}
                                    </div>
                                </div>
                                <h3 className="mt-3 text-sm md:text-lg font-bold text-slate-800 bg-white/90 px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                                    {team.name}
                                </h3>
                            </motion.div>
                            <div className="mb-8 text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mx-4 w-3/4">
                                <span className="block text-2xl md:text-4xl font-black text-white drop-shadow-md">{team.points}</span>
                                <span className="text-xs uppercase tracking-widest text-white/90 font-bold">Points</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-16">
                <h4 className="text-xl font-bold mb-6 text-slate-700 flex items-center gap-2">
                    <span className="bg-slate-100 p-2 rounded-lg">🎖️</span> Honorable Mentions
                </h4>
                <div className="flex gap-6 overflow-x-auto pb-4 px-2 no-scrollbar">
                    {others.map((team, i) => (
                        <motion.div
                            key={team.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + (i * 0.1) }}
                            className="flex-shrink-0 w-72 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-pink-200 hover:shadow-lg transition-all flex items-center gap-4 group cursor-pointer"
                        >
                            <span className="font-black text-3xl text-slate-200 group-hover:text-pink-400 transition-colors">#{team.rank}</span>
                            <img src={team.avatar} alt={team.name} className="w-12 h-12 rounded-full bg-white shadow-sm" />
                            <div>
                                <p className="font-bold text-slate-700 text-lg">{team.name}</p>
                                <p className="text-sm text-slate-500 font-medium">{team.points} pts</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
