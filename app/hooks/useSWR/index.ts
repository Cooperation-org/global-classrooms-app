import { mutate } from 'swr';
import { API_BASE_URL } from './types';
import useSWR from 'swr';
import { swrConfig } from './config';
import { publicFetcher } from './fetchers';

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

