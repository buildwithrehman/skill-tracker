import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'sf_knowledgestore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useKnowledgeStore = create((set, get) => ({
  items: [],
  
  fetchItems: async () => {
    const { data, error } = await supabase.from('knowledge_items').select('*');
    if (!error && data) {
      const mapped = data.map(i => ({
        ...i,
        content: i.summary,
        dateAdded: i.date_added,
        dateRead: i.date_read,
        isRead: i.is_read
      }));
      set({ items: mapped });
    }
  },
  
  add: async (item) => {
    const { data, error } = await supabase.from('knowledge_items').insert([{
      title: item.title,
      url: item.url,
      tags: item.tags || [],
      summary: item.content || item.summary,
      is_read: false,
      date_added: new Date().toISOString()
    }]).select();
    if (!error && data) {
      set(state => ({ items: [...state.items, { ...data[0], content: data[0].summary }] }));
    }
  },
  
  update: async (id, updates) => {
    const dbUpdates = { ...updates };
    if (updates.content) dbUpdates.summary = updates.content;
    if (updates.isRead !== undefined) dbUpdates.is_read = updates.isRead;
    
    const { data, error } = await supabase.from('knowledge_items').update(dbUpdates).eq('id', id).select();
    if (!error && data) {
      set(state => ({ items: state.items.map(i => i.id === id ? { ...data[0], content: data[0].summary } : i) }));
    }
  },
  
  remove: async (id) => {
    const { error } = await supabase.from('knowledge_items').delete().eq('id', id);
    if (!error) {
      set(state => ({ items: state.items.filter(i => i.id !== id) }));
    }
  },

  search: (query) => {
    const q = query.toLowerCase();
    return get().items.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.content.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    );
  },

  getByType: (type) => get().items.filter(i => i.type === type),
  getByTag: (tag) => get().items.filter(i => i.tags.includes(tag))
}));
