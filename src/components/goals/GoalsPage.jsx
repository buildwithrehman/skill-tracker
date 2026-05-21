import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, CheckCircle2, Clock } from 'lucide-react';
import { useGoalStore } from '../../store/useGoalStore';
import { useSkillStore } from '../../store/useSkillStore';
import { Modal } from '../shared/Modal';
import { ProgressBar } from '../shared/ProgressBar';
import { format, differenceInDays } from 'date-fns';

export default function GoalsPage() {
  const { goals, add, remove, toggleComplete } = useGoalStore();
  const { items: skills } = useSkillStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tab, setTab] = useState('active');

  const [title, setTitle] = useState('');
  const [type, setType] = useState('weekly');
  const [skillId, setSkillId] = useState('');
  const [targetValue, setTargetValue] = useState(1);
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const displayGoals = tab === 'active' ? activeGoals : completedGoals;

  const handleSubmit = (e) => {
    e.preventDefault();
    add({ title, type, skillId, targetValue: parseInt(targetValue), deadline, completed: false });
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="text-rose-400" /> Goal Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">Set specific skill targets and track completion</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      <div className="flex gap-4 border-b border-white/10 mb-6">
        <button onClick={() => setTab('active')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${tab === 'active' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          Active Goals ({activeGoals.length})
        </button>
        <button onClick={() => setTab('completed')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${tab === 'completed' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          Completed ({completedGoals.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayGoals.map((goal, i) => {
          const linkedSkill = skills.find(s => s.id === goal.skillId);
          const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : 0;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl border flex flex-col justify-between ${goal.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold ${goal.completed ? 'text-emerald-100 line-through' : 'text-slate-100'}`}>{goal.title}</h3>
                  <button onClick={() => toggleComplete(goal.id)} className={`p-1.5 rounded-full transition-colors ${goal.completed ? 'text-emerald-400 bg-emerald-400/20' : 'text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10'}`}>
                    <CheckCircle2 size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    {goal.type}
                  </span>
                  {linkedSkill && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {linkedSkill.name}
                    </span>
                  )}
                </div>
              </div>

              {!goal.completed && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                  <div className={`flex items-center gap-1.5 font-medium ${daysLeft < 0 ? 'text-rose-400' : daysLeft <= 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                    <Clock size={14} />
                    {daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} days` : daysLeft === 0 ? 'Due Today' : `${daysLeft} days left`}
                  </div>
                  <button onClick={() => remove(goal.id)} className="text-xs text-slate-500 hover:text-rose-400">Delete</button>
                </div>
              )}
            </motion.div>
          );
        })}
        {displayGoals.length === 0 && <div className="col-span-full py-10 text-center text-slate-500">No goals found here.</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set Goal">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Goal Objective</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="e.g. Build 3 React projects" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Milestone</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Date</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Link to Skill (Optional)</label>
            <select value={skillId} onChange={e => setSkillId(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
              <option value="">-- None --</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button type="submit" className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Save Goal
          </button>
        </form>
      </Modal>
    </div>
  );
}
