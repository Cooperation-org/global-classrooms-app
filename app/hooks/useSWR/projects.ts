import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import type { ProjectsResponse, Project } from '@/app/services/api';
import { API_BASE_URL } from './types';
import { swrConfig } from './config';
import { fetcher, publicFetcher } from './fetchers';
import { usePaginatedList, useSingleItem } from './factories';
import { isValidToken, getAuthToken, getAuthHeaders, handleAuthError } from './utils';

export const useProjects = (page: number = 1, limit: number = 10) => {
  const { items, totalCount, isLoading, error, mutate } = usePaginatedList(
    `/projects/?page=${page}&limit=${limit}`,
    isValidToken()
  );

  return {
    projects: items,
    totalCount,
    isLoading,
    error,
    mutate,
  };
};

export const useProjectById = (id: string): {
  project: Project | undefined;
  isLoading: boolean;
  error: unknown;
  mutate: () => void;
} => {
  const { data, isLoading, error, mutate } = useSingleItem<Project>(
    id ? `/projects/${id}/` : null,
    isValidToken()
  );

  return {
    project: data,
    isLoading,
    error,
    mutate,
  };
};

export const useProjectsBySchool = (schoolId: string, page: number = 1, limit: number = 10) => {
  const { items, totalCount, isLoading, error, mutate } = usePaginatedList(
    `/projects/?lead_school=${schoolId}&page=${page}&limit=${limit}`,
    !!schoolId && isValidToken()
  );

  return {
    projects: items,
    totalCount,
    isLoading,
    error,
    mutate,
  };
};

export const useFeaturedProjects = () => {
  const { items, isLoading, error, mutate } = usePaginatedList(
    '/projects/?featured=true&limit=6',
    isValidToken()
  );

  return {
    projects: items,
    isLoading,
    error,
    mutate,
  };
};

export const useCompletedProjects = () => {
  const { items, isLoading, error, mutate } = usePaginatedList(
    '/projects/?status=completed&limit=4',
    isValidToken()
  );

  return {
    projects: items,
    isLoading,
    error,
    mutate,
  };
};

export const useOpenCollaborations = () => {
  const { items, isLoading, error, mutate } = usePaginatedList(
    '/projects/?is_open_for_collaboration=true&limit=4',
    isValidToken()
  );

  return {
    projects: items,
    isLoading,
    error,
    mutate,
  };
};

export const usePublicProjects = (page: number = 1, limit: number = 100) => {
  const key = `${API_BASE_URL}/projects/?page=${page}&limit=${limit}`;
  const { data, error, isLoading, mutate } = useSWR(key, publicFetcher, {
    ...swrConfig,
    errorRetryCount: 2,
  });

  return {
    projects: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

export const useDeleteProject = () => {
  const { mutate } = useSWRConfig();

  const deleteProject = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }

      const errorData = await response.json().catch(() => ({ detail: 'Failed to delete project' }));
      throw new Error(errorData.detail || 'Failed to delete project');
    }

    mutate(
      (key: string) => key.includes('/projects/?'),
      (currentData: ProjectsResponse | undefined) => {
        if (!currentData) return currentData;

        const results = currentData.results || [];
        const projectWasPresent = results.some((project) => project.id === id);
        const filteredResults = results.filter((project) => project.id !== id);

        return {
          ...currentData,
          results: filteredResults,
          count: projectWasPresent
            ? Math.max((currentData.count || 1) - 1, 0)
            : currentData.count,
        };
      },
      false
    );

    mutate(`${API_BASE_URL}/projects/${id}/`, null, false);
    return true;
  };

  return { deleteProject };
};

