export interface Project {
  id: number;
  title: string;
  description: string;
  overview: string;
  schedule: { week: string; title: string; description: string }[];
  goals: string[];
  resources: { label: string; url: string; type: string }[];
  discussion: { user: string; message: string; time: string; avatar: string }[];
  schools: { name: string; location: string; logo: string }[];
  leaders: { name: string; role: string; avatar: string }[];
} 