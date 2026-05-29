import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSkillStore } from './useSkillStore';
import { supabase } from '../lib/supabaseClient';

// Mock supabase client
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn().mockReturnThis()
  }
}));

describe('useSkillStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSkillStore.setState({ items: [] });
    vi.clearAllMocks();
  });

  it('has default empty items array', () => {
    const state = useSkillStore.getState();
    expect(state.items).toEqual([]);
  });

  it('fetches skills successfully', async () => {
    const mockData = [{ id: '1', name: 'React', level: 5 }];
    supabase.select.mockResolvedValueOnce({ data: mockData, error: null });

    await useSkillStore.getState().fetch();
    
    expect(supabase.from).toHaveBeenCalledWith('skills');
    expect(useSkillStore.getState().items).toEqual(mockData);
  });

  it('does not update state on fetch error', async () => {
    supabase.select.mockResolvedValueOnce({ data: null, error: new Error('Failed to fetch') });

    await useSkillStore.getState().fetch();
    
    expect(useSkillStore.getState().items).toEqual([]); // Remains empty
  });
});
