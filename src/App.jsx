import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/layout/Sidebar';

// Lazy load pages for code splitting
const DashboardPage = React.lazy(() => import('./components/dashboard/DashboardPage'));
const AnalyticsPage = React.lazy(() => import('./components/analytics/AnalyticsPage'));
const ExecutionPage = React.lazy(() => import('./components/execution/ExecutionPage'));
const SkillsPage = React.lazy(() => import('./components/skills/SkillsPage'));
const ProjectsPage = React.lazy(() => import('./components/projects/ProjectsPage'));
const LearningPage = React.lazy(() => import('./components/learning/LearningPage'));
const RoadmapPage = React.lazy(() => import('./components/roadmap/RoadmapPage'));
const GoalsPage = React.lazy(() => import('./components/goals/GoalsPage'));
const HabitsPage = React.lazy(() => import('./components/habits/HabitsPage'));
const KnowledgePage = React.lazy(() => import('./components/knowledge/KnowledgePage'));
const FinancePage = React.lazy(() => import('./components/finance/FinancePage'));
const ExposurePage = React.lazy(() => import('./components/exposure/ExposurePage'));
const NetworkPage = React.lazy(() => import('./components/network/NetworkPage'));
const AIHubPage = React.lazy(() => import('./components/ai-views/AIHubPage'));

// Placeholder component for routes being built
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
    <h2 className="text-xl font-semibold text-slate-200">{title}</h2>
    <p className="mt-2">Building this module...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#06060b] text-slate-200 overflow-hidden selection:bg-indigo-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(129,140,248,0.1),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(192,132,252,0.08),transparent)]" />
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
        </div>

        {/* Sidebar */}
        <div className="z-20 relative">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 relative z-10 overflow-y-auto custom-scrollbar flex flex-col">
          <Suspense fallback={<Placeholder title="Loading Module" />}>
            <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/execution" element={<ExecutionPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/learning" element={<LearningPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/knowledge" element={<KnowledgePage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/exposure" element={<ExposurePage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/ai-hub" element={<AIHubPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Suspense>
        </main>
        
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: 'rgba(12, 12, 20, 0.9)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }
          }}
        />
      </div>
    </Router>
  );
}

export default App;
