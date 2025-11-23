import { mutate } from 'swr';
import { API_BASE_URL } from './types';
import useSWR from 'swr';
import { swrConfig } from './config';
import { publicFetcher, fetcher } from './fetchers';
import { isValidToken, getAuthHeaders, handleAuthError } from './utils';

// Re-export utilities
export { swrConfig } from './config';
export { getAuthToken, isValidToken, getAuthHeaders, handleAuthError } from './utils';
export { fetcher, publicFetcher } from './fetchers';
export { usePaginatedList, useSingleItem } from './factories';

// Project hooks
export {
  useProjects,
  useProjectById,
  useProjectsBySchool,
  useFeaturedProjects,
  useCompletedProjects,
  useOpenCollaborations,
  usePublicProjects,
  useDeleteProject,
} from './projects';

// School hooks
export {
  useSchools,
  useSchoolById,
  useUpdateSchool,
} from './schools';

// Teacher hooks
export {
  useTeacherProfiles,
  useCurrentTeacherProfile,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  useAddTeacherToSchool,
} from './teachers';

// Student hooks
export {
  useStudentProfiles,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useAddStudentToSchool,
} from './students';

// Subject hooks
export {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from './subjects';

// Class hooks
export { useCreateClass } from './classes';

// User profile hooks
export { useUserProfile } from './user';

// Utility functions
export const revalidateAll = () => {
  mutate(`${API_BASE_URL}/projects/`);
  mutate(`${API_BASE_URL}/schools/`);
  mutate(`${API_BASE_URL}/teacher-profiles/`);
  mutate(`${API_BASE_URL}/student-profiles/`);
};

export const optimisticUpdate = async (
  key: string,
  updater: (data: unknown) => unknown,
  fetcher: () => Promise<unknown>
) => {
  mutate(key, updater, false);
  
  try {
    const newData = await fetcher();
    mutate(key, newData, false);
  } catch (error) {
    mutate(key);
    throw error;
  }
};

// Public schools hook
export const usePublicSchools = (page: number = 1, limit: number = 100) => {
  const key = `${API_BASE_URL}/schools/?page=${page}&limit=${limit}`;
  const { data, error, isLoading, mutate } = useSWR(key, publicFetcher, {
    ...swrConfig,
    errorRetryCount: 2,
  });

  return {
    schools: data?.results || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
};

// Public class choices hook
interface ClassChoice {
  value: string;
  label: string;
}

export const usePublicClassChoices = () => {
  const { data, error, isLoading } = useSWR<ClassChoice[]>(
    `${API_BASE_URL}/classes/class-choices/`,
    publicFetcher,
    {
      ...swrConfig,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
  return {
    choices: data || [],
    isLoading,
    error,
  };
};

// Classes hook - fetches actual class objects with UUIDs
interface Class {
  id: string; // UUID
  name: string;
  school: string; // UUID
  school_name: string;
  description: string;
}

interface ClassesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Class[];
}

export const useClasses = (schoolId?: string, search?: string, page: number = 1) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (schoolId) {
    params.append('school', schoolId);
  }
  if (search) {
    params.append('search', search);
  }
  
  const endpoint = `/classes/?${params.toString()}`;
  const key = isValidToken() ? `${API_BASE_URL}${endpoint}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<ClassesResponse>(
    key,
    async (url) => {
      console.log('Fetching classes from:', url);
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch classes:', response.status, errorText);
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Authentication required');
        }
        throw new Error(`Failed to fetch classes: ${response.status}`);
      }

      const result = await response.json();
      console.log('Classes response:', result);
      return result;
    },
    {
      ...swrConfig,
      revalidateOnFocus: false,
    }
  );

  // Convert id to string if it's a number (API might return number but we need string UUID)
  const classes = (data?.results || []).map(cls => ({
    ...cls,
    id: String(cls.id), // Ensure id is always a string
  }));

  console.log('Processed classes:', classes);

  return {
    classes,
    totalCount: data?.count || 0,
    next: data?.next,
    previous: data?.previous,
    isLoading,
    error,
    mutate,
  };
};

