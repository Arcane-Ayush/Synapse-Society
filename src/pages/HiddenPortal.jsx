import { motion } from 'framer-motion';

export function HiddenPortal() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-2xl rounded-[2rem] border border-purple-500/30 bg-black/30 backdrop-blur-xl p-8 md:p-10 shadow-[0_0_60px_rgba(168,85,247,0.18)]"
      >
        <p className="text-[10px] uppercase tracking-[0.35em] font-semibold" style={{ color: 'rgba(var(--synapse-pink-rgb), 0.9)', fontFamily: 'Space Mono' }}>
          Hidden route
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>
          Internal access portal
        </h1>
        <p className="mt-4 text-sm md:text-base leading-7" style={{ color: 'rgba(var(--text-secondary-rgb), 0.85)', fontFamily: 'Inter' }}>
          This path is intentionally not linked in the navigation, so it can be used as a direct access route for privileged members.
        </p>

        <div className="mt-6 rounded-2xl border border-purple-400/20 bg-white/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: 'rgba(var(--text-secondary-rgb), 0.7)', fontFamily: 'Space Mono' }}>
            Direct path
          </p>
          <code className="break-all text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Space Mono' }}>
            /hiddenportal
          </code>
        </div>
      </motion.div>
    </div>
  );
}

export default HiddenPortal;

