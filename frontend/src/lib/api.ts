const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SimilarityResponse {
  score: number;
  passes_threshold: boolean;
  threshold: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  context_loaded: boolean;
}

export interface ContextResponse {
  context_set: boolean;
  message: string;
  context: string | null;
  length?: number;
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Failed to fetch health status');
    return res.json();
  },

  async setContext(contextText: string): Promise<{ message: string; context_set: boolean; context_preview: string }> {
    const res = await fetch(`${API_BASE_URL}/set-context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context_text: contextText }),
    });
    if (!res.ok) throw new Error('Failed to set context');
    return res.json();
  },

  async getContext(): Promise<ContextResponse> {
    const res = await fetch(`${API_BASE_URL}/get-context`);
    if (!res.ok) throw new Error('Failed to get context');
    return res.json();
  },

  async resetContext(): Promise<{ message: string; context_set: boolean }> {
    const res = await fetch(`${API_BASE_URL}/reset-context`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset context');
    return res.json();
  },

  async checkLlmInput(llmInput: string, threshold = 0.4): Promise<SimilarityResponse> {
    const res = await fetch(`${API_BASE_URL}/check-llm-input`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ llm_input: llmInput, threshold }),
    });
    if (!res.ok) throw new Error('Failed to check LLM input');
    return res.json();
  },

  async calculateSimilarity(contextText: string, userText: string, threshold = 0.4): Promise<SimilarityResponse> {
    const res = await fetch(`${API_BASE_URL}/similarity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context_text: contextText, user_text: userText, threshold }),
    });
    if (!res.ok) throw new Error('Failed to calculate similarity');
    return res.json();
  },
};
