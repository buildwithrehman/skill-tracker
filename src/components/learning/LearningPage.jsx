import React from 'react';
import { BookOpen, Layers } from 'lucide-react';

export default function LearningPage() {
  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="text-cyan-400" /> Learning Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">Courses, resources, and Spaced Repetition Flashcards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0c0c14] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center min-h-[300px]">
          <Layers size={48} className="text-cyan-400 mb-4 opacity-50" />
          <h2 className="text-lg font-bold text-slate-200 mb-2">Spaced Repetition System</h2>
          <p className="text-sm text-slate-400 max-w-sm mb-6">Create flashcards linked to your skills. The built-in SM-2 algorithm will schedule optimal review times to ensure long-term retention.</p>
          <button className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 px-6 py-2.5 rounded-lg font-bold transition-colors">
            Create Deck
          </button>
        </div>
        <div className="bg-[#0c0c14] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center min-h-[300px]">
          <BookOpen size={48} className="text-emerald-400 mb-4 opacity-50" />
          <h2 className="text-lg font-bold text-slate-200 mb-2">Active Courses</h2>
          <p className="text-sm text-slate-400 max-w-sm mb-6">Track your progress across Udemy, Coursera, YouTube playlists, and technical books.</p>
          <button className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-6 py-2.5 rounded-lg font-bold transition-colors">
            Add Resource
          </button>
        </div>
      </div>
    </div>
  );
}
