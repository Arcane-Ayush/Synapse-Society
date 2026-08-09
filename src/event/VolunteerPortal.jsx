import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Shield, UserPlus, Search, CheckCircle2, Plus, Sparkles,
    Trash2, ExternalLink, ArrowRight, XCircle, ChevronLeft, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
    fetchEventTeamsFromDb,
    assignMultipleMembersToTeam,
    createEventTeamInDb
} from './lib/eventState';
import { playEventSound } from './lib/soundSystem';
import { supabase } from '../lib/supabase';

export function VolunteerPortal() {
    const { user, profile, isLead, isVolunteer, isAuthenticated } = useAuth();
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [agentIdsInput, setAgentIdsInput] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'detail'

    // New Team Form State
    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');
    const [newBadge, setNewBadge] = useState('⚡');
    const [newColor, setNewColor] = useState('#00F0FF');
    const [newMotto, setNewMotto] = useState('');

    const loadTeams = () => {
        fetchEventTeamsFromDb().then(data => {
            if (data && data.length > 0) {
                setTeams(data);
                if (!selectedTeamId && data[0]) {
                    setSelectedTeamId(data[0].id);
                }
            }
        });
    };

    useEffect(() => {
        loadTeams();

        const channel = supabase.channel('synapse_volunteer_channel', {
            config: { broadcast: { self: true } }
        });

        channel
            .on('broadcast', { event: 'team_member_assigned' }, () => loadTeams())
            .on('broadcast', { event: 'team_active_changed' }, () => loadTeams())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const hasAccess = isAuthenticated && (isVolunteer || isLead);

    // Add members using space / comma separated IDs (e.g. "42 81 243 51")
    const handleAddMembers = async (e) => {
        e.preventDefault();
        if (!selectedTeamId || !agentIdsInput.trim()) return;

        const res = await assignMultipleMembersToTeam(selectedTeamId, agentIdsInput.trim());

        if (!res.error) {
            playEventSound('thock');
            loadTeams();
            const addedList = (res.added || []).map(m => m.agentNo).join(', ');
            setStatusMessage(`✓ Added ${res.count || 1} member(s): [${addedList || agentIdsInput}]`);
            setAgentIdsInput('');
            setTimeout(() => setStatusMessage(null), 3500);
        } else {
            setStatusMessage(`Error adding members. Please verify IDs.`);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    const handleRemoveMember = async (teamId, agentNo) => {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;

        const updatedMembers = (team.members || []).filter(m => m.agentNo !== agentNo);
        const shouldBeActive = updatedMembers.length > 0 || (team.s_coins > 0);

        await supabase
            .from('event_teams')
            .update({
                members: updatedMembers,
                is_active: shouldBeActive,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId);

        loadTeams();
        setStatusMessage(`Member #${agentNo} removed.`);
        setTimeout(() => setStatusMessage(null), 2000);
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newCode.trim() || !newName.trim()) return;

        const res = await createEventTeamInDb({
            code: newCode.trim(),
            name: newName.trim(),
            badge: newBadge.trim() || '⚡',
            color: newColor,
            motto: newMotto.trim()
        });

        if (!res.error) {
            playEventSound('fanfare');
            loadTeams();
            setIsCreateModalOpen(false);
            setNewCode('');
            setNewName('');
            setNewMotto('');
            setStatusMessage(`Team ${newName} created!`);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
    const filteredTeams = teams.filter(t =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalMembersAssigned = teams.reduce((acc, t) => acc + (Array.isArray(t.members) ? t.members.length : 0), 0);
    const activeTeamsCount = teams.filter(t => t.is_active || (Array.isArray(t.members) && t.members.length > 0)).length;

    if (!hasAccess) {
        return (
            <div className="min-h-screen px-4 py-24 flex items-center justify-center text-center bg-[#07070E] text-white font-mono">
                <div className="p-6 rounded-xl bg-zinc-950 border border-purple-500/30 max-w-md space-y-3">
                    <Shield size={32} className="text-purple-400 mx-auto" />
                    <h2 className="text-base font-bold text-white">Volunteer Access Required</h2>
                    <p className="text-xs text-zinc-400">
                        Please sign in with a volunteer, lead, or administrator account to manage teams.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07070E] text-white p-3 sm:p-6 max-w-7xl mx-auto select-none space-y-4 font-mono">
            {/* Header & Metrics Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950/80 border border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                        <Users size={18} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Volunteer Portal
                        </h1>
                        <p className="text-[11px] text-cyan-300">
                            Neural Nexus 2026 • Team Member Assignment
                        </p>
                    </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 text-xs">
                    <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                        <span className="text-zinc-400">Teams: </span>
                        <strong className="text-white">{teams.length}</strong>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
                        <span>Active: </span>
                        <strong>{activeTeamsCount}</strong>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-500/40 text-purple-300">
                        <span>Members: </span>
                        <strong>{totalMembersAssigned}</strong>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1 cursor-pointer"
                    >
                        <Plus size={13} /> + Add Team
                    </button>
                    {isLead && (
                        <a
                            href="/ucn/app/event/launch/state/components/exists/202608100001/event_admin"
                            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                            <span>Admin</span>
                            <ArrowRight size={11} />
                        </a>
                    )}
                </div>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400" /> {statusMessage}
                </div>
            )}

            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden rounded-lg bg-black/60 border border-white/10 p-1">
                <button
                    onClick={() => setMobileTab('list')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                        mobileTab === 'list' ? 'bg-cyan-500 text-black' : 'text-zinc-400'
                    }`}
                >
                    1. Select Team ({filteredTeams.length})
                </button>
                <button
                    onClick={() => setMobileTab('detail')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                        mobileTab === 'detail' ? 'bg-cyan-500 text-black' : 'text-zinc-400'
                    }`}
                >
                    2. Add Members ({selectedTeam ? selectedTeam.name : 'None'})
                </button>
            </div>

            {/* Main 2-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* ── LEFT: TEAM LIST (5 Cols) ───────────────────────────────── */}
                <div className={`lg:col-span-5 p-3.5 rounded-xl bg-zinc-950/60 border border-white/10 space-y-2.5 flex flex-col h-[calc(100vh-210px)] ${
                    mobileTab === 'detail' ? 'hidden lg:flex' : 'flex'
                }`}>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-300 uppercase">Select Team</span>
                        <div className="relative flex-1 max-w-[190px]">
                            <Search size={11} className="absolute left-2.5 top-2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search teams..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-7 pr-2 py-1 rounded bg-black border border-white/10 text-xs text-white outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                        {filteredTeams.map(t => {
                            const isSelected = t.id === selectedTeamId;
                            const memberCount = Array.isArray(t.members) ? t.members.length : 0;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setSelectedTeamId(t.id);
                                        setMobileTab('detail');
                                    }}
                                    className={`w-full p-2 rounded-lg border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-cyan-950/40 border-cyan-400 text-white'
                                            : 'bg-black/40 border-white/5 hover:border-white/20 text-zinc-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-lg">{t.badge}</span>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold truncate">{t.name}</div>
                                            <div className="text-[10px] text-zinc-400">{t.code}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            memberCount > 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-zinc-500'
                                        }`}>
                                            {memberCount}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── RIGHT: TEAM MEMBER ADDITION WORKSPACE (7 Cols) ─────────── */}
                <div className={`lg:col-span-7 p-4 rounded-xl bg-zinc-950/60 border border-white/10 space-y-4 h-[calc(100vh-210px)] overflow-y-auto custom-scrollbar ${
                    mobileTab === 'list' ? 'hidden lg:block' : 'block'
                }`}>
                    {selectedTeam ? (
                        <>
                            {/* Selected Team Banner */}
                            <div
                                className="p-3.5 rounded-lg border flex items-center justify-between gap-2"
                                style={{
                                    background: `${selectedTeam.color || '#00F0FF'}10`,
                                    borderColor: `${selectedTeam.color || '#00F0FF'}44`
                                }}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-10 h-10 rounded flex items-center justify-center text-xl"
                                        style={{ background: `${selectedTeam.color || '#00F0FF'}25`, border: `1px solid ${selectedTeam.color || '#00F0FF'}50` }}
                                    >
                                        {selectedTeam.badge}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: selectedTeam.color }}>
                                            {selectedTeam.code}
                                        </div>
                                        <h2 className="text-sm sm:text-base font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                            {selectedTeam.name}
                                        </h2>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-[9px] text-zinc-400">SCORE</div>
                                    <div className="text-xs font-bold text-yellow-300">{selectedTeam.s_coins || 0} S</div>
                                </div>
                            </div>

                            {/* Batch Member Registration Input Form (Space-Separated IDs) */}
                            <div className="p-3.5 rounded-lg bg-black/60 border border-cyan-500/30 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-1">
                                        <UserPlus size={13} /> Add Members by Agent IDs
                                    </span>
                                    <span className="text-[10px] text-zinc-400">Separate with spaces</span>
                                </div>

                                <form onSubmit={handleAddMembers} className="space-y-2">
                                    <div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 42 81 243 51"
                                            value={agentIdsInput}
                                            onChange={e => setAgentIdsInput(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-black border border-white/20 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                                        />
                                        <p className="text-[10px] text-zinc-400 mt-1">
                                            Type or scan multiple IDs with spaces: <strong className="text-cyan-300">42 81 243 51</strong>
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                                    >
                                        + Add Members to {selectedTeam.name}
                                    </button>
                                </form>
                            </div>

                            {/* Current Members List */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-zinc-400">
                                    <span>MEMBERS ({Array.isArray(selectedTeam.members) ? selectedTeam.members.length : 0})</span>
                                    <span className="text-[10px]">Team active on first member</span>
                                </div>

                                {Array.isArray(selectedTeam.members) && selectedTeam.members.length > 0 ? (
                                    <div className="space-y-1">
                                        {selectedTeam.members.map((m, idx) => (
                                            <div
                                                key={m.agentNo || idx}
                                                className="p-2 rounded bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center">
                                                        #{idx + 1}
                                                    </span>
                                                    <span className="text-xs font-bold text-white">
                                                        Agent #{m.agentNo}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveMember(selectedTeam.id, m.agentNo)}
                                                    className="p-1 rounded text-zinc-500 hover:text-red-400 cursor-pointer"
                                                    title="Remove Member"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded bg-black/20 border border-dashed border-white/10 text-center text-xs text-zinc-500">
                                        No members yet. Type IDs above (e.g. 42 81 243) and click Add.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center text-zinc-500 text-xs">Select a team to add members.</div>
                    )}
                </div>
            </div>

            {/* ── CREATE TEAM MODAL ───────────────────────────────────────────── */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md p-5 rounded-xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-3.5 text-left"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                    Add New Team
                                </h3>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                                    <XCircle size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTeam} className="space-y-2.5">
                                <div>
                                    <label className="block text-[10px] text-zinc-400 uppercase mb-0.5">Team Code *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. SYN-T41"
                                        value={newCode}
                                        onChange={e => setNewCode(e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded bg-black border border-white/20 text-xs text-white focus:border-cyan-400 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] text-zinc-400 uppercase mb-0.5">Team Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Cyber Dragons"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded bg-black border border-white/20 text-xs text-white focus:border-cyan-400 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] text-zinc-400 uppercase mb-0.5">Badge Emoji</label>
                                        <input
                                            type="text"
                                            value={newBadge}
                                            onChange={e => setNewBadge(e.target.value)}
                                            className="w-full px-2 py-1 rounded bg-black border border-white/20 text-xs text-white text-center focus:border-cyan-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-zinc-400 uppercase mb-0.5">Color Theme</label>
                                        <input
                                            type="color"
                                            value={newColor}
                                            onChange={e => setNewColor(e.target.value)}
                                            className="w-full h-8 rounded bg-black border border-white/20 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="pt-1 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 py-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                                    >
                                        Add Team
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
