import { ApiResponse } from '@/app/types';

// ============================================================================
// API Configuration & Utilities
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get authentication headers for API requests
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Handle authentication errors (401)
 */
function handleAuthError(errorData: unknown): void {
  const error = errorData as { status_code?: number; detail?: string };
  
  if (error.status_code === 401 || !error.status_code) {
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
}

/**
 * Extract field errors from API error response
 */
function extractFieldErrors(errorData: { details?: Record<string, unknown> }): string[] {
  const fieldErrors: string[] = [];
  
  if (!errorData.details) return fieldErrors;
  
  const fieldLabels: Record<string, string> = {
    user: 'User',
    email: 'Email',
    teacher_email: 'Teacher Email',
    student_email: 'Student Email',
    assigned_classes: 'Classes',
    assigned_class: 'Class',
    teacher_role: 'Role',
    student_id: 'Student ID',
    parent_name: 'Parent Name',
    parent_email: 'Parent Email',
    parent_phone: 'Parent Phone',
  };
  
  Object.entries(errorData.details).forEach(([field, error]) => {
    const label = fieldLabels[field] || field.charAt(0).toUpperCase() + field.slice(1);
    const message = Array.isArray(error) ? error[0] : String(error);
    
    // Add helpful context for common errors
    let enhancedMessage = String(message);
    if (field === 'user' && message.includes('Invalid pk') && message.includes('does not exist')) {
      enhancedMessage += '. Note: Backend may be expecting user ID (PK) instead of email. Ensure backend serializer accepts teacher_email/student_email.';
    }
    if ((field === 'assigned_classes' || field === 'assigned_class') && message.includes('Invalid pk') && message.includes('does not exist')) {
      enhancedMessage += '. Note: Backend may be expecting class IDs (PKs) instead of class identifiers. Ensure backend serializer accepts string identifiers like "GRADE_1".';
    }
    
    fieldErrors.push(`${label}: ${enhancedMessage}`);
  });
  
  return fieldErrors;
}

/**
 * Format error message from API error response
 */
function formatErrorMessage(
  errorData: { detail?: string; message?: string; details?: Record<string, unknown> },
  defaultMessage: string = 'An error occurred'
): string {
  // Try detail or message first
  if (errorData.detail) return errorData.detail;
  if (errorData.message) return errorData.message;
  
  // Extract field-specific errors
  const fieldErrors = extractFieldErrors(errorData);
  if (fieldErrors.length > 0) {
    return fieldErrors.join('. ');
  }
  
  return defaultMessage;
}

/**
 * Handle API response errors with consistent error handling
 */
function handleApiError(
  response: Response,
  errorData: unknown,
  context: string
): never {
  const error = errorData as { detail?: string; message?: string; details?: Record<string, unknown> };
  
  // Handle authentication errors
  if (response.status === 401) {
    handleAuthError(errorData);
    throw new Error('Authentication required. Please log in again.');
  }
  
  // Handle validation errors (400)
  if (response.status === 400) {
    // Check for backend serializer mismatch (backend expects old format)
    if (error.details) {
      const hasUserError = error.details.user && 
        Array.isArray(error.details.user) && 
        error.details.user.some((msg: unknown) => 
          String(msg).includes('Invalid pk') && String(msg).includes('does not exist')
        );
      const classErrors = error.details.assigned_classes || error.details.assigned_class;
      const hasClassError = classErrors &&
        Array.isArray(classErrors) &&
        classErrors.some((msg: unknown) =>
          String(msg).includes('Invalid pk') && String(msg).includes('does not exist')
        );

      if (hasUserError || hasClassError) {
        const mismatchMessage = [
          'Backend serializer format mismatch detected.',
          hasUserError ? 'Backend expects "user" (UUID) but frontend sends "teacher_email"/"student_email".' : '',
          hasClassError ? 'Backend expects numeric class IDs (PKs) but frontend sends string identifiers (e.g., "GRADE_1").' : '',
          'Please update the backend serializer to accept the new format.'
        ].filter(Boolean).join(' ');
        
        const originalMessage = formatErrorMessage(error, 'Invalid request data');
        throw new Error(`${originalMessage}\n\n${mismatchMessage}`);
      }
    }
    
    const message = formatErrorMessage(error, 'Invalid request data');
    throw new Error(message);
  }
  
  // Handle permission errors (403)
  if (response.status === 403) {
    throw new Error(error.detail || 'You do not have permission to perform this action');
  }
  
  // Handle not found errors (404)
  if (response.status === 404) {
    throw new Error(error.detail || 'Resource not found');
  }
  
  // Generic error
  const message = formatErrorMessage(error, `HTTP error! status: ${response.status}`);
  throw new Error(message);
}

/**
 * Generic API request wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  context: string = 'API request'
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const authHeaders = getAuthHeaders();
  
  // Ensure Content-Type is set for JSON requests
  const headers: Record<string, string> = {
    ...authHeaders,
    ...(options.headers as Record<string, string> || {}),
  };
  
  // If we have a body and it's a string (JSON), ensure Content-Type is set
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  const config: RequestInit = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text();
      handleApiError(response, errorData, context);
    }
    
    // Handle empty responses
    if (response.status === 204 || !isJson) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`${context} failed: ${String(error)}`);
  }
}

/**
 * GET request helper
 */
async function apiGet<T>(endpoint: string, context?: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' }, context);
}

/**
 * POST request helper
 */
async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  context?: string,
  useFormData: boolean = false
): Promise<T> {
  const options: RequestInit = {
    method: 'POST',
  };
  
  if (data) {
    if (useFormData && data instanceof FormData) {
      // Remove Content-Type header for FormData (browser sets it with boundary)
      const headers = getAuthHeaders();
      delete headers['Content-Type'];
      options.headers = headers;
      options.body = data;
    } else {
      // Ensure we're sending JSON with proper Content-Type
      const jsonBody = JSON.stringify(data);
      options.body = jsonBody;
      
      // Log the exact payload being sent for debugging
      if (context?.includes('teacher') || context?.includes('student')) {
        console.log('EXACT PAYLOAD BEING SENT:', {
          endpoint,
          body: jsonBody,
          parsed: JSON.parse(jsonBody),
          contentType: 'application/json'
        });
      }
    }
  }
  
  return apiRequest<T>(endpoint, options, context);
}

