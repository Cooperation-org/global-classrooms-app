export interface Member {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  type: 'teacher' | 'student';
}

export const mockTeachers: Member[] = [
  { id: 1, name: 'Evergreen High', status: 'active', type: 'teacher' },
  { id: 2, name: 'Redwood High', status: 'active', type: 'teacher' },
];

export const mockStudents: Member[] = [
  { id: 1, name: 'Alice Johnson', status: 'active', type: 'student' },
  { id: 2, name: 'Brian Lee', status: 'active', type: 'student' },
]; 