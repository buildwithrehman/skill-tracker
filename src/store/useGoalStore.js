import { create } from 'zustand';

const STORAGE_KEY = 'sf_goals';

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ goals: state.goals }));
  } catch (e) {
    console.error('[useGoalStore] Failed to persist state:', e);
  }
}

/**
 * @typedef {object} Goal
 * @property {string} id - UUID
 * @property {string} title
 * @property {'weekly'|'monthly'|'custom'} type
 * @property {string|null} skillId - Related skill UUID
 * @property {number} targetValue
 * @property {number} currentValue
 * @property {string} deadline - ISO date string
 * @property {boolean} completed
 * @property {string|null} completedAt - ISO date string
 * @property {string} createdAt - ISO date string
 */

export const useGoalStore = create((set, get) => ({
  /** @type {Goal[]} */
  goals: loadState()?.goals || [],

  // ─── CRUD ───────────────────────────────────────────────

  /**
   * Add a new goal.
   * @param {Partial<Goal>} goal
   */
  addGoal: (goal) =>
    set((state) => {
      const now = new Date().toISOString();
      const newGoal = {
        id: crypto.randomUUID(),
        title: '',
        type: 'weekly',
        skillId: null,
        targetValue: 100,
        currentValue: 0,
        deadline: '',
        completed: false,
        completedAt: null,
        ...goal,
        createdAt: now,
      };
      const newState = { goals: [...state.goals, newGoal] };
      persist({ ...state, ...newState });
      return newState;
    }),

  /**
   * Update a goal by ID.
   * @param {string} id
   * @param {Partial<Goal>} updates
   */
  updateGoal: (id, updates) =>
    set((state) => {
      const newState = {
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...updates } : g
        ),
      };
      persist({ ...state, ...newState });
      return newState;
    }),

  /**
   * Delete a goal by ID.
   * @param {string} id
   */
  deleteGoal: (id) =>
    set((state) => {
      const newState = { goals: state.goals.filter((g) => g.id !== id) };
      persist({ ...state, ...newState });
      return newState;
    }),

  /**
   * Increment the current value of a goal.
   * Auto-completes if currentValue >= targetValue.
   * @param {string} id
   * @param {number} [amount=1]
   */
  incrementProgress: (id, amount = 1) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal || goal.completed) return;

    const newValue = Math.min(goal.currentValue + amount, goal.targetValue);
    const updates = { currentValue: newValue };
    if (newValue >= goal.targetValue) {
      updates.completed = true;
      updates.completedAt = new Date().toISOString();
    }
    get().updateGoal(id, updates);
  },

  /**
   * Mark a goal as completed.
   * @param {string} id
   */
  completeGoal: (id) => {
    get().updateGoal(id, {
      completed: true,
      completedAt: new Date().toISOString(),
      currentValue: get().goals.find((g) => g.id === id)?.targetValue || 100,
    });
  },

  /**
   * Reopen a completed goal.
   * @param {string} id
   */
  reopenGoal: (id) => {
    get().updateGoal(id, { completed: false, completedAt: null });
  },

  // ─── COMPUTED GETTERS ──────────────────────────────────

  /**
   * Get a single goal by ID.
   * @param {string} id
   * @returns {Goal|undefined}
   */
  getGoalById: (id) => get().goals.find((g) => g.id === id),

  /**
   * Get active (not completed, not overdue) goals.
   * @returns {Goal[]}
   */
  getActive: () => {
    const now = new Date();
    return get().goals.filter(
      (g) => !g.completed && (!g.deadline || new Date(g.deadline) >= now)
    );
  },

  /**
   * Get all completed goals.
   * @returns {Goal[]}
   */
  getCompleted: () => get().goals.filter((g) => g.completed),

  /**
   * Get overdue goals (past deadline, not completed).
   * @returns {Goal[]}
   */
  getOverdue: () => {
    const now = new Date();
    return get().goals.filter(
      (g) => !g.completed && g.deadline && new Date(g.deadline) < now
    );
  },

  /**
   * Get goals with upcoming deadlines within N days.
   * @param {number} [days=7]
   * @returns {Goal[]}
   */
  getUpcomingDeadlines: (days = 7) => {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return get()
      .goals.filter(
        (g) =>
          !g.completed &&
          g.deadline &&
          new Date(g.deadline) >= now &&
          new Date(g.deadline) <= future
      )
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  },

  /**
   * Get goals linked to a specific skill.
   * @param {string} skillId
   * @returns {Goal[]}
   */
  getBySkill: (skillId) =>
    get().goals.filter((g) => g.skillId === skillId),

  /**
   * Get goals by type.
   * @param {'weekly'|'monthly'|'custom'} type
   * @returns {Goal[]}
   */
  getByType: (type) => get().goals.filter((g) => g.type === type),

  /**
   * Get overall goal completion rate.
   * @returns {number} Percentage 0-100.
   */
  getCompletionRate: () => {
    const { goals } = get();
    if (goals.length === 0) return 0;
    const completed = goals.filter((g) => g.completed).length;
    return Math.round((completed / goals.length) * 100);
  },
}));

// No default export, using named export only