/**
 * PUT request helper
 */
async function apiPut<T>(endpoint: string, data?: unknown, context?: string): Promise<T> {
  return apiRequest<T>(
    endpoint,
    {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    },
    context
  );
}

/**
 * PATCH request helper
 */
async function apiPatch<T>(endpoint: string, data?: unknown, context?: string): Promise<T> {
  return apiRequest<T>(
    endpoint,
    {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    },
    context
  );
}

/**
 * DELETE request helper
 */
async function apiDelete<T>(endpoint: string, context?: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' }, context);
}

/**
 * Helper to build FormData from object
 */
function buildFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
  
  return formData;
}

// ============================================================================
// Type Definitions
// ============================================================================

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
  participating_schools?: Array<{ id?: string; school?: string; name?: string }>;
  goals?: string[];
  total_impact: {
    trees_planted: number;
    students_engaged: number;
    waste_recycled: number;
  };
}

// Project Files (Resources)
export interface ProjectFile {
  id: string;
  file: string; // absolute or relative URL
  description: string;
  created_at: string;
}

export interface ProjectFilesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectFile[];
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
  document_files?: File[];
  media_files?: File[];
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
  admin?: string; // User ID of the school admin
  admin_name?: string;
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
  creator_name: string;
  creator_role: 'student' | 'teacher';
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

// ============================================================================
// Project API Functions
// ============================================================================

export async function fetchProjects(page: number = 1, limit: number = 10): Promise<ProjectsResponse> {
  return apiGet<ProjectsResponse>(
    `/projects/?page=${page}&limit=${limit}`,
    'fetching projects'
  );
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const data = await apiGet<ProjectsResponse>(
    '/projects/?featured=true&limit=6',
    'fetching featured projects'
  );
  return data.results;
}

export async function fetchCompletedProjects(): Promise<Project[]> {
  const data = await apiGet<ProjectsResponse>(
    '/projects/?status=completed&limit=4',
    'fetching completed projects'
  );
  return data.results;
}

export async function fetchOpenCollaborations(): Promise<Project[]> {
  const data = await apiGet<ProjectsResponse>(
    '/projects/?is_open_for_collaboration=true&limit=4',
    'fetching open collaborations'
  );
  return data.results;
}

