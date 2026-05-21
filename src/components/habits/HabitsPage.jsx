import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Plus, Check } from 'lucide-react';
import { useHabitStore } from '../../store/useHabitStore';
import { Modal } from '../shared/Modal';

export default function HabitsPage() {
  const { habits, add, remove, toggleCompletion } = useHabitStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    add({ name, frequency: 'daily' });
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Flame className="text-amber-400" /> Habits & Discipline
          </h1>
          <p className="text-slate-400 text-sm mt-1">Consistency compounds. Track daily routines.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Habit
        </button>
      </div>

      <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-6 text-slate-200">Daily Checklist</h2>
        <div className="space-y-3">
          {habits.map(habit => {
            const isDone = habit.completions && habit.completions[today];
            return (
              <motion.div 
                key={habit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isDone ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5 hover:border-white/15'}`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleCompletion(habit.id, today)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDone ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-white/10 text-transparent hover:bg-white/20'}`}
                  >
                    <Check size={16} className={isDone ? 'opacity-100' : 'opacity-0'} />
                  </button>
                  <div>
                    <h3 className={`font-bold ${isDone ? 'text-amber-100' : 'text-slate-200'}`}>{habit.name}</h3>
                    <p className="text-xs text-slate-500">Current Streak: <span className="font-bold text-amber-400">{habit.streak || 0} 🔥</span></p>
                  </div>
                </div>
                <button onClick={() => remove(habit.id)} className="text-slate-500 hover:text-rose-400 p-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </motion.div>
            )
          })}
          {habits.length === 0 && <p className="text-slate-500 text-center py-6">No habits yet. Start small.</p>}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Habit">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Habit Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="e.g. 1 hour of Leetcode" />
          </div>
          <button type="submit" className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Create Habit
          </button>
        </form>
      </Modal>
    </div>
  );
}
