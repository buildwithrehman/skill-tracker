import { create } from 'zustand';

const STORAGE_KEY = 'sf_learning';

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
        courses: state.courses,
        flashcards: state.flashcards,
        quizScores: state.quizScores,
      })
    );
  } catch (e) {
    console.error('[useLearningStore] Failed to persist state:', e);
  }
}

/**
 * @typedef {object} Course
 * @property {string} id - UUID
 * @property {'course'|'book'|'video'|'audiobook'} type
 * @property {string} title
 * @property {string} platform
 * @property {string} url
 * @property {number} progress - 0-100
 * @property {number} rating - 1-5
 * @property {string} notes
 * @property {string[]} keyTakeaways
 * @property {string|null} startDate - ISO date string
 * @property {string|null} completedDate - ISO date string
 * @property {string[]} skillIds - Related skill UUIDs
 */

/**
 * @typedef {object} Flashcard
 * @property {string} id - UUID
 * @property {string} front - Question / prompt
 * @property {string} back - Answer
 * @property {string} nextReview - ISO date string
 * @property {number} interval - Days until next review
 * @property {number} easeFactor - SM-2 ease factor (>= 1.3)
 * @property {number} repetitions - Number of successful reviews
 * @property {string|null} skillId - Related skill UUID
 */

/**
 * @typedef {object} QuizScore
 * @property {string} id - UUID
 * @property {string} topic
 * @property {number} score - 0-100
 * @property {number} totalQuestions
 * @property {number} correctAnswers
 * @property {string} date - ISO date string
 * @property {string|null} skillId
 */

