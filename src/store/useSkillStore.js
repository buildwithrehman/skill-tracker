import { create } from 'zustand';

const STORAGE_KEY = 'sf_skillstore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useSkillStore = create((set, get) => ({
  items: loadState()?.items || [],
  
  add: (skill) => set(state => {
    const newState = { items: [...state.items, { id: crypto.randomUUID(), ...skill, createdAt: new Date().toISOString() }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),
  
  update: (id, updates) => set(state => {
    const newState = { items: state.items.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  remove: (id) => set(state => {
    const newState = { items: state.items.filter(s => s.id !== id) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  })
}));
