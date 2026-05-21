const LEVEL_TITLES = [
  'Initiate',
  'Novice',
  'Apprentice',
  'Learner',
  'Practitioner',
  'Specialist',
  'Professional',
  'Expert',
  'Master',
  'Grandmaster',
  'Legend'
];

export const calculateLevel = (xp) => {
  let level = 1;
  let threshold = 100;
  let total = 0;
  
  while (xp >= total + threshold && level < 50) {
    total += threshold;
    level++;
    threshold = Math.floor(threshold * 1.35); // Escalating requirement
  }
  
  const currentXp = xp - total;
  
  return {
    level,
    currentXp,
    nextThreshold: threshold,
    totalXp: xp,
    progressPct: Math.min(100, Math.round((currentXp / threshold) * 100)),
    title: LEVEL_TITLES[Math.min(Math.floor((level - 1) / 5), LEVEL_TITLES.length - 1)]
  };
};

export const calculateProductivityScore = (habitsCompleted, totalHabits, streak, deepWorkMinutes) => {
  const habitScore = totalHabits > 0 ? (habitsCompleted / totalHabits) * 40 : 0;
  const streakScore = Math.min(streak * 2, 30); // Max 30 points for streak (15 days)
  const deepWorkScore = Math.min((deepWorkMinutes / 240) * 30, 30); // Max 30 points for 4 hours
  
  return Math.round(habitScore + streakScore + deepWorkScore);
};

export const calculateConsistencyScore = (activityMap, days = 30) => {
  const today = new Date();
  let activeDays = 0;
  
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (activityMap[key] && activityMap[key] > 0) activeDays++;
  }
  
  return Math.round((activeDays / days) * 100);
};
