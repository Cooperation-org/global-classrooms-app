// Application constants
export const APP_NAME = 'Global Classrooms';
export const APP_DESCRIPTION = 'Connecting students worldwide through innovative online learning experiences';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  COURSES: {
    LIST: '/courses',
    DETAIL: '/courses/:id',
    CREATE: '/courses',
    UPDATE: '/courses/:id',
    DELETE: '/courses/:id',
  },
  LESSONS: {
    LIST: '/courses/:courseId/lessons',
    DETAIL: '/lessons/:id',
    CREATE: '/lessons',
    UPDATE: '/lessons/:id',
    DELETE: '/lessons/:id',
  },
  ENROLLMENTS: {
    LIST: '/enrollments',
    CREATE: '/enrollments',
    UPDATE: '/enrollments/:id',
    DELETE: '/enrollments/:id',
  },
} as const;

// Course categories
export const COURSE_CATEGORIES = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Finance',
  'Health',
  'Education',
  'Language',
  'Music',
  'Cooking',
] as const;

// Course levels
export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

// User roles
export const USER_ROLES = ['student', 'teacher', 'admin'] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Theme options
export const THEMES = ['light', 'dark', 'system'] as const;

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
] as const; 