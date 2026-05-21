import { create } from 'zustand';

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
  projects: loadState()?.projects || [],

  // ─── CRUD ───────────────────────────────────────────────

  /**
   * Add a new project.
   * @param {Partial<Project>} project
   */
  addProject: (project) =>
    set((state) => {
      const now = new Date().toISOString();
      const newProject = {
        id: crypto.randomUUID(),
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
      const newState = { projects: [...state.projects, newProject] };
      persist({ ...state, ...newState });
      return newState;
    }),

  /**
   * Update a project by ID.
   * @param {string} id
   * @param {Partial<Project>} updates
   */
  updateProject: (id, updates) =>
    set((state) => {
      const newState = {
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      };
      persist({ ...state, ...newState });
      return newState;
    }),

  /**
   * Delete a project by ID.
   * @param {string} id
   */
  deleteProject: (id) =>
    set((state) => {
      const newState = { projects: state.projects.filter((p) => p.id !== id) };
      persist({ ...state, ...newState });
      return newState;
    }),

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
