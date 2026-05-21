import { create } from 'zustand';

const STORAGE_KEY = 'sf_networkstore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useNetworkStore = create((set, get) => ({
  connections: loadState()?.connections || [],
  brandMetrics: loadState()?.brandMetrics || [],
  
  addConnection: (conn) => set(state => {
    const newState = { connections: [...state.connections, { id: crypto.randomUUID(), ...conn, createdAt: new Date().toISOString() }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),
  
  updateConnection: (id, updates) => set(state => {
    const newState = { connections: state.connections.map(c => c.id === id ? { ...c, ...updates } : c) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  removeConnection: (id) => set(state => {
    const newState = { connections: state.connections.filter(c => c.id !== id) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  addBrandMetric: (metric) => set(state => {
    const newState = { brandMetrics: [...state.brandMetrics, { id: crypto.randomUUID(), ...metric, date: new Date().toISOString() }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  })
}));
