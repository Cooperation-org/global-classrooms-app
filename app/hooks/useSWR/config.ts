import { SWRConfiguration } from 'swr';
import type { ApiError } from './types';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 1,
  errorRetryInterval: 3000,
  shouldRetryOnError: (error) => {
    const apiError = error as ApiError;
    if (apiError?.status === 401) {
      return false;
    }
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      return false;
    }
    return true;
  },
};

