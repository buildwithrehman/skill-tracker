import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Plus, ExternalLink, Activity } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useSkillStore } from '../../store/useSkillStore';
import { Modal } from '../shared/Modal';
import { ProgressBar } from '../shared/ProgressBar';

export default function ProjectsPage() {
  const { projects, add, remove, updateStatus } = useProjectStore();
  const { items: skills } = useSkillStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [techStr, setTechStr] = useState('');
  const [completion, setCompletion] = useState(50);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    add({
      title,
      description,
      status,
      techStack: techStr.split(',').map(s => s.trim()).filter(Boolean),
      completionPct: parseInt(completion),
      skillsUsed: []
    });
    setIsModalOpen(false);
    setTitle(''); setDescription(''); setTechStr('');
  };

  const getStatusColor = (s) => {
    switch(s) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'planning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'completed': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'paused': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="text-indigo-400" /> Project Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track portfolio projects and map them to your skills</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {['all', 'planning', 'active', 'completed', 'paused'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`capitalize px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === f ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
        {filtered.map((proj, i) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all group flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-slate-100">{proj.title}</h3>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getStatusColor(proj.status)}`}>
                    {proj.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{proj.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => remove(proj.id)} className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {proj.techStack?.map(tech => (
                <span key={tech} className="px-2 py-1 bg-white/5 rounded text-xs font-medium text-indigo-300">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Progress</span>
                <span>{proj.completionPct}%</span>
              </div>
              <ProgressBar progress={proj.completionPct} color={proj.status === 'completed' ? 'emerald' : 'indigo'} />
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500">
            No projects found in this status.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white h-24" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white">
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Completion %</label>
              <input type="number" min="0" max="100" value={completion} onChange={e => setCompletion(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Tech Stack (comma separated)</label>
            <input type="text" value={techStr} onChange={e => setTechStr(e.target.value)} placeholder="React, Node, PostgreSQL" className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none text-white" />
          </div>
          <button type="submit" className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Create Project
          </button>
        </form>
      </Modal>
    </div>
  );
}
