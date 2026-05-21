export const load = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Error loading from localStorage for key ${key}:`, error);
    return fallback;
  }
};

export const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

export const exportAll = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('sf_'));
  const data = {};
  keys.forEach(k => {
    data[k] = JSON.parse(localStorage.getItem(k));
  });
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `skillforge-os-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const importAll = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    Object.keys(data).forEach(key => {
      if (key.startsWith('sf_')) {
        localStorage.setItem(key, JSON.stringify(data[key]));
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