export async function fetchFutureProjects(): Promise<Project[]> {
  const data = await apiGet<ProjectsResponse>(
    '/projects/?limit=20',
    'fetching future projects'
  );
  
  const currentDate = new Date();
  return data.results.filter((project: Project) => {
    const startDate = new Date(project.start_date);
    return startDate > currentDate;
  });
}

export async function uploadProjectFile(projectId: string, file: File, description: string = ''): Promise<ProjectFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description);

  return apiPost<ProjectFile>(
    `/projects/${projectId}/files/`,
    formData,
    'uploading project file',
    true
  );
}

export async function fetchProjectFiles(projectId: string, page: number = 1, limit: number = 50): Promise<ProjectFile[]> {
  const data = await apiGet<ProjectFilesResponse | ProjectFile[]>(
    `/projects/${projectId}/files/?page=${page}&limit=${limit}`,
    'fetching project files'
  );
  
  // Normalize response: handle both paginated and array responses
  return Array.isArray(data) ? data : (data as ProjectFilesResponse).results || [];
}

export async function createProject(projectData: CreateProjectRequest): Promise<Project> {
  const formData = new FormData();
  
  // Add all text fields
  Object.entries({
    title: projectData.title,
    short_description: projectData.short_description,
    detailed_description: projectData.detailed_description,
    start_date: projectData.start_date,
    end_date: projectData.end_date,
    is_open_for_collaboration: projectData.is_open_for_collaboration.toString(),
    offer_rewards: projectData.offer_rewards.toString(),
    recognition_type: projectData.recognition_type,
    award_criteria: projectData.award_criteria,
    lead_school: projectData.lead_school,
    contact_person_name: projectData.contact_person_name,
    contact_person_email: projectData.contact_person_email,
    contact_person_role: projectData.contact_person_role,
    contact_country: projectData.contact_country,
    contact_city: projectData.contact_city,
    goals: JSON.stringify(projectData.goals),
    environmental_themes: JSON.stringify(projectData.environmental_themes),
  }).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  
  // Add cover image if it's a File
  if (projectData.cover_image instanceof File) {
    formData.append('cover_image', projectData.cover_image);
  }

  const createdProject = await apiPost<Project>(
    '/projects/',
    formData,
    'creating project',
    true
  );

  // Upload additional files separately
  const uploadPromises: Promise<ProjectFile>[] = [];
  
  if (projectData.document_files?.length) {
    projectData.document_files.forEach((file) => {
      uploadPromises.push(uploadProjectFile(createdProject.id, file, 'Supporting Document'));
    });
  }
  
  if (projectData.media_files?.length) {
    projectData.media_files.forEach((file) => {
      uploadPromises.push(uploadProjectFile(createdProject.id, file, 'Project Media'));
    });
  }

  // Upload files in background (don't fail project creation if files fail)
  if (uploadPromises.length > 0) {
    Promise.all(uploadPromises).catch((error) => {
      console.error('Some files failed to upload:', error);
    });
  }

  return createdProject;
}

// ============================================================================
// School API Functions
// ============================================================================

export async function fetchSchools(page: number = 1, limit: number = 10): Promise<SchoolsResponse> {
  return apiGet<SchoolsResponse>(
    `/schools/?page=${page}&limit=${limit}`,
    'fetching schools'
  );
}

export async function createSchool(schoolData: CreateSchoolRequest): Promise<School> {
  const formData = new FormData();
  
  // Add all text fields
  Object.entries({
    name: schoolData.name,
    overview: schoolData.overview,
    institution_type: schoolData.institution_type,
    affiliation: schoolData.affiliation,
    registration_number: schoolData.registration_number,
    year_of_establishment: schoolData.year_of_establishment.toString(),
    address_line_1: schoolData.address_line_1,
    address_line_2: schoolData.address_line_2,
    city: schoolData.city,
    state: schoolData.state,
    postal_code: schoolData.postal_code,
    country: schoolData.country,
    phone_number: schoolData.phone_number,
    email: schoolData.email,
    website: schoolData.website,
    principal_name: schoolData.principal_name,
    principal_email: schoolData.principal_email,
    principal_phone: schoolData.principal_phone,
    number_of_students: schoolData.number_of_students.toString(),
    number_of_teachers: schoolData.number_of_teachers.toString(),
    medium_of_instruction: schoolData.medium_of_instruction,
    creator_name: schoolData.creator_name,
    creator_role: schoolData.creator_role,
  }).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  
  // Add logo if it's a File
  if (schoolData.logo instanceof File) {
    formData.append('logo', schoolData.logo);
  }

  return apiPost<School>('/schools/', formData, 'creating school', true);
}

