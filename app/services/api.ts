import { ApiResponse } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // If the response is not ok (4xx, 5xx), handle it as an error response
      if (!response.ok) {
        // Return the error response as-is, but mark it as unsuccessful
        return {
          success: false,
          error: data.details?.detail || data.message || data.error || 'An error occurred',
          message: data.message,
          details: data.details,
          status_code: data.status_code,
          timestamp: data.timestamp
        };
      }

      // Handle different response formats
      // If the response has a 'success' field, use it as is
      if (data.hasOwnProperty('success')) {
        return data;
      }
      
      // If the response doesn't have a 'success' field but has data, wrap it
      return {
        success: true,
        data: data,
        message: data.message || 'Request successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiService = new ApiService(); 