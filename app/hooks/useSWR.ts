import useSWR, { SWRConfiguration, mutate, useSWRConfig } from 'swr';

// Extend Error type for custom properties
interface ApiError extends Error {
  info?: unknown;
  status?: number;
}

// SWR Configuration
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 1, // Reduce retry count to prevent loops
  errorRetryInterval: 3000,
  // Only make requests if we have a valid token
  shouldRetryOnError: (error) => {
    const apiError = error as ApiError;
    // Don't retry on 401 errors to prevent logout loops
    if (apiError?.status === 401) {
      return false;
    }
    // Don't retry if no token is available
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      return false;
    }
    return true;
  },
};

// Token validation helper
const isValidToken = (): boolean => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
  if (!token) return false;
  
  // Basic token validation - check if it's not empty and has proper format
  return token.length > 10 && token.includes('.');
};

// Fetcher function with authentication
const fetcher = async (url: string) => {
  // Check if we have a valid token before making the request
  if (!isValidToken()) {
    console.log('SWR Fetcher: No valid token found, skipping request to:', url);
    const error = new Error('No valid authentication token available') as ApiError;
    error.status = 401;
    throw error;
  }
  
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
  console.log('SWR Fetcher: Making request to:', url);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log('SWR Fetcher: Request failed with status:', response.status, 'for URL:', url);
    const error = new Error('An error occurred while fetching the data.') as ApiError;
    try {
      error.info = await response.json();
    } catch {
      error.info = { detail: 'Failed to parse error response' };
    }
    error.status = response.status;
    
    // Only clear tokens and redirect on 401 if we're not already on auth pages
    if (response.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      console.log('SWR Fetcher: 401 error detected, current path:', currentPath);
      if (!currentPath.includes('/signin') && !currentPath.includes('/signup')) {
        console.log('SWR Fetcher: Clearing tokens and redirecting to signin');
        // Clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        sessionStorage.removeItem('auth_token');
        
        // Redirect to signin
        window.location.href = '/signin';
      } else {
        console.log('SWR Fetcher: Already on auth page, not redirecting');
      }
    }
    
    throw error;
  }

  console.log('SWR Fetcher: Request successful for:', url);
  return response.json();
};

// Public fetcher function without authentication (for public pages)
const publicFetcher = async (url: string) => {
  console.log('Public Fetcher: Making request to:', url);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Try direct request first
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Public Fetcher: Direct request failed with status:', response.status, 'for URL:', url);
      
      // If it's a CORS issue in development, try with a CORS proxy
      if (isDevelopment && response.status === 0) {
        throw new Error('CORS_ERROR');
      }
      
      const error = new Error('An error occurred while fetching the data.') as ApiError;
      try {
        error.info = await response.json();
      } catch {
        error.info = { detail: 'Failed to parse error response' };
      }
      error.status = response.status;
      throw error;
    }

    console.log('Public Fetcher: Direct request successful for:', url);
    return response.json();
  } catch (error) {
    // In development, if we have CORS issues, try with a proxy
    if (isDevelopment && (error as Error).message === 'CORS_ERROR') {
      console.log('Public Fetcher: Trying with CORS proxy for:', url);
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
            console.log('Public Fetcher: CORS proxy request successful for:', url);
            return response.json();
          }
        } catch (proxyError) {
          console.log('Public Fetcher: CORS proxy failed:', proxyError);
          continue;
        }
      }
    }
    
    console.error('Public Fetcher: All requests failed for:', url, error);
    throw error;
  }
};

// Custom hooks for different data types
export const useProjects = (page: number = 1, limit: number = 10) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate: mutateProjects } = useSWR(
    isValidToken() ? `${API_BASE_URL}/projects/?page=${page}&limit=${limit}` : null,
    fetcher,
    swrConfig
  );

  return {
    projects: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate: mutateProjects,
  };
};

// Public projects hook for landing page (no authentication required)
export const usePublicProjects = (page: number = 1, limit: number = 100) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate: mutateProjects } = useSWR(
    `${API_BASE_URL}/projects/?page=${page}&limit=${limit}`,
    publicFetcher,
    {
      ...swrConfig,
      errorRetryCount: 2, // Allow more retries for public endpoint
    }
  );

  return {
    projects: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate: mutateProjects,
  };
};

