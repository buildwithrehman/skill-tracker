import React from 'react';
import { Map, CheckCircle2, Circle } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { useSkillStore } from '../../store/useSkillStore';

export default function RoadmapPage() {
  const { roadmaps, updateMilestone } = useRoadmapStore();
  const { items: skills } = useSkillStore();

  const activeRoadmap = roadmaps[0];

  return (
    <div className="h-full pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Map className="text-purple-400" /> Career Roadmaps
        </h1>
        <p className="text-slate-400 text-sm mt-1">Structured milestones towards mastery.</p>
      </div>

      {activeRoadmap ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 max-w-4xl">
          <h2 className="text-xl font-bold text-slate-100 mb-2">{activeRoadmap.title}</h2>
          <p className="text-sm text-slate-400 mb-8">{activeRoadmap.description}</p>
          
          <div className="space-y-0">
            {activeRoadmap.milestones?.map((milestone, idx) => (
              <div key={milestone.id || idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => updateMilestone(activeRoadmap.id, milestone.id, !milestone.completed)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${milestone.completed ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-[#0c0c14] border-2 border-white/20 text-transparent hover:border-purple-400'}`}
                  >
                    {milestone.completed ? <CheckCircle2 size={18} /> : <Circle size={10} className="fill-current" />}
                  </button>
                  {idx !== activeRoadmap.milestones.length - 1 && (
                    <div className={`w-0.5 h-full my-1 ${milestone.completed ? 'bg-purple-500/50' : 'bg-white/10'}`} />
                  )}
                </div>
                
                <div className="pb-10 pt-1 flex-1">
                  <h3 className={`text-lg font-bold ${milestone.completed ? 'text-slate-400 line-through decoration-purple-500/30' : 'text-slate-200'}`}>
                    {milestone.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {milestone.skills?.map(s => {
                      const userSkill = skills.find(sk => sk.name.toLowerCase() === s.toLowerCase());
                      const lvl = userSkill ? userSkill.level : 0;
                      return (
                        <div key={s} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold">
                          <span className="text-slate-300">{s}</span>
                          <span className={`${lvl >= 5 ? 'text-emerald-400' : lvl > 0 ? 'text-amber-400' : 'text-slate-500'}`}>Lvl {lvl}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">No active roadmaps found.</div>
      )}
    </div>
  );
}
