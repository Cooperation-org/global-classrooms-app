'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useCurrentTeacherProfile } from '@/app/hooks/useSWR';
import { getProjectJoinButtonState, SCHOOL_ADMIN_MESSAGES } from '@/app/utils/schoolAdminVerification';
import { joinProject } from '@/app/services/api';
import { Button } from '@/components/ui/button';

interface ProjectJoinButtonProps {
  projectId: string;
  projectData: {
    lead_school?: string;
    participating_schools?: Array<{ id?: string; school?: string }>;
    is_open_for_collaboration?: boolean;
    title?: string;
  };
  onJoinSuccess?: () => void;
  className?: string;
}

/**
 * Smart join button that:
 * 1. Only shows for school admins
 * 2. Shows "Already Joined" if school is participating
 * 3. Handles the join project action
 */
export const ProjectJoinButton: React.FC<ProjectJoinButtonProps> = ({
  projectId,
  projectData,
  onJoinSuccess,
  className = '',
}) => {
  const { user } = useAuth();
  const { teacherProfile, isLoading: profileLoading } = useCurrentTeacherProfile();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Get button state based on user permissions and project status
  const buttonState = getProjectJoinButtonState({
    user,
    teacherProfile: teacherProfile ? {
      teacher_role: teacherProfile.teacher_role,
      school: teacherProfile.school,
      school_name: teacherProfile.school_name,
    } : undefined,
    projectData,
  });

  const handleJoin = async () => {
    if (!teacherProfile) {
      setError(SCHOOL_ADMIN_MESSAGES.NO_PROFILE);
      return;
    }

    try {
      setIsJoining(true);
      setError('');
      
      await joinProject(projectId, teacherProfile.school);
      
      setSuccess(true);
      if (onJoinSuccess) {
        onJoinSuccess();
      }
      
      // Show success message temporarily
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join project');
    } finally {
      setIsJoining(false);
    }
  };

  // Loading state
  if (profileLoading) {
    return (
      <Button disabled variant="outline" className={className}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Don't show button if user doesn't have permission
  if (!buttonState.showButton) {
    return null;
  }

  // Success state
  if (success) {
    return (
      <Button disabled variant="default" className={`bg-green-600 ${className}`}>
        <CheckCircle className="w-4 h-4 mr-2" />
        {SCHOOL_ADMIN_MESSAGES.SUCCESS}
      </Button>
    );
  }

  // Already joined state
  if (buttonState.buttonDisabled && buttonState.buttonText === 'Already Joined') {
    return (
      <Button disabled variant="outline" className={`border-green-300 bg-green-50 text-green-700 ${className}`}>
        <CheckCircle className="w-4 h-4 mr-2" />
        {buttonState.buttonText}
      </Button>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <Button
          onClick={handleJoin}
          disabled={isJoining}
          variant="default"
          className="w-full mb-2"
        >
          {isJoining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              {buttonState.buttonText}
            </>
          )}
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Active join button
  return (
    <Button
      onClick={handleJoin}
      disabled={isJoining || buttonState.buttonDisabled}
      variant="default"
      className={`bg-green-600 hover:bg-green-700 ${className}`}
    >
      {isJoining ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Joining...
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          {buttonState.buttonText}
        </>
      )}
    </Button>
  );
};

/**
 * Inline status indicator for projects list
 */
export const ProjectJoinStatus: React.FC<{
  projectData: {
    lead_school?: string;
    participating_schools?: Array<{ id?: string; school?: string }>;
  };
  teacherProfile?: {
    school: string;
    school_name: string;
  };
}> = ({ projectData, teacherProfile }) => {
  if (!teacherProfile) return null;

  const schoolId = teacherProfile.school;
  const isParticipating =
    projectData.lead_school === schoolId ||
    projectData.participating_schools?.some(
      (school) => school.id === schoolId || school.school === schoolId
    );

  if (!isParticipating) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
      <CheckCircle className="w-3.5 h-3.5" />
      Joined
    </div>
  );
};

export default ProjectJoinButton;

