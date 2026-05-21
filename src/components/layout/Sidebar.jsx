import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, PieChart, Zap, Activity, FolderKanban, BookOpen, 
  Map, Target, Flame, DollarSign, Globe, Users, Brain, Sparkles, Trophy, Settings
} from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { calculateLevel } from '../../utils/scoring';
import { Modal } from '../shared/Modal';

export function Sidebar() {
  const { name, xp, settings, updateSettings } = useProfileStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(settings?.openAiKey || '');
  const levelInfo = calculateLevel(xp);

  const mainNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Execution', path: '/execution', icon: Zap },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
  ];

  const manageNav = [
    { name: 'Skills', path: '/skills', icon: Activity },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Learning', path: '/learning', icon: BookOpen },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
  ];

  const trackNav = [
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Habits', path: '/habits', icon: Flame },
    { name: 'Knowledge', path: '/knowledge', icon: Brain },
    { name: 'Finance', path: '/finance', icon: DollarSign },
  ];

  const NavItem = ({ item }) => (
    <NavLink 
      to={item.path}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(129,140,248,0.1)]' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`
      }
    >
      <item.icon size={18} />
      {item.name}
    </NavLink>
  );

  return (
    <aside className="w-[260px] h-screen bg-[#09090f]/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              SkillForge OS
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 px-2">Main</div>
          <nav className="flex flex-col gap-1">
            {mainNav.map(n => <NavItem key={n.name} item={n} />)}
            <NavLink to="/ai-hub" className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${isActive ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 hover:bg-white/5'}`}>
              <Brain size={18} className="text-indigo-400" /> AI Hub
            </NavLink>
          </nav>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 px-2">Manage</div>
          <nav className="flex flex-col gap-1">
            {manageNav.map(n => <NavItem key={n.name} item={n} />)}
          </nav>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 px-2">Track</div>
          <nav className="flex flex-col gap-1">
            {trackNav.map(n => <NavItem key={n.name} item={n} />)}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 mt-auto">
        <div 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover:hidden">
            {name.substring(0, 2).toUpperCase()}
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/10 hidden items-center justify-center text-white font-bold text-sm shadow-inner group-hover:flex">
            <Settings size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-200 truncate">{name}</div>
            <div className="text-xs text-slate-400">Level {levelInfo.level} • {levelInfo.title}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="System Settings">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-2">OpenAI API Key</h3>
            <p className="text-xs text-slate-400 mb-3">
              Unlock true generative AI features. Your key is stored locally on your device and is never sent to our servers.
            </p>
            <input 
              type="password" 
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-[#06060b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none mb-3"
            />
            <button 
              onClick={() => { updateSettings({ openAiKey: apiKey }); setIsSettingsOpen(false); }}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg transition-colors text-sm"
            >
              Save Key
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
