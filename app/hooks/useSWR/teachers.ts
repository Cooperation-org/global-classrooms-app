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
    '/teacher-profiles/me/',
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

export const useAddTeacherToSchool = () => {
  const { mutate } = useSWRConfig();

  const addTeacherToSchool = async (
    schoolId: string,
    teacherData: {
      teacher_email: string;
      teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
      assigned_classes: string[];
    }
  ) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // Ensure we're sending the exact format
    const payload = {
      teacher_email: teacherData.teacher_email,
      teacher_role: teacherData.teacher_role,
      assigned_classes: teacherData.assigned_classes,
    };
    
    const jsonBody = JSON.stringify(payload);
    
    // Log the EXACT payload being sent
    console.log('EXACT PAYLOAD BEING SENT (hook):', {
      url: `${API_BASE_URL}/schools/${schoolId}/add-teacher-school/`,
      payload: jsonBody,
      parsed: JSON.parse(jsonBody),
      contentType: 'application/json'
    });
    
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}/add-teacher-school/`, {
      method: 'POST',
      headers,
      body: jsonBody,
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      const errorData = await response.json();
      
      // Provide better error messages for serializer mismatches
      if (response.status === 400 && errorData.details) {
        const hasUserError = errorData.details.user && 
          Array.isArray(errorData.details.user) && 
          errorData.details.user.some((msg: unknown) => 
            String(msg).includes('Invalid pk') && String(msg).includes('does not exist')
          );
        const hasClassError = errorData.details.assigned_classes &&
          Array.isArray(errorData.details.assigned_classes) &&
          errorData.details.assigned_classes.some((msg: unknown) =>
            String(msg).includes('Invalid pk') && String(msg).includes('does not exist')
          );

        if (hasUserError || hasClassError) {
          const parts = [];
          if (hasUserError) {
            parts.push('Backend expects "user" (UUID) but received "teacher_email".');
          }
          if (hasClassError) {
            parts.push('Backend expects numeric class IDs but received string identifiers.');
          }
          parts.push('Please update the backend serializer to accept the new format.');
          throw new Error(parts.join(' '));
        }
      }
      
      throw new Error(errorData.detail || errorData.message || 'Failed to add teacher to school');
    }

    const result = await response.json();
    
    mutate((key: string) => key.includes('/teacher-profiles/'), undefined, { revalidate: true });
    mutate((key: string) => key.includes('/schools/'), undefined, { revalidate: true });

    return result;
  };

  return { addTeacherToSchool };
};

