import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  ShieldCheck,
  Award,
  Sparkles,
  UserCheck,
  ChevronDown,
  Cpu,
  Layers,
  Video,
  Palette,
  FileText,
  Calendar,
  Megaphone,
  Users
} from 'lucide-react';

export function About() {
  const deptLeads = [
    { title: 'TECH HEAD', name: 'Ayush Kumar Singh', icon: Cpu, color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-950/40', image: '/leadership/ayush-kumar-singh-tech-head.jpg' },
    { title: 'PROJECT SUPERVISOR', name: 'Vansh Kumar Chandel', icon: Layers, color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-950/40', image: '/leadership/vansh-kumar-chandel.jpg' },
    { title: 'MEDIA HEAD', name: 'Vaishnavi Srivastava', icon: Video, color: 'text-pink-400', border: 'border-pink-500/40', bg: 'bg-pink-950/40', image: '/leadership/vaishnavi-srivastava-media-head.png' },
    { title: 'DESIGN HEAD', name: 'Kishan Verma', icon: Palette, color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40', image: '/leadership/kishan-verma-design-head.jpg' },
    { title: 'CONTENT HEAD', name: 'Vaishnavi Gupta', icon: FileText, color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/40', image: '/leadership/vaishnavi-gupta-content-head.png' },
    { title: 'EVENT HEAD', name: 'Ujjwal', icon: Calendar, color: 'text-indigo-400', border: 'border-indigo-500/40', bg: 'bg-indigo-950/40' },
    { title: 'PR & OUTREACH HEAD', name: 'Prateek Kumar', icon: Megaphone, color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-950/40', image: '/leadership/prateek-kumar-pr-head.jpg' },
  ];

  return (
    <section className="min-h-screen py-16 relative overflow-hidden text-white z-10" style={{ background: 'var(--bg-base)' }}>
      {/* Background Circuit Grid Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10 w-full text-center relative">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 font-mono text-xs mb-4 shadow-[0_0_25px_rgba(124,58,237,0.3)]"
        >
          <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>SYNAPSE COMMAND CENTER • ORGANIZATIONAL HIERARCHY</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          THE SYNAPSE SOCIETY LEADERSHIP STRUCTURE
        </motion.h1>

        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-16 leading-relaxed" style={{ fontFamily: 'Inter' }}>
          Four-tier governance matrix mapping executive leadership, department leads, specialized divisions &amp; SYN-CARD team members across Chandigarh University.
        </p>

        {/* ========================================================================= */}
        {/* TIER 1 — PRESIDENT (CROWN AUTHORITIES) WITH POP-OUT 3D FRAME */}
        {/* ========================================================================= */}
        <div className="relative mb-16 flex flex-col items-center">
          <div className="font-mono text-xs text-amber-400 font-bold mb-4 tracking-widest flex items-center gap-2 uppercase">
            <Crown className="w-4 h-4 text-amber-400" /> TIER 1 — PRESIDENT
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 pt-10 sm:pt-12 border-2 border-purple-500/60 shadow-[0_0_50px_rgba(124,58,237,0.4)] relative overflow-visible flex flex-col sm:flex-row items-center gap-6 group hover:border-purple-400 transition-all mt-8"
            style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
          >
            {/* Background Glow Aura */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/35 transition-all pointer-events-none" />

            {/* 3D Overlapping Holographic Photo Frame */}
            <div className="relative w-48 h-64 sm:w-52 sm:h-72 rounded-2xl border-2 border-amber-400/90 bg-gradient-to-b from-purple-900/80 via-purple-950/90 to-[#09090B] shadow-[0_0_35px_rgba(251,191,36,0.4)] shrink-0 flex flex-col justify-end p-2 border-t-transparent">
              {/* Overlapping Pop-out Cut-out Image */}
              <img
                src="/leadership/pragya-shukla-president.png"
                alt="Pragya Shukla - Society President"
                className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-[220px] sm:w-[250px] max-w-none h-auto object-contain pointer-events-none drop-shadow-[0_15px_25px_rgba(251,191,36,0.5)] z-20 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-60 rounded-2xl z-10" />
              <div className="relative z-20 text-center pb-1">
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-lg">
                  CHIEF AUTHORITY
                </span>
              </div>
            </div>

            {/* Authority Info */}
            <div className="text-left flex-grow">
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
              <p className="text-xs text-gray-300 leading-relaxed mb-4" style={{ fontFamily: 'Inter' }}>
                Directing strategic vision, technological architecture, department execution, and university-wide hackathons for The Synapse Society.
              </p>

              <div className="pt-3 border-t border-purple-500/30 flex items-center justify-between text-[11px] font-mono text-purple-300">
                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                  <UserCheck className="w-3.5 h-3.5" /> VERIFIED EXECUTIVE LEAD
                </span>
                <span>SYNAPSE 2025 - 2026</span>
              </div>
            </div>
          </motion.div>

          {/* Vertical Connector Line Down to Tier 2 */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-purple-500 to-indigo-500 my-2 shadow-[0_0_10px_#7C3AED]" />
          <ChevronDown className="w-5 h-5 text-indigo-400 animate-bounce -mt-3" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 2 — EXECUTIVE COUNCIL */}
        {/* ========================================================================= */}
        <div className="relative mb-16">
          <div className="font-mono text-xs text-indigo-400 font-bold mb-4 tracking-widest flex items-center justify-center gap-2 uppercase">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> TIER 2 — EXECUTIVE COUNCIL
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto">
            {/* Vice President: Ankit Kumar Mishra */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl p-5 border-2 border-indigo-500/40 shadow-xl flex flex-col justify-between text-left group hover:border-indigo-400 transition-all w-full md:w-[340px]"
              style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold">
                    VICE PRESIDENT
                  </span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>

                <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden mb-4 border border-indigo-500/40 bg-purple-950/60 shadow-lg">
                  <img
                    src="/leadership/ankit-kumar-mishra-vice-president.jpg"
                    alt="Ankit Kumar Mishra - Vice President"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-xl font-extrabold text-white drop-shadow-md" style={{ fontFamily: 'Space Grotesk' }}>
                    Ankit Kumar Mishra
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-3" style={{ fontFamily: 'Inter' }}>
                  Overseeing operational execution, technical divisions, and member initiatives.
                </p>
              </div>

              <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-cyan-300 font-bold flex justify-between">
                <span>EXECUTIVE BOARD</span>
                <span>TIER 2</span>
              </div>
            </motion.div>

            {/* Treasurer: Paras Tiwari */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl p-5 border-2 border-emerald-500/40 shadow-xl flex flex-col justify-between text-left group hover:border-emerald-400 transition-all w-full md:w-[340px]"
              style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                    TREASURER
                  </span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden mb-4 border border-emerald-500/40 bg-purple-950/60 shadow-lg">
                  <img
                    src="/leadership/treasurer.png"
                    alt="Paras Tiwari - Treasurer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-xl font-extrabold text-white drop-shadow-md" style={{ fontFamily: 'Space Grotesk' }}>
                    Paras Tiwari
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-3" style={{ fontFamily: 'Inter' }}>
                  Managing financial allocations, event budgets, and hackathon prize logistics.
                </p>
              </div>

              <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-emerald-300 font-bold flex justify-between">
                <span>TREASURY BOARD</span>
                <span>TIER 2</span>
              </div>
            </motion.div>
          </div>

          {/* Connector Line Down to Tier 3 */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-indigo-500 to-cyan-500 mx-auto my-2 shadow-[0_0_10px_#38BDF8]" />
          <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce mx-auto -mt-3" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 3A — DEPARTMENT HEADS & LEADS */}
        {/* ========================================================================= */}
        <div className="relative mb-16">
          <div className="font-mono text-xs text-cyan-400 font-bold mb-4 tracking-widest flex items-center justify-center gap-2 uppercase">
            <Cpu className="w-4 h-4 text-cyan-400" /> TIER 3A — DEPARTMENT HEADS &amp; LEADS
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {deptLeads.map((head, idx) => {
              const IconComp = head.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className={`rounded-2xl p-5 border-2 ${head.border} ${head.bg} flex flex-col justify-between text-left group hover:scale-[1.02] hover:border-purple-400 transition-all shadow-xl w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] xl:w-[calc(25%-18px)] max-w-[275px]`}
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full bg-purple-950/80 border ${head.border} ${head.color} font-mono text-[10px] font-bold`}>
                        {head.title}
                      </span>
                      <IconComp className={`w-4 h-4 ${head.color}`} />
                    </div>

                    {/* Large Portrait Image Frame */}
                    <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4 border border-purple-500/30 bg-purple-950/80 shadow-lg flex items-center justify-center">
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

                  <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-purple-300 font-bold flex justify-between">
                    <span>DEPARTMENT HEAD</span>
                    <span>TIER 3A</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Connector Line Down to Tier 4 */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-pink-500 mx-auto my-2 shadow-[0_0_10px_#EC4899]" />
        </div>

        {/* ========================================================================= */}
        {/* TIER 4 — SYN-CARD TEAM MEMBERS SHOWCASE GRID */}
        {/* ========================================================================= */}
        <div className="relative mb-16">
          <div className="font-mono text-xs text-purple-400 font-bold mb-4 tracking-widest flex items-center justify-center gap-2 uppercase">
            <Users className="w-4 h-4 text-purple-400" /> TIER 4 — SYN-CARD TEAM MEMBER CARDS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Ayush Pandey - Media Department SYN-CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-5 border-2 border-pink-500/50 bg-pink-950/20 shadow-xl flex flex-col justify-between text-left group hover:border-pink-400 transition-all"
              style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 font-mono text-[10px] font-bold">
                    MEDIA DEPARTMENT
                  </span>
                  <Video className="w-4 h-4 text-pink-400" />
                </div>

                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 border border-pink-500/40 bg-purple-950 shadow-lg">
                  <img
                    src="/leadership/ayush-pandey-media.png"
                    alt="Ayush Pandey - Media Department"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>Ayush Pandey</div>
                    <div className="font-mono text-xs text-pink-300 font-bold">UID: 25LBCS1314</div>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-pink-300 mb-1">
                  Content Strategist &amp; Media Creator
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-pink-300 font-bold flex justify-between">
                <span>SYN-CARD LVL 2 NOVICE</span>
                <span>TIER 4 MEMBER</span>
              </div>
            </motion.div>

            {/* Ankan Bhattacharjee - Tech Department SYN-CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl p-5 border-2 border-cyan-500/50 bg-cyan-950/20 shadow-xl flex flex-col justify-between text-left group hover:border-cyan-400 transition-all"
              style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
                    TECH DEPARTMENT
                  </span>
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>

                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 border border-cyan-500/40 bg-purple-950 shadow-lg">
                  <img
                    src="/leadership/ankan-bhattacharjee.jpg"
                    alt="Ankan Bhattacharjee - Tech Department"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>Ankan Bhattacharjee</div>
                    <div className="font-mono text-xs text-cyan-300 font-bold">UID: 25LBCS3067</div>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-cyan-300 mb-1">
                  Core Software Developer
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-cyan-300 font-bold flex justify-between">
                <span>SYN-CARD LVL 3 AWAKENED</span>
                <span>TIER 4 MEMBER</span>
              </div>
            </motion.div>

            {/* Ishaan Sharma - Media Department SYN-CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl p-5 border-2 border-purple-500/50 bg-purple-950/20 shadow-xl flex flex-col justify-between text-left group hover:border-purple-400 transition-all"
              style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(16px)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
                    MEDIA DEPARTMENT
                  </span>
                  <Video className="w-4 h-4 text-purple-400" />
                </div>

                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 border border-purple-500/40 bg-purple-950 shadow-lg">
                  <img
                    src="/leadership/ishaan-sharma-media.jpg"
                    alt="Ishaan Sharma - Media Department"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>Ishaan Sharma</div>
                    <div className="font-mono text-xs text-purple-300 font-bold">UID: 25LBCS3111</div>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-purple-300 mb-1">
                  Video Creator &amp; Editor
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/20 font-mono text-[10px] text-purple-300 font-bold flex justify-between">
                <span>SYN-CARD LVL 2 NOVICE</span>
                <span>TIER 4 MEMBER</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Faculty Leadership Footer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-4xl mx-auto p-4 rounded-2xl border border-purple-500/30 text-center flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-purple-200 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
          style={{ background: 'rgba(8, 8, 12, 0.85)', backdropFilter: 'blur(12px)' }}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 font-bold">Faculty Coordinator:</span>
          <span>Dr. Ajay Kumar Singh, Head, Dept. of Computer Science &amp; Engineering</span>
        </motion.div>
      </div>
    </section>
  );
}
