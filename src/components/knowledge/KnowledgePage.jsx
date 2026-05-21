import React, { useState } from 'react';
import { Brain, Search, Plus, Tag } from 'lucide-react';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { Modal } from '../shared/Modal';

export default function KnowledgePage() {
  const { items, add, remove } = useKnowledgeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('note');

  const handleSubmit = (e) => {
    e.preventDefault();
    add({ title, content, type, tags: [] });
    setIsModalOpen(false);
    setTitle(''); setContent('');
  };

  return (
    <div className="h-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Brain className="text-pink-400" /> Second Brain
          </h1>
          <p className="text-slate-400 text-sm mt-1">Capture ideas, snippets, and knowledge frameworks</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(note => (
          <div key={note.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded">
                {note.type}
              </span>
              <button onClick={() => remove(note.id)} className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Delete
              </button>
            </div>
            <h3 className="font-bold text-lg text-slate-200 mb-2">{note.title}</h3>
            <p className="text-sm text-slate-400 whitespace-pre-wrap line-clamp-4">{note.content}</p>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-10 text-center text-slate-500">Your second brain is empty. Feed it knowledge.</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Note">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
              <option value="note">Concept Note</option>
              <option value="snippet">Code Snippet</option>
              <option value="idea">Idea</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Content</label>
            <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full h-40 bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none custom-scrollbar" />
          </div>
          <button type="submit" className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            Save to Brain
          </button>
        </form>
      </Modal>
    </div>
  );
}
