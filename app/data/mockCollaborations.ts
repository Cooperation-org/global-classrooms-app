export interface CollaborationTag {
  label: string;
  type: 'water' | 'waste' | 'biodiversity' | 'sdg6' | 'sdg11' | 'sdg15';
}

export interface CollaborationParticipant {
  name: string;
  color: string;
}

export interface Collaboration {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: CollaborationTag[];
  status: 'active' | 'completed';
  school: string;
  participants: CollaborationParticipant[];
}

export const mockCollaborations: Collaboration[] = [
  {
    id: 1,
    title: 'Clean Water Initiative',
    description: 'Implement water conservation strategies and water quality monitoring systems in school and surrounding community.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    tags: [
      { label: 'Water', type: 'water' },
      { label: 'SDG 6', type: 'sdg6' },
    ],
    status: 'active',
    school: 'Unknown School',
    participants: [
      { name: 'A', color: 'bg-blue-200 text-blue-800' },
      { name: 'B', color: 'bg-green-200 text-green-800' },
      { name: 'C', color: 'bg-purple-200 text-purple-800' },
    ],
  },
  {
    id: 2,
    title: 'Zero Waste School',
    description: 'Develop and implement a comprehensive zero waste strategy for schools to reduce landfill waste.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600',
    tags: [
      { label: 'Waste', type: 'waste' },
      { label: 'SDG 11', type: 'sdg11' },
    ],
    status: 'active',
    school: 'Unknown School',
    participants: [
      { name: 'A', color: 'bg-blue-200 text-blue-800' },
      { name: 'B', color: 'bg-green-200 text-green-800' },
      { name: 'C', color: 'bg-purple-200 text-purple-800' },
      { name: 'D', color: 'bg-pink-200 text-pink-800' },
    ],
  },
  {
    id: 3,
    title: 'Local Biodiversity Mapping',
    description: 'Map and protect local biodiversity through community science initiatives and habitat restoration.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600',
    tags: [
      { label: 'Biodiversity', type: 'biodiversity' },
      { label: 'SDG 15', type: 'sdg15' },
    ],
    status: 'active',
    school: 'Unknown School',
    participants: [
      { name: 'A', color: 'bg-blue-200 text-blue-800' },
      { name: 'B', color: 'bg-green-200 text-green-800' },
      { name: 'C', color: 'bg-purple-200 text-purple-800' },
      { name: 'D', color: 'bg-pink-200 text-pink-800' },
      { name: 'E', color: 'bg-yellow-200 text-yellow-800' },
    ],
  },
]; 