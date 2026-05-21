import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, Zap, Trophy, TrendingUp, Clock, Plus, Flame } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { useSkillStore } from '../../store/useSkillStore';
import { calculateLevel } from '../../utils/scoring';

export default function DashboardPage() {
  const { name, xp } = useProfileStore();
  const { items: skills } = useSkillStore();
  const levelInfo = calculateLevel(xp);

  const avgProgress = skills.length ? Math.round(skills.reduce((a,b)=>a+(b.level*10), 0) / skills.length) : 0;
  const mastered = skills.filter(s => s.level >= 8).length;

  const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 blur-[50px] rounded-full -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50`} />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
        <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 text-${color}-400 flex items-center justify-center`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="text-3xl font-bold font-mono text-slate-100 relative z-10">{value}</div>
    </motion.div>
  );

  return (
    <div className="h-full pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome back, {name}</h1>
          <p className="text-slate-400 text-sm mt-1">Here's your intelligence summary for today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-bold text-indigo-400">Level {levelInfo.level}</div>
            <div className="text-xs text-slate-500">{levelInfo.currentXp} / {levelInfo.nextThreshold} XP</div>
          </div>
          <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${levelInfo.progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Skills" value={skills.length} icon={Activity} color="indigo" delay={0.05} />
        <StatCard title="Avg Proficiency" value={`${avgProgress}%`} icon={TrendingUp} color="emerald" delay={0.1} />
        <StatCard title="Mastered Skills" value={mastered} icon={Trophy} color="amber" delay={0.15} />
        <StatCard title="Current Streak" value="3 🔥" icon={Flame} color="pink" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Focus Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="col-span-1 lg:col-span-2 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
              <Target size={20} /> Today's Focus
            </h2>
            <button className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 transition-colors">
              Start Session
            </button>
          </div>
          
          <div className="bg-[#0c0c14] border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400">PRIORITY</span>
              <h3 className="font-bold text-lg text-slate-200">React Performance Optimization</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Complete the 'useMemo and useCallback' module in Advanced React Patterns.</p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Clock size={16} /> 45 mins</span>
              <span className="flex items-center gap-1.5"><Trophy size={16} /> +20 XP</span>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-6">
            <Zap size={20} className="text-amber-400" /> AI Insights
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 border-l-2 border-l-amber-500">
              <p className="text-sm text-slate-300">You haven't practiced <span className="font-bold text-white">System Design</span> in 12 days. Consider reviewing load balancing concepts today.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 border-l-2 border-l-emerald-500">
              <p className="text-sm text-slate-300">Your <span className="font-bold text-white">Python</span> proficiency matches 80% of Data Scientist roles. Adding Pandas would boost this to 92%.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
