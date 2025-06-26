export interface SchoolTag {
  label: string;
  type: 'waste' | 'energy' | 'climate' | 'water' | 'biodiversity';
}

export interface SchoolProject {
  title: string;
  description: string;
  image: string;
}

export interface SchoolCollaboration {
  name: string;
  image: string;
}

export interface SchoolImpactMetric {
  title: string;
  value: string;
  unit?: string;
  lastYearChange: string;
  chart: number[];
}

export interface School {
  id: number;
  name: string;
  subtitle?: string;
  location: string;
  description: string;
  tags: SchoolTag[];
  image: string;
  students: number;
  badge?: string;
  website?: string;
  schoolType?: string;
  sustainabilityGoals?: string;
  activeProjects?: SchoolProject[];
  collaborations?: SchoolCollaboration[];
  impact?: SchoolImpactMetric[];
}

export const mockSchools: School[] = [
  {
    id: 1,
    name: 'Greenwood Academy',
    subtitle: 'A leading institution in environmental education',
    location: 'Springfield, USA',
    description: 'Greenwood Academy is committed to fostering environmental stewardship among students. Our mission is to integrate sustainability into all aspects of education, preparing students to be responsible global citizens. We align our projects with the UN Sustainable Development Goals, focusing on climate action, responsible consumption, and life on land.',
    tags: [
      { label: 'Climate', type: 'climate' },
      { label: 'Biodiversity', type: 'biodiversity' },
    ],
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=600',
    students: 900,
    website: 'www.greenwoodacademy.edu',
    schoolType: 'Secondary School',
    sustainabilityGoals: 'Reduce carbon footprint by 50% by 2030, Implement zero-waste initiatives, Enhance biodiversity on campus',
    activeProjects: [
      {
        title: 'Tree Planting Initiative',
        description: 'Students are planting 1000 trees to offset carbon emissions.',
        image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=600',
      },
      {
        title: 'Water Quality Monitoring',
        description: 'Students are monitoring water quality in local rivers.',
        image: 'https://assets-global.website-files.com/5f6b7b6c6e2c6e2c6e2c6e2c/5f6b7b6c6e2c6e2c6e2c6e2c_water-quality.svg',
      },
      {
        title: 'Community Garden Project',
        description: 'Students are creating a community garden to promote sustainable agriculture.',
        image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600',
      },
    ],
    collaborations: [
      {
        name: 'Oakwood High',
        image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=600',
      },
      {
        name: 'Riverside School',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600',
      },
      {
        name: 'Hillside Academy',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
      },
    ],
    impact: [
      {
        title: 'Plantation',
        value: '450',
        unit: 'trees',
        lastYearChange: '+5%',
        chart: [5, 6, 7, 8, 8, 9],
      },
      {
        title: 'Water Conservation',
        value: '15',
        unit: '%',
        lastYearChange: '+3%',
        chart: [2, 3, 4, 5, 6, 7],
      },
      {
        title: 'Biodiversity Enhancement',
        value: '10',
        unit: '%',
        lastYearChange: '+2%',
        chart: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    id: 2,
    name: 'Green Valley High School',
    location: 'Portland, USA',
    description: 'A pioneer in environmental education with a strong focus on renewable energy and sustainability.',
    tags: [
      { label: 'Energy', type: 'energy' },
      { label: 'Climate', type: 'climate' },
    ],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    students: 850,
    badge: 'HomeBiogas',
  },
  {
    id: 3,
    name: 'Sustainable Future Academy',
    location: 'Nairobi, Kenya',
    description: 'Leading the way in water conservation and biodiversity protection in East Africa.',
    tags: [
      { label: 'Water', type: 'water' },
      { label: 'Biodiversity', type: 'biodiversity' },
    ],
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600',
    students: 620,
  },
]; 