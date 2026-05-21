import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Code, Target, Map, Trophy, FileText, Activity, Loader2 } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { useSkillStore } from '../../store/useSkillStore';
import { generateCompletion } from '../../ai/openaiService';
import { Modal } from '../shared/Modal';

export default function AIHubPage() {
  const { settings } = useProfileStore();
  const { items: skills } = useSkillStore();
  const apiKey = settings?.openAiKey;
  
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const modules = [
    { id: 'generator', name: 'AI Project Generator', icon: Code, desc: 'Invents hyper-personalized projects for your exact skill profile.' },
    { id: 'gap', name: 'Gap Detector', icon: Target, desc: 'Finds missing fundamentals preventing you from getting hired.' },
    { id: 'interviewer', name: 'Mock Interviewer', icon: Trophy, desc: 'Conducts simulated interviews with dynamic follow-ups.' },
    { id: 'resume', name: 'Resume Builder', icon: FileText, desc: 'Auto-generates resume bullet points using your tracker data.' }
  ];

  const handleRunAnalysis = async (mod) => {
    if (!apiKey) {
      setError("Please add your OpenAI API Key in Settings (bottom left of Sidebar) to use this feature.");
      return;
    }
    
    setActiveModule(mod);
    setLoading(true);
    setResult(null);
    setError(null);

    const skillsStr = skills.map(s => `${s.name} (Lvl ${s.level}/10)`).join(', ');

    let prompt = "";
    let system = "";

    if (mod.id === 'generator') {
      system = "You are a senior engineering mentor. Generate exactly ONE highly unique, portfolio-worthy project idea that perfectly combines the user's current skills. Format with markdown.";
      prompt = `My current skills: ${skillsStr || "No skills yet. Assume I am a complete beginner in programming."}\nProvide: 1. Project Title, 2. Pitch (1 sentence), 3. Tech Stack, 4. Architecture overview, 5. Why this fits my skill profile perfectly.`;
    } else if (mod.id === 'gap') {
      system = "You are an elite tech recruiter and engineering manager.";
      prompt = `Analyze my skills and tell me what the biggest glaring gap is for a modern tech job: ${skillsStr}. Keep it punchy and actionable.`;
    } else {
      system = "You are an AI assistant.";
      prompt = `Generate a brief, fun response acknowledging you are testing the ${mod.name} module with skills: ${skillsStr}`;
    }

    try {
      const response = await generateCompletion(prompt, apiKey, system);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="text-indigo-400" /> Generative AI Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {apiKey ? 'OpenAI API Connected. Ready for analysis.' : 'API Key missing. Add it in settings to unlock generative features.'}
          </p>
        </div>
      </div>

      {error && !activeModule && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-6 rounded-2xl border bg-white/[0.02] border-white/5 flex flex-col hover:border-white/10 transition-colors`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                <mod.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-200">{mod.name}</h3>
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">GPT-4 Powered</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 flex-1">{mod.desc}</p>
            <button 
              onClick={() => handleRunAnalysis(mod)}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/20"
            >
              Run {mod.name}
            </button>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={!!activeModule} onClose={() => setActiveModule(null)} title={activeModule?.name || 'AI Analysis'} maxWidth="max-w-3xl">
        <div className="min-h-[200px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-indigo-400 space-y-4 py-12">
              <Loader2 size={40} className="animate-spin" />
              <p className="text-sm text-slate-400 animate-pulse">Analyzing your skill profile...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-rose-400 p-6 text-center bg-rose-500/10 rounded-xl border border-rose-500/20">
              {error}
            </div>
          ) : result ? (
            <div className="prose prose-invert max-w-none prose-indigo p-2">
              {result.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 text-slate-300">{line.replace('- ', '')}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="mb-2 text-slate-300">{line}</p>;
              })}
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
