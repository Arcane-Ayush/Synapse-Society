import { motion } from "framer-motion";
import { Github, Linkedin, Brain } from "lucide-react";

const teamMembers = {
    faculty: [
        {
            id: "hod",
            name: "Dr. [Name]",
            role: "Head of Department",
            department: "Computer Science & Engineering",
            image: null,
            quote: "Innovation begins where curiosity meets discipline.",
            type: "hod",
        }
    ],
    leadership: [
        {
            id: "president",
            name: "[President Name]",
            role: "Club President",
            image: null,
            quote: "Building the future, one synapse at a time.",
            social: { linkedin: "#", github: "#" },
        },
        {
            id: "vc",
            name: "[Vice President Name]",
            role: "Vice President",
            image: null,
            quote: "Leadership is about lifting others as you rise.",
            social: { linkedin: "#", github: "#" },
        },
        {
            id: "gensec",
            name: "[General Secretary]",
            role: "General Secretary",
            image: null,
            quote: "Execution is the bridge between vision and reality.",
            social: { linkedin: "#", github: "#" },
        },
        {
            id: "treasurer",
            name: "[Treasurer Name]",
            role: "Treasurer",
            image: null,
            quote: "Every rupee invested in learning compounds infinitely.",
            social: { linkedin: "#", github: "#" },
        },
    ],
    coreMembers: [
        { id: "media", name: "[Media Head]", role: "Media Head", dept: "Media & Communications", icon: "⚲", color: "var(--synapse-violet-light)" },
        { id: "tech", name: "[Tech Head]", role: "Tech Head", dept: "Technology & Development", icon: "⌘", color: "#6366F1" },
        { id: "content", name: "[Content Head]", role: "Content Head", dept: "Content & Copywriting", icon: "▤", color: "#8B5CF6" },
        { id: "design", name: "[Design Head]", role: "Design Head", dept: "Design & Creative", icon: "◧", color: "var(--synapse-pink)" },
        { id: "pr", name: "[PR Head]", role: "PR Head", dept: "Public Relations", icon: "⋈", color: "var(--synapse-violet)" },
        { id: "events", name: "[Events Head]", role: "Event Management Head", dept: "Events & Logistics", icon: "⍋", color: "#9333EA" },
        { id: "anchoring", name: "[Anchoring Head]", role: "Anchoring Head", dept: "Anchoring & Hosting", icon: "⍾", color: "#C026D3" },
        { id: "learning", name: "[Learning Head]", role: "Learning Head", dept: "Learning & Development", icon: "⎈", color: "#7E22CE" },
    ]
};

