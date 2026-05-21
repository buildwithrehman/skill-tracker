import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const useExposureStore = create((set, get) => ({
  entries: [],
  
  fetch: async () => {
    const { data, error } = await supabase.from('exposure_logs').select('*');
    if (!error && data) set({ entries: data });
  },

  add: async (entry) => {
    const { data, error } = await supabase.from('exposure_logs').insert([{ ...entry, created_at: new Date().toISOString() }]).select();
    if (!error && data) set(state => ({ entries: [...state.entries, data[0]] }));
  },
  
  update: async (id, updates) => {
    const { data, error } = await supabase.from('exposure_logs').update(updates).eq('id', id).select();
    if (!error && data) set(state => ({ entries: state.entries.map(e => e.id === id ? data[0] : e) }));
  },

  remove: async (id) => {
    const { error } = await supabase.from('exposure_logs').delete().eq('id', id);
    if (!error) set(state => ({ entries: state.entries.filter(e => e.id !== id) }));
  }
}));
