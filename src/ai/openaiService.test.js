import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCompletion } from './openaiService';

// Mock the global fetch
global.fetch = vi.fn();

describe('openaiService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should throw an error if API key is missing', async () => {
    // Clear the env var if it exists for this test
    const originalEnv = import.meta.env.VITE_OPENAI_API_KEY;
    import.meta.env.VITE_OPENAI_API_KEY = '';
    
    await expect(generateCompletion('Hello', '')).rejects.toThrow('OpenAI API key is missing');
    
    // Restore env var
    import.meta.env.VITE_OPENAI_API_KEY = originalEnv;
  });

  it('should return completion data on success', async () => {
    const originalEnv = import.meta.env.VITE_OPENAI_API_KEY;
    import.meta.env.VITE_OPENAI_API_KEY = '';

    const mockResponse = {
      choices: [{ message: { content: 'Mocked response' } }]
    };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateCompletion('Hello', 'fake-key');
    expect(result).toBe('Mocked response');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[0]).toBe('/api/openai/v1/chat/completions');
    expect(callArgs[1].headers.Authorization).toBe('Bearer fake-key');

    import.meta.env.VITE_OPENAI_API_KEY = originalEnv;
  });

  it('should throw an error if the API request fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Bad Request' } }),
    });

    await expect(generateCompletion('Hello', 'fake-key')).rejects.toThrow('Bad Request');
  });
});
