// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
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