'use client';

import React, { useState } from 'react';
import { apiService } from '@/app/services/api';
import { API_ENDPOINTS } from '@/app/utils/constants';
import { isValidEmail, isValidPassword } from '@/app/utils/validation';
import { RegistrationResponse } from '@/app/types';

const SignUpPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    
    if (!formData.email || !formData.password || !formData.password_confirm) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    const passwordValidation = isValidPassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }
    
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        role: selectedRole
      });
      
      if (response.success) {
        setSuccess('Account created successfully! Welcome to Global Classrooms!');
        
        // Log the response data for debugging
        console.log('Registration successful:', response.data);
        
        // Store user data and tokens if needed
        const registrationData = response.data as RegistrationResponse;
        if (registrationData?.user && registrationData?.tokens) {
          // Store tokens in localStorage
          localStorage.setItem('access_token', registrationData.tokens.access);
          localStorage.setItem('refresh_token', registrationData.tokens.refresh);
          
          // Store user data
          localStorage.setItem('user_data', JSON.stringify(registrationData.user));
        }
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          password_confirm: '',
        });
        setSelectedRole('');
        setShowEmailForm(false);
        
        // Optionally redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Main Content */}
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create an account
          </h1>
          <p className="text-gray-600 text-sm">
            Choose how you want to sign up to earn CS tokens.<br />
            Powered by Universal Basic Income (UBI)
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select your role:</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Student Role */}
            <button 
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === 'student' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-900">Student</span>
              </div>
            </button>

            {/* Teacher Role */}
            <button 
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === 'teacher' 
                  ? 'border-yellow-500 bg-yellow-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-900">Teacher</span>
              </div>
            </button>
          </div>
        </div>

        {/* Signup Options */}
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

          {/* Sign Up with Google */}
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

          {/* Email Signup Toggle */}
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
              <span className="font-semibold text-gray-900">Sign up with Email</span>
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
            <form onSubmit={handleSubmit} className="border-2 border-gray-200 rounded-lg p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
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
                  placeholder="Create a password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
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
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Already have account link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/signin" className="font-semibold text-green-600 hover:underline">
            Log in
          </a>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;