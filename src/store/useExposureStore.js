import { create } from 'zustand';

const STORAGE_KEY = 'sf_exposurestore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useExposureStore = create((set, get) => ({
  entries: loadState()?.entries || [],
  
  add: (entry) => set(state => {
    const newState = { entries: [...state.entries, { id: crypto.randomUUID(), ...entry, createdAt: new Date().toISOString() }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),
  
  update: (id, updates) => set(state => {
    const newState = { entries: state.entries.map(e => e.id === id ? { ...e, ...updates } : e) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  remove: (id) => set(state => {
    const newState = { entries: state.entries.filter(e => e.id !== id) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  })
}));
