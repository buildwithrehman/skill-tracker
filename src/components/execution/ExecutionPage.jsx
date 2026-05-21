import React, { useState, useEffect } from 'react';
import { Zap, Play, Square, Target, Activity } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { useGoalStore } from '../../store/useGoalStore';
import { useHabitStore } from '../../store/useHabitStore';
import { EmptyState } from '../shared/EmptyState';
import { motion } from 'framer-motion';

export default function ExecutionPage() {
  const { focusSkillId } = useProfileStore();
  const { items: goals } = useGoalStore();
  
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (isActive && timer === 0) {
      setIsActive(false);
      if (!isBreak) {
        setTimer(5 * 60);
        setIsBreak(true);
        // Play sound or notification here
      } else {
        setTimer(25 * 60);
        setIsBreak(false);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timer, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimer(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeGoals = goals.filter(g => !g.completed).slice(0, 3);

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto pb-20">
      <div className="w-full mb-12 text-center">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center justify-center gap-3">
          <Zap className="text-amber-400" size={32} /> Deep Work Engine
        </h1>
        <p className="text-slate-400 mt-2">Distraction-free execution mode.</p>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-96 h-96 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-colors duration-1000 ${
          isActive 
            ? isBreak ? 'border-emerald-500/50 shadow-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/50 shadow-rose-500/20 bg-rose-500/5'
            : 'border-white/10 bg-white/5'
        }`}
      >
        <span className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-2">
          {isBreak ? 'Short Break' : 'Focus Session'}
        </span>
        <div className="text-7xl font-mono font-bold text-white mb-8 tracking-tighter">
          {formatTime(timer)}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={toggleTimer}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform active:scale-95 ${isActive ? 'bg-amber-500' : 'bg-indigo-500'}`}
          >
            {isActive ? <Square size={20} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </motion.div>

      <div className="w-full max-w-2xl mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl">
          <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Target size={18} className="text-indigo-400" /> Current Objectives
          </h3>
          <div className="space-y-3">
            {activeGoals.map(g => (
              <div key={g.id} className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border border-white/20 mt-0.5" />
                <span className="text-sm text-slate-300">{g.title}</span>
              </div>
            ))}
            {activeGoals.length === 0 && <p className="text-sm text-slate-500">No active goals. Just focus on building!</p>}
          </div>
        </div>
        
        <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl flex flex-col justify-center text-center">
          <Activity size={32} className="text-indigo-400 mx-auto mb-3" />
          <p className="text-sm text-indigo-200">
            "The successful warrior is the average man, with laser-like focus."
          </p>
        </div>
      </div>
    </div>
  );
}
