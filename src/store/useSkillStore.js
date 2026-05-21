import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const useSkillStore = create((set, get) => ({
  items: [],
  
  fetch: async () => {
    const { data, error } = await supabase.from('skills').select('*');
    if (!error && data) set({ items: data });
  },

  add: async (skill) => {
    const { data, error } = await supabase.from('skills').insert([{ ...skill, created_at: new Date().toISOString() }]).select();
    if (!error && data) set(state => ({ items: [...state.items, data[0]] }));
  },
  
  update: async (id, updates) => {
    const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select();
    if (!error && data) set(state => ({ items: state.items.map(s => s.id === id ? data[0] : s) }));
  },

  remove: async (id) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) set(state => ({ items: state.items.filter(s => s.id !== id) }));
  }
}));
