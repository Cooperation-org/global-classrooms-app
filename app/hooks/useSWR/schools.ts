import { useSWRConfig } from 'swr';
import { API_BASE_URL } from './types';
import { usePaginatedList, useSingleItem } from './factories';
import { isValidToken, getAuthToken, getAuthHeaders, handleAuthError } from './utils';

export const useSchools = (page: number = 1, limit: number = 10) => {
  const { items, totalCount, isLoading, error, mutate } = usePaginatedList(
    `/schools/?page=${page}&limit=${limit}`,
    isValidToken()
  );

  return {
    schools: items,
    totalCount,
    isLoading,
    error,
    mutate,
  };
};

export const useSchoolById = (id: string) => {
  const { data, isLoading, error, mutate } = useSingleItem(
    id ? `/schools/${id}/` : null,
    isValidToken()
  );

  return {
    school: data,
    isLoading,
    error,
    mutate,
  };
};

export const useUpdateSchool = () => {
  const { mutate } = useSWRConfig();
  
  const updateSchool = async (
    id: string,
    schoolData: Record<string, unknown>
  ) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/schools/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(schoolData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error('Authentication required');
      }
      
      const errorData = await response.json().catch(() => ({ detail: 'Update failed' }));
      throw new Error(errorData.detail || 'Failed to update school');
    }

    const updatedSchool = await response.json();
    
    mutate(`${API_BASE_URL}/schools/${id}/`, updatedSchool, false);
    mutate(`${API_BASE_URL}/schools/`);
    
    return updatedSchool;
  };

  return { updateSchool };
};


