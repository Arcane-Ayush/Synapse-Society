import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BlackHole } from "../themes/basic/BlackHole";
import {
  ShieldCheck, Award, Sparkles, Zap, CheckCircle2, RefreshCw,
  Star, Users, Sliders, Radio, Flame, ChevronRight, Maximize, Minimize
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Role definitions (4 roles: HOD, Dean, President, Audience - 25% each)
const ROLE_DEFINITIONS = {
  hod: {
    id: 'hod',
    role: 'Head of Department',
    shortName: 'HOD',
    title: 'Head of Department (HOD)',
    department: 'Department of Computer Science & Engineering',
    color: '#06B6D4',
    rgbColor: '6, 182, 212',
    defaultWeight: 25,
    icon: Star,
    badgeText: 'HOD OFFICIAL KEY',
    headlineFirst: 'Where Ideas',
    headlineHighlight: 'SPARK',
    headlineLast: 'into Reality.',
  },
  dean: {
    id: 'dean',
    role: 'Dean of Academic Affairs',
    shortName: 'Dean',
    title: 'Dean of Academic Affairs',
    department: 'Chandigarh University',
    color: '#A855F7',
    rgbColor: '168, 85, 247',
    defaultWeight: 25,
    icon: Award,
    badgeText: 'DEAN OFFICIAL KEY',
    headlineFirst: 'Empowering',
    headlineHighlight: 'FUTURE',
    headlineLast: 'Tech Leaders.',
  },
  president: {
    id: 'president',
    role: 'Club President',
    shortName: 'President',
    title: 'Synapse Society President',
    department: 'Student Executive Body',
    color: '#EC4899',
    rgbColor: '236, 72, 153',
    defaultWeight: 25,
    icon: Zap,
    badgeText: 'PRESIDENT KEY',
    headlineFirst: 'Pioneering',
    headlineHighlight: 'STUDENT',
    headlineLast: 'Excellence.',
  },
  audience: {
    id: 'audience',
    role: 'Student Audience',
    shortName: 'Audience',
    title: 'Synapse Student Audience',
    department: 'Chandigarh University Community',
    color: '#00F0FF',
    rgbColor: '0, 240, 255',
    defaultWeight: 25,
    icon: Users,
    badgeText: '',
    headlineFirst: 'Uniting',
    headlineHighlight: 'COMMUNITY',
    headlineLast: 'Together.',
  },
};

const DEFAULT_STATE = {
  completed: {
    hod: false,
    dean: false,
    president: false,
    audience: false,
  },
  weights: {
    hod: 25,
    dean: 25,
    president: 25,
    audience: 25,
  },
  audienceHoldSeconds: 0,
};

const AUDIENCE_TARGET_HOLD_SECONDS = 8;
const BENCHMARK_CPS = 4;

// Web Audio API synthesizer
function playAudioSignal(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'activate') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.7);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500 + Math.random() * 250, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'grand_fanfare') {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.0);
      });
    }
  } catch (e) {
    // ignore
  }
}

