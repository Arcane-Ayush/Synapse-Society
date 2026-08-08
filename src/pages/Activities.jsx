import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Tag, ExternalLink, Zap, ChevronDown, Loader } from "lucide-react";

const STATUS_STYLES = {
    Upcoming: {
        badge: 'badge-upcoming',
        dotColor: 'var(--synapse-violet-light)',
        glow: 'rgba(var(--synapse-violet-rgb), 0.2)',
        borderHover: 'rgba(var(--synapse-violet-rgb), 0.35)',
    },
    Active: {
        badge: 'badge-active',
        dotColor: '#10B981',
        glow: 'rgba(16,185,129,0.15)',
        borderHover: 'rgba(16,185,129,0.35)',
    },
    Planned: {
        badge: 'badge-upcoming',
        dotColor: '#6366F1',
        glow: 'rgba(99,102,241,0.15)',
        borderHover: 'rgba(99,102,241,0.3)',
    },
    Completed: {
        badge: 'badge-completed',
        dotColor: '#475569',
        glow: 'rgba(71,85,105,0.08)',
        borderHover: 'rgba(71,85,105,0.25)',
    },
};

const TYPE_COLORS = {
    Workshop: '#6366F1',
    Hackathon: '#EF4444',
    'Study Jam': '#10B981',
    'Speaker Session': '#F59E0B',
    Contribution: '#3B82F6',
    Launch: 'var(--synapse-violet-light)',
};

