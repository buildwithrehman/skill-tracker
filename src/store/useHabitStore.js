import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'sf_habits';

/**
 * Load persisted state from localStorage.
 * @returns {object|null}
 */
function loadState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Persist state to localStorage.
 * @param {object} state
 */
function persist(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        habits: state.habits,
        deepWorkSessions: state.deepWorkSessions,
        disciplineLog: state.disciplineLog,
      })
    );
  } catch (e) {
    console.error('[useHabitStore] Failed to persist state:', e);
  }
}

/**
 * Get today's date as YYYY-MM-DD string.
 * @returns {string}
 */
function todayKey() {
  return new Date().toISOString().split('T')[0];
}

/**
 * @typedef {object} Habit
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} icon - Emoji or icon name
 * @property {'daily'|'weekly'} frequency
 * @property {Record<string, boolean>} completions - { 'YYYY-MM-DD': boolean }
 * @property {number} streak - Current streak count
 * @property {number} bestStreak - Best streak ever
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {object} DeepWorkSession
 * @property {string} id - UUID
 * @property {string} date - YYYY-MM-DD
 * @property {number} duration - Minutes
 * @property {string} skill - Skill name or ID
 * @property {string} notes
 */

export const useHabitStore = create((set, get) => {
  const saved = loadState();

  return {
    /** @type {Habit[]} */
    habits: [],
    /** @type {DeepWorkSession[]} */
    deepWorkSessions: saved?.deepWorkSessions || [],
    /** @type {Record<string, number>} disciplineLog - { 'YYYY-MM-DD': score (1-10) } */
    disciplineLog: saved?.disciplineLog || {},

    fetchHabits: async () => {
      const { data, error } = await supabase.from('habits').select('*');
      if (!error && data) {
        const mapped = data.map(h => ({
           id: h.id,
           name: h.title,
           icon: '✅',
           frequency: h.category,
           streak: h.streak,
           bestStreak: h.streak,
           completions: h.completions || {},
           createdAt: h.created_at
        }));
        set({ habits: mapped });
      }
    },

    // ─── HABIT CRUD ─────────────────────────────────────────

    /**
     * Add a new habit.
     * @param {Partial<Habit>} habit
     */
    addHabit: async (habit) => {
      const newHabit = {
        name: '',
        icon: '✅',
        frequency: 'daily',
        completions: {},
        streak: 0,
        bestStreak: 0,
        createdAt: new Date().toISOString(),
        ...habit,
      };
      const { data, error } = await supabase.from('habits').insert([{
        title: newHabit.name,
        category: newHabit.frequency,
        streak: newHabit.streak,
        completions: newHabit.completions,
        created_at: newHabit.createdAt
      }]).select();
      if (!error && data) {
        set((state) => {
          const dbHabit = { ...newHabit, id: data[0].id };
          const newState = { ...state, habits: [...state.habits, dbHabit] };
          persist(newState);
          return { habits: newState.habits };
        });
      }
    },

    /**
     * Update a habit by ID.
     * @param {string} id
     * @param {Partial<Habit>} updates
     */
    updateHabit: async (id, updates) => {
      const dbUpdates = {};
      if (updates.name) dbUpdates.title = updates.name;
      if (updates.frequency) dbUpdates.category = updates.frequency;
      if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
      if (updates.completions) dbUpdates.completions = updates.completions;

      const { data, error } = await supabase.from('habits').update(dbUpdates).eq('id', id).select();
      if (!error && data) {
        set((state) => {
          const newHabits = state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h));
          const newState = { ...state, habits: newHabits };
          persist(newState);
          return { habits: newHabits };
        });
      }
    },

    /**
     * Delete a habit by ID.
     * @param {string} id
     */
    deleteHabit: async (id) => {
      const { error } = await supabase.from('habits').delete().eq('id', id);
      if (!error) {
        set((state) => {
          const newHabits = state.habits.filter((h) => h.id !== id);
          const newState = { ...state, habits: newHabits };
          persist(newState);
          return { habits: newHabits };
        });
      }
    },

    /**
     * Toggle a habit completion for a specific date.
     * Updates streak and bestStreak accordingly.
     * @param {string} id - Habit UUID
     * @param {string} [date] - YYYY-MM-DD, defaults to today
     */
    toggleCompletion: (id, date) => {
      const dateKey = date || todayKey();
      const habit = get().habits.find((h) => h.id === id);
      if (!habit) return;

      const newCompletions = { ...habit.completions };
      newCompletions[dateKey] = !newCompletions[dateKey];

      // Recalculate streak from today going backwards
      let streak = 0;
      const current = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(current);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if (newCompletions[key]) {
          streak++;
        } else {
          break;
        }
      }

      const bestStreak = Math.max(habit.bestStreak, streak);

      get().updateHabit(id, {
        completions: newCompletions,
        streak,
        bestStreak,
      });
    },

    /**
     * Check if a habit is completed for a given date.
     * @param {string} id
     * @param {string} [date] - YYYY-MM-DD, defaults to today
     * @returns {boolean}
     */
    isCompleted: (id, date) => {
      const dateKey = date || todayKey();
      const habit = get().habits.find((h) => h.id === id);
      return habit?.completions[dateKey] === true;
    },

    /**
     * Get completion rate for a habit over last N days.
     * @param {string} id
     * @param {number} [days=30]
     * @returns {number} Percentage 0-100
     */
    getCompletionRate: (id, days = 30) => {
      const habit = get().habits.find((h) => h.id === id);
      if (!habit) return 0;

      let completed = 0;
      const current = new Date();
      for (let i = 0; i < days; i++) {
        const d = new Date(current);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if (habit.completions[key]) completed++;
      }
      return Math.round((completed / days) * 100);
    },

    /**
     * Get today's habits completion summary.
     * @returns {{ total: number, completed: number, pct: number }}
     */
    getTodaySummary: () => {
      const { habits } = get();
      const today = todayKey();
      const dailyHabits = habits.filter((h) => h.frequency === 'daily');
      const completed = dailyHabits.filter(
        (h) => h.completions[today] === true
      ).length;
      return {
        total: dailyHabits.length,
        completed,
        pct: dailyHabits.length > 0 ? Math.round((completed / dailyHabits.length) * 100) : 0,
      };
    },

    // ─── DEEP WORK SESSIONS ──────────────────────────────

    /**
     * Log a deep work session.
     * @param {{ duration: number, skill: string, notes?: string, date?: string }} session
     */
    addDeepWorkSession: (session) =>
      set((state) => {
        const newSession = {
          id: crypto.randomUUID(),
          date: todayKey(),
          duration: 0,
          skill: '',
          notes: '',
          ...session,
        };
        const newState = {
          ...state,
          deepWorkSessions: [...state.deepWorkSessions, newSession],
        };
        persist(newState);
        return { deepWorkSessions: newState.deepWorkSessions };
      }),

    /**
     * Delete a deep work session.
     * @param {string} id
     */
    deleteDeepWorkSession: (id) =>
      set((state) => {
        const newSessions = state.deepWorkSessions.filter((s) => s.id !== id);
        const newState = { ...state, deepWorkSessions: newSessions };
        persist(newState);
        return { deepWorkSessions: newSessions };
      }),

    /**
     * Get total deep work minutes for a date range.
     * @param {number} [days=7]
     * @returns {number}
     */
    getDeepWorkMinutes: (days = 7) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffKey = cutoff.toISOString().split('T')[0];
      return get()
        .deepWorkSessions.filter((s) => s.date >= cutoffKey)
        .reduce((sum, s) => sum + s.duration, 0);
    },

    /**
     * Get deep work sessions grouped by skill.
     * @returns {Record<string, number>} skill -> total minutes
     */
    getDeepWorkBySkill: () => {
      const result = {};
      for (const s of get().deepWorkSessions) {
        result[s.skill] = (result[s.skill] || 0) + s.duration;
      }
      return result;
    },

    // ─── DISCIPLINE LOG ──────────────────────────────────

    /**
     * Log discipline score for a day.
     * @param {number} score - 1-10
     * @param {string} [date] - YYYY-MM-DD, defaults to today
     */
    logDiscipline: (score, date) =>
      set((state) => {
        const dateKey = date || todayKey();
        const clamped = Math.max(1, Math.min(10, score));
        const newLog = { ...state.disciplineLog, [dateKey]: clamped };
        const newState = { ...state, disciplineLog: newLog };
        persist(newState);
        return { disciplineLog: newLog };
      }),

    /**
     * Get average discipline score over last N days.
     * @param {number} [days=30]
     * @returns {number}
     */
    getAvgDiscipline: (days = 30) => {
      const { disciplineLog } = get();
      const current = new Date();
      let total = 0;
      let count = 0;
      for (let i = 0; i < days; i++) {
        const d = new Date(current);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if (disciplineLog[key] !== undefined) {
          total += disciplineLog[key];
          count++;
        }
      }
      return count > 0 ? Math.round((total / count) * 10) / 10 : 0;
    },

    /**
     * Get a habit by ID.
     * @param {string} id
     * @returns {Habit|undefined}
     */
    getHabitById: (id) => get().habits.find((h) => h.id === id),
  };
});

// No default export, using named export only
