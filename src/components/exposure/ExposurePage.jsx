import React, { useState } from 'react';
import { Globe, Plus, Award, Trash2 } from 'lucide-react';
import { useExposureStore } from '../../store/useExposureStore';
import { Modal } from '../shared/Modal';

export default function ExposurePage() {
  const { entries, add, remove } = useExposureStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState('hackathon');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    add({ title, type, description, date });
    setIsModalOpen(false);
    setTitle(''); setDescription('');
  };

  const getIconColor = (t) => {
    switch(t) {
      case 'hackathon': return 'text-purple-400 bg-purple-500/10';
      case 'certification': return 'text-emerald-400 bg-emerald-500/10';
      case 'internship': return 'text-blue-400 bg-blue-500/10';
      case 'open-source': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Globe className="text-blue-400" /> Real-World Exposure
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track hackathons, internships, certs, and open source contributions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Log Experience
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.sort((a,b) => new Date(b.date) - new Date(a.date)).map(entry => (
          <div key={entry.id} className="bg-[#0c0c14] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getIconColor(entry.type)}`}>
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-lg leading-tight">{entry.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase mt-0.5">{entry.type} • {entry.date}</p>
                </div>
              </div>
              <button onClick={() => remove(entry.id)} className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm text-slate-400 line-clamp-3">{entry.description}</p>
          </div>
        ))}
        {entries.length === 0 && <div className="col-span-full py-12 text-center text-slate-500">No real-world exposure logged yet. Start building your portfolio!</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Experience">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="e.g. AWS Certified Solutions Architect" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
                <option value="hackathon">Hackathon</option>
                <option value="certification">Certification</option>
                <option value="internship">Internship</option>
                <option value="open-source">Open Source</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Date Achieved</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description / Key Takeaways</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none h-24 custom-scrollbar" placeholder="What did you build? What did you learn?" />
          </div>
          <button type="submit" className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Log Experience
          </button>
        </form>
      </Modal>
    </div>
  );
}