// Public schools hook for landing page (no authentication required)
export const usePublicSchools = (page: number = 1, limit: number = 100) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate: mutateSchools } = useSWR(
    `${API_BASE_URL}/schools/?page=${page}&limit=${limit}`,
    publicFetcher,
    {
      ...swrConfig,
      errorRetryCount: 2, // Allow more retries for public endpoint
    }
  );

  return {
    schools: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate: mutateSchools,
  };
};

export const useFeaturedProjects = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    isValidToken() ? `${API_BASE_URL}/projects/?featured=true&limit=6` : null,
    fetcher,
    swrConfig
  );

  return {
    projects: data?.results || [],
    isLoading,
    error,
    mutate,
  };
};

export const useCompletedProjects = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    isValidToken() ? `${API_BASE_URL}/projects/?status=completed&limit=4` : null,
    fetcher,
    swrConfig
  );

  return {
    projects: data?.results || [],
    isLoading,
    error,
    mutate,
  };
};

export const useOpenCollaborations = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    isValidToken() ? `${API_BASE_URL}/projects/?is_open_for_collaboration=true&limit=4` : null,
    fetcher,
    swrConfig
  );

  return {
    projects: data?.results || [],
    isLoading,
    error,
    mutate,
  };
};

export const useSchools = (page: number = 1, limit: number = 10) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    isValidToken() ? `${API_BASE_URL}/schools/?page=${page}&limit=${limit}` : null,
    fetcher,
    swrConfig
  );

  return {
    schools: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

export const useSchoolById = (id: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    id && isValidToken() ? `${API_BASE_URL}/schools/${id}/` : null,
    fetcher,
    swrConfig
  );

  return {
    school: data,
    isLoading,
    error,
    mutate,
  };
};

// Update school hook
export const useUpdateSchool = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const updateSchool = async (id: string, schoolData: {
    name: string;
    overview: string;
    institution_type: 'primary' | 'secondary' | 'higher_secondary' | 'university' | 'vocational' | 'special_needs';
    affiliation: 'government' | 'private' | 'aided' | 'international' | 'religious';
    registration_number: string;
    year_of_establishment: number;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone_number: string;
    email: string;
    website?: string;
    principal_name: string;
    principal_email: string;
    principal_phone: string;
    number_of_students: number;
    number_of_teachers: number;
    medium_of_instruction: 'english' | 'local' | 'bilingual' | 'multilingual';
    logo?: string;
    is_verified?: boolean;
    is_active?: boolean;
    admin?: string;
  }) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/schools/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(schoolData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Update failed' }));
        throw new Error(errorData.detail || 'Failed to update school');
      }

      const updatedSchool = await response.json();
      
      // Update the cache optimistically
      mutate(`${API_BASE_URL}/schools/${id}/`, updatedSchool, false);
      mutate(`${API_BASE_URL}/schools/`);
      
      return updatedSchool;
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  };

  return { updateSchool };
};

export const useProjectById = (id: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    id && isValidToken() ? `${API_BASE_URL}/projects/${id}/` : null,
    fetcher,
    swrConfig
  );

  return {
    project: data,
    isLoading,
    error,
    mutate,
  };
};

