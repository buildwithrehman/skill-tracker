import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Activity, Star } from 'lucide-react';
import { useSkillStore } from '../../store/useSkillStore';
import { ProgressBar } from '../shared/ProgressBar';
import { Modal } from '../shared/Modal';

export default function SkillsPage() {
  const { items: skills, add, remove } = useSkillStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Programming', 'Web Dev', 'AI/ML', 'Cloud', 'Data', 'Personal'];

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState(1);
  const [priority, setPriority] = useState('medium');

  const filtered = skills.filter(s => {
    if (filter !== 'All' && s.category !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    add({ name, category, level: parseInt(level), priority });
    setIsModalOpen(false);
    setName('');
  };

  const getPriorityColor = (p) => {
    if (p === 'high') return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    if (p === 'medium') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-indigo-400" /> Skill OS
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your entire capability stack</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Skill
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search skills..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-200"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar hide-scrollbar">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === c ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-200">{skill.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-white/10 text-slate-400 bg-white/5">
                    {skill.category}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getPriorityColor(skill.priority)}`}>
                    {skill.priority}
                  </span>
                </div>
              </div>
              <button onClick={() => remove(skill.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
            
            <div className="space-y-1 mb-1">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Level {skill.level}/10</span>
                <span>{skill.level * 10}%</span>
              </div>
              <ProgressBar progress={skill.level * 10} color={skill.level >= 8 ? 'emerald' : skill.level >= 4 ? 'indigo' : 'amber'} />
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500">
            No skills found. Add some to get started!
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Skill">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Skill Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white" placeholder="e.g. React, Python" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white">
                {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Current Level (1-10): {level}</label>
            <input type="range" min="1" max="10" value={level} onChange={e => setLevel(e.target.value)} className="w-full accent-indigo-500" />
          </div>
          <button type="submit" className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Save Skill
          </button>
        </form>
      </Modal>
    </div>
  );
}
