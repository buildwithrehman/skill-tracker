import React, { useState } from 'react';
import { DollarSign, TrendingUp, Plus, Briefcase, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useSkillStore } from '../../store/useSkillStore';
import { Modal } from '../shared/Modal';

export default function FinancePage() {
  const { entries, addEntry, deleteEntry } = useFinanceStore();
  const { items: skills } = useSkillStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [skillId, setSkillId] = useState('');

  const handleCloseFinanceModal = () => setIsModalOpen(false);

  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalInvested = entries.filter(e => e.type === 'investment').reduce((sum, e) => sum + Number(e.amount), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addEntry({ title, amount: Number(amount), type, skillId });
    setIsModalOpen(false);
    setTitle(''); setAmount(''); setSkillId('');
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="text-emerald-400" /> Financial Growth
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track skill ROI, freelance income, and investments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Total Income</p>
            <p className="text-2xl font-bold text-slate-100">${totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Total Invested</p>
            <p className="text-2xl font-bold text-slate-100">${totalInvested.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-6 text-slate-200">Transaction History</h2>
        <div className="space-y-3">
          {entries.map(entry => {
            const linkedSkill = skills.find(s => s.id === entry.skillId);
            return (
              <div key={entry.id} className="flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-200">{entry.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${entry.type === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                      {entry.type}
                    </span>
                    {linkedSkill && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        Skill: {linkedSkill.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${entry.type === 'income' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {entry.type === 'income' ? '+' : ''}${entry.amount.toLocaleString()}
                  </span>
                  <button onClick={() => deleteEntry(entry.id)} className="text-slate-500 hover:text-rose-400 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {entries.length === 0 && <p className="text-slate-500 text-center py-6">No financial entries yet. Time to monetize your skills!</p>}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseFinanceModal} title="Add Financial Entry">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title / Description</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="e.g. Freelance API Integration" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
                <option value="income">Income</option>
                <option value="investment">Investment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Amount ($)</label>
              <input required type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Link to Skill (Optional - Tracks ROI)</label>
            <select value={skillId} onChange={e => setSkillId(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
              <option value="">-- None --</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button type="submit" className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Save Entry
          </button>
        </form>
      </Modal>
    </div>
  );
}
