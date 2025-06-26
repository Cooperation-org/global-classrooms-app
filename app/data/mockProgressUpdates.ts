export type ProgressStatus = 'approved' | 'pending' | 'rejected';

export interface ProjectProgressUpdate {
  id: number;
  title: string;
  description: string;
  status: ProgressStatus;
  date: string; // ISO format
}

export const mockProgressUpdates: ProjectProgressUpdate[] = [
  {
    id: 1,
    title: 'Tree Planting Initiative',
    description: 'We successfully planted 40 saplings in our school garden, engaging students in hands-on learning about biodiversity and environmental stewardship.',
    status: 'approved',
    date: '2023-09-15',
  },
  {
    id: 2,
    title: 'Waste Audit and Recycling Program',
    description: "Students conducted a waste audit to understand our school's waste generation patterns, identifying key areas for improvement in our recycling program.",
    status: 'rejected',
    date: '2023-10-20',
  },
  {
    id: 3,
    title: 'River Cleanup Activity',
    description: 'Our students participated in a local river cleanup, removing plastic waste and learning about the impact of pollution on aquatic ecosystems.',
    status: 'pending',
    date: '2023-09-05',
  },
]; 