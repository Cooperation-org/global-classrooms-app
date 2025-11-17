import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { API_BASE_URL } from './types';
import { swrConfig } from './config';
import { getAuthHeaders, handleAuthError, getAuthToken, isValidToken } from './utils';

const createApiError = async (response: Response, defaultMessage: string) => {
  const error = new Error(defaultMessage) as { info?: unknown; status?: number };
  try {
    error.info = await response.json();
  } catch {
    error.info = { detail: 'Failed to parse error response' };
  }
  error.status = response.status;
  return error;
};

export const useSubjects = (schoolId?: string, page: number = 1, limit: number = 100) => {
  const endpoint = schoolId 
    ? `/subjects/?school=${schoolId}&page=${page}&limit=${limit}`
    : `/subjects/?page=${page}&limit=${limit}`;
  
  const key = isValidToken() ? `${API_BASE_URL}${endpoint}` : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async (url) => {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Authentication required');
        }
        throw await createApiError(response, 'Failed to fetch subjects');
      }

      const result = await response.json();
      return {
        subjects: result.results || [],
        totalCount: result.count || 0,
        next: result.next,
        previous: result.previous,
      };
    },
    {
      ...swrConfig,
      revalidateOnFocus: false,
    }
  );

  return {
    subjects: data?.subjects || [],
    totalCount: data?.totalCount || 0,
    next: data?.next,
    previous: data?.previous,
    isLoading,
    error,
    mutate,
  };
};

export const useCreateSubject = () => {
  const { mutate } = useSWRConfig();

  const createSubject = async (subjectData: {
    name: string;
    description: string;
    is_active: boolean;
    school: string;
  }) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/subjects/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to create subject');
    }

    const newSubject = await response.json();
    
    mutate(
      (key: string) => key.includes('/subjects/'),
      (currentData: { subjects: Array<{ id: number }>; totalCount: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          subjects: [...(currentData.subjects || []), newSubject],
          totalCount: (currentData.totalCount || 0) + 1,
        };
      },
      false
    );

    return newSubject;
  };

  return { createSubject };
};

export const useUpdateSubject = () => {
  const { mutate } = useSWRConfig();

  const updateSubject = async (id: number, subjectData: {
    name: string;
    description: string;
    is_active: boolean;
  }) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/subjects/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to update subject');
    }

    const updatedSubject = await response.json();
    
    mutate(
      (key: string) => key.includes('/subjects/'),
      (currentData: { subjects: Array<{ id: number }>; totalCount: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          subjects: currentData.subjects.map((subject: { id: number }) => 
            subject.id === id ? updatedSubject : subject
          ),
        };
      },
      false
    );

    return updatedSubject;
  };

  return { updateSubject };
};

export const useDeleteSubject = () => {
  const { mutate } = useSWRConfig();

  const deleteSubject = async (id: number) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/subjects/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to delete subject');
    }
    
    mutate(
      (key: string) => key.includes('/subjects/'),
      (currentData: { subjects: Array<{ id: number }>; totalCount: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          subjects: currentData.subjects.filter((subject: { id: number }) => subject.id !== id),
          totalCount: (currentData.totalCount || 0) - 1,
        };
      },
      false
    );

    return true;
  };

  return { deleteSubject };
};

