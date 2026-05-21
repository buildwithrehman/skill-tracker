import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'sf_projects';

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects: state.projects }));
  } catch (e) {
    console.error('[useProjectStore] Failed to persist state:', e);
  }
}

/**
 * @typedef {object} Project
 * @property {string} id - UUID
 * @property {string} title
 * @property {string} description
 * @property {string[]} techStack
 * @property {string[]} skillsUsed - Array of skill IDs
 * @property {number} difficulty - 1-5
 * @property {number} completionPct - 0-100
 * @property {string} githubUrl
 * @property {string} demoUrl
 * @property {string} problemsFaced
 * @property {string} lessonsLearned
 * @property {string[]} screenshots - Array of URLs/paths
 * @property {string[]} teamMembers
 * @property {'planning'|'active'|'completed'|'paused'} status
 * @property {string|null} startDate - ISO date string
 * @property {string|null} endDate - ISO date string
 * @property {string} createdAt - ISO date string
 */

export const useProjectStore = create((set, get) => ({
  /** @type {Project[]} */
  projects: [],
  
  fetchProjects: async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) console.error('Supabase fetch error:', error);
    if (!error && data) {
      const mapped = data.map(p => ({
        ...p,
        skillsUsed: p.linked_skills || [],
        completionPct: p.progress || 0,
        createdAt: p.created_at,
        techStack: p.techStack || [],
        screenshots: p.screenshots || [],
        teamMembers: p.teamMembers || []
      }));
      set({ projects: mapped });
    }
  },

  // ─── CRUD ───────────────────────────────────────────────

  /**
   * Add a new project.
   * @param {Partial<Project>} project
   */
  addProject: async (project) => {
    const now = new Date().toISOString();
    const newProject = {
      title: '',
      description: '',
      techStack: [],
      skillsUsed: [],
      difficulty: 3,
      completionPct: 0,
      githubUrl: '',
      demoUrl: '',
      problemsFaced: '',
      lessonsLearned: '',
      screenshots: [],
      teamMembers: [],
      status: 'planning',
      startDate: null,
      endDate: null,
      ...project,
      createdAt: now,
    };
    const { data, error } = await supabase.from('projects').insert([{
      title: newProject.title,
      description: newProject.description,
      status: newProject.status,
      linked_skills: newProject.skillsUsed || [],
      progress: newProject.completionPct || 0,
      created_at: newProject.createdAt
    }]).select();
    if (error) console.error('Supabase insert error:', error);
    if (!error && data) {
      set(state => ({ projects: [...state.projects, { ...newProject, id: data[0].id }] }));
    }
  },

  /**
   * Update a project by ID.
   * @param {string} id
   * @param {Partial<Project>} updates
   */
  updateProject: async (id, updates) => {
    const dbUpdates = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.skillsUsed !== undefined) dbUpdates.linked_skills = updates.skillsUsed;
    if (updates.completionPct !== undefined) dbUpdates.progress = updates.completionPct;
    
    if (Object.keys(dbUpdates).length === 0) {
      set(state => ({ projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p) }));
      return;
    }

    const { data, error } = await supabase.from('projects').update(dbUpdates).eq('id', id).select();
    if (error) console.error('Supabase update error:', error);
    if (!error && data) {
      set(state => ({ projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p) }));
    }
  },

  /**
   * Delete a project by ID.
   * @param {string} id
   */
  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) set(state => ({ projects: state.projects.filter(p => p.id !== id) }));
  },

  /**
   * Update project completion percentage.
   * Automatically marks as completed if 100%.
   * @param {string} id
   * @param {number} pct - 0-100
   */
  updateCompletion: (id, pct) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const updates = { completionPct: clamped };
    if (clamped === 100) {
      updates.status = 'completed';
      updates.endDate = new Date().toISOString();
    }
    get().updateProject(id, updates);
  },

  /**
   * Add a tech stack item to a project.
   * @param {string} projectId
   * @param {string} tech
   */
  addTechStack: (projectId, tech) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (project && !project.techStack.includes(tech)) {
      get().updateProject(projectId, {
        techStack: [...project.techStack, tech],
      });
    }
  },

  /**
   * Remove a tech stack item from a project.
   * @param {string} projectId
   * @param {string} tech
   */
  removeTechStack: (projectId, tech) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (project) {
      get().updateProject(projectId, {
        techStack: project.techStack.filter((t) => t !== tech),
      });
    }
  },

  /**
   * Link a skill to a project.
   * @param {string} projectId
   * @param {string} skillId
   */
  linkSkill: (projectId, skillId) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (project && !project.skillsUsed.includes(skillId)) {
      get().updateProject(projectId, {
        skillsUsed: [...project.skillsUsed, skillId],
      });
    }
  },

  /**
   * Unlink a skill from a project.
   * @param {string} projectId
   * @param {string} skillId
   */
  unlinkSkill: (projectId, skillId) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (project) {
      get().updateProject(projectId, {
        skillsUsed: project.skillsUsed.filter((id) => id !== skillId),
      });
    }
  },

  // ─── COMPUTED GETTERS ──────────────────────────────────

  /**
   * Get a single project by ID.
   * @param {string} id
   * @returns {Project|undefined}
   */
  getProjectById: (id) => get().projects.find((p) => p.id === id),

  /**
   * Get projects filtered by status.
   * @param {'planning'|'active'|'completed'|'paused'} status
   * @returns {Project[]}
   */
  getByStatus: (status) =>
    get().projects.filter((p) => p.status === status),

  /**
   * Get active projects (status = 'active').
   * @returns {Project[]}
   */
  getActiveProjects: () =>
    get().projects.filter((p) => p.status === 'active'),

  /**
   * Get completed projects.
   * @returns {Project[]}
   */
  getCompletedProjects: () =>
    get().projects.filter((p) => p.status === 'completed'),

  /**
   * Get all unique tech stack items across all projects with usage count.
   * @returns {Record<string, number>}
   */
  getTechStackBreakdown: () => {
    const breakdown = {};
    for (const p of get().projects) {
      for (const tech of p.techStack) {
        breakdown[tech] = (breakdown[tech] || 0) + 1;
      }
    }
    return breakdown;
  },

  /**
   * Get projects that use a specific skill.
   * @param {string} skillId
   * @returns {Project[]}
   */
  getProjectsBySkill: (skillId) =>
    get().projects.filter((p) => p.skillsUsed.includes(skillId)),

  /**
   * Get average completion across all projects.
   * @returns {number}
   */
  getAvgCompletion: () => {
    const { projects } = get();
    if (projects.length === 0) return 0;
    const total = projects.reduce((sum, p) => sum + p.completionPct, 0);
    return Math.round(total / projects.length);
  },
}));

// Named export used instead