export async function fetchSchoolById(id: string): Promise<SchoolDetails> {
  return apiGet<SchoolDetails>(`/schools/${id}/`, 'fetching school details');
}

export async function fetchProjectsBySchool(schoolId: string, page: number = 1, limit: number = 10): Promise<ProjectsResponse> {
  return apiGet<ProjectsResponse>(
    `/projects/?lead_school=${schoolId}&page=${page}&limit=${limit}`,
    'fetching projects by school'
  );
}

export async function fetchProjectById(id: string): Promise<Project> {
  return apiGet<Project>(`/projects/${id}/`, 'fetching project details');
}

export async function updateProject(id: string, projectData: Partial<CreateProjectRequest>): Promise<Project> {
  const formData = new FormData();
  
  // Add fields that exist
  Object.entries(projectData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (key === 'cover_image' && value instanceof File) {
      formData.append(key, value);
    } else if (key === 'goals' || key === 'environmental_themes') {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'is_open_for_collaboration' || key === 'offer_rewards') {
      formData.append(key, String(value));
    } else if (typeof value === 'string' || typeof value === 'number') {
      formData.append(key, String(value));
    }
  });

  return apiRequest<Project>(
    `/projects/${id}/`,
    {
      method: 'PATCH',
      body: formData,
      headers: (() => {
        const headers = getAuthHeaders();
        delete headers['Content-Type']; // Let browser set boundary for FormData
        return headers;
      })(),
    },
    'updating project'
  );
}

/**
 * Join a project on behalf of a school
 * @param id - Project ID
 * @param schoolId - School ID joining the project (required)
 * @throws Error if user is not a teacher or school is already participating
 */
export async function joinProject(id: string, schoolId?: string): Promise<{ message: string }> {
  if (!schoolId) {
    throw new Error('School ID is required to join a project. Only teachers can join projects on behalf of their school.');
  }

  return apiPost<{ message: string }>(
    `/projects/${id}/join/`,
    { school_id: schoolId },
    'joining project'
  );
}

export async function deleteProject(id: string): Promise<void> {
  await apiDelete<void>(`/projects/${id}/`, 'deleting project');
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
  return apiGet<ProjectUpdatesResponse>(
    `/projects/${projectId}/updates/?page=${page}&limit=${limit}`,
    'fetching project updates'
  );
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
  const { page = 1, limit = 10, ordering, search } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (ordering) queryParams.append('ordering', ordering);
  if (search) queryParams.append('search', search);
  
  return apiGet<ProjectGoalsResponse>(
    `/projects/${projectId}/goals/?${queryParams.toString()}`,
    'fetching project goals'
  );
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

// Add Teacher to School Request/Response
export interface AddTeacherToSchoolRequest {
  teacher_email: string;
  teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
  assigned_classes: string[];
}

export interface AddTeacherToSchoolResponse {
  message: string;
  teacher_profile: TeacherProfile;
  school_membership: {
    id: string;
    school: string;
    user: string;
    role: 'teacher' | 'student';
    status: 'active' | 'inactive';
    joined_at: string;
  };
}

export interface TeacherProfilesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeacherProfile[];
}

export async function fetchTeacherProfiles(schoolId?: string, page: number = 1, limit: number = 10): Promise<TeacherProfilesResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (schoolId) {
    queryParams.append('school', schoolId);
  }
  
  return apiGet<TeacherProfilesResponse>(
    `/teacher-profiles/?${queryParams.toString()}`,
    'fetching teacher profiles'
  );
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

// Add Student to School Request/Response
export interface AddStudentToSchoolRequest {
  student_email: string;
  assigned_class: string;
  student_id?: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
}

export interface AddStudentToSchoolResponse {
  message: string;
  student_profile: StudentProfile;
  school_membership: {
    id: string;
    school: string;
    user: string;
    role: 'teacher' | 'student';
    status: 'active' | 'inactive';
    joined_at: string;
  };
}

