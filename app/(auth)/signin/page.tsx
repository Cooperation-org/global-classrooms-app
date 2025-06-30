'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiService } from '@/app/services/api';
import { API_ENDPOINTS } from '@/app/utils/constants';
import { isValidEmail } from '@/app/utils/validation';
import { LoginResponse } from '@/app/types';

const LoginPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Check if user is already authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (accessToken && userData) {
      console.log('User already authenticated, redirecting to:', redirectTo);
      // User is already logged in, redirect to dashboard or intended page
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password
      });
      
      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        
        // Debug: Log the response data
        console.log('Login response:', response.data);
        
        // Store user data and tokens
        const loginData = response.data as LoginResponse;
        
        // Check if we have the required data
        if (loginData?.user && loginData?.access && loginData?.refresh) {
          localStorage.setItem('access_token', loginData.access);
          localStorage.setItem('refresh_token', loginData.refresh);
          localStorage.setItem('user_data', JSON.stringify(loginData.user));
          
          console.log('Tokens stored successfully');
          console.log('User data stored:', loginData.user);
          console.log('Redirecting to:', redirectTo);
        } else {
          console.error('Missing required data in login response:', loginData);
          setError('Login response is missing required data');
          return;
        }
        
        // Reset form
        setFormData({
          email: '',
          password: '',
        });
        
        // Use a small delay to ensure localStorage is updated, then redirect
        setTimeout(() => {
          // Use router.replace to prevent back button issues
          router.replace(redirectTo);
        }, 100);
      } else {
        // Handle error response
        console.log('Login error response:', response);
        console.log('Response success:', response.success);
        console.log('Response error:', response.error);
        console.log('Response message:', response.message);
        console.log('Response details:', response.details);
        console.log('Full response object:', JSON.stringify(response, null, 2));
        
        // Check for different error response structures
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (response.error) {
          errorMessage = response.error;
        } else if (response.message) {
          errorMessage = response.message;
        } else if (response.details?.detail) {
          errorMessage = response.details.detail;
        }
        
        console.log('Final error message:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Main Content */}
      <div className="space-y-6 pt-2">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to your account to continue earning<br />
            CS tokens
          </p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* MetaMask Wallet Button */}
          <button className="w-full p-4 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-between text-white transition-colors group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.05 12l-1.78-6.3L18.8 1.5l-7.5 5.4L3.8 1.5 2.33 5.7.55 12l1.78 6.3L4.8 22.5l7.5-5.4 7.5 5.4 1.47-4.2L22.05 12z"/>
                </svg>
              </div>
              <span className="font-semibold text-white">Connect with MetaMask</span>
            </div>
            <svg 
              className="w-5 h-5 text-orange-200 group-hover:text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Sign In with Google */}
          <button className="w-full p-4 border-2 border-gray-200 hover:border-gray-300 rounded-lg flex items-center justify-center text-gray-700 transition-colors">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-semibold">Continue with Google</span>
          </button>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Email Login Toggle */}
          <button 
            type="button"
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full p-4 border-2 border-gray-200 hover:border-gray-300 rounded-lg flex items-center justify-between text-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Sign in with Email</span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${showEmailForm ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Email Form - Expandable */}
          {showEmailForm && (
            <form onSubmit={handleLogin} className="border-2 border-gray-200 rounded-lg p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
              
              {/* Error and Success Messages */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  {success}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        {/* Don't have account link */}
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-semibold text-green-600 hover:underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