function ActivityCard({ activity, index }) {
    const [expanded, setExpanded] = useState(false);
    const statusStyle = STATUS_STYLES[activity.status] || STATUS_STYLES.Upcoming;
    const typeColor = TYPE_COLORS[activity.type] || 'var(--synapse-violet-light)';
    const isCompleted = activity.status === 'Completed';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group"
            style={{
                background: isCompleted ? 'rgba(10,10,16,0.6)' : 'rgba(var(--bg-glass-rgb), 0.85)',
                border: `1px solid rgba(var(--synapse-violet-rgb), 0.1)`,
                opacity: isCompleted ? 0.7 : 1,
            }}
            onClick={() => setExpanded(!expanded)}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = statusStyle.borderHover;
                e.currentTarget.style.boxShadow = `0 8px 40px ${statusStyle.glow}`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(var(--synapse-violet-rgb), 0.1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Left accent bar */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: `linear-gradient(to bottom, ${typeColor}, ${typeColor}44)` }}
            />

            <div className="p-6 md:p-8 pl-8 md:pl-10">
                {/* Top row */}
                <div className="flex flex-wrap items-start gap-3 mb-4">
                    {/* Type badge */}
                    <span
                        className="text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-lg uppercase"
                        style={{
                            background: `${typeColor}15`,
                            color: typeColor,
                            border: `1px solid ${typeColor}25`,
                        }}
                    >
                        {activity.type}
                    </span>

                    {/* Status */}
                    <span className={`flex items-center gap-1.5 text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-lg uppercase ${statusStyle.badge}`}>
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                background: statusStyle.dotColor,
                                boxShadow: `0 0 4px ${statusStyle.dotColor}`,
                                animation: activity.status !== 'Completed' ? 'node-pulse 2s ease-in-out infinite' : 'none',
                            }}
                        />
                        {activity.status}
                    </span>

                    {/* XP reward */}
                    {activity.xpReward && (
                        <span
                            className="ml-auto flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg"
                            style={{
                                background: 'rgba(var(--synapse-violet-rgb), 0.1)',
                                color: 'var(--synapse-violet-light)',
                                border: '1px solid rgba(var(--synapse-violet-rgb), 0.2)',
                            }}
                        >
                            <Zap size={9} />
                            +{activity.xpReward} XP
                        </span>
                    )}
                </div>

                {/* Title + meta */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-grow">
                        <h3
                            className="text-lg font-bold mb-3"
                            style={{ fontFamily: 'Space Grotesk', color: isCompleted ? 'rgba(245,243,255,0.6)' : 'var(--text-primary)' }}
                        >
                            {activity.title}
                        </h3>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}>
                                <Calendar size={12} style={{ color: 'var(--synapse-violet-light)' }} />
                                {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            {activity.time && (
                                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}>
                                    <Clock size={12} style={{ color: 'var(--synapse-violet-light)' }} />
                                    {activity.time}
                                </span>
                            )}
                            {activity.location && (
                                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(var(--text-secondary-rgb), 0.5)', fontFamily: 'Inter' }}>
                                    <MapPin size={12} style={{ color: 'var(--synapse-violet-light)' }} />
                                    {activity.location}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                        {/* Active Register button */}
                        {activity.link && activity.status !== 'Completed' && (
                            <a
                                href={activity.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="btn-cyber btn-cyber-sm flex-shrink-0"
                            >
                                Register
                                <span className="arrow">↗</span>
                            </a>
                        )}

                        {/* Registration Opening Soon badge when registration link is disabled */}
                        {!activity.link && activity.status !== 'Completed' && (
                            <span
                                className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    color: 'rgba(var(--text-secondary-rgb), 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                <Clock size={10} style={{ color: 'var(--synapse-violet-light)' }} />
                                Opening Soon
                            </span>
                        )}

                        {/* Expand Hint */}
                        <div 
                            className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity duration-300 ml-auto md:ml-0" 
                            style={{ color: 'rgba(var(--text-secondary-rgb), 0.8)' }}
                        >
                            <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline-block">
                                {expanded ? 'Close' : 'Details'}
                            </span>
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown size={16} />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Expanded description */}
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4"
                        style={{ borderTop: '1px solid rgba(var(--synapse-violet-rgb), 0.1)' }}
                    >
                        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(var(--text-secondary-rgb), 0.6)', fontFamily: 'Inter' }}>
                            {activity.description}
                        </p>
                        {activity.tags && (
                            <div className="flex flex-wrap gap-2">
                                {activity.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md"
                                        style={{
                                            background: 'rgba(var(--synapse-violet-rgb), 0.08)',
                                            color: 'rgba(var(--text-secondary-rgb), 0.5)',
                                            border: '1px solid rgba(var(--synapse-violet-rgb), 0.15)',
                                        }}
                                    >
                                        <Tag size={9} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export function Activities() {
    const [dbActivities, setDbActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import("../lib/auth").then(({ getActivities }) => {
            getActivities().then(res => {
                const mapped = (res.data || []).map(a => ({
                    ...a,
                    date: a.event_date,
                    time: a.time_info || a.event_time,
                    xpReward: a.xp_reward ?? a.xpReward,
                    link: a.register_url || a.link,
                    participants: a.max_participants ? `0/${a.max_participants}` : undefined
                }));
                setDbActivities(mapped);
                setLoading(false);
            });
        });
    }, []);

    // Auto-update status by date
    const processedActivities = dbActivities.map(activity => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activityDate = new Date(activity.date);
        if (activityDate < today) {
            return { ...activity, status: "Completed" };
        }
        return activity;
    });

    const sorted = [...processedActivities].sort((a, b) => {
        const aComp = a.status === 'Completed';
        const bComp = b.status === 'Completed';
        if (aComp && !bComp) return 1;
        if (!aComp && bComp) return -1;
        const dA = new Date(a.date);
        const dB = new Date(b.date);
        return aComp ? dB - dA : dA - dB;
    });

    const upcoming = sorted.filter(a => a.status !== 'Completed');
    const completed = sorted.filter(a => a.status === 'Completed');

    return (
        <div className="min-h-screen px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-14"
                >
                    <div className="section-label mb-3">Events & Activities</div>
                    <div className="flex items-end gap-4">
                        <h1
                            className="text-5xl md:text-6xl font-black tracking-tight"
                            style={{ fontFamily: 'Space Grotesk' }}
                        >
                            Adventure{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, var(--synapse-violet-light), var(--synapse-pink-light))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Board
                            </span>
                        </h1>
                        <div className="hidden md:block flex-1 h-[1px] mb-2" style={{ background: 'linear-gradient(90deg, rgba(var(--synapse-violet-rgb), 0.3), transparent)' }} />
                    </div>
                    <p className="text-base mt-4 leading-relaxed" style={{ color: 'rgba(var(--text-secondary-rgb), 0.55)', fontFamily: 'Inter' }}>
                        Attend events to earn XP and unlock higher card tiers. Click any event to see details.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-purple-400">
                        <Loader className="animate-spin mb-4" size={32} />
                        <p className="font-mono text-sm tracking-widest uppercase">Fetching Events...</p>
                    </div>
                ) : (
                    <>
                        {/* Upcoming */}
                        {upcoming.length > 0 && (
                            <div className="mb-12">
                                <div
                                    className="flex items-center gap-3 mb-6"
                                    style={{ borderBottom: '1px solid rgba(var(--synapse-violet-rgb), 0.1)', paddingBottom: '12px' }}
                                >
                                    <span className="section-label">Upcoming</span>
                                    <span
                                        className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                                        style={{ background: 'rgba(var(--synapse-violet-rgb), 0.15)', color: 'var(--synapse-violet-light)', border: '1px solid rgba(var(--synapse-violet-rgb), 0.25)' }}
                                    >
                                        {upcoming.length}
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    {upcoming.map((activity, i) => (
                                        <ActivityCard key={activity.id} activity={activity} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completed */}
                        {completed.length > 0 && (
                            <div>
                                <div
                                    className="flex items-center gap-3 mb-6"
                                    style={{ borderBottom: '1px solid rgba(71,85,105,0.15)', paddingBottom: '12px' }}
                                >
                                    <span className="section-label" style={{ color: 'rgba(100,116,139,0.6)' }}>Completed</span>
                                    <span
                                        className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                                        style={{ background: 'rgba(71,85,105,0.1)', color: '#64748B', border: '1px solid rgba(71,85,105,0.2)' }}
                                    >
                                        {completed.length}
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    {completed.map((activity, i) => (
                                        <ActivityCard key={activity.id} activity={activity} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
