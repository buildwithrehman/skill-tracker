import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { useSkillStore } from '../../store/useSkillStore';

export default function AnalyticsPage() {
  const { items: skills } = useSkillStore();

  const categories = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="h-full pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <PieChart className="text-indigo-400" /> Advanced Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">Deep dive into your progress metrics and capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl col-span-1 lg:col-span-2 min-h-[300px] flex flex-col items-center justify-center">
          <TrendingUp size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-500 font-medium">Growth Chart Data Loading...</p>
          <p className="text-xs text-slate-600 mt-2">(Recharts integration pending data aggregation)</p>
        </div>

        <div className="bg-[#0c0c14] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center">
          <Activity size={48} className="text-indigo-500/50 mb-4" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">Category Spread</h3>
          <div className="w-full space-y-3 mt-4">
            {Object.entries(categories).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1 text-slate-400 font-semibold uppercase tracking-wider">
                  <span>{cat}</span>
                  <span>{count} Skills</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${(count / skills.length) * 100}%` }} />
                </div>
              </div>
            ))}
            {Object.keys(categories).length === 0 && <p className="text-sm text-slate-500 text-center">No categories yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
