import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  ShieldCheck,
  Award,
  UserCheck,
  ChevronDown,
  Cpu,
  Layers,
  Video,
  Palette,
  FileText,
  Calendar,
  Megaphone,
  Users,
  Lock,
  Unlock,
  X
} from 'lucide-react';

export function Slide06Leadership() {
  // President (id tier1-0) unlocked by default; others locked
  const [unlockedCards, setUnlockedCards] = useState({ 'tier1-0': true });
  const [expandedMember, setExpandedMember] = useState(null);

  // Department Heads (Tier 3A)
  const deptLeads = [
    { id: 't3-0', title: 'TECH HEAD', name: 'Ayush Kumar Singh', icon: Cpu, color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-950/40', image: '/leadership/ayush-kumar-singh-tech-head.jpg', role: 'TECH HEAD', desc: 'Architecting full-stack event infrastructure, real-time engines, and member web portals.' },
    { id: 't3-1', title: 'PROJECT SUPERVISOR', name: 'Vansh Kumar Chandel', icon: Layers, color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-950/40', image: '/leadership/vansh-kumar-chandel.jpg', role: 'PROJECT SUPERVISOR', desc: 'Supervising open-source software projects, code audits, and repository quality standards.' },
    { id: 't3-2', title: 'MEDIA HEAD', name: 'Vaishnavi Srivastava', icon: Video, color: 'text-pink-400', border: 'border-pink-500/40', bg: 'bg-pink-950/40', image: '/leadership/vaishnavi-srivastava-media-head.png', role: 'MEDIA HEAD', desc: 'Directing video production, stage motion graphics, and event media broadcasting.' },
    { id: 't3-3', title: 'DESIGN HEAD', name: 'Kishan Verma', icon: Palette, color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40', image: '/leadership/kishan-verma-design-head.jpg', role: 'DESIGN HEAD', desc: 'Crafting brand aesthetics, visual identities, design systems, and UI components.' },
    { id: 't3-4', title: 'CONTENT HEAD', name: 'Vaishnavi Gupta', icon: FileText, color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/40', image: '/leadership/vaishnavi-gupta-content-head.png', role: 'CONTENT HEAD', desc: 'Authoring hackathon briefs, technical documentation, and event workshop guides.' },
    { id: 't3-5', title: 'EVENT HEAD', name: 'Ujjwal', icon: Calendar, color: 'text-indigo-400', border: 'border-indigo-500/40', bg: 'bg-indigo-950/40', role: 'EVENT HEAD', desc: 'Managing event schedules, stage coordination, and venue logistics.' },
    { id: 't3-6', title: 'PR & OUTREACH HEAD', name: 'Prateek Kumar', icon: Megaphone, color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-950/40', image: '/leadership/prateek-kumar-pr-head.jpg', role: 'PR & OUTREACH HEAD', desc: 'Managing university outreach, external partnerships, and speaker invitations.' },
  ];

  // Tier 4 Members
  const tier4Members = [
    { id: 't4-0', dept: 'MEDIA DEPARTMENT', icon: Video, color: 'text-pink-400', border: 'border-pink-500/50', bg: 'bg-pink-950/20', name: 'Ayush Pandey', role: 'Content Strategist & Media Creator', image: '/leadership/ayush-pandey-media.png' },
    { id: 't4-1', dept: 'TECH DEPARTMENT', icon: Cpu, color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-950/20', name: 'Krish Mishra', role: 'Core Software Developer', image: '/leadership/krish-mishra.jpg' },
    { id: 't4-2', dept: 'MEDIA DEPARTMENT', icon: Video, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/20', name: 'Ishaan Sharma', role: 'Video Creator & Editor', image: '/leadership/ishaan-sharma-media.jpg' },
  ];

  const handleCardClick = (cardId, memberData) => {
    if (!unlockedCards[cardId]) {
      setUnlockedCards(prev => ({ ...prev, [cardId]: true }));
    } else {
      setExpandedMember(memberData);
    }
  };

  // Helper for Nexus-style 3D Tilt Card
  const TiltCard = ({ children, className = '', onClick, style = {} }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setTilt({ x: -y / 15, y: x / 15 });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    return (
      <div
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`cursor-pointer transition-transform duration-150 ease-out ${className}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          ...style
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <section className="min-h-[85vh] py-6 relative text-white z-10 font-sans select-none overflow-y-auto max-h-[85vh] custom-scrollbar">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10 w-full text-center relative">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 font-mono text-xs mb-3 shadow-[0_0_25px_rgba(124,58,237,0.3)]"
        >
          <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>SYNAPSE COMMAND CENTER • ORGANIZATIONAL HIERARCHY</span>
        </motion.div>

        <h1
          className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          THE SYNAPSE SOCIETY LEADERSHIP STRUCTURE
        </h1>

        <p className="text-gray-300 text-xs sm:text-sm max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          Four-tier governance matrix mapping executive leadership, department leads, specialized divisions &amp; team members. Hover for 3D tilt, tap locked cards to unlock!
        </p>

        {/* ========================================================================= */}
        {/* TIER 1 — PRESIDENT (CROWN AUTHORITIES) WITH POP-OUT 3D FRAME */}
        {/* ========================================================================= */}
        <div className="relative mb-12 flex flex-col items-center">
          <div className="font-mono text-xs text-amber-400 font-bold mb-3 tracking-widest flex items-center gap-2 uppercase">
            <Crown className="w-4 h-4 text-amber-400" /> TIER 1 — PRESIDENT
          </div>

          <TiltCard
            onClick={() => setExpandedMember({
              title: 'SOCIETY PRESIDENT',
              name: 'Pragya Shukla',
              role: 'President & Executive Director',
              desc: 'Directing strategic vision, technological architecture, department execution, and university-wide hackathons for The Synapse Society.',
              image: '/leadership/pragya-shukla-president.png',
              tier: 'TIER 1'
            })}
            className="w-full max-w-2xl"
          >
            <div
              className="rounded-3xl p-6 sm:p-8 pt-10 sm:pt-12 border-2 border-purple-500/60 shadow-[0_0_50px_rgba(124,58,237,0.4)] relative overflow-visible flex flex-col sm:flex-row items-center gap-6 group hover:border-purple-400 transition-all mt-4 text-left"
              style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
            >
              {/* 3D Holographic Photo Frame */}
              <div className="relative w-48 h-64 sm:w-52 sm:h-72 rounded-2xl border-2 border-amber-400/90 bg-gradient-to-b from-purple-900/80 via-purple-950/90 to-[#09090B] shadow-[0_0_35px_rgba(251,191,36,0.4)] shrink-0 flex flex-col justify-end p-2 border-t-transparent">
                <img
                  src="/leadership/pragya-shukla-president.png"
                  alt="Pragya Shukla"
                  className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-[220px] sm:w-[250px] max-w-none h-auto object-contain pointer-events-none drop-shadow-[0_15px_25px_rgba(251,191,36,0.5)] z-20 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-60 rounded-2xl z-10" />
                <div className="relative z-20 text-center pb-1">
                  <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-lg">
                    CHIEF AUTHORITY
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-300 font-mono text-xs font-bold flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>SOCIETY PRESIDENT</span>
                  </span>
                  <span className="font-mono text-[10px] text-cyan-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/30">
                    TIER 1 AUTHORIZED
                  </span>
                </div>

                <h3 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                  Pragya Shukla
                </h3>
                <p className="font-mono text-xs text-amber-300 font-semibold mb-3">
                  President &amp; Executive Director
                </p>
                <p className="text-xs text-gray-300 leading-relaxed mb-4 font-sans">
                  Directing strategic vision, technological architecture, department execution, and university-wide hackathons for The Synapse Society.
                </p>

                <div className="pt-3 border-t border-purple-500/30 flex items-center justify-between text-[11px] font-mono text-purple-300">
                  <span className="flex items-center gap-1 text-cyan-300 font-bold">
                    <UserCheck className="w-3.5 h-3.5" /> VERIFIED EXECUTIVE LEAD
                  </span>
                  <span>SYNAPSE 2025 - 2026</span>
                </div>
              </div>
            </div>
          </TiltCard>

          <ChevronDown className="w-5 h-5 text-indigo-400 animate-bounce mx-auto mt-4" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 2 — EXECUTIVE COUNCIL */}
        {/* ========================================================================= */}
        <div className="relative mb-12">
          <div className="font-mono text-xs text-indigo-400 font-bold mb-4 tracking-widest flex items-center justify-center gap-2 uppercase">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> TIER 2 — EXECUTIVE COUNCIL
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto">
            {/* Vice President */}
            {(() => {
              const cardId = 'tier2-vp';
              const isUnlocked = unlockedCards[cardId];
              const memberData = { title: 'VICE PRESIDENT', name: 'Ankit Kumar Mishra', role: 'Vice President', desc: 'Overseeing operational execution, technical divisions, and member initiatives.', image: '/leadership/ankit-kumar-mishra-vice-president.jpg', tier: 'TIER 2' };

              return (
                <TiltCard
                  onClick={() => handleCardClick(cardId, memberData)}
                  className="w-full md:w-[340px]"
                >
                  <div
                    className={`rounded-2xl p-5 border-2 border-indigo-500/40 shadow-xl flex flex-col justify-between text-left group hover:border-indigo-400 transition-all h-full ${
                      isUnlocked ? 'bg-zinc-950/85' : 'bg-black/90 border-dashed border-indigo-500/30'
                    }`}
                    style={{ backdropFilter: 'blur(16px)' }}
                  >
                    {!isUnlocked ? (
                      <div className="flex flex-col items-center justify-center text-center my-auto py-16 space-y-2">
                        <Lock size={28} className="text-indigo-400 mb-1" />
                        <span className="text-xs font-mono font-bold text-indigo-300 uppercase">VICE PRESIDENT</span>
                        <span className="text-[11px] font-mono text-zinc-400">Click for 3D Flip Unlock</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold">
                            VICE PRESIDENT
                          </span>
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        </div>

                        <div className="relative w-full h-72 rounded-xl overflow-hidden mb-4 border border-indigo-500/40 bg-purple-950/60 shadow-lg">
                          <img
                            src="/leadership/ankit-kumar-mishra-vice-president.jpg"
                            alt="Ankit Kumar Mishra"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-3 left-3 right-3 text-xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Ankit Kumar Mishra
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed mb-3 font-sans">
                          Overseeing operational execution, technical divisions, and member initiatives.
                        </p>

                        <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-cyan-300 font-bold flex justify-between">
                          <span>EXECUTIVE BOARD</span>
                          <span>TIER 2</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TiltCard>
              );
            })()}

            {/* Treasurer */}
            {(() => {
              const cardId = 'tier2-treasurer';
              const isUnlocked = unlockedCards[cardId];
              const memberData = { title: 'TREASURER', name: 'Paras Tiwari', role: 'Treasurer', desc: 'Managing financial allocations, event budgets, and hackathon prize logistics.', image: '/leadership/treasurer.png', tier: 'TIER 2' };

              return (
                <TiltCard
                  onClick={() => handleCardClick(cardId, memberData)}
                  className="w-full md:w-[340px]"
                >
                  <div
                    className={`rounded-2xl p-5 border-2 border-emerald-500/40 shadow-xl flex flex-col justify-between text-left group hover:border-emerald-400 transition-all h-full ${
                      isUnlocked ? 'bg-zinc-950/85' : 'bg-black/90 border-dashed border-emerald-500/30'
                    }`}
                    style={{ backdropFilter: 'blur(16px)' }}
                  >
                    {!isUnlocked ? (
                      <div className="flex flex-col items-center justify-center text-center my-auto py-16 space-y-2">
                        <Lock size={28} className="text-emerald-400 mb-1" />
                        <span className="text-xs font-mono font-bold text-emerald-300 uppercase">TREASURER</span>
                        <span className="text-[11px] font-mono text-zinc-400">Click for 3D Flip Unlock</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                            TREASURER
                          </span>
                          <Award className="w-4 h-4 text-emerald-400" />
                        </div>

                        <div className="relative w-full h-72 rounded-xl overflow-hidden mb-4 border border-emerald-500/40 bg-purple-950/60 shadow-lg">
                          <img
                            src="/leadership/treasurer.png"
                            alt="Paras Tiwari"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-3 left-3 right-3 text-xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Paras Tiwari
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed mb-3 font-sans">
                          Managing financial allocations, event budgets, and hackathon prize logistics.
                        </p>

                        <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-emerald-300 font-bold flex justify-between">
                          <span>TREASURY BOARD</span>
                          <span>TIER 2</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TiltCard>
              );
            })()}
          </div>

          <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce mx-auto mt-4" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 3A — DEPARTMENT HEADS & LEADS (EXACT ABOUT PAGE CARDS) */}
        {/* ========================================================================= */}
        <div className="relative mb-12">
          <div className="font-mono text-xs text-cyan-400 font-bold mb-4 tracking-widest flex items-center justify-center gap-2 uppercase">
            <Cpu className="w-4 h-4 text-cyan-400" /> TIER 3A — DEPARTMENT HEADS &amp; LEADS
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {deptLeads.map((head) => {
              const IconComp = head.icon;
              const isUnlocked = unlockedCards[head.id];

              return (
                <TiltCard
                  key={head.id}
                  onClick={() => handleCardClick(head.id, { ...head, tier: 'TIER 3A' })}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] xl:w-[calc(25%-18px)] max-w-[275px]"
                >
                  <div
                    className={`rounded-2xl p-5 border-2 ${head.border} ${head.bg} flex flex-col justify-between text-left group hover:scale-[1.02] transition-all shadow-xl min-h-[280px] h-full`}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    {!isUnlocked ? (
                      <div className="flex flex-col items-center justify-center text-center my-auto py-12 space-y-2">
                        <Lock size={24} className={head.color} />
                        <span className={`text-[11px] font-mono font-bold ${head.color} uppercase`}>{head.title}</span>
                        <span className="text-[10px] font-mono text-zinc-400">Click for 3D Flip</span>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full bg-purple-950/80 border ${head.border} ${head.color} font-mono text-[10px] font-bold`}>
                              {head.title}
                            </span>
                            <IconComp className={`w-4 h-4 ${head.color}`} />
                          </div>

                          <div className="relative w-full h-52 rounded-xl overflow-hidden mb-3 border border-purple-500/30 bg-purple-950/80 shadow-lg flex items-center justify-center">
                            {head.image ? (
                              <img
                                src={head.image}
                                alt={head.name}
                                className="w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center p-4 text-center">
                                <IconComp className={`w-12 h-12 ${head.color} opacity-40 mb-2 animate-pulse`} />
                                <span className="font-mono text-[10px] text-purple-300/60 uppercase tracking-widest">
                                  SYN-CARD AVATAR
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="text-lg font-extrabold text-white drop-shadow-md" style={{ fontFamily: 'Space Grotesk' }}>
                                {head.name}
                              </div>
                            </div>
                          </div>

                          <div className={`font-mono text-xs font-bold ${head.color} mb-1`}>
                            {head.title}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-purple-300 font-bold flex justify-between mt-2">
                          <span>DEPARTMENT HEAD</span>
                          <span>TIER 3A</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TiltCard>
              );
            })}
          </div>

          <ChevronDown className="w-5 h-5 text-pink-400 animate-bounce mx-auto mt-4" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 4 — SYN-CARD TEAM MEMBERS SHOWCASE GRID (EXACT ABOUT PAGE CARDS) */}
        {/* ========================================================================= */}
        <div className="relative mb-12">
          <div className="font-mono text-xs text-purple-400 font-bold mb-4 tracking-widest flex items-center justify-center gap-2 uppercase">
            <Users className="w-4 h-4 text-purple-400" /> TIER 4 — SYN-CARD TEAM MEMBER CARDS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tier4Members.map((m) => {
              const IconComp = m.icon;
              const isUnlocked = unlockedCards[m.id];

              return (
                <TiltCard
                  key={m.id}
                  onClick={() => handleCardClick(m.id, { ...m, tier: 'TIER 4 MEMBER' })}
                >
                  <div
                    className={`rounded-2xl p-5 border-2 ${m.border} ${m.bg} shadow-xl flex flex-col justify-between text-left group hover:scale-[1.02] transition-all min-h-[280px] h-full`}
                    style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
                  >
                    {!isUnlocked ? (
                      <div className="flex flex-col items-center justify-center text-center my-auto py-12 space-y-2">
                        <Lock size={24} className={m.color} />
                        <span className={`text-xs font-mono font-bold ${m.color}`}>{m.name.toUpperCase()}</span>
                        <span className="text-[10px] font-mono text-zinc-400">Click for 3D Flip</span>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-0.5 rounded-full bg-purple-950/80 border ${m.border} ${m.color} font-mono text-[10px] font-bold`}>
                              {m.dept}
                            </span>
                            <IconComp className={`w-4 h-4 ${m.color}`} />
                          </div>

                          <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 border border-purple-500/40 bg-purple-950 shadow-lg">
                            <img
                              src={m.image}
                              alt={m.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>{m.name}</div>
                            </div>
                          </div>

                          <div className={`font-mono text-xs font-bold ${m.color} mb-1`}>
                            {m.role}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-purple-300 font-bold flex justify-between mt-2">
                          <span>SYNAPSE MEMBER</span>
                          <span>TIER 4 MEMBER</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3D EXPANDED OVERLAY MODAL */}
      <AnimatePresence>
        {expandedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.85, opacity: 0, rotateX: -15 }}
              className="w-full max-w-lg p-6 rounded-3xl bg-zinc-950 border-2 border-purple-500/60 shadow-[0_0_60px_rgba(168,85,247,0.5)] relative space-y-4 text-left overflow-hidden"
            >
              <button
                onClick={() => setExpandedMember(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-20"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                {expandedMember.image && (
                  <div className="w-28 h-36 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-purple-950 flex-shrink-0">
                    <img
                      src={expandedMember.image}
                      alt={expandedMember.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-400/40 text-purple-300 font-mono text-[10px] font-bold">
                    {expandedMember.title || expandedMember.dept}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                    {expandedMember.name}
                  </h3>
                  <p className="text-xs font-mono text-amber-300 font-bold">
                    {expandedMember.role || expandedMember.title}
                  </p>
                </div>
              </div>

              {expandedMember.desc && (
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300 leading-relaxed font-sans">
                  {expandedMember.desc}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
