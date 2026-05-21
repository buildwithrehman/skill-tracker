import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'sf_networkstore';

function loadState() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}

export const useNetworkStore = create((set, get) => ({
  connections: [],
  brandMetrics: loadState()?.brandMetrics || [],
  
  fetchConnections: async () => {
    const { data, error } = await supabase.from('network_contacts').select('*');
    if (!error && data) {
      const mapped = data.map(c => ({
        ...c,
        contactInfo: c.contact_info,
        lastContacted: c.last_contacted,
        createdAt: c.created_at
      }));
      set({ connections: mapped });
    }
  },
  
  addConnection: async (conn) => {
    const { data, error } = await supabase.from('network_contacts').insert([{
      name: conn.name,
      role: conn.role,
      company: conn.company,
      contact_info: conn.contactInfo || conn.contact_info,
      strength: conn.strength || 3,
      notes: conn.notes,
      last_contacted: conn.lastContacted || conn.last_contacted,
      created_at: new Date().toISOString()
    }]).select();
    if (!error && data) {
      set(state => ({ connections: [...state.connections, data[0]] }));
    }
  },
  
  updateConnection: async (id, updates) => {
    const dbUpdates = { ...updates };
    if (updates.contactInfo) dbUpdates.contact_info = updates.contactInfo;
    if (updates.lastContacted) dbUpdates.last_contacted = updates.lastContacted;
    
    const { data, error } = await supabase.from('network_contacts').update(dbUpdates).eq('id', id).select();
    if (!error && data) {
      set(state => ({ connections: state.connections.map(c => c.id === id ? data[0] : c) }));
    }
  },

  removeConnection: async (id) => {
    const { error } = await supabase.from('network_contacts').delete().eq('id', id);
    if (!error) {
      set(state => ({ connections: state.connections.filter(c => c.id !== id) }));
    }
  },

  addBrandMetric: (metric) => set(state => {
    const newState = { brandMetrics: [...state.brandMetrics, { id: crypto.randomUUID(), ...metric, date: new Date().toISOString() }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ...newState }));
    return newState;
  })
}));
