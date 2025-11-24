import useSWR, { SWRConfiguration } from 'swr';
import { API_BASE_URL } from './types';
import { fetcher } from './fetchers';
import { swrConfig } from './config';
import { isValidToken } from './utils';

/**
 * Generic hook factory for paginated list endpoints
 */
export const usePaginatedList = <T>(
  endpoint: string,
  condition: boolean = true,
  options?: SWRConfiguration
) => {
  const key = condition ? `${API_BASE_URL}${endpoint}` : null;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    ...swrConfig,
    ...options,
  });

  return {
    items: (data?.results || []) as T[],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Generic hook factory for single item endpoints
 */
export const useSingleItem = <T>(
  endpoint: string | null,
  condition: boolean = true,
  options?: SWRConfiguration
) => {
  const key = condition && endpoint ? `${API_BASE_URL}${endpoint}` : null;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    ...swrConfig,
    ...options,
  });

  return {
    data: data as T | undefined,
    isLoading,
    error,
    mutate,
  };
};

