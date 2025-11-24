import { API_BASE_URL } from './types';

/**
 * Get authentication token from storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
};

/**
 * Token validation helper
 */
export const isValidToken = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  return token.length > 10 && token.includes('.');
};

/**
 * Get authentication headers
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Handle authentication errors and redirect
 */
export const handleAuthError = (): void => {
  if (typeof window === 'undefined') return;
  
  const currentPath = window.location.pathname;
  if (!currentPath.includes('/signin') && !currentPath.includes('/signup')) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    window.location.href = '/signin';
  }
};

