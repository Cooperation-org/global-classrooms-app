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

export interface CreateProjectRequest {
  title: string;
  short_description: string;
  detailed_description: string;
  cover_image?: File | string;
  environmental_themes: Record<string, string>;
  start_date: string;
  end_date: string;
  is_open_for_collaboration: boolean;
  offer_rewards: boolean;
  recognition_type: string;
  award_criteria: string;
  lead_school: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_role: string;
  contact_country: string;
  contact_city: string;
  goals: string[];
}

export interface School {
  id: string;
  name: string;
  overview: string;
  institution_type: 'primary' | 'secondary' | 'higher_secondary' | 'college' | 'university';
  affiliation: 'government' | 'private' | 'semi_government' | 'international';
  registration_number: string;
  year_of_establishment: number;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  email: string;
  website: string;
  principal_name: string;
  principal_email: string;
  principal_phone: string;
  number_of_students: number;
  number_of_teachers: number;
  medium_of_instruction: 'english' | 'hindi' | 'french' | 'spanish' | 'german' | 'other';
  logo: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolRequest {
  name: string;
  overview: string;
  institution_type: 'primary' | 'secondary' | 'higher_secondary' | 'college' | 'university';
  affiliation: 'government' | 'private' | 'semi_government' | 'international';
  registration_number: string;
  year_of_establishment: number;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  email: string;
  website: string;
  principal_name: string;
  principal_email: string;
  principal_phone: string;
  number_of_students: number;
  number_of_teachers: number;
  medium_of_instruction: 'english' | 'hindi' | 'french' | 'spanish' | 'german' | 'other';
  logo?: File | string;
}

export interface SchoolsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: School[];
}

export interface SchoolDetails extends School {
  is_verified: boolean;
  is_active: boolean;
  admin: string;
  admin_name: string;
  member_count: string;
  project_count: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

const handleAuthError = (error: { status_code?: number; detail?: string }) => {
  if (error.status_code === 401) {
    // Clear invalid tokens
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  throw error;
};

export async function fetchProjects(page: number = 1, limit: number = 10): Promise<ProjectsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
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
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
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
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
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
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching open collaborations:', error);
    throw error;
  }
}

export async function createProject(projectData: CreateProjectRequest): Promise<Project> {
  try {
    const formData = new FormData();
    
    // Add all text fields
    formData.append('title', projectData.title);
    formData.append('short_description', projectData.short_description);
    formData.append('detailed_description', projectData.detailed_description);
    formData.append('start_date', projectData.start_date);
    formData.append('end_date', projectData.end_date);
    formData.append('is_open_for_collaboration', projectData.is_open_for_collaboration.toString());
    formData.append('offer_rewards', projectData.offer_rewards.toString());
    formData.append('recognition_type', projectData.recognition_type);
    formData.append('award_criteria', projectData.award_criteria);
    formData.append('lead_school', projectData.lead_school);
    formData.append('contact_person_name', projectData.contact_person_name);
    formData.append('contact_person_email', projectData.contact_person_email);
    formData.append('contact_person_role', projectData.contact_person_role);
    formData.append('contact_country', projectData.contact_country);
    formData.append('contact_city', projectData.contact_city);
    
    // Add goals as JSON string
    formData.append('goals', JSON.stringify(projectData.goals));
    
    // Add environmental themes as JSON string
    formData.append('environmental_themes', JSON.stringify(projectData.environmental_themes));
    
    // Add cover image if it's a File
    if (projectData.cover_image instanceof File) {
      formData.append('cover_image', projectData.cover_image);
    }

    const response = await fetch(`${API_BASE_URL}/projects/`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization || '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function fetchSchools(page: number = 1, limit: number = 10): Promise<SchoolsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/schools/?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
}

export async function createSchool(schoolData: CreateSchoolRequest): Promise<School> {
  try {
    const formData = new FormData();
    
    // Add all text fields
    formData.append('name', schoolData.name);
    formData.append('overview', schoolData.overview);
    formData.append('institution_type', schoolData.institution_type);
    formData.append('affiliation', schoolData.affiliation);
    formData.append('registration_number', schoolData.registration_number);
    formData.append('year_of_establishment', schoolData.year_of_establishment.toString());
    formData.append('address_line_1', schoolData.address_line_1);
    formData.append('address_line_2', schoolData.address_line_2);
    formData.append('city', schoolData.city);
    formData.append('state', schoolData.state);
    formData.append('postal_code', schoolData.postal_code);
    formData.append('country', schoolData.country);
    formData.append('phone_number', schoolData.phone_number);
    formData.append('email', schoolData.email);
    formData.append('website', schoolData.website);
    formData.append('principal_name', schoolData.principal_name);
    formData.append('principal_email', schoolData.principal_email);
    formData.append('principal_phone', schoolData.principal_phone);
    formData.append('number_of_students', schoolData.number_of_students.toString());
    formData.append('number_of_teachers', schoolData.number_of_teachers.toString());
    formData.append('medium_of_instruction', schoolData.medium_of_instruction);
    
    // Add logo if it's a File
    if (schoolData.logo instanceof File) {
      formData.append('logo', schoolData.logo);
    }

    const response = await fetch(`${API_BASE_URL}/schools/`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization || '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
}

export async function fetchSchoolById(id: string): Promise<SchoolDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/schools/${id}/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        handleAuthError(errorData);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching school details:', error);
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