function HodCard({ member }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative max-w-2xl mx-auto mb-24"
        >
            {/* Glow bg */}
            <div
                className="absolute -inset-8 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(var(--synapse-violet-rgb), 0.12) 0%, transparent 70%)' }}
            />

            <div
                className="relative rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center"
                style={{
                    background: 'rgba(var(--bg-glass-rgb), 0.9)',
                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.25)',
                    boxShadow: '0 0 40px rgba(var(--synapse-violet-rgb), 0.1)',
                }}
            >
                {/* Avatar */}
                <div
                    className="w-28 h-28 rounded-2xl flex-shrink-0 flex items-center justify-center text-5xl relative"
                    style={{
                        background: 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.3), rgba(var(--synapse-violet-light-rgb), 0.15))',
                        border: '2px solid rgba(var(--synapse-violet-light-rgb), 0.3)',
                        boxShadow: '0 0 24px rgba(var(--synapse-violet-rgb), 0.3)',
                    }}
                >
                    {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--synapse-violet-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                            <path d="M6.002 6.5a3 3 0 0 1-.399-1.375"></path>
                            <path d="M11.83 12.08a1.8 1.8 0 1 1-1.66 0"></path>
                        </svg>
                    )}

                    {/* Faculty badge */}
                    <div
                        className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest"
                        style={{
                            background: 'linear-gradient(135deg, var(--synapse-violet), var(--synapse-violet-light))',
                            color: 'white',
                        }}
                    >
                        FACULTY
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <div className="section-label mb-2">Supported By</div>
                    <h3 className="text-2xl md:text-3xl font-black mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                        {member.name}
                    </h3>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--synapse-violet-light)' }}>{member.role}</p>
                    <p className="text-xs mb-4" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Space Mono' }}>
                        {member.department}
                    </p>
                    {member.quote && (
                        <blockquote
                            className="text-sm italic leading-relaxed border-l-2 pl-4"
                            style={{
                                color: 'rgba(var(--text-secondary-rgb), 0.6)',
                                borderColor: 'rgba(var(--synapse-violet-rgb), 0.4)',
                                fontFamily: 'Inter',
                            }}
                        >
                            "{member.quote}"
                        </blockquote>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function LeaderCard({ member, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl p-6 group transition-all duration-300"
            style={{
                background: 'rgba(var(--bg-glass-rgb), 0.8)',
                border: '1px solid rgba(var(--synapse-violet-rgb), 0.12)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(var(--synapse-violet-light-rgb), 0.3)';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(var(--synapse-violet-rgb), 0.15)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(var(--synapse-violet-rgb), 0.12)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Avatar */}
            <div
                className="w-20 h-20 rounded-xl mb-4 flex items-center justify-center mx-auto text-3xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(var(--synapse-violet-rgb), 0.2), rgba(var(--synapse-violet-light-rgb), 0.1))',
                    border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)',
                }}
            >
                {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                    <span style={{ fontSize: '2rem' }}>👤</span>
                )}
            </div>

            <div className="text-center">
                <h4 className="font-bold text-base mb-1" style={{ fontFamily: 'Space Grotesk' }}>{member.name}</h4>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--synapse-violet-light)', fontFamily: 'Space Mono' }}>
                    {member.role}
                </p>
                {member.quote && (
                    <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter', fontStyle: 'italic' }}>
                        "{member.quote}"
                    </p>
                )}

                {member.social && (
                    <div className="flex items-center justify-center gap-3">
                        {member.social.linkedin && (
                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                               className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                               style={{ background: 'rgba(var(--synapse-violet-rgb), 0.1)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--synapse-violet-light)' }}
                               onMouseEnter={e => e.currentTarget.style.background = 'rgba(var(--synapse-violet-rgb), 0.25)'}
                               onMouseLeave={e => e.currentTarget.style.background = 'rgba(var(--synapse-violet-rgb), 0.1)'}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                        )}
                        {member.social.github && (
                            <a href={member.social.github} target="_blank" rel="noopener noreferrer"
                               className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                               style={{ background: 'rgba(var(--synapse-violet-rgb), 0.1)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)', color: 'var(--synapse-violet-light)' }}
                               onMouseEnter={e => e.currentTarget.style.background = 'rgba(var(--synapse-violet-rgb), 0.25)'}
                               onMouseLeave={e => e.currentTarget.style.background = 'rgba(var(--synapse-violet-rgb), 0.1)'}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                </svg>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function CoreMemberCard({ member, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 text-center group transition-all duration-200"
            style={{
                background: 'rgba(var(--bg-glass-rgb), 0.7)',
                border: '1px solid rgba(var(--synapse-violet-rgb), 0.1)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${member.color}40`;
                e.currentTarget.style.boxShadow = `0 8px 30px ${member.color}15`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(var(--synapse-violet-rgb), 0.1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                style={{ background: `${member.color}15`, border: `1px solid ${member.color}25` }}
            >
                {member.icon}
            </div>
            <h5 className="font-bold text-sm mb-0.5" style={{ fontFamily: 'Space Grotesk' }}>{member.name}</h5>
            <p className="text-xs font-semibold mb-1" style={{ color: member.color, fontFamily: 'Space Mono' }}>
                {member.role}
            </p>
            <p className="text-[10px]" style={{ color: 'rgba(var(--text-secondary-rgb), 0.35)' }}>{member.dept}</p>
        </motion.div>
    );
}

export function About() {
    return (
        <div className="min-h-screen px-4 py-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-20"
                >
                    <div className="section-label mb-3">The Team</div>
                    <div className="flex items-end gap-4">
                        <h1
                            className="text-5xl md:text-7xl font-black tracking-tight"
                            style={{ fontFamily: 'Space Grotesk' }}
                        >
                            The{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Minds
                            </span>{' '}
                            Behind Synapse
                        </h1>
                        <div className="hidden md:block flex-1 h-[1px] mb-4" style={{ background: 'linear-gradient(90deg, rgba(var(--synapse-violet-rgb), 0.3), transparent)' }} />
                    </div>
                    <p className="text-base mt-4 max-w-2xl leading-relaxed" style={{ color: 'rgba(var(--text-secondary-rgb), 0.55)', fontFamily: 'Inter' }}>
                        A collective of passionate students and supportive faculty, building the future of tech education — one idea at a time.
                    </p>
                </motion.div>

                {/* Faculty / HOD */}
                <div>
                    {teamMembers.faculty.map(member => (
                        <HodCard key={member.id} member={member} />
                    ))}
                </div>

                {/* Leadership */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                >
                    <div className="section-label mb-2 text-center">Society Leadership</div>
                    <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: 'Space Grotesk' }}>
                        Executive Board
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-24">
                    {teamMembers.leadership.map((member, i) => (
                        <LeaderCard key={member.id} member={member} index={i} />
                    ))}
                </div>

                {/* Core Members */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                >
                    <div className="section-label mb-2 text-center">Department Heads</div>
                    <h2 className="text-3xl font-black text-center mb-10" style={{ fontFamily: 'Space Grotesk' }}>
                        Core Members
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {teamMembers.coreMembers.map((member, i) => (
                        <CoreMemberCard key={member.id} member={member} index={i} />
                    ))}
                </div>

                {/* Vision statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden"
                    style={{
                        background: 'rgba(var(--bg-glass-rgb), 0.8)',
                        border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)',
                    }}
                >
                    {/* Glow */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                            width: 500,
                            height: 300,
                            background: 'radial-gradient(ellipse, rgba(var(--synapse-violet-rgb), 0.12) 0%, transparent 70%)',
                        }}
                    />

                    <div className="relative z-10">
                        <div className="section-label mb-6">Our Vision</div>
                        <blockquote
                            className="text-2xl md:text-3xl font-bold leading-relaxed mb-6"
                            style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}
                        >
                            "To build a community where every student can{" "}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                connect their potential
                            </span>{" "}
                            to meaningful impact."
                        </blockquote>
                        <p className="text-sm" style={{ color: 'rgba(var(--text-secondary-rgb), 0.4)', fontFamily: 'Space Mono' }}>
                            — Synapse Society, Season 1
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
