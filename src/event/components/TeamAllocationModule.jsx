import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, CheckCircle2, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { getTeamByCode } from '../lib/eventTeamsData';
import { setAssignedEventTeam, fetchEventTeamsFromDb } from '../lib/eventState';

export function TeamAllocationModule({ user, assignedTeam, onTeamSelected }) {
    const [teams, setTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(assignedTeam);
    const [customCode, setCustomCode] = useState('');
    const [confirmed, setConfirmed] = useState(!!assignedTeam);

    useEffect(() => {
        fetchEventTeamsFromDb().then(dbTeams => {
            if (dbTeams && dbTeams.length > 0) setTeams(dbTeams);
        });
    }, []);

    const filteredTeams = teams.filter(t => 
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.motto?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (team) => {
        setSelectedTeam(team);
    };

    const handleConfirm = () => {
        if (!selectedTeam) return;
        setAssignedEventTeam(user?.id, selectedTeam);
        setConfirmed(true);
        if (onTeamSelected) onTeamSelected(selectedTeam);
    };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        const found = getTeamByCode(customCode);
        if (found) {
            handleSelect(found);
            setAssignedEventTeam(user?.id, found);
            setConfirmed(true);
            if (onTeamSelected) onTeamSelected(found);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(13, 13, 25, 0.95) 0%, rgba(20, 15, 35, 0.95) 100%)',
                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.35)',
                    boxShadow: '0 0 50px rgba(var(--synapse-violet-rgb), 0.2)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-purple-400" />
                        <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Squad Alignment • 40 Event Teams
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
                        PHASE 1
                    </span>
                </div>

                <p className="text-xs font-mono text-zinc-400 mb-6">
                    Align your Agent ID with your assigned table / squad number. Ground team can assign directly, or choose your squad below:
                </p>

                {/* Quick Code Input */}
                <form onSubmit={handleCodeSubmit} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Enter Squad Code (e.g. SYN-T07)"
                        value={customCode}
                        onChange={e => setCustomCode(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-purple-400/30 text-xs font-mono uppercase text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-mono font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                        Join <ArrowRight size={14} />
                    </button>
                </form>

                {/* Search Squads */}
                <div className="relative mb-4">
                    <Search size={14} className="absolute left-3.5 top-3 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search 40 Squads by name, number or badge..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/30 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-400/50"
                    />
                </div>

                {/* Grid of 40 Teams */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar mb-6">
                    {filteredTeams.map(team => {
                        const isSelected = selectedTeam?.id === team.id;
                        return (
                            <motion.button
                                key={team.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelect(team)}
                                className="p-3 rounded-xl flex items-center gap-3 text-left transition-all cursor-pointer select-none"
                                style={{
                                    background: isSelected ? `${team.color}25` : 'rgba(255, 255, 255, 0.03)',
                                    border: isSelected ? `2px solid ${team.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: isSelected ? `0 0 20px ${team.color}33` : 'none'
                                }}
                            >
                                <span className="text-xl flex-shrink-0">{team.badge}</span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                        <span className="text-xs font-bold truncate text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                            {team.name}
                                        </span>
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400">
                                            {team.code}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                                        {team.motto}
                                    </p>
                                </div>
                                {isSelected && (
                                    <CheckCircle2 size={16} style={{ color: team.color }} className="flex-shrink-0" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Confirm Alignment Button */}
                {selectedTeam && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleConfirm}
                        className="w-full py-3 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                        style={{
                            background: `linear-gradient(135deg, ${selectedTeam.color}, #7C3AED)`,
                            color: '#FFFFFF'
                        }}
                    >
                        <Sparkles size={14} />
                        Confirm Alignment: {selectedTeam.name}
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}
