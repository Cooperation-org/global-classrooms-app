'use client';

import { useGlobalState } from '@/app/context/GlobalStateContext';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const ClientPathNameSync: React.FC = () => {
  const pathname = usePathname();
  const { dispatch } = useGlobalState()

  useEffect(() => {
    dispatch({ type: 'SET_IS_LANDING_PAGE', payload: pathname === '/' });
  }, [pathname, dispatch]);

  return null; // no UI
}

export default ClientPathNameSync
