import { useSWRConfig } from 'swr';
import { API_BASE_URL } from './types';
import { usePaginatedList } from './factories';
import { isValidToken, getAuthToken, getAuthHeaders, handleAuthError } from './utils';

export const useStudentProfiles = (schoolId?: string, page: number = 1, limit: number = 10) => {
  const endpoint = schoolId 
    ? `/student-profiles/?school=${schoolId}&page=${page}&limit=${limit}`
    : `/student-profiles/?page=${page}&limit=${limit}`;

  const { items, totalCount, isLoading, error, mutate } = usePaginatedList(
    endpoint,
    isValidToken()
  );

  return {
    students: items,
    totalCount,
    isLoading,
    error,
    mutate,
  };
};

export const useCreateStudent = () => {
  const { mutate } = useSWRConfig();

  const createStudent = async (studentData: Record<string, unknown>) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/student-profiles/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to create student');
    }

    const newStudent = await response.json();
    
    mutate(
      (key: string) => key.includes('/student-profiles/'),
      (currentData: { results?: Array<unknown>; count?: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          results: [...(currentData.results || []), newStudent],
          count: (currentData.count || 0) + 1,
        };
      },
      false
    );

    return newStudent;
  };

  return { createStudent };
};

export const useUpdateStudent = () => {
  const { mutate } = useSWRConfig();

  const updateStudent = async (id: string, studentData: Record<string, unknown>) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/student-profiles/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to update student');
    }

    const updatedStudent = await response.json();
    
    mutate(
      (key: string) => key.includes('/student-profiles/'),
      (currentData: { results?: Array<{ id: string }> } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          results: currentData.results?.map((student: { id: string }) => 
            student.id === id ? updatedStudent : student
          ),
        };
      },
      false
    );

    return updatedStudent;
  };

  return { updateStudent };
};

export const useDeleteStudent = () => {
  const { mutate } = useSWRConfig();

  const deleteStudent = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/student-profiles/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      throw new Error('Failed to delete student');
    }
    
    mutate(
      (key: string) => key.includes('/student-profiles/'),
      (currentData: { results?: Array<{ id: string }>; count?: number } | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          results: currentData.results?.filter((student: { id: string }) => student.id !== id),
          count: (currentData.count || 1) - 1,
        };
      },
      false
    );

    return true;
  };

  return { deleteStudent };
};

export const useAddStudentToSchool = () => {
  const { mutate } = useSWRConfig();

  const addStudentToSchool = async (
    schoolId: string,
    studentData: {
      email: string;
      assigned_class: number;
      student_id?: string;
      parent_name?: string;
      parent_email?: string;
      parent_phone?: string;
    }
  ) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}/add-student-school/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to add student to school');
    }

    const result = await response.json();
    
    mutate((key: string) => key.includes('/student-profiles/'), undefined, { revalidate: true });
    mutate((key: string) => key.includes('/schools/'), undefined, { revalidate: true });

    return result;
  };

  return { addStudentToSchool };
};