export const useProjectsBySchool = (schoolId: string, page: number = 1, limit: number = 10) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    schoolId && isValidToken() ? `${API_BASE_URL}/projects/?lead_school=${schoolId}&page=${page}&limit=${limit}` : null,
    fetcher,
    swrConfig
  );

  return {
    projects: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

export const useTeacherProfiles = (schoolId?: string, page: number = 1, limit: number = 10) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = schoolId 
    ? `${API_BASE_URL}/teacher-profiles/?school=${schoolId}&page=${page}&limit=${limit}`
    : `${API_BASE_URL}/teacher-profiles/?page=${page}&limit=${limit}`;

  const { data, error, isLoading, mutate } = useSWR(
    isValidToken() ? url : null,
    fetcher,
    swrConfig
  );

  return {
    teachers: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

export const useStudentProfiles = (schoolId?: string, page: number = 1, limit: number = 10) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = schoolId 
    ? `${API_BASE_URL}/student-profiles/?school=${schoolId}&page=${page}&limit=${limit}`
    : `${API_BASE_URL}/student-profiles/?page=${page}&limit=${limit}`;

  const { data, error, isLoading, mutate } = useSWR(
    isValidToken() ? url : null,
    fetcher,
    swrConfig
  );

  return {
    students: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

export const useUserProfile = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate } = useSWR(
    isValidToken() ? `${API_BASE_URL}/auth/profile/` : null,
    fetcher,
    swrConfig
  );

  return {
    profile: data,
    isLoading,
    error,
    mutate,
  };
};

export const useSubjects = (schoolId?: string, page: number = 1, limit: number = 100) => {
  const key = schoolId && isValidToken() ? `/subjects/?school=${schoolId}&page=${page}&limit=${limit}` : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async (url) => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch subjects');
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
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to create subject');
      }

      const newSubject = await response.json();
      
      // Optimistically update the subjects list
      mutate(
        (key: string) => key.includes('/subjects/'),
        (currentData: { subjects: Array<{ id: number; name: string; description: string; is_active: boolean }>; totalCount: number } | undefined) => {
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
    } catch (error) {
      console.error('Failed to create subject:', error);
      throw error;
    }
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
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to update subject');
      }

      const updatedSubject = await response.json();
      
      // Update the subjects list
      mutate(
        (key: string) => key.includes('/subjects/'),
        (currentData: { subjects: Array<{ id: number; name: string; description: string; is_active: boolean }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            subjects: currentData.subjects.map((subject: { id: number; name: string; description: string; is_active: boolean }) => 
              subject.id === id ? updatedSubject : subject
            ),
          };
        },
        false
      );

      return updatedSubject;
    } catch (error) {
      console.error('Failed to update subject:', error);
      throw error;
    }
  };

  return { updateSubject };
};

export const useDeleteSubject = () => {
  const { mutate } = useSWRConfig();

  const deleteSubject = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to delete subject');
      }
      
      // Optimistically update the subjects list
      mutate(
        (key: string) => key.includes('/subjects/'),
        (currentData: { subjects: Array<{ id: number; name: string; description: string; is_active: boolean }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            subjects: currentData.subjects.filter((subject: { id: number; name: string; description: string; is_active: boolean }) => subject.id !== id),
            totalCount: (currentData.totalCount || 0) - 1,
          };
        },
        false
      );

      return true;
    } catch (error) {
      console.error('Failed to delete subject:', error);
      throw error;
    }
  };

  return { deleteSubject };
};

export const useCreateTeacher = () => {
  const { mutate } = useSWRConfig();

  const createTeacher = async (teacherData: {
    user: string;
    school: string;
    teacher_role: string;
    assigned_subjects: number[];
    assigned_classes: number[];
    status: string;
    // Additional fields for comprehensive teacher form
    full_name?: string;
    email?: string;
    mobile_number?: string;
    gender?: string;
    date_of_joining?: string;
    send_invitation?: boolean;
  }) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher-profiles/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to create teacher');
      }

      const newTeacher = await response.json();
      
      // Optimistically update the teachers list
      mutate(
        (key: string) => key.includes('/teacher-profiles/'),
        (currentData: { teachers: Array<{ id: string; user_name: string; teacher_role: string; status: string }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            teachers: [...(currentData.teachers || []), newTeacher],
            totalCount: (currentData.totalCount || 0) + 1,
          };
        },
        false
      );

      return newTeacher;
    } catch (error) {
      console.error('Failed to create teacher:', error);
      throw error;
    }
  };

  return { createTeacher };
};

export const useUpdateTeacher = () => {
  const { mutate } = useSWRConfig();

  const updateTeacher = async (id: string, teacherData: {
    user: string;
    school: string;
    teacher_role: string;
    assigned_subjects: number[];
    assigned_classes: number[];
    status: string;
  }) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher-profiles/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to update teacher');
      }

      const updatedTeacher = await response.json();
      
      // Update the teachers list
      mutate(
        (key: string) => key.includes('/teacher-profiles/'),
        (currentData: { teachers: Array<{ id: string; user_name: string; teacher_role: string; status: string }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            teachers: currentData.teachers.map((teacher: { id: string; user_name: string; teacher_role: string; status: string }) => 
              teacher.id === id ? updatedTeacher : teacher
            ),
          };
        },
        false
      );

      return updatedTeacher;
    } catch (error) {
      console.error('Failed to update teacher:', error);
      throw error;
    }
  };

  return { updateTeacher };
};

