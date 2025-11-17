# Teacher Project Join Implementation

## Overview
This implementation ensures that **any teacher** (school administrators, class teachers, or subject teachers) can join projects on behalf of their schools. Once a school joins a project, the join button is replaced with a "Joined" status indicator for all teachers at that school.

## Key Features

### 1. **Teacher Roles**
- All teachers with a `TeacherProfile` can join projects on behalf of their school
- This includes:
  - `admin` - School administrators
  - `class_teacher` - Regular class teachers
  - `subject_teacher` - Subject-specific teachers

### 2. **Permission System**

#### User Roles (Global Level)
- `student` - Students
- `teacher` - Teachers (must have a TeacherProfile to join projects)
- `admin` - Platform administrators  
- `super_admin` - Super administrators

#### Teacher Roles (School Level)
- `class_teacher` - Regular class teacher
- `subject_teacher` - Subject-specific teacher
- `admin` - **School administrator** (can join projects)

### 3. **Join Button Behavior**

The join button displays different states based on:

| Condition | Button State | Visibility |
|-----------|-------------|------------|
| User is not a teacher | Hidden | ❌ |
| User has no teacher profile | Hidden | ❌ |
| School already joined | "Already Joined" (disabled) | ✅ |
| Teacher with profile, not joined | "Join Project" (active) | ✅ |
| Project not open | Hidden | ❌ |

## Implementation Files

### Core Files Created

1. **`app/utils/schoolAdminVerification.ts`**
   - Permission checking functions
   - Button state logic
   - School participation verification

2. **`app/components/projects/ProjectJoinButton.tsx`**
   - Smart join button component
   - Auto-hides for non-admins
   - Shows appropriate messages
   - Handles join action with error handling

3. **`app/hooks/useSWR.ts`** (Updated)
   - Added `useCurrentTeacherProfile()` hook
   - Fetches current user's teacher profile
   - Returns school admin status

### Files Modified

1. **`app/services/api.ts`**
   - Updated `joinProject()` to require `schoolId`
   - Added client-side validation
   - Improved error handling for permissions

2. **`app/(main)/dashboard/projects/[id]/page.tsx`**
   - Replaced old join button with `ProjectJoinButton`
   - Removed manual join handling
   - Integrated smart button logic

## Usage Example

```tsx
import { ProjectJoinButton } from '@/app/components/projects/ProjectJoinButton';

// In your project detail page
<ProjectJoinButton
  projectId={project.id}
  projectData={{
    lead_school: project.lead_school,
    participating_schools: project.participating_schools,
    is_open_for_collaboration: project.is_open_for_collaboration,
    title: project.title,
  }}
  onJoinSuccess={() => router.refresh()}
/>
```

## API Requirements

### Backend Endpoint
```
POST /projects/{id}/join/
```

### Request Body
```json
{
  "school_id": "school-uuid"
}
```

### Expected Responses

**Success (200)**
```json
{
  "message": "Successfully joined the project"
}
```

**Not Authorized (403)**
```json
{
  "detail": "Only teachers can join projects on behalf of their school"
}
```

**Already Joined (400)**
```json
{
  "detail": "School is already participating in this project"
}
```

**Unauthenticated (401)**
```json
{
  "detail": "Authentication credentials were not provided"
}
```

## Permission Flow

```
User attempts to join project
  ↓
Check if user is logged in
  ↓
Check if user is a teacher
  ↓
Fetch user's teacher profile
  ↓
Check if school already participating
  ↓
If all checks pass: Show "Join Project" button
Else: Hide button or show "Already Joined"
```

## Error Messages

### User-Facing Messages
- **Not logged in**: "You must be logged in to join a project"
- **Not a teacher**: "Only teachers can join projects on behalf of their school"  
- **No teacher profile**: "Please complete your teacher profile to join projects"
- **Already joined**: "Your school is already participating in this project"
- **Project not open**: "This project is not open for collaboration"

## Testing Checklist

- [ ] Non-logged-in users don't see join button
- [ ] Students don't see join button
- [ ] Teachers with profile see active join button
- [ ] Button becomes "Already Joined" after joining
- [ ] Other teachers at same school see "Already Joined"
- [ ] Teachers from different schools see active "Join Project" button
- [ ] Error handling works for network failures
- [ ] Success callback triggers page refresh

## Future Enhancements

1. **Approval Workflow**
   - Add approval step for platform admins
   - Notify school admins of join requests

2. **Multiple Schools**
   - Allow teachers affiliated with multiple schools
   - Let them choose which school to represent

3. **Delegate Permissions**
   - Allow school admins to delegate join permissions
   - Create temporary join tokens

4. **Activity Tracking**
   - Log who joined projects and when
   - Track school participation history

## Database Schema Considerations

### Teacher Profile
```typescript
interface TeacherProfile {
  id: number;
  user: string; // User ID
  school: string; // School ID
  teacher_role: 'class_teacher' | 'subject_teacher' | 'admin';
  // ... other fields
}
```

### Project Participation
```typescript
interface Project {
  id: string;
  lead_school: string; // School ID
  participating_schools: Array<{
    id: string; // School ID
    // ... other school info
  }>;
  is_open_for_collaboration: boolean;
  // ... other fields
}
```

## Support

For questions or issues with this implementation:
1. Check the console logs for detailed error messages
2. Verify user has a teacher profile with school association
3. Confirm teacher_role is set to 'admin'
4. Check backend API responses for specific errors

