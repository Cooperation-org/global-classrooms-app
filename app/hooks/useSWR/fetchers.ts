import type { ApiError } from './types';
import { isValidToken, getAuthHeaders, handleAuthError } from './utils';

/**
 * Create an error object from a failed response
 */
const createApiError = async (response: Response, defaultMessage: string): Promise<ApiError> => {
  const error = new Error(defaultMessage) as ApiError;
  try {
    error.info = await response.json();
  } catch {
    error.info = { detail: 'Failed to parse error response' };
  }
  error.status = response.status;
  return error;
};

/**
 * Fetcher function with authentication
 */
export const fetcher = async (url: string) => {
  if (!isValidToken()) {
    const error = new Error('No valid authentication token available') as ApiError;
    error.status = 401;
    throw error;
  }
  
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await createApiError(response, 'An error occurred while fetching the data.');
    if (response.status === 401) {
      handleAuthError();
    }
    throw error;
  }

  return response.json();
};

/**
 * Public fetcher function without authentication (for public pages)
 */
export const publicFetcher = async (url: string) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (isDevelopment && response.status === 0) {
        throw new Error('CORS_ERROR');
      }
      throw await createApiError(response, 'An error occurred while fetching the data.');
    }

    return response.json();
  } catch (error) {
    if (isDevelopment && (error as Error).message === 'CORS_ERROR') {
      const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
      ];
      
      for (const proxy of corsProxies) {
        try {
          const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
          const response = await fetch(proxyUrl, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            return response.json();
          }
        } catch {
          continue;
        }
      }
    }
    
    throw error;
  }
};

