import { mutate, useSWRConfig } from 'swr';
import { API_BASE_URL } from './types';
import { getAuthToken, getAuthHeaders, handleAuthError } from './utils';
import { createClass, CreateClassRequest, Class } from '@/app/services/api';

export const useCreateClass = () => {
  const { mutate } = useSWRConfig();

  const create = async (classData: CreateClassRequest): Promise<Class> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const newClass = await createClass(classData);
    
    // Invalidate and refetch classes list
    mutate(
      (key: string) => typeof key === 'string' && key.includes('/classes/'),
      undefined,
      { revalidate: true }
    );

    return newClass;
  };

  return { createClass: create };
};