export interface StudentProfilesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentProfile[];
}

export async function fetchStudentProfiles(schoolId?: string, page: number = 1, limit: number = 10): Promise<StudentProfilesResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (schoolId) {
    queryParams.append('school', schoolId);
  }
  
  return apiGet<StudentProfilesResponse>(
    `/student-profiles/?${queryParams.toString()}`,
    'fetching student profiles'
  );
}

/**
 * Add a teacher to a school
 * Creates/activates SchoolMembership and creates TeacherProfile with class assignments
 * 
 * Backend Requirements:
 * - The serializer should accept 'teacher_email' and look up the user
 * - The user must exist and have role 'teacher'
 * - All assigned_classes must be valid class identifiers (e.g., "GRADE_1", "GRADE_2")
 * - The user must not already be a member of the school (or membership should be activated)
 * 
 * @param schoolId - The school ID to add the teacher to
 * @param data - Teacher data including teacher_email, role, and assigned_classes (string array)
 * @returns Response with teacher profile and school membership
 */
export async function addTeacherToSchool(
  schoolId: string,
  data: AddTeacherToSchoolRequest
): Promise<AddTeacherToSchoolResponse> {
  // Log the payload being sent for debugging
  console.log('Adding teacher to school:', {
    schoolId,
    payload: data,
    expectedFormat: {
      teacher_email: 'string (email address)',
      teacher_role: 'class_teacher | subject_teacher | admin',
      assigned_classes: 'string[] (e.g., ["GRADE_1", "GRADE_2"])'
    }
  });

  try {
    return await apiPost<AddTeacherToSchoolResponse>(
      `/schools/${schoolId}/add-teacher-school/`,
      data,
      'adding teacher to school'
    );
  } catch (error) {
    // Enhance error message with payload info
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('user') || errorMessage.includes('Invalid pk')) {
      console.error('Backend serializer mismatch detected:', {
        sent: data,
        backendExpects: {
          user: 'UUID (primary key)',
          assigned_classes: 'number[] (primary keys)'
        },
        frontendSends: {
          teacher_email: 'string',
          assigned_classes: 'string[]'
        },
        note: 'Backend serializer may need to be updated to accept teacher_email and string class identifiers'
      });
    }
    throw error;
  }
}

/**
 * Add a student to a school
 * Creates/activates SchoolMembership and creates StudentProfile with class assignment
 * 
 * Backend Requirements:
 * - The serializer should accept 'student_email' and look up the user
 * - The user must exist and have role 'student'
 * - The assigned_class must be a valid class identifier (e.g., "GRADE_1")
 * - The user must not already be a member of the school (or membership should be activated)
 * 
 * @param schoolId - The school ID to add the student to
 * @param data - Student data including student_email, assigned_class (string), and optional parent info
 * @returns Response with student profile and school membership
 */
export async function addStudentToSchool(
  schoolId: string,
  data: AddStudentToSchoolRequest
): Promise<AddStudentToSchoolResponse> {
  // Log the payload being sent for debugging
  console.log('Adding student to school:', {
    schoolId,
    payload: data,
    expectedFormat: {
      student_email: 'string (email address)',
      assigned_class: 'string (e.g., "GRADE_1")'
    }
  });

  try {
    return await apiPost<AddStudentToSchoolResponse>(
      `/schools/${schoolId}/add-student-school/`,
      data,
      'adding student to school'
    );
  } catch (error) {
    // Enhance error message with payload info
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('user') || errorMessage.includes('Invalid pk')) {
      console.error('Backend serializer mismatch detected:', {
        sent: data,
        backendExpects: {
          user: 'UUID (primary key)',
          assigned_class: 'number (primary key)'
        },
        frontendSends: {
          student_email: 'string',
          assigned_class: 'string'
        },
        note: 'Backend serializer may need to be updated to accept student_email and string class identifier'
      });
    }
    throw error;
  }
}

// ============================================================================
// User Profile API
// ============================================================================

export async function fetchUserProfile(): Promise<unknown> {
  return apiGet<unknown>('/auth/profile/', 'fetching user profile');
}

export async function updateUserProfile(data: unknown): Promise<unknown> {
  return apiPatch<unknown>('/auth/profile/', data, 'updating user profile');
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
