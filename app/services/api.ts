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
  goals?: string[];
  total_impact: {
    trees_planted: number;
    students_engaged: number;
    waste_recycled: number;
  };
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
    
    // Only redirect if we're not already on auth pages
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/signin') && !currentPath.includes('/signup')) {
        window.location.href = '/signin';
      }
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

export async function fetchFutureProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/?limit=20`, {
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
    const currentDate = new Date();
    
    // Filter projects that haven't started yet (future projects)
    const futureProjects = data.results.filter((project: Project) => {
      const startDate = new Date(project.start_date);
      return startDate > currentDate;
    });

    return futureProjects;
  } catch (error) {
    console.error('Error fetching future projects:', error);
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
      console.log('Cover image added to FormData:', projectData.cover_image.name, projectData.cover_image.size);
    } else {
      console.log('No cover image file found:', projectData.cover_image);
    }

    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
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

export async function fetchProjectsBySchool(schoolId: string, page: number = 1, limit: number = 10): Promise<ProjectsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/?lead_school=${schoolId}&page=${page}&limit=${limit}`, {
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
    console.error('Error fetching projects by school:', error);
    throw error;
  }
}

export async function fetchProjectById(id: string): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
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
    console.error('Error fetching project details:', error);
    throw error;
  }
}

export async function updateProject(id: string, projectData: Partial<CreateProjectRequest>): Promise<Project> {
  try {
    const formData = new FormData();
    
    // Add all text fields if they exist
    if (projectData.title) formData.append('title', projectData.title);
    if (projectData.short_description) formData.append('short_description', projectData.short_description);
    if (projectData.detailed_description) formData.append('detailed_description', projectData.detailed_description);
    if (projectData.start_date) formData.append('start_date', projectData.start_date);
    if (projectData.end_date) formData.append('end_date', projectData.end_date);
    if (projectData.is_open_for_collaboration !== undefined) {
      formData.append('is_open_for_collaboration', projectData.is_open_for_collaboration.toString());
    }
    if (projectData.offer_rewards !== undefined) {
      formData.append('offer_rewards', projectData.offer_rewards.toString());
    }
    if (projectData.recognition_type) formData.append('recognition_type', projectData.recognition_type);
    if (projectData.award_criteria) formData.append('award_criteria', projectData.award_criteria);
    if (projectData.lead_school) formData.append('lead_school', projectData.lead_school);
    if (projectData.contact_person_name) formData.append('contact_person_name', projectData.contact_person_name);
    if (projectData.contact_person_email) formData.append('contact_person_email', projectData.contact_person_email);
    if (projectData.contact_person_role) formData.append('contact_person_role', projectData.contact_person_role);
    if (projectData.contact_country) formData.append('contact_country', projectData.contact_country);
    if (projectData.contact_city) formData.append('contact_city', projectData.contact_city);
    
    // Add goals as JSON string if exists
    if (projectData.goals) {
      formData.append('goals', JSON.stringify(projectData.goals));
    }
    
    // Add environmental themes as JSON string if exists
    if (projectData.environmental_themes) {
      formData.append('environmental_themes', JSON.stringify(projectData.environmental_themes));
    }
    
    // Add cover image if it's a File
    if (projectData.cover_image instanceof File) {
      formData.append('cover_image', projectData.cover_image);
    }

    const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
      method: 'PATCH',
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
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function joinProject(id: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/join/`, {
      method: 'POST',
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
    console.error('Error joining project:', error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      let errorData: { detail?: string } = {};
      try {
        errorData = await response.json();
      } catch {
        // Ignore JSON parsing errors for empty responses
      }

      if (response.status === 401) {
        handleAuthError(errorData);
      }

      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // DELETE requests often return 204 No Content
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  author: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  project: string;
}

export interface ProjectUpdatesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectUpdate[];
}

export async function fetchProjectUpdates(projectId: string, page: number = 1, limit: number = 10): Promise<ProjectUpdatesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/updates/?page=${page}&limit=${limit}`, {
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
    console.error('Error fetching project updates:', error);
    throw error;
  }
}

export interface ProjectGoal {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  project: string;
}

export interface ProjectGoalsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectGoal[];
}

export interface FetchProjectGoalsParams {
  page?: number;
  limit?: number;
  ordering?: string;
  search?: string;
}

export async function fetchProjectGoals(
  projectId: string, 
  params: FetchProjectGoalsParams = {}
): Promise<ProjectGoalsResponse> {
  try {
    const { page = 1, limit = 10, ordering, search } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (ordering) {
      queryParams.append('ordering', ordering);
    }
    
    if (search) {
      queryParams.append('search', search);
    }
    
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/goals/?${queryParams.toString()}`, {
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
    console.error('Error fetching project goals:', error);
    throw error;
  }
}

export interface AssignedSubject {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface AssignedClass {
  id: number;
  name: string;
  school: string;
  school_name: string;
  description: string;
}

export interface TeacherProfile {
  id: number;
  user: string;
  school: string;
  user_name: string;
  school_name: string;
  teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
  assigned_subjects: number[];
  assigned_classes: number[];
  assigned_subjects_data: AssignedSubject[];
  assigned_classes_data: AssignedClass[];
  status: 'active' | 'inactive';
  join_link: string;
}

export interface TeacherProfilesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeacherProfile[];
}

export async function fetchTeacherProfiles(schoolId?: string, page: number = 1, limit: number = 10): Promise<TeacherProfilesResponse> {
  try {
    let url = `${API_BASE_URL}/teacher-profiles/?page=${page}&limit=${limit}`;
    if (schoolId) {
      url += `&school=${schoolId}`;
    }

    const response = await fetch(url, {
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
    console.error('Error fetching teacher profiles:', error);
    throw error;
  }
}

export interface StudentProfile {
  id: number;
  user: string;
  school: string;
  user_name: string;
  school_name: string;
  student_id: string;
  current_class: number;
  class_name: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  enrollment_date: string;
}

export interface StudentProfilesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentProfile[];
}

export async function fetchStudentProfiles(schoolId?: string, page: number = 1, limit: number = 10): Promise<StudentProfilesResponse> {
  try {
    let url = `${API_BASE_URL}/student-profiles/?page=${page}&limit=${limit}`;
    if (schoolId) {
      url += `&school=${schoolId}`;
    }

    const response = await fetch(url, {
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
    console.error('Error fetching student profiles:', error);
    throw error;
  }
}

// User Profile API

export async function fetchUserProfile(): Promise<unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) handleAuthError(errorData);
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(data: unknown): Promise<unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) handleAuthError(errorData);
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Debug logging
    console.log('API Request:', {
      method: options.method || 'GET',
      url,
      API_BASE_URL,
      endpoint
    });
    
    const authHeaders = getAuthHeaders();

    const config: RequestInit = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      let data;
      if (isJson) {
        data = await response.json();
      } else {
        // If it's not JSON, get the text to see what we received
        const text = await response.text();
        console.error('Non-JSON response received:', {
          url,
          status: response.status,
          statusText: response.statusText,
          contentType,
          text: text.substring(0, 200) + (text.length > 200 ? '...' : '')
        });
        
        // Return a proper error response
        return {
          success: false,
          error: `Server returned ${response.status}: ${response.statusText}`,
          message: 'Server error - expected JSON response',
          status_code: response.status
        };
      }

      // If the response is not ok (4xx, 5xx), handle it as an error response
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          handleAuthError(data);
        }
        
        // Return the error response as-is, but mark it as unsuccessful
        return {
          success: false,
          error: data.details?.detail || data.message || data.error || 'An error occurred',
          message: data.message,
          details: data.details,
          status_code: response.status,
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
