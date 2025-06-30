'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      console.log('Dashboard Layout - Checking auth:');
      console.log('Access token exists:', !!accessToken);
      console.log('User data exists:', !!userData);
      
      if (!accessToken || !userData) {
        console.log('No auth data found, redirecting to signin');
        // Not authenticated, redirect to login
        router.push('/signin');
        return;
      }
      
      // Validate token (you can add more validation here)
      try {
        const user = JSON.parse(userData);
        console.log('Parsed user data:', user);
        
        if (!user.id || !user.email) {
          throw new Error('Invalid user data');
        }
        console.log('User data is valid, setting authenticated');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid user data:', error);
        // Clear invalid data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        router.push('/signin');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
} 