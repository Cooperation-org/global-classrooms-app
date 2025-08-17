'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/app/types';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/app/utils/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for both access_token and user_data like the dashboard does
  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user_data');
        
        console.log('AuthContext - Checking auth:');
        console.log('Access token exists:', !!accessToken);
        console.log('User data exists:', !!userData);
        
        if (!accessToken || !userData) {
          console.log('No auth data found in AuthContext');
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Validate and parse user data
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user data in AuthContext:', parsedUser);
          
          // Check for either email (email users) or username (wallet users)
          if (!parsedUser.id || (!parsedUser.email && !parsedUser.username)) {
            throw new Error('Invalid user data in AuthContext');
          }
          
          // Convert to our User type format if needed
          const user: User = {
            id: parsedUser.id,
            email: parsedUser.email || parsedUser.username,
            name: parsedUser.full_name || parsedUser.first_name + ' ' + parsedUser.last_name || parsedUser.username,
            role: parsedUser.role || 'student',
            createdAt: new Date(parsedUser.date_joined || Date.now()),
            updatedAt: new Date(),
          };
          
          console.log('AuthContext: User data is valid, setting user');
          setUser(user);
        } catch (parseError) {
          console.error('Invalid user data in AuthContext:', parseError);
          // Clear invalid data
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store in localStorage like the real login does
      const mockLoginData = {
        id: '1',
        email,
        full_name: 'John Doe',
        role: 'student',
        date_joined: new Date().toISOString(),
      };
      
      localStorage.setItem('access_token', 'mock_access_token');
      localStorage.setItem('refresh_token', 'mock_refresh_token');
      localStorage.setItem('user_data', JSON.stringify(mockLoginData));
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear all auth data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    console.log('AuthContext: User logged out, cleared all auth data');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock registration - replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        name,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store in localStorage like the real registration does
      const mockRegData = {
        id: '1',
        email,
        full_name: name,
        role: 'student',
        date_joined: new Date().toISOString(),
      };
      
      localStorage.setItem('access_token', 'mock_access_token');
      localStorage.setItem('refresh_token', 'mock_refresh_token');
      localStorage.setItem('user_data', JSON.stringify(mockRegData));
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData, updatedAt: new Date() });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 