// SLIDING ACTIVATION KEY COMPONENT FOR DIGNITARIES (GPU ACCELERATED & ULTRA SMOOTH)
function SlideToActivateButton({ role, isActivated, onActivate }) {
  const trackRef = useRef(null);
  const [maxDrag, setMaxDrag] = useState(240);
  const x = useMotionValue(0);

  // Smoothly transform filled progress bar width directly on GPU without React re-renders
  const fillWidth = useTransform(x, (currentX) => `${Math.max(48, currentX + 52)}px`);

  useEffect(() => {
    const updateMaxDrag = () => {
      if (trackRef.current) {
        setMaxDrag(Math.max(120, trackRef.current.clientWidth - 58));
      }
    };
    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, []);

  const handleDragEnd = () => {
    if (isActivated) return;
    const currentX = x.get();
    if (currentX >= maxDrag * 0.45) {
      onActivate();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 450, damping: 28 });
    }
  };

  if (isActivated) {
    return (
      <div
        className="w-full max-w-sm h-16 rounded-full border backdrop-blur-xl flex items-center justify-center gap-3 px-6 shadow-2xl transition-all duration-500 animate-pulse"
        style={{
          background: `rgba(${role?.rgbColor || '16, 185, 129'}, 0.15)`,
          borderColor: `rgba(${role?.rgbColor || '16, 185, 129'}, 0.5)`,
          boxShadow: `0 0 35px rgba(${role?.rgbColor || '16, 185, 129'}, 0.35)`,
        }}
      >
        <CheckCircle2 size={24} style={{ color: role?.color || '#10B981' }} className="animate-bounce" />
        <span
          className="text-xs sm:text-sm font-black font-mono tracking-wider uppercase"
          style={{ color: role?.color || '#10B981' }}
        >
          {role?.shortName} KEY ACTIVATED
        </span>
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className="w-full max-w-sm h-16 rounded-full bg-[#030308]/95 border p-1.5 relative overflow-hidden flex items-center justify-between shadow-2xl select-none touch-none"
      style={{
        borderColor: `rgba(${role?.rgbColor || '124, 58, 237'}, 0.4)`,
        boxShadow: `0 0 30px rgba(${role?.rgbColor || '124, 58, 237'}, 0.25)`,
      }}
    >
      {/* Filled progress bar driven directly by MotionValue (Zero React Re-renders) */}
      <motion.div
        className="absolute top-1.5 bottom-1.5 left-1.5 rounded-full pointer-events-none"
        style={{
          width: fillWidth,
          background: `linear-gradient(90deg, rgba(${role?.rgbColor || '124, 58, 237'}, 0.4) 0%, ${role?.color || '#A855F7'} 100%)`,
        }}
      />

      <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold tracking-widest text-purple-200/90 uppercase pointer-events-none pl-12 pr-4 text-center">
        SLIDE TO ACTIVATE {role?.shortName} KEY →
      </span>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.02}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="w-13 h-13 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 border border-white/40 shadow-xl touch-none"
        style={{
          x,
          background: `linear-gradient(135deg, ${role?.color || '#A855F7'} 0%, #7C3AED 100%)`,
          boxShadow: `0 0 25px ${role?.color || '#A855F7'}`,
        }}
      >
        <ChevronRight size={22} className="text-white animate-pulse" />
      </motion.div>
    </div>
  );
}

