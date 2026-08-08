import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Award, Sparkles, Zap, CheckCircle2, RefreshCw,
  Crown, Star, Users, Sliders, Radio, Flame
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Role definitions
const ROLE_DEFINITIONS = {
  hod: {
    id: 'hod',
    role: 'Head of Department',
    shortName: 'HOD',
    title: 'Head of Department (HOD)',
    department: 'Department of Computer Science & Engineering',
    color: '#06B6D4',
    rgbColor: '6, 182, 212',
    defaultWeight: 20,
    icon: Star,
    badgeText: 'HOD OFFICIAL KEY',
  },
  dean: {
    id: 'dean',
    role: 'Dean of Academic Affairs',
    shortName: 'Dean',
    title: 'Dean of Academic Affairs',
    department: 'Chandigarh University',
    color: '#A855F7',
    rgbColor: '168, 85, 247',
    defaultWeight: 20,
    icon: Award,
    badgeText: 'DEAN OFFICIAL KEY',
  },
  provc: {
    id: 'provc',
    role: 'Pro Vice Chancellor',
    shortName: 'Pro VC',
    title: 'Pro Vice Chancellor (Pro VC)',
    department: 'Chandigarh University',
    color: '#F59E0B',
    rgbColor: '245, 158, 11',
    defaultWeight: 20,
    icon: Crown,
    badgeText: 'PRO VC OFFICIAL KEY',
  },
  president: {
    id: 'president',
    role: 'Club President',
    shortName: 'President',
    title: 'Synapse Society President',
    department: 'Student Executive Body',
    color: '#EC4899',
    rgbColor: '236, 72, 153',
    defaultWeight: 20,
    icon: Zap,
    badgeText: 'PRESIDENT KEY',
  },
  audience: {
    id: 'audience',
    role: 'Student Audience',
    shortName: 'Audience',
    title: 'Synapse Student Audience',
    department: 'Chandigarh University Community',
    color: '#00F0FF',
    rgbColor: '0, 240, 255',
    defaultWeight: 20,
    icon: Users,
    badgeText: 'ARC REACTOR POWER',
  },
};

