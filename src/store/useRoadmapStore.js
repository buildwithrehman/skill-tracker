import { create } from 'zustand';
import roadmapsData from '../data/roadmaps.js';

const STORAGE_KEY = 'sf_roadmapstore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useRoadmapStore = create((set, get) => ({
  roadmaps: loadState()?.roadmaps || roadmapsData || [],
  
  add: (roadmap) => set(state => {
    const newState = { roadmaps: [...state.roadmaps, { id: crypto.randomUUID(), ...roadmap, createdAt: new Date().toISOString() }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),
  
  updateMilestone: (roadmapId, milestoneId, completed) => set(state => {
    const newState = { 
      roadmaps: state.roadmaps.map(r => r.id === roadmapId ? {
        ...r, 
        milestones: r.milestones.map(m => m.id === milestoneId ? { ...m, completed } : m)
      } : r)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  remove: (id) => set(state => {
    const newState = { roadmaps: state.roadmaps.filter(r => r.id !== id) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  })
}));
