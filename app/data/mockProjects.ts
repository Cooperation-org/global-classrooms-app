import { Project } from '../types/project';

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Water Conservation Initiative',
    overview: 'This project focuses on water conservation including the management of water resources through effective methods, education, and community engagement. Students and teachers will participate in water quality monitoring, awareness campaigns, and implementation of conservation strategies. The project culminates in a student-led campaign to implement water-saving measures in their schools and efforts.',
    schedule: [
      { week: 'Week 1-2', title: 'Introduction to Water Conservation', description: 'Project kick-off and team formation' },
      { week: 'Week 3-4', title: 'Data Collection and Analysis', description: 'Student will conduct water audits and research' },
      { week: 'Week 5-6', title: 'Action Planning', description: 'Students will develop their action plans' },
      { week: 'Week 7-8', title: 'Implementation and Outreach', description: 'Launch conservation campaigns' },
    ],
    goals: [
      'Reduce water consumption in participating schools by 10%',
      'Increase student awareness of water conservation by 90%',
      'Engage at least 200 students in community outreach activities',
    ],
    resources: [
      { label: 'Project Guide', url: '#', type: 'pdf' },
      { label: 'Presentation Slides', url: '#', type: 'ppt' },
      { label: 'External Resources', url: '#', type: 'link' },
    ],
    discussion: [
      { user: 'Sarah Miller', message: 'Excited to start this project! Any tips for the intro collection phase?', time: '2 days ago', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
      { user: 'David Chen', message: 'I recommend having the students to collaborate the data collection methods. It increases their engagement and ownership of the project.', time: '1 day ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    ],
    schools: [
      { name: 'Greenwood High School', location: 'San Francisco, CA', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100' },
      { name: 'Riverside Middle School', location: 'Seattle, WA', logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100' },
      { name: 'Valley Creek Academy', location: 'Austin, TX', logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100' },
    ],
    leaders: [
      { name: 'Emily Carter', role: 'Project Lead Science Teacher', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
      { name: 'Mark Johnson', role: 'Environmental Science Teacher', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    ],
  },
]; 