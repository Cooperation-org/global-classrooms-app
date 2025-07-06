'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Project, fetchFeaturedProjects, fetchCompletedProjects, fetchOpenCollaborations } from '@/app/services/api';

const placeholderImg = 'https://placehold.co/300x180?text=Image';

export default function DashboardHome() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [openCollaborations, setOpenCollaborations] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featured, completed, collaborations] = await Promise.all([
          fetchFeaturedProjects(),
          fetchCompletedProjects(),
          fetchOpenCollaborations(),
        ]);

        setFeaturedProjects(featured);
        setCompletedProjects(completed);
        setOpenCollaborations(collaborations);
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.full_name || parsedUser.email || parsedUser.username || 'User');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        if (errorMessage.includes('401') || errorMessage.includes('Authentication')) {
          // Redirect to login if authentication failed
          window.location.href = '/login';
          return;
        }
        setError('Failed to load projects. Please try again later.');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ProjectCard = ({ project, showLeadSchool = false }: { project: Project; showLeadSchool?: boolean }) => (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
      <img
        src={project.cover_image || placeholderImg}
        alt={project.title}
        className="rounded mb-2 w-full h-28 object-cover"
      />
      <span className="font-semibold text-center">{project.title}</span>
      {showLeadSchool && (
        <span className="text-xs text-gray-500 text-center">Lead School: {project.lead_school_name}</span>
      )}
      {project.short_description && (
        <span className="text-xs text-gray-600 text-center mt-1 line-clamp-2">
          {project.short_description}
        </span>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col w-full max-w-7xl py-8 px-4 gap-10">
        <div className="animate-pulse">
          <div className="h-64 md:h-80 bg-gray-200 rounded-2xl mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl w-60 h-40"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full max-w-7xl py-8 px-4 gap-10">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-7xl py-8 px-4 gap-10">
      {/* Hero Banner */}
      <section className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden flex items-center mb-4">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
          alt="Environmental Education Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-center h-full pl-10">
          <p className="text-white text-lg mb-2">Connect with schools worldwide to take real action for the planet.</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
            Welcome to <span className="text-green-200">GlobalClassrooms</span>,<br />
            {userName} <span className="inline-block">👋</span>
          </h1>
        </div>
      </section>

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Completed Projects</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} showLeadSchool={true} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Environmental Projects */}
      {featuredProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Environmental Projects</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Collaborations You Can Join */}
      {openCollaborations.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Collaborations You Can Join</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {openCollaborations.map((project) => (
              <ProjectCard key={project.id} project={project} showLeadSchool={true} />
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">What We&apos;re Achieving Together</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">500</span>
            <span className="text-gray-600 text-sm text-center">Total Schools Involved</span>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">200</span>
            <span className="text-gray-600 text-sm text-center">Total Environmental Projects</span>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">100</span>
            <span className="text-gray-600 text-sm text-center">Total Collaborations</span>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">50</span>
            <span className="text-gray-600 text-sm text-center">Total Countries Reached</span>
          </div>
        </div>
      </section>

      {/* See What Schools Are Doing */}
      {/* <section>
        <h2 className="text-2xl font-bold mb-4">See What Schools Are Doing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col">
            <img src={placeholderImg} alt="Project Update" className="rounded mb-2 w-full h-40 object-cover" />
            <span className="font-semibold">Project &quote;Green Our School&quote; update submitted</span>
            <span className="text-xs text-green-700">Maplewood Academy</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col">
            <img src={placeholderImg} alt="Collaboration Message" className="rounded mb-2 w-full h-40 object-cover" />
            <span className="font-semibold">Collaboration message from Ms. Evans</span>
            <span className="text-xs text-green-700">Lakeside High</span>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="flex flex-col items-center justify-center py-12">
        <h2 className="text-3xl font-extrabold mb-2 text-center">Ready to Create Your Next Impact?</h2>
        <p className="text-lg text-gray-600 mb-6 text-center">Start a new project or join a collaboration today.</p>
        <div className="flex gap-4">
          <Link href="/dashboard/collaborations/new">
            <button className="cursor-pointer bg-black text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-gray-900 transition">Start a Project</button>
          </Link>
          <Link href="/collaborations">
            <button className="bg-green-50 text-black px-6 py-3 rounded-full font-semibold text-lg hover:bg-green-100 transition">View Collaborations</button>

          </Link>
        </div>
      </section>
    </div>
  );
} 