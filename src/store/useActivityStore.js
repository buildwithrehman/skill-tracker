import { create } from 'zustand';

const STORAGE_KEY = 'sf_activitystore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

const todayStr = () => new Date().toISOString().split('T')[0];

export const useActivityStore = create((set, get) => ({
  activityMap: loadState()?.activityMap || {},
  streakData: loadState()?.streakData || { current: 0, best: 0, lastDate: null },
  timeByCategory: loadState()?.timeByCategory || {},
  
  recordActivity: () => set(state => {
    const today = todayStr();
    const newActivityMap = { ...state.activityMap, [today]: (state.activityMap[today] || 0) + 1 };
    
    // Update streak
    let newStreak = { ...state.streakData };
    if (newStreak.lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      
      if (newStreak.lastDate === yStr) {
        newStreak.current++;
      } else {
        newStreak.current = 1;
      }
      newStreak.lastDate = today;
      if (newStreak.current > newStreak.best) newStreak.best = newStreak.current;
    }

    const newState = { activityMap: newActivityMap, streakData: newStreak };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  }),

  recordTime: (category, minutes) => set(state => {
    const newState = { timeByCategory: { ...state.timeByCategory, [category]: (state.timeByCategory[category] || 0) + minutes } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  })
}));