export const useLearningStore = create((set, get) => ({
  /** @type {Course[]} */
  courses: loadState()?.courses || [],
  /** @type {Flashcard[]} */
  flashcards: loadState()?.flashcards || [],
  /** @type {QuizScore[]} */
  quizScores: loadState()?.quizScores || [],

  // ─── COURSE CRUD ────────────────────────────────────────

  /**
   * Add a new learning resource (course/book/video/audiobook).
   * @param {Partial<Course>} course
   */
  addCourse: (course) =>
    set((state) => {
      const newCourse = {
        id: crypto.randomUUID(),
        type: 'course',
        title: '',
        platform: '',
        url: '',
        progress: 0,
        rating: 0,
        notes: '',
        keyTakeaways: [],
        startDate: null,
        completedDate: null,
        skillIds: [],
        ...course,
      };
      const newState = { ...state, courses: [...state.courses, newCourse] };
      persist(newState);
      return { courses: newState.courses };
    }),

  /**
   * Update a course by ID.
   * @param {string} id
   * @param {Partial<Course>} updates
   */
  updateCourse: (id, updates) =>
    set((state) => {
      const newCourses = state.courses.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      const newState = { ...state, courses: newCourses };
      persist(newState);
      return { courses: newCourses };
    }),

  /**
   * Delete a course by ID.
   * @param {string} id
   */
  deleteCourse: (id) =>
    set((state) => {
      const newCourses = state.courses.filter((c) => c.id !== id);
      const newState = { ...state, courses: newCourses };
      persist(newState);
      return { courses: newCourses };
    }),

  /**
   * Update course progress and auto-complete if 100%.
   * @param {string} id
   * @param {number} progress - 0-100
   */
  updateCourseProgress: (id, progress) => {
    const clamped = Math.max(0, Math.min(100, progress));
    const updates = { progress: clamped };
    if (clamped === 100) {
      updates.completedDate = new Date().toISOString();
    }
    get().updateCourse(id, updates);
  },

  /**
   * Add a key takeaway to a course.
   * @param {string} courseId
   * @param {string} takeaway
   */
  addKeyTakeaway: (courseId, takeaway) => {
    const course = get().courses.find((c) => c.id === courseId);
    if (course) {
      get().updateCourse(courseId, {
        keyTakeaways: [...course.keyTakeaways, takeaway],
      });
    }
  },

  // ─── FLASHCARD CRUD (SM-2 Algorithm) ───────────────────

  /**
   * Add a new flashcard.
   * @param {Partial<Flashcard>} card
   */
  addFlashcard: (card) =>
    set((state) => {
      const newCard = {
        id: crypto.randomUUID(),
        front: '',
        back: '',
        nextReview: new Date().toISOString(),
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        skillId: null,
        ...card,
      };
      const newState = { ...state, flashcards: [...state.flashcards, newCard] };
      persist(newState);
      return { flashcards: newState.flashcards };
    }),

  /**
   * Update a flashcard by ID.
   * @param {string} id
   * @param {Partial<Flashcard>} updates
   */
  updateFlashcard: (id, updates) =>
    set((state) => {
      const newCards = state.flashcards.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      const newState = { ...state, flashcards: newCards };
      persist(newState);
      return { flashcards: newCards };
    }),

  /**
   * Delete a flashcard by ID.
   * @param {string} id
   */
  deleteFlashcard: (id) =>
    set((state) => {
      const newCards = state.flashcards.filter((c) => c.id !== id);
      const newState = { ...state, flashcards: newCards };
      persist(newState);
      return { flashcards: newCards };
    }),

  /**
   * Review a flashcard using the SM-2 spaced repetition algorithm.
   * @param {string} id
   * @param {number} quality - User self-assessment 0-5 (0=complete blackout, 5=perfect)
   */
  reviewFlashcard: (id, quality) => {
    const card = get().flashcards.find((c) => c.id === id);
    if (!card) return;

    // SM-2 algorithm implementation
    const q = Math.max(0, Math.min(5, quality));
    let { easeFactor, interval, repetitions } = card;

    if (q < 3) {
      // Failed review - reset
      repetitions = 0;
      interval = 1;
    } else {
      // Successful review
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);

    const nextReview = new Date(
      Date.now() + interval * 24 * 60 * 60 * 1000
    ).toISOString();

    get().updateFlashcard(id, {
      easeFactor,
      interval,
      repetitions,
      nextReview,
    });
  },

  /**
   * Get flashcards due for review (nextReview <= now).
   * @returns {Flashcard[]}
   */
  getDueFlashcards: () => {
    const now = new Date();
    return get().flashcards.filter((c) => new Date(c.nextReview) <= now);
  },

  // ─── QUIZ SCORES ───────────────────────────────────────

  /**
   * Add a quiz score.
   * @param {Partial<QuizScore>} score
   */
  addQuizScore: (score) =>
    set((state) => {
      const newScore = {
        id: crypto.randomUUID(),
        topic: '',
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        date: new Date().toISOString(),
        skillId: null,
        ...score,
      };
      const newState = {
        ...state,
        quizScores: [...state.quizScores, newScore],
      };
      persist(newState);
      return { quizScores: newState.quizScores };
    }),

  /**
   * Delete a quiz score.
   * @param {string} id
   */
  deleteQuizScore: (id) =>
    set((state) => {
      const newScores = state.quizScores.filter((s) => s.id !== id);
      const newState = { ...state, quizScores: newScores };
      persist(newState);
      return { quizScores: newScores };
    }),

  // ─── COMPUTED GETTERS ──────────────────────────────────

  /**
   * Get courses by type.
   * @param {'course'|'book'|'video'|'audiobook'} type
   * @returns {Course[]}
   */
  getCoursesByType: (type) =>
    get().courses.filter((c) => c.type === type),

  /**
   * Get completed courses.
   * @returns {Course[]}
   */
  getCompletedCourses: () =>
    get().courses.filter((c) => c.progress === 100),

  /**
   * Get in-progress courses.
   * @returns {Course[]}
   */
  getInProgressCourses: () =>
    get().courses.filter((c) => c.progress > 0 && c.progress < 100),

  /**
   * Get courses linked to a specific skill.
   * @param {string} skillId
   * @returns {Course[]}
   */
  getCoursesBySkill: (skillId) =>
    get().courses.filter((c) => c.skillIds.includes(skillId)),

  /**
   * Get average quiz score.
   * @returns {number}
   */
  getAvgQuizScore: () => {
    const { quizScores } = get();
    if (quizScores.length === 0) return 0;
    const total = quizScores.reduce((sum, s) => sum + s.score, 0);
    return Math.round(total / quizScores.length);
  },

  /**
   * Get course by ID.
   * @param {string} id
   * @returns {Course|undefined}
   */
  getCourseById: (id) => get().courses.find((c) => c.id === id),

  /**
   * Get learning stats summary.
   * @returns {{ totalCourses: number, completed: number, inProgress: number, totalFlashcards: number, dueFlashcards: number, avgQuizScore: number }}
   */
  getStats: () => {
    const state = get();
    const now = new Date();
    return {
      totalCourses: state.courses.length,
      completed: state.courses.filter((c) => c.progress === 100).length,
      inProgress: state.courses.filter(
        (c) => c.progress > 0 && c.progress < 100
      ).length,
      totalFlashcards: state.flashcards.length,
      dueFlashcards: state.flashcards.filter(
        (c) => new Date(c.nextReview) <= now
      ).length,
      avgQuizScore: state.getAvgQuizScore(),
    };
  },
}));

// Named export used instead
