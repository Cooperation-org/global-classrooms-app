import { User } from '@/app/types';

/**
 * Check if a user is a teacher with a school affiliation
 * Any teacher (admin, class_teacher, or subject_teacher) can join projects
 */
export interface SchoolAdminStatus {
  isSchoolAdmin: boolean;
  teacherProfile?: {
    id: number;
    school: string;
    school_name: string;
    teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
  };
  reason?: string;
}

/**
 * Validates if a user can join projects on behalf of their school
 * @param user - The current user
 * @param teacherProfile - The user's teacher profile (if they have one)
 */
export function canJoinProjectAsSchool(
  user: User | null,
  teacherProfile?: {
    teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
    school: string;
    school_name: string;
  }
): { canJoin: boolean; reason?: string } {
  if (!user) {
    return {
      canJoin: false,
      reason: 'You must be logged in to join a project',
    };
  }

  // User must be a teacher
  if (user.role !== 'teacher' && user.role !== 'admin' && user.role !== 'super_admin') {
    return {
      canJoin: false,
      reason: 'Only teachers can join projects on behalf of their school',
    };
  }

  // Teacher must have a profile
  if (!teacherProfile) {
    return {
      canJoin: false,
      reason: 'Please complete your teacher profile to join projects',
    };
  }

  // Any teacher with a profile can join (admin, class_teacher, or subject_teacher)
  return { canJoin: true };
}

/**
 * Check if a teacher has school admin role
 */
export function isSchoolAdmin(
  teacherProfile?: {
    teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
  }
): boolean {
  return teacherProfile?.teacher_role === 'admin';
}

/**
 * Check if user's school is already participating in a project
 */
export function isSchoolParticipating(
  projectData: {
    lead_school?: string;
    participating_schools?: Array<{ id?: string; school?: string }>;
  },
  userSchoolId?: string
): boolean {
  if (!userSchoolId) return false;

  // Check if user's school is the lead school
  if (projectData.lead_school === userSchoolId) {
    return true;
  }

  // Check if user's school is in participating schools
  if (projectData.participating_schools) {
    return projectData.participating_schools.some(
      (school) => school.id === userSchoolId || school.school === userSchoolId
    );
  }

  return false;
}

/**
 * Get appropriate button state for project joining
 */
export function getProjectJoinButtonState(params: {
  user: User | null;
  teacherProfile?: {
    teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
    school: string;
    school_name: string;
  };
  projectData: {
    lead_school?: string;
    participating_schools?: Array<{ id?: string; school?: string }>;
    is_open_for_collaboration?: boolean;
  };
}): {
  showButton: boolean;
  buttonText: string;
  buttonDisabled: boolean;
  message?: string;
} {
  const { user, teacherProfile, projectData } = params;

  // Check if project is open for collaboration
  if (projectData.is_open_for_collaboration === false) {
    return {
      showButton: false,
      buttonText: '',
      buttonDisabled: true,
      message: 'This project is not open for collaboration',
    };
  }

  // Check if user's school is already participating
  const schoolId = teacherProfile?.school;
  if (schoolId && isSchoolParticipating(projectData, schoolId)) {
    return {
      showButton: true,
      buttonText: 'Already Joined',
      buttonDisabled: true,
      message: 'Your school is already participating in this project',
    };
  }

  // Check if user can join
  const joinCheck = canJoinProjectAsSchool(user, teacherProfile);

  if (!joinCheck.canJoin) {
    return {
      showButton: false,
      buttonText: '',
      buttonDisabled: true,
      message: joinCheck.reason,
    };
  }

  // User can join
  return {
    showButton: true,
    buttonText: 'Join Project',
    buttonDisabled: false,
  };
}

/**
 * Permission messages for different scenarios
 */
export const SCHOOL_ADMIN_MESSAGES = {
  NOT_LOGGED_IN: 'You must be logged in to join a project',
  NOT_TEACHER: 'Only teachers can join projects on behalf of their school',
  NO_PROFILE: 'Please complete your teacher profile to join projects',
  ALREADY_JOINED: 'Your school is already participating in this project',
  NOT_OPEN: 'This project is not open for collaboration',
  SUCCESS: 'Successfully joined the project!',
} as const;