const DEFAULT_STATE = {
  completed: {
    hod: false,
    dean: false,
    provc: false,
    president: false,
    audience: false,
  },
  weights: {
    hod: 20,
    dean: 20,
    provc: 20,
    president: 20,
    audience: 20,
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

// Movie-Accurate Iron Man Arc Reactor Component
function ArcReactor({ cps, isActivated, progress, isStageScreen }) {
  const spinDuration = isActivated
    ? 0.4
    : Math.max(0.2, 8 / Math.max(1, cps * 2.5));

  const sizeClasses = isStageScreen
    ? 'w-72 h-72 sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px]'
    : 'w-60 h-60 sm:w-72 sm:h-72';

  return (
    <div className={`relative ${sizeClasses} flex items-center justify-center my-4 select-none`}>
      {/* Outer Bright Cyan Flare */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
        style={{
          background: isActivated
            ? 'radial-gradient(circle, rgba(0, 240, 255, 0.8) 0%, rgba(0, 240, 255, 0.25) 60%, transparent 75%)'
            : `radial-gradient(circle, rgba(0, 240, 255, ${Math.min(0.45, 0.1 + cps * 0.04)}) 0%, transparent 70%)`,
          boxShadow: isActivated
            ? '0 0 140px rgba(0, 240, 255, 1), 0 0 200px rgba(255, 255, 255, 0.95)'
            : `0 0 ${20 + cps * 6}px rgba(0, 240, 255, 0.5)`,
        }}
      />

      {/* Rotating Outer Rim */}
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

      {/* Inner Metallic Arc Core */}
      <div className="absolute inset-10 rounded-full bg-slate-950/95 border-4 border-slate-900 shadow-[inset_0_0_40px_#00F0FF] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <circle cx="100" cy="100" r="82" fill="none" stroke="#1E293B" strokeWidth="16" />
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i * 18 * Math.PI) / 180;
            const hx = 100 + 82 * Math.sin(angle);
            const hy = 100 - 82 * Math.cos(angle);
            return <circle key={i} cx={hx} cy={hy} r="3.8" fill="#00F0FF" opacity="0.9" filter="url(#arc-glow-lg)" />;
          })}

          <circle cx="100" cy="100" r="64" fill="none" stroke="#0B0F19" strokeWidth="4" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="#00F0FF" strokeWidth="2" opacity="0.65" />
          <circle cx="100" cy="100" r="36" fill="none" stroke="#0B0F19" strokeWidth="4" />

          {[0, 120, 240].map((deg, i) => (
            <g key={i} transform={`rotate(${deg} 100 100)`}>
              <rect x="96" y="24" width="8" height="52" fill="#0B0F19" stroke="#1E293B" strokeWidth="1" />
              <line x1="98" y1="30" x2="98" y2="70" stroke="#00F0FF" strokeWidth="1.5" opacity="0.9" />
              <line x1="102" y1="30" x2="102" y2="70" stroke="#00F0FF" strokeWidth="1.5" opacity="0.9" />
            </g>
          ))}

          <circle cx="100" cy="100" r="28" fill="#00F0FF" opacity={isActivated ? "1" : "0.9"} filter="url(#arc-glow-lg)" />
          <circle cx="100" cy="100" r="18" fill="#FFFFFF" />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-200 font-extrabold uppercase">
            ARC CORE
          </span>
          <span
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_20px_#00F0FF]"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            {Math.round(progress)}%
          </span>
        </div>
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
    if (path.includes('provc') || path.includes('pro-vc')) return 'provc';
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

  const [ceremonyState, setCeremonyState] = useState(() => {
    try {
      const saved = localStorage.getItem('synapse_inauguration_v8');
      return saved ? JSON.parse(saved) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const [showConfig, setShowConfig] = useState(false);
  const [clickTimestamps, setClickTimestamps] = useState([]);
  const [cps, setCps] = useState(0);

  // Dignitary baseline safe floor
  const calculateDignitaryBaseline = (state) => {
    let baseline = 0;
    ['hod', 'dean', 'provc', 'president'].forEach((key) => {
      if (state.completed[key]) {
        baseline += Number(state.weights[key] ?? ROLE_DEFINITIONS[key].defaultWeight);
      }
    });
    return baseline;
  };

  const dignitaryBaseline = calculateDignitaryBaseline(ceremonyState);
  const audienceWeight = Number(ceremonyState.weights.audience ?? 20);

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
  const isFullyInaugurated = totalProgress >= 100 || (ceremonyState.completed.hod && ceremonyState.completed.dean && ceremonyState.completed.provc && ceremonyState.completed.president && ceremonyState.completed.audience);

  // Broadcast state helper
  const broadcastState = (newState) => {
    setCeremonyState(newState);
    try {
      localStorage.setItem('synapse_inauguration_v8', JSON.stringify(newState));
    } catch (e) {}

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'state_changed',
        payload: newState,
      });
    }

    try {
      const localBc = new BroadcastChannel('synapse_inauguration_v8_local');
      localBc.postMessage({ type: 'state', payload: newState });
      localBc.close();
    } catch (e) {}
  };

  // Synchronized Realtime Setup (Supabase Broadcast + Local Storage + BroadcastChannel)
  useEffect(() => {
    const channel = supabase.channel('synapse_inauguration_ceremony_v8', {
      config: { broadcast: { self: true } },
    });

    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'state_changed' }, ({ payload }) => {
        if (payload) {
          setCeremonyState(payload);
          try {
            localStorage.setItem('synapse_inauguration_v8', JSON.stringify(payload));
          } catch (e) {}
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

    // Native Cross-Tab Storage Listener for zero delay sync
    const handleStorageChange = (e) => {
      if (e.key === 'synapse_inauguration_v8' && e.newValue) {
        try {
          setCeremonyState(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    let localBc;
    try {
      localBc = new BroadcastChannel('synapse_inauguration_v8_local');
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
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
      if (localBc) localBc.close();
    };
  }, []);

  // CPS recalculation & hold timer loop (every 200ms) with automatic state broadcasting
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

  // Dignitary Key Activation
  const handleActivateRoleKey = () => {
    if (!currentRoleKey || currentRoleKey === 'audience' || ceremonyState.completed[currentRoleKey]) return;

    playAudioSignal('activate');
    if (navigator.vibrate) {
      try { navigator.vibrate([100, 50, 200]); } catch (e) {}
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
      try { navigator.vibrate(30); } catch (e) {}
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
      const localBc = new BroadcastChannel('synapse_inauguration_v8_local');
      localBc.postMessage({ type: 'click' });
      localBc.close();
    } catch (err) {}
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
        provc: false,
        president: false,
        audience: false,
      },
      weights: ceremonyState.weights,
      audienceHoldSeconds: 0,
    };
    broadcastState(resetState);
  };

  // MAIN STAGE WIDESCREEN DISPLAY (NO CONTAINER BOXES, PURE BORDERLESS STAGE INTERFACE)
  if (isMainStageScreen) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-between items-center px-6 py-8 relative overflow-hidden text-white select-none">
        {/* Stage Atmospheric Background Elements */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: isFullyInaugurated
              ? 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.3) 0%, rgba(124, 58, 237, 0.2) 50%, rgba(7, 7, 14, 0.98) 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15) 0%, rgba(7, 7, 14, 0.98) 80%)',
          }}
        />

        {/* Laser Grid Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00F0FF]" />

        {/* Stage Header */}
        <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10 pt-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Sparkles size={24} className="text-cyan-400 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white" style={{ fontFamily: 'Space Grotesk' }}>
                SYNAPSE SOCIETY
              </h1>
              <p className="text-xs font-mono text-cyan-300 tracking-wider">
                OFFICIAL INAUGURATION CEREMONY • CHANDIGARH UNIVERSITY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-xs font-mono">
              <Radio size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-cyan-200 font-bold">STAGE DISPLAY • REALTIME SYNC</span>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold transition-colors cursor-pointer"
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
              className="w-full max-w-4xl bg-black/90 border border-cyan-500/40 rounded-2xl p-5 my-4 backdrop-blur-2xl space-y-4 text-left z-20 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  ⚙️ STAGE CONTROL: EDITABLE ROLE WEIGHTS (%)
                </span>
                <button
                  onClick={handleResetCeremony}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold hover:bg-red-500/30 cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw size={12} /> RESET CEREMONY
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                {Object.values(ROLE_DEFINITIONS).map((role) => (
                  <div
                    key={role.id}
                    className="flex flex-col p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1"
                  >
                    <span className="text-gray-300 font-bold">{role.shortName}:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ceremonyState.weights[role.id] ?? role.defaultWeight}
                        onChange={(e) => handleWeightChange(role.id, e.target.value)}
                        className="w-16 bg-black/80 border border-cyan-400/40 rounded px-2 py-1 text-white font-bold text-center focus:outline-none focus:border-cyan-400"
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Stage Arc Reactor Core Display (BORDERLESS) */}
        <div className="my-auto flex flex-col items-center justify-center z-10">
          <ArcReactor
            cps={cps}
            isActivated={ceremonyState.completed.audience || isFullyInaugurated}
            progress={totalProgress}
            isStageScreen={true}
          />

          {isFullyInaugurated && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 px-8 py-4 rounded-3xl bg-cyan-500/10 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,240,255,0.4)] text-center space-y-1"
            >
              <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-300 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                SYNAPSE SOCIETY IS OFFICIALLY LIVE! 🎉
              </h2>
              <p className="text-xs font-mono text-emerald-400 font-bold tracking-widest uppercase">
                ALL CEREMONIAL KEYS ACTIVATED • SYSTEM OPERATIONAL
              </p>
            </motion.div>
          )}
        </div>

        {/* Widescreen Bottom Panel */}
        <div className="w-full max-w-7xl z-10 space-y-6 pt-4 border-t border-white/10">
          {/* Main Stage Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck size={14} className="text-cyan-400" /> SAFE FLOOR: {dignitaryBaseline}%
              </span>
              <span className="text-cyan-300 font-bold flex items-center gap-2">
                {ceremonyState.completed.audience || isFullyInaugurated ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-extrabold">✓ ARC REACTOR FULLY ACTIVATED</span>
                ) : (
                  <span className="text-cyan-400 flex items-center gap-1.5 font-extrabold">
                    <Flame size={14} className="animate-pulse text-cyan-300" /> CROWD REALTIME SPEED REACTION
                  </span>
                )}
              </span>
            </div>

            <div className="w-full h-6 bg-white/5 rounded-full overflow-hidden border border-cyan-500/40 p-0.5 relative shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              {/* Dignitary Safe Floor Marker */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-cyan-400 z-30 shadow-[0_0_15px_#00F0FF]"
                style={{ left: `${dignitaryBaseline}%` }}
                title={`Dignitary Baseline Safe Floor: ${dignitaryBaseline}%`}
              />

              {/* Progress Bar Fill */}
              <motion.div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${totalProgress}%`,
                  background: 'linear-gradient(90deg, #06B6D4 0%, #00F0FF 50%, #10B981 100%)',
                  boxShadow: '0 0 30px rgba(0, 240, 255, 0.9)',
                }}
              />
            </div>
          </div>

          {/* Widescreen 5-Column Role Node Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
            {Object.values(ROLE_DEFINITIONS).map((role) => {
              const isDone = ceremonyState.completed[role.id];
              const weightVal = ceremonyState.weights[role.id] ?? role.defaultWeight;
              const IconComp = role.icon;
              return (
                <div
                  key={role.id}
                  className={`flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComp size={16} style={{ color: role.color }} />
                    <span className="text-xs font-black font-mono text-white">{role.shortName}</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 mb-2">
                    Weight: +{weightVal}%
                  </div>
                  <div>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-extrabold text-emerald-400">
                        <CheckCircle2 size={14} className="animate-pulse" /> ACTIVATED
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-gray-500">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // MOBILE PORTALS FOR DIGNITARIES & AUDIENCE (KEEPS GLASSMORPHIC CARD STYLE)
  return (
    <div className="min-h-[calc(100dvh-5rem)] flex flex-col justify-between items-center px-4 py-6 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 35%, rgba(${currentRole?.rgbColor || '0, 240, 255'}, ${
            ceremonyState.completed[currentRoleKey] ? 0.35 : 0.18
          }) 0%, transparent 70%)`,
        }}
      />

      <div className="w-full max-w-xl mx-auto relative z-10 flex flex-col items-center flex-grow justify-center">
        {/* Real-time Status Header */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-cyan-400 animate-pulse" />
            <span className="text-gray-300">REALTIME NETWORK: CONNECTED</span>
          </div>
        </div>

        {/* Mobile Header Progress Card */}
        <div className="w-full bg-black/60 border border-cyan-500/30 rounded-[2.5rem] p-6 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,240,255,0.25)] mb-6 text-center relative overflow-hidden flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <div
              className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-white relative shadow-2xl overflow-hidden border border-white/20"
              style={{
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(7, 7, 14, 0.9) 80%)',
                boxShadow: '0 0 45px rgba(124, 58, 237, 0.5)',
              }}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300">TOTAL PROGRESS</span>
              <span
                className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                {Math.round(totalProgress)}%
              </span>
            </div>
          </div>

          <div className="w-full mt-4 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-cyan-400" /> SAFE FLOOR: {dignitaryBaseline}%
              </span>
              <span className="text-cyan-400 font-bold">
                {ceremonyState.completed.audience || isFullyInaugurated ? (
                  <span className="text-emerald-400 flex items-center gap-1">✓ ACTIVATED</span>
                ) : (
                  <span className="text-cyan-300 flex items-center gap-1">
                    <Flame size={12} className="animate-pulse" /> CHARGING CORE
                  </span>
                )}
              </span>
            </div>

            <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden border border-cyan-500/30 p-0.5 relative">
              <div
                className="absolute top-0 bottom-0 w-1 bg-cyan-400 z-30 shadow-[0_0_10px_#00F0FF]"
                style={{ left: `${dignitaryBaseline}%` }}
              />
              <motion.div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${totalProgress}%`,
                  background: 'linear-gradient(90deg, #06B6D4 0%, #00F0FF 50%, #10B981 100%)',
                  boxShadow: '0 0 25px rgba(0, 240, 255, 0.8)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 mt-5 pt-3 border-t border-white/10 w-full text-center">
            {Object.values(ROLE_DEFINITIONS).map((role) => {
              const isDone = ceremonyState.completed[role.id];
              const weightVal = ceremonyState.weights[role.id] ?? role.defaultWeight;
              return (
                <div
                  key={role.id}
                  className={`flex flex-col items-center p-1.5 rounded-xl border transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <span className="text-[10px] font-extrabold font-mono">{role.shortName}</span>
                  <span className="text-[9px] font-mono text-gray-400">{weightVal}%</span>
                  <div className="mt-1">
                    {isDone ? (
                      <CheckCircle2 size={12} className="text-emerald-400 animate-pulse" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full border border-gray-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROLE SPECIFIC MOBILE PORTAL */}
        {currentRoleKey === 'audience' ? (
          /* AUDIENCE MOBILE SPAM PORTAL */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full rounded-[2.5rem] border border-cyan-400/40 bg-black/65 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(0,240,255,0.2)] text-center flex flex-col items-center relative overflow-hidden"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-3 border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 font-mono">
              <Users size={12} />
              <span>SYNAPSE ARC REACTOR ACTIVATION</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>
              SPAM CLICK TOGETHER! ⚡
            </h2>
            <p className="text-xs text-gray-300 mb-4" style={{ fontFamily: 'Inter' }}>
              Tap rapidly to accelerate and ignite the Arc Reactor core!
            </p>

            <div className="relative my-2">
              <button
                onClick={handleAudienceClick}
                disabled={ceremonyState.completed.audience}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center text-white font-black cursor-pointer transition-all duration-150 active:scale-95 shadow-2xl relative overflow-hidden border-2 border-cyan-300/60 group"
                style={{
                  fontFamily: 'Space Grotesk',
                  background: 'linear-gradient(135deg, #00F0FF 0%, #0284C7 50%, #0369A1 100%)',
                  boxShadow: '0 0 55px rgba(0, 240, 255, 0.75)',
                }}
              >
                <Flame size={36} className="mb-1 text-cyan-100 animate-bounce" />
                <span className="text-xs sm:text-sm tracking-wider uppercase font-black">
                  {ceremonyState.completed.audience ? 'CORE ACTIVATED! ⚡' : 'TAP TO CHARGE ARC REACTOR'}
                </span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* DIGNITARY MOBILE PORTAL (HOD, Dean, Pro VC, President) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-[2.5rem] border border-white/15 bg-black/50 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden text-center flex flex-col items-center"
            style={{
              borderColor: `rgba(${currentRole.rgbColor}, 0.4)`,
              boxShadow: `0 0 60px rgba(${currentRole.rgbColor}, 0.18)`,
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border"
              style={{
                borderColor: `rgba(${currentRole.rgbColor}, 0.5)`,
                background: `rgba(${currentRole.rgbColor}, 0.12)`,
                color: currentRole.color,
                fontFamily: 'Space Mono',
              }}
            >
              <Sparkles size={12} />
              <span>{currentRole.badgeText}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>
              {currentRole.title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-300 mb-6" style={{ fontFamily: 'Inter' }}>
              {currentRole.department}
            </p>

            <div className="w-full flex flex-col items-center my-2">
              {!ceremonyState.completed[currentRoleKey] ? (
                <button
                  onClick={handleActivateRoleKey}
                  className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white font-black cursor-pointer transition-all duration-300 active:scale-95 shadow-2xl relative overflow-hidden border border-white/30"
                  style={{
                    fontFamily: 'Space Grotesk',
                    background: `linear-gradient(135deg, ${currentRole.color}, #1E1B4B)`,
                    boxShadow: `0 0 45px rgba(${currentRole.rgbColor}, 0.6)`,
                  }}
                >
                  <Zap size={32} className="mb-1 text-white" />
                  <span className="text-[11px] tracking-wider uppercase font-black text-center px-2 leading-tight">
                    ACTIVATE KEY (+{ceremonyState.weights[currentRoleKey]}%)
                  </span>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${currentRole.color}, #10B981)` }}
                  >
                    <CheckCircle2 size={36} className="text-white animate-bounce" />
                  </div>
                  <h2 className="text-base font-black text-emerald-400 font-mono">
                    {currentRole.shortName.toUpperCase()} KEY ACTIVATED!
                  </h2>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Inauguration;
