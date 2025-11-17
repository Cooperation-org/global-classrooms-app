export interface ApiError extends Error {
  info?: unknown;
  status?: number;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

