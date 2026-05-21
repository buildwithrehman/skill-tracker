// SkillForge OS — Achievements System
// 35 meaningful achievements that track real progress, not vanity metrics

const achievements = [
  // ─── SKILL MILESTONES ────────────────────────────────────────────
  {
    id: 'first-skill',
    icon: '🌱',
    title: 'First Seed',
    description: 'Add your first skill to track',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.length >= 1;
    },
  },
  {
    id: 'skill-collector-5',
    icon: '📚',
    title: 'Knowledge Seeker',
    description: 'Track 5 different skills',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.length >= 5;
    },
  },
  {
    id: 'skill-collector-15',
    icon: '🏛️',
    title: 'Library Builder',
    description: 'Track 15 different skills',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.length >= 15;
    },
  },
  {
    id: 'skill-collector-30',
    icon: '🌍',
    title: 'Renaissance Mind',
    description: 'Track 30 different skills across multiple domains',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.length >= 30;
    },
  },
  {
    id: 'first-mastery',
    icon: '⭐',
    title: 'First Mastery',
    description: 'Reach level 5 in any skill',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.some((s) => s.level >= 5);
    },
  },
  {
    id: 'triple-mastery',
    icon: '🏆',
    title: 'Triple Crown',
    description: 'Reach level 5 in three different skills',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.filter((s) => s.level >= 5).length >= 3;
    },
  },
  {
    id: 'category-diversity',
    icon: '🎭',
    title: 'Jack of All Trades',
    description: 'Have skills in at least 4 different categories',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      const categories = new Set(skills.map((s) => s.category).filter(Boolean));
      return categories.size >= 4;
    },
  },
  {
    id: 'level-up',
    icon: '📈',
    title: 'Leveled Up',
    description: 'Increase any skill from level 1 to level 3',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.some((s) => s.level >= 3);
    },
  },

  // ─── PROJECT MILESTONES ──────────────────────────────────────────
  {
    id: 'first-project',
    icon: '🔨',
    title: 'Builder',
    description: 'Add your first project',
    check: (stores) => {
      const projects = stores.projects?.projects || [];
      return projects.length >= 1;
    },
  },
  {
    id: 'project-5',
    icon: '🏗️',
    title: 'Construction Crew',
    description: 'Complete 5 projects',
    check: (stores) => {
      const projects = stores.projects?.projects || [];
      return projects.filter((p) => p.status === 'completed').length >= 5;
    },
  },
  {
    id: 'project-10',
    icon: '🏙️',
    title: 'City Planner',
    description: 'Complete 10 projects — a solid portfolio',
    check: (stores) => {
      const projects = stores.projects?.projects || [];
      return projects.filter((p) => p.status === 'completed').length >= 10;
    },
  },
  {
    id: 'complex-project',
    icon: '🎯',
    title: 'Complexity Conqueror',
    description: 'Complete a project with difficulty 4 or higher',
    check: (stores) => {
      const projects = stores.projects?.projects || [];
      return projects.some(
        (p) => p.status === 'completed' && (p.difficulty || 0) >= 4
      );
    },
  },
  {
    id: 'multi-tech-project',
    icon: '🔗',
    title: 'Full Stack Build',
    description: 'Complete a project using 4+ different technologies',
    check: (stores) => {
      const projects = stores.projects?.projects || [];
      return projects.some(
        (p) =>
          p.status === 'completed' && (p.techStack || p.skills || []).length >= 4
      );
    },
  },

  // ─── LEARNING & HABITS ───────────────────────────────────────────
  {
    id: 'first-session',
    icon: '⏱️',
    title: 'First Session',
    description: 'Log your first study or practice session',
    check: (stores) => {
      const activity = stores.activity?.sessions || stores.habits?.sessions || [];
      return activity.length >= 1;
    },
  },
  {
    id: 'streak-7',
    icon: '🔥',
    title: 'On Fire',
    description: 'Maintain a 7-day practice streak',
    check: (stores) => {
      const streak = stores.habits?.currentStreak || stores.activity?.streak || 0;
      return streak >= 7;
    },
  },
  {
    id: 'streak-30',
    icon: '💎',
    title: 'Diamond Discipline',
    description: 'Maintain a 30-day practice streak',
    check: (stores) => {
      const streak = stores.habits?.currentStreak || stores.activity?.streak || 0;
      return streak >= 30;
    },
  },
  {
    id: 'streak-100',
    icon: '🌟',
    title: 'Century Streak',
    description: 'Maintain a 100-day practice streak — legendary consistency',
    check: (stores) => {
      const streak = stores.habits?.currentStreak || stores.activity?.streak || 0;
      return streak >= 100;
    },
  },
  {
    id: 'hours-50',
    icon: '📖',
    title: 'Dedicated Learner',
    description: 'Accumulate 50 total study hours',
    check: (stores) => {
      const totalHours = stores.activity?.totalHours || stores.habits?.totalHours || 0;
      return totalHours >= 50;
    },
  },
  {
    id: 'hours-200',
    icon: '🎓',
    title: 'Scholar',
    description: 'Accumulate 200 total study hours',
    check: (stores) => {
      const totalHours = stores.activity?.totalHours || stores.habits?.totalHours || 0;
      return totalHours >= 200;
    },
  },
  {
    id: 'hours-500',
    icon: '🧠',
    title: 'Deep Expert',
    description: 'Accumulate 500 total study hours',
    check: (stores) => {
      const totalHours = stores.activity?.totalHours || stores.habits?.totalHours || 0;
      return totalHours >= 500;
    },
  },

  // ─── ROADMAP & GOALS ─────────────────────────────────────────────
  {
    id: 'first-roadmap',
    icon: '🗺️',
    title: 'Pathfinder',
    description: 'Start your first learning roadmap',
    check: (stores) => {
      const roadmaps = stores.roadmap?.roadmaps || stores.roadmap?.activeRoadmaps || [];
      return roadmaps.length >= 1;
    },
  },
  {
    id: 'milestone-complete',
    icon: '🏁',
    title: 'Milestone Reached',
    description: 'Complete your first roadmap milestone',
    check: (stores) => {
      const roadmaps = stores.roadmap?.roadmaps || [];
      return roadmaps.some((r) =>
        (r.milestones || []).some((m) => m.completed)
      );
    },
  },
  {
    id: 'roadmap-complete',
    icon: '🎖️',
    title: 'Journey Complete',
    description: 'Complete an entire learning roadmap',
    check: (stores) => {
      const roadmaps = stores.roadmap?.roadmaps || [];
      return roadmaps.some(
        (r) =>
          (r.milestones || []).length > 0 &&
          (r.milestones || []).every((m) => m.completed)
      );
    },
  },
  {
    id: 'goal-setter',
    icon: '🎯',
    title: 'Goal Setter',
    description: 'Set 3 learning goals',
    check: (stores) => {
      const goals = stores.goals?.goals || stores.activity?.goals || [];
      return goals.length >= 3;
    },
  },

  // ─── INTERVIEW PREP ──────────────────────────────────────────────
  {
    id: 'first-interview',
    icon: '💼',
    title: 'Interview Ready',
    description: 'Complete your first mock interview session',
    check: (stores) => {
      const interviews = stores.interview?.completedSessions || stores.knowledge?.mockInterviews || 0;
      return (Array.isArray(interviews) ? interviews.length : interviews) >= 1;
    },
  },
  {
    id: 'interview-10',
    icon: '🎤',
    title: 'Seasoned Interviewee',
    description: 'Complete 10 mock interview sessions',
    check: (stores) => {
      const interviews = stores.interview?.completedSessions || stores.knowledge?.mockInterviews || 0;
      return (Array.isArray(interviews) ? interviews.length : interviews) >= 10;
    },
  },
  {
    id: 'flashcard-100',
    icon: '🃏',
    title: 'Flashcard Master',
    description: 'Create and review 100 flashcards',
    check: (stores) => {
      const count = stores.knowledge?.flashcardsReviewed || stores.learning?.flashcardCount || 0;
      return count >= 100;
    },
  },

  // ─── EXPOSURE & NETWORKING ────────────────────────────────────────
  {
    id: 'first-exposure',
    icon: '🌐',
    title: 'Going Public',
    description: 'Add your first exposure activity (blog, talk, open-source)',
    check: (stores) => {
      const exposures = stores.exposure?.activities || stores.exposure?.items || [];
      return exposures.length >= 1;
    },
  },
  {
    id: 'exposure-5',
    icon: '📡',
    title: 'Signal Booster',
    description: 'Complete 5 exposure activities',
    check: (stores) => {
      const exposures = stores.exposure?.activities || stores.exposure?.items || [];
      return exposures.length >= 5;
    },
  },
  {
    id: 'open-source',
    icon: '🐙',
    title: 'Open Source Contributor',
    description: 'Log an open-source contribution',
    check: (stores) => {
      const exposures = stores.exposure?.activities || stores.exposure?.items || [];
      return exposures.some(
        (e) =>
          (e.type || '').toLowerCase().includes('open-source') ||
          (e.type || '').toLowerCase().includes('opensource') ||
          (e.category || '').toLowerCase().includes('open-source')
      );
    },
  },
  {
    id: 'network-10',
    icon: '🤝',
    title: 'Networker',
    description: 'Add 10 professional contacts',
    check: (stores) => {
      const contacts = stores.network?.contacts || [];
      return contacts.length >= 10;
    },
  },

  // ─── SPECIAL ACHIEVEMENTS ────────────────────────────────────────
  {
    id: 't-shaped',
    icon: '📐',
    title: 'T-Shaped Professional',
    description: 'Reach level 4+ in one category while having skills in 3+ other categories',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      const hasDeep = skills.some((s) => s.level >= 4);
      const categories = new Set(skills.map((s) => s.category).filter(Boolean));
      return hasDeep && categories.size >= 3;
    },
  },
  {
    id: 'speed-learner',
    icon: '⚡',
    title: 'Speed Learner',
    description: 'Level up a skill within your first week of tracking it',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      return skills.some((s) => {
        if (!s.createdAt || s.level < 2) return false;
        const created = new Date(s.createdAt);
        const now = new Date();
        const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7 && s.level >= 2;
      });
    },
  },
  {
    id: 'well-rounded',
    icon: '🔮',
    title: 'Well-Rounded',
    description: 'Have both technical skills (level 3+) and soft skills (level 3+)',
    check: (stores) => {
      const skills = stores.skills?.skills || [];
      const hasTech = skills.some(
        (s) =>
          s.level >= 3 &&
          ['Programming', 'Web Development', 'AI/ML', 'Data Science', 'Cloud'].includes(s.category)
      );
      const hasSoft = skills.some(
        (s) => s.level >= 3 && ['Personal', 'Business'].includes(s.category)
      );
      return hasTech && hasSoft;
    },
  },
  {
    id: 'completionist',
    icon: '💯',
    title: 'Completionist',
    description: 'Fill in all profile sections: skills, projects, goals, and exposure',
    check: (stores) => {
      const hasSkills = (stores.skills?.skills || []).length > 0;
      const hasProjects = (stores.projects?.projects || []).length > 0;
      const hasGoals =
        (stores.goals?.goals || stores.activity?.goals || []).length > 0;
      const hasExposure =
        (stores.exposure?.activities || stores.exposure?.items || []).length > 0;
      return hasSkills && hasProjects && hasGoals && hasExposure;
    },
  },
  {
    id: 'career-focused',
    icon: '🧭',
    title: 'Career Navigator',
    description: 'Set a target career path and complete a gap analysis',
    check: (stores) => {
      const targetPath =
        stores.career?.targetPath || stores.goals?.targetCareer || null;
      return !!targetPath;
    },
  },
];

// Helper: check all achievements and return unlocked ones
export const checkAchievements = (stores) =>
  achievements.filter((a) => {
    try {
      return a.check(stores);
    } catch {
      return false;
    }
  });

// Helper: get newly unlocked (comparing with previously unlocked IDs)
export const getNewlyUnlocked = (stores, previouslyUnlockedIds = []) => {
  const allUnlocked = checkAchievements(stores);
  return allUnlocked.filter((a) => !previouslyUnlockedIds.includes(a.id));
};

// Helper: get progress toward next achievement
export const getAchievementProgress = (stores) => {
  const unlocked = checkAchievements(stores);
  return {
    total: achievements.length,
    unlocked: unlocked.length,
    percentage: Math.round((unlocked.length / achievements.length) * 100),
    locked: achievements.filter((a) => !unlocked.find((u) => u.id === a.id)),
  };
};

export default achievements;
