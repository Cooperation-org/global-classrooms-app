import { useSingleItem } from './factories';
import { isValidToken } from './utils';

export const useUserProfile = () => {
  const { data, isLoading, error, mutate } = useSingleItem(
    '/auth/profile/',
    isValidToken()
  );

  return {
    profile: data,
    isLoading,
    error,
    mutate,
  };
};

