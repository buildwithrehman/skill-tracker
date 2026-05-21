import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'sf_finance';

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: state.entries }));
  } catch (e) {
    console.error('[useFinanceStore] Failed to persist state:', e);
  }
}

/**
 * @typedef {object} FinanceEntry
 * @property {string} id - UUID
 * @property {'freelance'|'investment'|'side'|'salary'|'savings'} type
 * @property {number} amount - Positive for income, could be negative for expenses
 * @property {string} description
 * @property {string} date - ISO date string
 * @property {string|null} skillId - Related skill UUID
 * @property {string} createdAt - ISO date string
 */

export const useFinanceStore = create((set, get) => ({
  /** @type {FinanceEntry[]} */
  entries: [],

  fetchEntries: async () => {
    const { data, error } = await supabase.from('finance_transactions').select('*');
    if (!error && data) set({ entries: data });
  },

  // ─── CRUD ───────────────────────────────────────────────

  /**
   * Add a finance entry.
   * @param {Partial<FinanceEntry>} entry
   */
  addEntry: async (entry) => {
    const now = new Date().toISOString();
    const newEntry = {
      type: 'freelance',
      amount: 0,
      description: '',
      date: now,
      skillId: null,
      ...entry,
      createdAt: now,
    };
    const { data, error } = await supabase.from('finance_transactions').insert([{
      type: newEntry.type,
      amount: newEntry.amount,
      source: newEntry.description,
      date: newEntry.date,
      skill_id: newEntry.skillId,
      created_at: newEntry.createdAt
    }]).select();
    if (!error && data) set(state => ({ entries: [...state.entries, { ...newEntry, id: data[0].id }] }));
  },

  /**
   * Update a finance entry by ID.
   * @param {string} id
   * @param {Partial<FinanceEntry>} updates
   */
  updateEntry: async (id, updates) => {
    const { data, error } = await supabase.from('finance_transactions').update(updates).eq('id', id).select();
    if (!error && data) set(state => ({ entries: state.entries.map(e => e.id === id ? { ...e, ...updates } : e) }));
  },

  /**
   * Delete a finance entry by ID.
   * @param {string} id
   */
  deleteEntry: async (id) => {
    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (!error) set(state => ({ entries: state.entries.filter(e => e.id !== id) }));
  },

  // ─── COMPUTED GETTERS ──────────────────────────────────

  /**
   * Get a finance entry by ID.
   * @param {string} id
   * @returns {FinanceEntry|undefined}
   */
  getEntryById: (id) => get().entries.find((e) => e.id === id),

  /**
   * Get total amount grouped by type.
   * @returns {Record<string, number>}
   */
  getTotalByType: () => {
    const result = {};
    for (const e of get().entries) {
      result[e.type] = (result[e.type] || 0) + e.amount;
    }
    return result;
  },

  /**
   * Get total income (sum of all positive amounts).
   * @returns {number}
   */
  getTotalIncome: () =>
    get().entries.reduce(
      (sum, e) => sum + (e.amount > 0 ? e.amount : 0),
      0
    ),

  /**
   * Get entries filtered by type.
   * @param {'freelance'|'investment'|'side'|'salary'|'savings'} type
   * @returns {FinanceEntry[]}
   */
  getByType: (type) => get().entries.filter((e) => e.type === type),

  /**
   * Calculate ROI per skill — total amount earned linked to each skill.
   * @returns {Record<string, number>} skillId -> total amount
   */
  getSkillROI: () => {
    const result = {};
    for (const e of get().entries) {
      if (e.skillId) {
        result[e.skillId] = (result[e.skillId] || 0) + e.amount;
      }
    }
    return result;
  },

  /**
   * Get monthly trend — total per month sorted chronologically.
   * @returns {{ month: string, total: number }[]}
   */
  getMonthlyTrend: () => {
    const monthly = {};
    for (const e of get().entries) {
      const month = e.date.slice(0, 7); // YYYY-MM
      monthly[month] = (monthly[month] || 0) + e.amount;
    }
    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));
  },

  /**
   * Get entries for a specific date range.
   * @param {string} startDate - ISO date string
   * @param {string} endDate - ISO date string
   * @returns {FinanceEntry[]}
   */
  getByDateRange: (startDate, endDate) =>
    get().entries.filter(
      (e) => e.date >= startDate && e.date <= endDate
    ),

  /**
   * Get entries linked to a specific skill.
   * @param {string} skillId
   * @returns {FinanceEntry[]}
   */
  getBySkill: (skillId) =>
    get().entries.filter((e) => e.skillId === skillId),

  /**
   * Get finance summary.
   * @returns {{ totalEntries: number, totalIncome: number, avgPerEntry: number, topType: string }}
   */
  getSummary: () => {
    const { entries } = get();
    if (entries.length === 0) {
      return { totalEntries: 0, totalIncome: 0, avgPerEntry: 0, topType: 'N/A' };
    }
    const totalIncome = entries.reduce((sum, e) => sum + e.amount, 0);
    const byType = {};
    for (const e of entries) {
      byType[e.type] = (byType[e.type] || 0) + e.amount;
    }
    const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return {
      totalEntries: entries.length,
      totalIncome,
      avgPerEntry: Math.round(totalIncome / entries.length),
      topType,
    };
  },
}));

// Named export used instead
