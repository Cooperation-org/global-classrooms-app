import { ApiResponse } from '@/app/types';

export interface Project {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string;
  cover_image: string;
  environmental_themes: Record<string, string>;
  start_date: string;
  end_date: string;
  is_open_for_collaboration: boolean;
  offer_rewards: boolean;
  recognition_type: string;
  award_criteria: string;
  lead_school: string;
  lead_school_name: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_role: string;
  contact_country: string;
  contact_city: string;
  media_files: Record<string, string>;
  status: 'draft' | 'published' | 'completed';
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  participating_schools_count: string;
  total_impact: string;
}

export interface ProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchProjects(page: number = 1, limit: number = 10): Promise<ProjectsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/?page=${page}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/?featured=true&limit=6`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }
}

export async function fetchCompletedProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/?status=completed&limit=4`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching completed projects:', error);
    throw error;
  }
}

export async function fetchOpenCollaborations(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/?is_open_for_collaboration=true&limit=4`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching open collaborations:', error);
    throw error;
  }
}

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