import { create } from 'zustand';

const STORAGE_KEY = 'sf_knowledgestore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useKnowledgeStore = create((set, get) => ({
  items: loadState()?.items || [],
  
  add: (item) => set(state => {
    const newState = { items: [...state.items, { id: crypto.randomUUID(), ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),
  
  update: (id, updates) => set(state => {
    const newState = { items: state.items.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),
  
  remove: (id) => set(state => {
    const newState = { items: state.items.filter(i => i.id !== id) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  search: (query) => {
    const q = query.toLowerCase();
    return get().items.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.content.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    );
  },

  getByType: (type) => get().items.filter(i => i.type === type),
  getByTag: (tag) => get().items.filter(i => i.tags.includes(tag))
}));
