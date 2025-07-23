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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        
        // Check for either email (email users) or username (wallet users)
        if (!user.id || (!user.email && !user.username)) {
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
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100 flex items-center h-14 px-4">
        <button
          className="mr-3 text-gray-700 hover:text-green-700 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close sidebar menu' : 'Open sidebar menu'}
        >
          {sidebarOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        <span className="font-bold text-lg text-green-800">Global Classrooms</span>
      </div>
      {/* Sidebar (responsive) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
} 