export const useDeleteTeacher = () => {
  const { mutate } = useSWRConfig();

  const deleteTeacher = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher-profiles/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to delete teacher');
      }
      
      // Optimistically update the teachers list
      mutate(
        (key: string) => key.includes('/teacher-profiles/'),
        (currentData: { teachers: Array<{ id: string; user_name: string; teacher_role: string; status: string }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            teachers: currentData.teachers.filter((teacher: { id: string; user_name: string; teacher_role: string; status: string }) => teacher.id !== id),
            totalCount: (currentData.totalCount || 0) - 1,
          };
        },
        false
      );

      return true;
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      throw error;
    }
  };

  return { deleteTeacher };
};

export const useCreateStudent = () => {
  const { mutate } = useSWRConfig();

  const createStudent = async (studentData: {
    user: string;
    school: string;
    student_id: string;
    current_class: number;
    parent_name: string;
    parent_email: string;
    parent_phone: string;
  }) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student-profiles/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to create student');
      }

      const newStudent = await response.json();
      
      // Optimistically update the students list
      mutate(
        (key: string) => key.includes('/student-profiles/'),
        (currentData: { students: Array<{ id: string; user_name: string; student_id: string; current_class: number }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            students: [...(currentData.students || []), newStudent],
            totalCount: (currentData.totalCount || 0) + 1,
          };
        },
        false
      );

      return newStudent;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  };

  return { createStudent };
};

export const useUpdateStudent = () => {
  const { mutate } = useSWRConfig();

  const updateStudent = async (id: string, studentData: {
    user: string;
    school: string;
    student_id: string;
    current_class: number;
    parent_name: string;
    parent_email: string;
    parent_phone: string;
  }) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student-profiles/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to update student');
      }

      const updatedStudent = await response.json();
      
      // Update the students list
      mutate(
        (key: string) => key.includes('/student-profiles/'),
        (currentData: { students: Array<{ id: string; user_name: string; student_id: string; current_class: number }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            students: currentData.students.map((student: { id: string; user_name: string; student_id: string; current_class: number }) => 
              student.id === id ? updatedStudent : student
            ),
          };
        },
        false
      );

      return updatedStudent;
    } catch (error) {
      console.error('Failed to update student:', error);
      throw error;
    }
  };

  return { updateStudent };
};

export const useDeleteStudent = () => {
  const { mutate } = useSWRConfig();

  const deleteStudent = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student-profiles/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to delete student');
      }
      
      // Optimistically update the students list
      mutate(
        (key: string) => key.includes('/student-profiles/'),
        (currentData: { students: Array<{ id: string; user_name: string; student_id: string; current_class: number }>; totalCount: number } | undefined) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            students: currentData.students.filter((student: { id: string; user_name: string; student_id: string; current_class: number }) => student.id !== id),
            totalCount: (currentData.totalCount || 0) - 1,
          };
        },
        false
      );

      return true;
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error;
    }
  };

  return { deleteStudent };
};

// Utility function to revalidate all data
export const revalidateAll = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  mutate(`${API_BASE_URL}/projects/`);
  mutate(`${API_BASE_URL}/schools/`);
  mutate(`${API_BASE_URL}/teacher-profiles/`);
  mutate(`${API_BASE_URL}/student-profiles/`);
};

// Optimistic update helpers
export const optimisticUpdate = async (
  key: string,
  updater: (data: unknown) => unknown,
  fetcher: () => Promise<unknown>
) => {
  // Optimistically update the cache
  mutate(key, updater, false);
  
  try {
    // Fetch fresh data
    const newData = await fetcher();
    // Update with fresh data
    mutate(key, newData, false);
  } catch (error) {
    // Revert on error
    mutate(key);
    throw error;
  }
}; 