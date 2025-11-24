import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { API_BASE_URL } from './types';
import { swrConfig } from './config';
import { publicFetcher } from './fetchers';
import { usePaginatedList, useSingleItem } from './factories';
import { isValidToken, getAuthToken, getAuthHeaders, handleAuthError } from './utils';

export const useTeacherProfiles = (schoolId?: string, page: number = 1, limit: number = 10) => {
  const endpoint = schoolId 
    ? `/teacher-profiles/?school=${schoolId}&page=${page}&limit=${limit}`
    : `/teacher-profiles/?page=${page}&limit=${limit}`;

  const { items, totalCount, isLoading, error, mutate } = usePaginatedList(
    endpoint,
    isValidToken()
  );

  return {
    teachers: items,
    totalCount,
    isLoading,
    error,
    mutate,
  };
};

export const useCurrentTeacherProfile = () => {
  const { data, isLoading, error, mutate } = useSingleItem<{
    teacher_role?: 'class_teacher' | 'subject_teacher' | 'admin';
    school?: string;
    school_name?: string;
  }>(
    '/teacher-profiles/me',
    isValidToken(),
    {
      ...swrConfig,
      revalidateOnFocus: false,
      onError: async () => null,
    }
  );

  return {
    teacherProfile: data,
    isSchoolAdmin: data?.teacher_role === 'admin',
    school: data?.school,
    schoolName: data?.school_name,
    isLoading,
    error,
    mutate,
  };
};

export const useCreateTeacher = () => {
  const { mutate } = useSWRConfig();

  const createTeacher = async (teacherData: Record<string, unknown>) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/teacher-profiles/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(teacherData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to create teacher');
    }

    const newTeacher = await response.json();
    
    mutate(
      (key: string) => key.includes('/teacher-profiles/'),
      (currentData: { results?: Array<unknown>; count?: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          results: [...(currentData.results || []), newTeacher],
          count: (currentData.count || 0) + 1,
        };
      },
      false
    );

    return newTeacher;
  };

  return { createTeacher };
};

export const useUpdateTeacher = () => {
  const { mutate } = useSWRConfig();

  const updateTeacher = async (id: string, teacherData: Record<string, unknown>) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/teacher-profiles/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(teacherData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to update teacher');
    }

    const updatedTeacher = await response.json();
    
    mutate(
      (key: string) => key.includes('/teacher-profiles/'),
      (currentData: { results?: Array<{ id: string }> } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          results: currentData.results?.map((teacher: { id: string }) => 
            teacher.id === id ? updatedTeacher : teacher
          ),
        };
      },
      false
    );

    return updatedTeacher;
  };

  return { updateTeacher };
};

export const useDeleteTeacher = () => {
  const { mutate } = useSWRConfig();

  const deleteTeacher = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/teacher-profiles/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to delete teacher');
    }
    
    mutate(
      (key: string) => key.includes('/teacher-profiles/'),
      (currentData: { results?: Array<{ id: string }>; count?: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          results: currentData.results?.filter((teacher: { id: string }) => teacher.id !== id),
          count: (currentData.count || 1) - 1,
        };
      },
      false
    );

    return true;
  };

  return { deleteTeacher };
};

export const useAddTeacherToSchool = (schoolId?: string) => {
  const { mutate } = useSWRConfig();

  const addTeacherToSchool = async (userData: {
    full_name: string;
    teacher_email: string;
    wallet_id: string;
    gender?: string;
    assigned_classes: string[];
    is_active: boolean;
  }) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    if (!schoolId) {
      throw new Error('School ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}/add-teacher-school/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      const errorData = await response.json().catch(() => ({ detail: 'Failed to add teacher to school' }));
      throw new Error(errorData.detail || errorData.message || 'Failed to add teacher to school.');
    }

    const addedTeacher = await response.json();
    
    // Optimistically update the teachers list
    mutate(
      (key: string) => key.includes('/teacher-profiles/'),
      (currentData: { results?: Array<unknown>; count?: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          results: [...(currentData.results || []), addedTeacher],
          count: (currentData.count || 0) + 1,
        };
      },
      false
    );

    return addedTeacher;
  };

  return { addTeacherToSchool };
};