// Movie-Accurate Iron Man Arc Reactor Component
function ArcReactor({ cps, isActivated, isStageScreen }) {
  const spinDuration = isActivated
    ? 0.4
    : Math.max(0.2, 8 / Math.max(1, cps * 2.5));

  const sizeClasses = isStageScreen
    ? 'w-72 h-72 sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px]'
    : 'w-60 h-60 sm:w-72 sm:h-72';

  return (
    <div className={`relative ${sizeClasses} flex items-center justify-center my-4 select-none`}>
      <div
        className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
        style={{
          background: isActivated
            ? 'radial-gradient(circle, rgba(0, 240, 255, 0.85) 0%, rgba(168, 85, 247, 0.35) 55%, transparent 75%)'
            : `radial-gradient(circle, rgba(168, 85, 247, ${Math.min(0.4, 0.15 + cps * 0.04)}) 0%, rgba(0, 240, 255, ${Math.min(0.35, 0.1 + cps * 0.03)}) 50%, transparent 70%)`,
          boxShadow: isActivated
            ? '0 0 160px rgba(0, 240, 255, 1), 0 0 220px rgba(168, 85, 247, 0.95)'
            : `0 0 ${25 + cps * 7}px rgba(168, 85, 247, 0.6)`,
        }}
      />

      <div
        className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none"
        style={{
          animation: `arc-reactor-spin ${spinDuration}s linear infinite`,
        }}
      >
        <style>{`
          @keyframes arc-reactor-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <filter id="arc-glow-lg" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="copper-wire-lg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="cyan-light-lg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>

          <circle
            cx="150"
            cy="150"
            r="125"
            fill="none"
            stroke="url(#cyan-light-lg)"
            strokeWidth="32"
            opacity={isActivated ? "1" : "0.9"}
            filter="url(#arc-glow-lg)"
          />

          <circle cx="150" cy="150" r="142" fill="none" stroke="#0B0F19" strokeWidth="6" />
          <circle cx="150" cy="150" r="108" fill="none" stroke="#0B0F19" strokeWidth="6" />

          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i * 36 * Math.PI) / 180;
            const x = 150 + 125 * Math.sin(angle);
            const y = 150 - 125 * Math.cos(angle);
            const deg = i * 36;
            return (
              <g key={i} transform={`translate(${x}, ${y}) rotate(${deg})`}>
                <rect x="-14" y="-18" width="28" height="36" rx="3" fill="url(#copper-wire-lg)" stroke="#451A03" strokeWidth="1.5" />
                {[-12, -7, -2, 3, 8, 13].map((py, idx) => (
                  <line key={idx} x1="-13" y1={py} x2="13" y2={py} stroke="#FCD34D" strokeWidth="1" />
                ))}
                <circle cx="-11" cy="-15" r="2" fill="#F1F5F9" />
                <circle cx="11" cy="-15" r="2" fill="#F1F5F9" />
                <circle cx="-11" cy="15" r="2" fill="#F1F5F9" />
                <circle cx="11" cy="15" r="2" fill="#F1F5F9" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="absolute inset-10 rounded-full bg-[#030308]/95 border-4 border-[#080812] shadow-[inset_0_0_40px_#00F0FF] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <circle cx="100" cy="100" r="82" fill="none" stroke="#0f172a" strokeWidth="16" />
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i * 18 * Math.PI) / 180;
            const hx = 100 + 82 * Math.sin(angle);
            const hy = 100 - 82 * Math.cos(angle);
            return <circle key={i} cx={hx} cy={hy} r="3.8" fill="#00F0FF" opacity="0.9" filter="url(#arc-glow-lg)" />;
          })}

          <circle cx="100" cy="100" r="64" fill="none" stroke="#050811" strokeWidth="4" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="#00F0FF" strokeWidth="2" opacity="0.65" />
          <circle cx="100" cy="100" r="36" fill="none" stroke="#050811" strokeWidth="4" />

          {[0, 120, 240].map((deg, i) => (
            <g key={i} transform={`rotate(${deg} 100 100)`}>
              <rect x="96" y="24" width="8" height="52" fill="#050811" stroke="#1E293B" strokeWidth="1" />
              <line x1="98" y1="30" x2="98" y2="70" stroke="#00F0FF" strokeWidth="1.5" opacity="0.9" />
              <line x1="102" y1="30" x2="102" y2="70" stroke="#00F0FF" strokeWidth="1.5" opacity="0.9" />
            </g>
          ))}

          <circle cx="100" cy="100" r="28" fill="#00F0FF" opacity={isActivated ? "1" : "0.9"} filter="url(#arc-glow-lg)" />
          <circle cx="100" cy="100" r="18" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}

export function Inauguration() {
  const { dignitary: urlParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const channelRef = useRef(null);

  const getRoleFromPath = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('dean')) return 'dean';
    if (path.includes('hod')) return 'hod';
    if (path.includes('president')) return 'president';
    if (path.includes('audience')) return 'audience';
    if (urlParam && ROLE_DEFINITIONS[urlParam.toLowerCase()]) return urlParam.toLowerCase();
    return null;
  };

  const currentRoleKey = getRoleFromPath();
  const currentRole = currentRoleKey ? ROLE_DEFINITIONS[currentRoleKey] : null;
  const isMainStageScreen = !currentRoleKey;

  const STORAGE_KEY = 'synapse_inauguration_v13_void3d';
  const CHANNEL_NAME = 'synapse_inauguration_ceremony_v13_void3d';
  const LOCAL_BC_NAME = 'synapse_inauguration_v13_void3d_local';

  const [ceremonyState, setCeremonyState] = useState(() => {
    try {
      ['synapse_inauguration_v6', 'synapse_inauguration_v7', 'synapse_inauguration_v8', 'synapse_inauguration_v9_reset', 'synapse_inauguration_v10_4roles', 'synapse_inauguration_v11_slider', 'synapse_inauguration_v12_synapsetheme'].forEach((k) => {
        try { localStorage.removeItem(k); } catch (err) { }
      });
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const [showConfig, setShowConfig] = useState(false);
  const [clickTimestamps, setClickTimestamps] = useState([]);
  const [cps, setCps] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Dignitary baseline safe floor (HOD, Dean, President = 25% each)
  const calculateDignitaryBaseline = (state) => {
    let baseline = 0;
    ['hod', 'dean', 'president'].forEach((key) => {
      if (state.completed[key]) {
        baseline += Number(state.weights[key] ?? ROLE_DEFINITIONS[key].defaultWeight);
      }
    });
    return baseline;
  };

  const dignitaryBaseline = calculateDignitaryBaseline(ceremonyState);
  const audienceWeight = Number(ceremonyState.weights.audience ?? 25);

  // Total progress calculation
  const calculateTotalProgress = (state) => {
    const base = calculateDignitaryBaseline(state);
    if (state.completed.audience) {
      return Math.min(100, base + audienceWeight);
    }
    const holdSecs = state.audienceHoldSeconds ?? 0;
    const audProg = (holdSecs / AUDIENCE_TARGET_HOLD_SECONDS) * audienceWeight;
    return Math.min(100, Math.max(base, base + audProg));
  };

  const totalProgress = calculateTotalProgress(ceremonyState);
  const isFullyInaugurated = totalProgress >= 100 || (ceremonyState.completed.hod && ceremonyState.completed.dean && ceremonyState.completed.president && ceremonyState.completed.audience);

  // Broadcast state helper
  const broadcastState = (newState) => {
    setCeremonyState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) { }

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'state_changed',
        payload: newState,
      });
    }

    try {
      const localBc = new BroadcastChannel(LOCAL_BC_NAME);
      localBc.postMessage({ type: 'state', payload: newState });
      localBc.close();
    } catch (e) { }
  };

  // Synchronized Realtime Setup
  useEffect(() => {
    const channel = supabase.channel(CHANNEL_NAME, {
      config: { broadcast: { self: true } },
    });

    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'state_changed' }, ({ payload }) => {
        if (payload) {
          setCeremonyState(payload);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
          } catch (e) { }
        }
      })
      .on('broadcast', { event: 'audience_click' }, () => {
        setClickTimestamps((prev) => {
          const updated = [...prev, Date.now()];
          const now = Date.now();
          const recent = updated.filter((ts) => now - ts <= 1000);
          setCps(recent.length);
          return updated;
        });
      })
      .subscribe();

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCeremonyState(JSON.parse(e.newValue));
        } catch (err) { }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    let localBc;
    try {
      localBc = new BroadcastChannel(LOCAL_BC_NAME);
      localBc.onmessage = (event) => {
        if (event.data?.type === 'state') {
          setCeremonyState(event.data.payload);
        } else if (event.data?.type === 'click') {
          setClickTimestamps((prev) => {
            const updated = [...prev, Date.now()];
            const now = Date.now();
            const recent = updated.filter((ts) => now - ts <= 1000);
            setCps(recent.length);
            return updated;
          });
        }
      };
    } catch (e) { }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
      if (localBc) localBc.close();
    };
  }, []);

  // CPS recalculation & hold timer loop (every 200ms)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const recent = clickTimestamps.filter((ts) => now - ts <= 1000);
      setClickTimestamps(recent);
      const currentCps = recent.length;
      setCps(currentCps);

      setCeremonyState((prev) => {
        if (prev.completed.audience) return prev;

        let holdSecs = prev.audienceHoldSeconds ?? 0;
        let stateHasChanged = false;

        if (currentCps >= BENCHMARK_CPS) {
          holdSecs = Math.min(AUDIENCE_TARGET_HOLD_SECONDS, holdSecs + 0.2);
          stateHasChanged = true;
        } else if (currentCps < BENCHMARK_CPS && holdSecs > 0) {
          holdSecs = Math.max(0, holdSecs - 0.25);
          stateHasChanged = true;
        }

        const isAudienceDone = holdSecs >= AUDIENCE_TARGET_HOLD_SECONDS;
        const updatedCompleted = {
          ...prev.completed,
          audience: isAudienceDone ? true : prev.completed.audience,
        };

        const updatedState = {
          ...prev,
          completed: updatedCompleted,
          audienceHoldSeconds: holdSecs,
        };

        if (isAudienceDone && !prev.completed.audience) {
          playAudioSignal('grand_fanfare');
        }

        if (stateHasChanged) {
          broadcastState(updatedState);
        }

        return updatedState;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [clickTimestamps]);

  // Dignitary Key Activation Trigger
  const handleActivateRoleKey = () => {
    if (!currentRoleKey || currentRoleKey === 'audience' || ceremonyState.completed[currentRoleKey]) return;

    playAudioSignal('activate');
    if (navigator.vibrate) {
      try { navigator.vibrate([100, 50, 200]); } catch (e) { }
    }

    const newState = {
      ...ceremonyState,
      completed: {
        ...ceremonyState.completed,
        [currentRoleKey]: true,
      },
    };
    broadcastState(newState);

    if (calculateTotalProgress(newState) >= 100) {
      playAudioSignal('grand_fanfare');
    }
  };

  // Audience Spam Click Handler
  const handleAudienceClick = () => {
    if (ceremonyState.completed.audience) return;

    playAudioSignal('click');
    if (navigator.vibrate) {
      try { navigator.vibrate(30); } catch (e) { }
    }

    setClickTimestamps((prev) => {
      const updated = [...prev, Date.now()];
      const now = Date.now();
      const recent = updated.filter((ts) => now - ts <= 1000);
      setCps(recent.length);
      return updated;
    });

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'audience_click',
      });
    }

    try {
      const localBc = new BroadcastChannel(LOCAL_BC_NAME);
      localBc.postMessage({ type: 'click' });
      localBc.close();
    } catch (err) { }
  };

  const handleWeightChange = (roleId, value) => {
    const numVal = Math.max(0, Math.min(100, Number(value) || 0));
    const newState = {
      ...ceremonyState,
      weights: {
        ...ceremonyState.weights,
        [roleId]: numVal,
      },
    };
    broadcastState(newState);
  };

  const handleResetCeremony = () => {
    const resetState = {
      completed: {
        hod: false,
        dean: false,
        president: false,
        audience: false,
      },
      weights: ceremonyState.weights,
      audienceHoldSeconds: 0,
    };
    broadcastState(resetState);
  };

  // MAIN STAGE WIDESCREEN DISPLAY WITH 3D BLACK HOLE VOID THEME
  if (isMainStageScreen) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden flex flex-col justify-between items-center px-6 py-5 bg-[#020205] text-white select-none">
        {/* Laser Grid Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-600 to-transparent shadow-[0_0_15px_#7C3AED] z-10" />

        {/* Stage Header */}
        <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10 pt-1 border-b border-purple-900/20 pb-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black/60 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.2)]">
              <Sparkles size={24} className="text-purple-400 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white" style={{ fontFamily: 'Space Grotesk' }}>
                SYNAPSE SOCIETY
              </h1>
              <p className="text-xs font-mono text-purple-400/80 tracking-wider">
                STUDENT-RUN TECH COLLECTIVE • CHANDIGARH UNIVERSITY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-purple-500/30 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-purple-200 font-bold uppercase tracking-wider">• STAGE SYSTEM • REALTIME SYNC</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-purple-500/20 text-purple-300 hover:text-purple-200 text-xs font-mono font-bold transition-colors cursor-pointer hover:border-purple-500/40"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
              <span>{isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}</span>
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-purple-500/20 text-purple-300 hover:text-purple-200 text-xs font-mono font-bold transition-colors cursor-pointer hover:border-purple-500/40"
            >
              <Sliders size={13} />
              <span>{showConfig ? 'HIDE CONFIG' : 'EDIT %'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Editable Weight Configuration Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full max-w-4xl bg-[#040409]/95 border border-purple-500/30 rounded-2xl p-5 my-4 backdrop-blur-2xl space-y-4 text-left z-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center border-b border-purple-900/30 pb-2">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                  ⚙️ STAGE CONTROL: EDITABLE ROLE WEIGHTS (%)
                </span>
                <button
                  onClick={handleResetCeremony}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono font-bold hover:bg-red-900/50 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={12} /> RESET CEREMONY
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                {Object.values(ROLE_DEFINITIONS).map((role) => (
                  <div
                    key={role.id}
                    className="flex flex-col p-2.5 rounded-xl bg-black/50 border border-purple-900/30 space-y-1"
                  >
                    <span className="text-gray-300 font-bold">{role.shortName}:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ceremonyState.weights[role.id] ?? role.defaultWeight}
                        onChange={(e) => handleWeightChange(role.id, e.target.value)}
                        className="w-16 bg-black border border-purple-500/40 rounded px-2 py-1 text-white font-bold text-center focus:outline-none focus:border-purple-400"
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Stage Headline & Arc Reactor Display with Cyberpunk Percentage Readout */}
        <div className="my-auto flex flex-col items-center justify-center z-10 text-center w-full max-w-6xl space-y-4 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-purple-500/30 text-xs font-mono tracking-wider text-purple-300 uppercase mb-2 shadow-[0_0_15px_rgba(124,58,237,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>STUDENT-RUN TECH COLLECTIVE • CHANDIGARH UNIVERSITY</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 sm:gap-20 md:gap-24 lg:gap-36 my-2 w-full">
            {/* Shifted Arc Reactor with 3D Black Hole centered directly behind it */}
            <div className="flex-shrink-0 relative md:-ml-12 lg:-ml-20 transition-all duration-300 flex items-center justify-center">
              {/* 3D BlackHole Canvas centered exactly behind Arc Reactor */}
              <div className="absolute -inset-20 sm:-inset-28 lg:-inset-36 pointer-events-none z-0 opacity-80 flex items-center justify-center">
                <Canvas camera={{ position: [0, 2.5, 6], fov: 60 }}>
                  <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                  <BlackHole scale={1.15} position={[0, 0, 0]} />
                </Canvas>
              </div>

              <div className="relative z-10">
                <ArcReactor
                  cps={cps}
                  isActivated={ceremonyState.completed.audience || isFullyInaugurated}
                  isStageScreen={true}
                />
              </div>
            </div>

            {/* Cyberpunk Percentage Readout Panel on the Right */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/50 border border-cyan-500/40 text-[11px] font-mono tracking-widest text-cyan-300 uppercase shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>[ ARC_CORE // POWER_OUTPUT ]</span>
              </div>

              {/* Giant Cyberpunk Percentage Display */}
              <div className="relative flex items-baseline justify-center md:justify-start gap-2 my-1 select-none">
                <span
                  className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400 drop-shadow-[0_0_35px_rgba(0,240,255,0.85)]"
                  style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '-0.02em' }}
                >
                  {Math.round(totalProgress)}
                </span>
                <span
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  %
                </span>
              </div>

              {/* Cyber Telemetry Metrics */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <div className="px-3 py-1 rounded-lg bg-black/70 border border-purple-500/30 text-xs font-mono text-purple-200 flex items-center gap-2 shadow-[0_0_10px_rgba(124,58,237,0.15)]">
                  <span className="text-gray-400 font-medium">STATUS:</span>
                  <span className={isFullyInaugurated ? "text-emerald-400 font-extrabold tracking-wider" : "text-cyan-300 font-extrabold tracking-wider animate-pulse"}>
                    {isFullyInaugurated ? "100% ONLINE" : "CHARGING ARCHITECTURE"}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-black/70 border border-purple-500/30 text-xs font-mono text-purple-200 flex items-center gap-2 shadow-[0_0_10px_rgba(124,58,237,0.15)]">
                  <span className="text-gray-400 font-medium">SPEED:</span>
                  <span className="text-cyan-400 font-extrabold">{cps.toFixed(1)} CPS</span>
                </div>
              </div>
            </div>
          </div>

          {isFullyInaugurated && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-2 px-8 py-4 rounded-3xl bg-[#090514]/90 border border-purple-500/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(124,58,237,0.3)] text-center space-y-1"
            >
              <h2 className="text-2xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-300 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                SYNAPSE SOCIETY IS OFFICIALLY LIVE! 🎉
              </h2>
              <p className="text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-widest uppercase">
                ALL CEREMONIAL KEYS ACTIVATED • SYSTEM OPERATIONAL
              </p>
            </motion.div>
          )}
        </div>

        {/* Widescreen Bottom Panel */}
        <div className="w-full max-w-7xl z-10 space-y-6 pt-4 border-t border-purple-900/20">
          {/* Main Stage Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1.5 text-purple-300">
                <ShieldCheck size={14} className="text-purple-400" /> SAFE FLOOR: {dignitaryBaseline}%
              </span>
              <span className="text-purple-300 font-bold flex items-center gap-2">
                {ceremonyState.completed.audience || isFullyInaugurated ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-extrabold">✓ ARC REACTOR FULLY ACTIVATED</span>
                ) : (
                  <span className="text-purple-300 flex items-center gap-1.5 font-extrabold">
                    <Flame size={14} className="animate-pulse text-purple-400" /> CROWD REALTIME SPEED REACTION
                  </span>
                )}
              </span>
            </div>

            <div className="w-full h-6 bg-black/80 rounded-full overflow-hidden border border-purple-500/30 p-0.5 relative shadow-[0_0_25px_rgba(124,58,237,0.15)]">
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-purple-400 z-30 shadow-[0_0_15px_#A855F7]"
                style={{ left: `${dignitaryBaseline}%` }}
                title={`Dignitary Baseline Safe Floor: ${dignitaryBaseline}%`}
              />

              <motion.div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${totalProgress}%`,
                  background: 'linear-gradient(90deg, #6D28D9 0%, #00F0FF 50%, #10B981 100%)',
                  boxShadow: '0 0 25px rgba(109, 40, 217, 0.8)',
                }}
              />
            </div>
          </div>

          {/* Widescreen 4-Column Role Node Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
            {Object.values(ROLE_DEFINITIONS).map((role) => {
              const isDone = ceremonyState.completed[role.id];
              const weightVal = ceremonyState.weights[role.id] ?? role.defaultWeight;
              const IconComp = role.icon;
              return (
                <div
                  key={role.id}
                  className={`flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${isDone
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                      : 'bg-black/60 border-purple-900/30 text-gray-400 hover:border-purple-500/40 hover:bg-black/80'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComp size={16} style={{ color: role.color }} />
                    <span className="text-xs font-black font-mono text-white">{role.shortName}</span>
                  </div>
                  <div className="text-[10px] font-mono text-purple-300/60 mb-2">
                    Weight: +{weightVal}%
                  </div>
                  <div>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-extrabold text-emerald-400">
                        <CheckCircle2 size={14} className="animate-pulse" /> ACTIVATED
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-purple-400/40 font-bold">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer tagline */}
          <div className="text-center text-[10px] font-mono tracking-widest text-purple-400/40 uppercase">
            • BUILD • LEARN • ELEVATE •
          </div>
        </div>
      </div>
    );
  }

  // MOBILE-FOCUSED PORTALS FOR DIGNITARIES (HOD, DEAN, PRESIDENT) & AUDIENCE
  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between items-center px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden bg-[#020205] text-white select-none">
      {/* 3D BlackHole Void Canvas Background for Dignitaries */}
      {currentRoleKey !== 'audience' && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-65">
          <Canvas camera={{ position: [0, 2.5, 6], fov: 60 }}>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            <BlackHole scale={1.0} position={[0, 0.2, 0]} />
          </Canvas>
        </div>
      )}

      {/* Ambient background glow orbs */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: `radial-gradient(circle, rgba(${currentRole?.rgbColor || '124, 58, 237'}, ${
            ceremonyState.completed[currentRoleKey] ? 0.22 : 0.12
          }) 0%, transparent 70%)`,
        }}
      />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10 flex flex-col items-center flex-grow justify-between text-center my-auto px-1 space-y-6">
        {/* Top Monospace Tag Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-purple-500/30 text-[10px] font-mono tracking-wider text-purple-300 uppercase shadow-[0_0_15px_rgba(124,58,237,0.15)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYNAPSE • CHANDIGARH UNIV</span>
          <span className="text-purple-400/40">|</span>
          <span className="text-emerald-400 font-bold">• ACTIVE</span>
        </div>

        {/* Role Badge (renders only if badgeText exists) */}
        {currentRole?.badgeText && (
          <div className="px-4 py-1.5 rounded-xl bg-black/70 border border-purple-500/30 text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
            {currentRole.badgeText}
          </div>
        )}

        {/* Hero Headline */}
        <h1
          className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          {currentRole?.headlineFirst || 'Where Ideas'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-black">
            {currentRole?.headlineHighlight || 'SPARK'}
          </span>{' '}
          {currentRole?.headlineLast || 'into Reality.'}
        </h1>

        <p className="text-xs text-purple-200/70 font-medium max-w-xs leading-relaxed" style={{ fontFamily: 'Inter' }}>
          {currentRoleKey === 'audience' ? (
            <>
              Synapse Society{' '}
              <span
                className="text-sm font-black text-cyan-300 drop-shadow-[0_0_12px_#00F0FF] uppercase tracking-wider inline-block mx-0.5"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                AGENT
              </span>
            </>
          ) : (
            currentRole?.title
          )}{' '}
          — Official launch authorization.
        </p>

        {/* DIGNITARIES GET SLIDING ACTIVATION KEY; AUDIENCE GETS SPAM TAP BUTTON */}
        {currentRoleKey === 'audience' ? (
          /* AUDIENCE ONLY: ROUND SPAM TAP BUTTON WITH BLACK HOLE CENTERED DIRECTLY BEHIND IT */
          <div className="w-full flex flex-col items-center justify-center my-4 relative">
            <div className="absolute -inset-24 sm:-inset-32 pointer-events-none z-0 opacity-80 flex items-center justify-center">
              <Canvas camera={{ position: [0, 2.5, 6], fov: 60 }}>
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                <BlackHole scale={1.15} position={[0, 0, 0]} />
              </Canvas>
            </div>

            <button
              onClick={handleAudienceClick}
              disabled={ceremonyState.completed.audience}
              className="relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center text-white font-black cursor-pointer transition-all duration-150 active:scale-95 shadow-2xl overflow-hidden border-2 border-purple-300/70 group"
              style={{
                fontFamily: 'Space Grotesk',
                background: ceremonyState.completed.audience
                  ? 'linear-gradient(135deg, #059669 0%, #10B981 50%, #064E3B 100%)'
                  : 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #D946EF 100%)',
                boxShadow: ceremonyState.completed.audience
                  ? '0 0 60px rgba(16, 185, 129, 0.8), inset 0 0 25px rgba(16, 185, 129, 0.4)'
                  : '0 0 60px rgba(168, 85, 247, 0.85), inset 0 0 25px rgba(217, 70, 239, 0.4)',
              }}
            >
              <Flame size={38} className="mb-1.5 text-purple-100 animate-bounce" />
              <span className="text-xs tracking-wider uppercase font-black text-center px-3 leading-tight">
                {ceremonyState.completed.audience ? 'CORE ACTIVATED! ⚡' : 'TAP TO CHARGE ARC REACTOR'}
              </span>
            </button>
          </div>
        ) : (
          /* DIGNITARIES ONLY: MOBILE SLIDE-TO-ACTIVATE KEY */
          <div className="w-full flex flex-col items-center my-2">
            <SlideToActivateButton
              role={currentRole}
              weight={ceremonyState.weights[currentRoleKey] ?? currentRole.defaultWeight}
              isActivated={ceremonyState.completed[currentRoleKey]}
              onActivate={handleActivateRoleKey}
            />
          </div>
        )}

        {/* Footer Tagline */}
        <div className="text-[9px] font-mono tracking-widest text-purple-400/40 uppercase pb-2">
          • BUILD • LEARN • ELEVATE •
        </div>
      </div>
    </div>
  );
}

export default Inauguration;
