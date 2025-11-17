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
      student_email: string;
      assigned_class: string;
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

    // Ensure we're sending the exact format
    const payload = {
      student_email: studentData.student_email,
      assigned_class: studentData.assigned_class,
      ...(studentData.student_id && { student_id: studentData.student_id }),
      ...(studentData.parent_name && { parent_name: studentData.parent_name }),
      ...(studentData.parent_email && { parent_email: studentData.parent_email }),
      ...(studentData.parent_phone && { parent_phone: studentData.parent_phone }),
    };
    
    const jsonBody = JSON.stringify(payload);
    
    // Log the EXACT payload being sent
    console.log('EXACT PAYLOAD BEING SENT (hook):', {
      url: `${API_BASE_URL}/schools/${schoolId}/add-student-school/`,
      payload: jsonBody,
      parsed: JSON.parse(jsonBody),
      contentType: 'application/json'
    });
    
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}/add-student-school/`, {
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
        const hasClassError = errorData.details.assigned_class &&
          Array.isArray(errorData.details.assigned_class) &&
          errorData.details.assigned_class.some((msg: unknown) =>
            String(msg).includes('Invalid pk') && String(msg).includes('does not exist')
          );

        if (hasUserError || hasClassError) {
          const parts = [];
          if (hasUserError) {
            parts.push('Backend expects "user" (UUID) but received "student_email".');
          }
          if (hasClassError) {
            parts.push('Backend expects numeric class ID but received string identifier.');
          }
          parts.push('Please update the backend serializer to accept the new format.');
          throw new Error(parts.join(' '));
        }
      }
      
      throw new Error(errorData.detail || errorData.message || 'Failed to add student to school');
    }

    const result = await response.json();
    
    mutate((key: string) => key.includes('/student-profiles/'), undefined, { revalidate: true });
    mutate((key: string) => key.includes('/schools/'), undefined, { revalidate: true });

    return result;
  };

  return { addStudentToSchool };
};

