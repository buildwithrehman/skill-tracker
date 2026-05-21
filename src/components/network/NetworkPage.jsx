import React, { useState } from 'react';
import { Users, Plus, Link, Mail, Star } from 'lucide-react';
import { useNetworkStore } from '../../store/useNetworkStore';
import { Modal } from '../shared/Modal';

export default function NetworkPage() {
  const { connections, addConnection, removeConnection } = useNetworkStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [strength, setStrength] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    addConnection({ name, role, company, contactInfo, notes, strength: Number(strength), lastContacted: new Date().toISOString() });
    setIsModalOpen(false);
    setName(''); setRole(''); setCompany(''); setContactInfo(''); setNotes(''); setStrength(3);
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-pink-400" /> Professional Network
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage connections, outreach, and relationships.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Contact
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {connections.map(conn => (
          <div key={conn.id} className="bg-[#0c0c14] border border-white/5 rounded-2xl p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-pink-400 font-bold text-lg">
                  {conn.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">{conn.name}</h3>
                  <p className="text-sm text-slate-400">{conn.role} {conn.company && `at ${conn.company}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={14} className={star <= conn.strength ? "fill-amber-400 text-amber-400" : "text-white/10"} />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
              {conn.contactInfo && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded">
                  <Link size={12} /> {conn.contactInfo}
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/5">
              <p className="text-sm text-slate-500 italic mb-3">"{conn.notes || 'No notes.'}"</p>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Added: {new Date(conn.createdAt).toLocaleDateString()}</span>
                <button onClick={() => removeConnection(conn.id)} className="hover:text-rose-400 transition-colors">Remove</button>
              </div>
            </div>
          </div>
        ))}
        {connections.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Users size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">Your CRM is empty. Network = Net Worth.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Connection">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Role / Job Title</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Link (LinkedIn / Email)</label>
            <input type="text" value={contactInfo} onChange={e => setContactInfo(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Relationship Strength (1-5)</label>
            <input type="range" min="1" max="5" value={strength} onChange={e => setStrength(e.target.value)} className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Acquaintance</span>
              <span>Mentor/Ally</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Private Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none h-20" placeholder="How did you meet? What value can you provide them?" />
          </div>
          <button type="submit" className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Add to Network
          </button>
        </form>
      </Modal>
    </div>
  );
}
