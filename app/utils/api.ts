const BASE_URL = 'https://web-production-7209.up.railway.app/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'API request failed');
  }
  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T, B = unknown>(endpoint: string, body?: B) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}; 