'use client'
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePublicProjects } from '@/app/hooks/useSWR';
import { Project } from '@/app/services/api';

// Fallback mock data in case API is not available
const mockProjects: Project[] = [
  {
    id: 'mock-1',
    title: 'Solar Energy Initiative',
    short_description: 'Students design and install solar panels to power their school buildings while learning about renewable energy.',
    detailed_description: 'A comprehensive program where students work with engineers to design, install, and monitor solar energy systems.',
    cover_image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
    environmental_themes: { energy: 'Solar Energy' },
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    is_open_for_collaboration: true,
    offer_rewards: false,
    recognition_type: 'certificate',
    award_criteria: 'Participation',
    lead_school: 'school-1',
    lead_school_name: 'Green Valley High School',
    contact_person_name: 'Sarah Johnson',
    contact_person_email: 'sarah@greenvalley.edu',
    contact_person_role: 'Environmental Science Teacher',
    contact_country: 'USA',
    contact_city: 'San Francisco',
    media_files: {},
    status: 'published' as const,
    created_by: 'user-1',
    created_by_name: 'Sarah Johnson',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    participating_schools_count: '15',
    total_impact: {
      trees_planted: 0,
      students_engaged: 450,
      waste_recycled: 0,
    },
  },
  {
    id: 'mock-2',
    title: 'Zero Waste School Program',
    short_description: 'Students audit waste streams and implement comprehensive recycling and composting systems.',
    detailed_description: 'A school-wide initiative to eliminate waste through innovative recycling, composting, and reduction strategies.',
    cover_image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600',
    environmental_themes: { waste: 'Waste Management' },
    start_date: '2024-02-01',
    end_date: '2024-11-30',
    is_open_for_collaboration: true,
    offer_rewards: false,
    recognition_type: 'certificate',
    award_criteria: 'Participation',
    lead_school: 'school-2',
    lead_school_name: 'Riverside Middle School',
    contact_person_name: 'Mike Chen',
    contact_person_email: 'mike@riverside.edu',
    contact_person_role: 'Science Teacher',
    contact_country: 'USA',
    contact_city: 'Seattle',
    media_files: {},
    status: 'published' as const,
    created_by: 'user-2',
    created_by_name: 'Mike Chen',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    participating_schools_count: '23',
    total_impact: {
      trees_planted: 0,
      students_engaged: 680,
      waste_recycled: 15000,
    },
  },
  {
    id: 'mock-3',
    title: 'School Garden Network',
    short_description: 'Students create sustainable gardens to grow fresh food and learn about agricultural science.',
    detailed_description: 'A network of school gardens focused on sustainable agriculture, nutrition education, and food security.',
    cover_image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
    environmental_themes: { agriculture: 'Sustainable Agriculture' },
    start_date: '2024-03-01',
    end_date: '2024-10-31',
    is_open_for_collaboration: true,
    offer_rewards: false,
    recognition_type: 'certificate',
    award_criteria: 'Participation',
    lead_school: 'school-3',
    lead_school_name: 'Valley Creek Academy',
    contact_person_name: 'Emily Rodriguez',
    contact_person_email: 'emily@valleycreek.edu',
    contact_person_role: 'Agriculture Teacher',
    contact_country: 'USA',
    contact_city: 'Austin',
    media_files: {},
    status: 'published' as const,
    created_by: 'user-3',
    created_by_name: 'Emily Rodriguez',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    participating_schools_count: '31',
    total_impact: {
      trees_planted: 0,
      students_engaged: 890,
      waste_recycled: 0,
    },
  },
];

const categories = ['All Themes', 'All Status', 'Water Conservation', 'Waste Management', 'Biodiversity Protection', 'Climate Action', 'Sustainable Agriculture'];

const ProjectsGridSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Themes');
  
  // Use public SWR hook for data fetching (no authentication required)
  const { projects: apiProjects, isLoading, error } = usePublicProjects(1, 100);
  
  // Use API projects if available, otherwise fall back to mock data
  const projects = apiProjects && apiProjects.length > 0 ? apiProjects : mockProjects;
  
  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    return projects.filter((project: Project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.short_description && project.short_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (project.detailed_description && project.detailed_description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All Themes' || selectedCategory === 'All Status' || 
                             (project.environmental_themes && 
                              Object.values(project.environmental_themes).some((theme: string) => 
                                theme && typeof theme === 'string' && theme.toLowerCase().includes(selectedCategory.toLowerCase())
                              ));
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show demo data notice if API failed but we have fallback data
  const showDemoNotice = error && projects === mockProjects;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Data Notice */}
        {showDemoNotice && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-blue-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold">Demo Projects</h4>
                <p className="text-blue-700 text-sm">We&apos;re showing sample projects. Sign in to view live project data from our network.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: Project) => {
            // Helper function to get the first theme or default category
            const getProjectCategory = () => {
              if (project.environmental_themes) {
                const themes = Object.values(project.environmental_themes).filter(Boolean);
                if (themes.length > 0) {
                  return String(themes[0]);
                }
              }
              return 'Environmental';
            };

            // Helper function to determine project status
            const getProjectStatus = () => {
              if (project.status === 'published' && project.is_open_for_collaboration) {
                return 'Open for Collaboration';
              } else if (project.status === 'completed') {
                return 'Completed';
              } else if (project.status === 'draft') {
                return 'In Development';
              }
              return 'Available';
            };

            return (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={project.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'} 
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {getProjectCategory()}
                    </span>
                  </div>
                </div>
                
                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.short_description || project.detailed_description}
                  </p>
                  
                  {/* Project Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>👥 {project.total_impact?.students_engaged || 0} students</span>
                      <span>🏫 {project.participating_schools_count || 0} schools</span>
                    </div>
                  </div>
                  
                  {/* Status and Action */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      project.is_open_for_collaboration ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      🟢 {getProjectStatus()}
                    </span>
                    <Link 
                      href="/signin"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results State */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria, or sign in to access more projects.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Join a Project?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with schools worldwide and make a positive impact on our planet. 
              Sign up today to start collaborating on meaningful environmental projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signin"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Join as a School
              </Link>
              <Link 
                href="/contact"
                className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsGridSection;
