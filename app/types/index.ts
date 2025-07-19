// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  createdAt: Date;
  updatedAt: Date;
}

// Course related types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  price: number;
  rating: number;
  enrolledStudents: number;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Lesson related types
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  duration: number; // in minutes
  order: number;
  videoUrl?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Enrollment related types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // percentage
  completedLessons: string[];
  enrolledAt: Date;
  lastAccessedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: {
    detail: string;
  };
  status_code?: number;
  timestamp?: string;
}

// Registration response types
export interface RegistrationTokens {
  refresh: string;
  access: string;
}

export interface RegistrationUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  mobile_number: string | null;
  gender: string | null;
  date_of_birth: string | null;
  profile_picture: string | null;
  city: string | null;
  country: string | null;
  is_active: boolean;
  date_joined: string;
  school_count: number;
  signup_method: string;
}

export interface RegistrationResponse {
  user: RegistrationUser;
  tokens: RegistrationTokens;
}

// Login response types (same structure as registration)
export interface LoginResponse {
  user: RegistrationUser;
  access: string;
  refresh: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
} 