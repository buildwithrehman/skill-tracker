import React from 'react';
import { motion } from 'framer-motion';

export function ProgressBar({ progress, color = 'indigo' }) {
  const gradients = {
    indigo: 'from-indigo-500 to-purple-500',
    emerald: 'from-emerald-400 to-cyan-400',
    amber: 'from-amber-400 to-orange-500',
    pink: 'from-pink-500 to-rose-500',
    blue: 'from-blue-400 to-indigo-500',
    gray: 'from-slate-400 to-slate-500'
  };

  return (
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full bg-gradient-to-r ${gradients[color]} rounded-full relative`}
      >
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 rounded-full blur-[2px]" />
      </motion.div>
    </div>
  );
}
