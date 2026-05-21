import { create } from 'zustand';

const STORAGE_KEY = 'sf_profilestore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useProfileStore = create((set, get) => ({
  name: loadState()?.name || 'Engineer',
  xp: loadState()?.xp || 0,
  settings: loadState()?.settings || { theme: 'dark', notifications: true, openAiKey: '' },
  focusSkillId: loadState()?.focusSkillId || null,
  createdAt: loadState()?.createdAt || new Date().toISOString(),
  
  updateProfile: (updates) => set(state => {
    const newState = { ...state, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return newState;
  }),

  updateSettings: (newSettings) => set(state => {
    const newState = { ...state, settings: { ...state.settings, ...newSettings } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return newState;
  }),

  addXP: (amount) => set(state => {
    const newState = { xp: state.xp + amount };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  setFocusSkill: (id) => set(state => {
    const newState = { focusSkillId: id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  })
}));
