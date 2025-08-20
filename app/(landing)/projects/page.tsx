import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load components for better performance
const ProjectsHeroSection = dynamic(() => import("@/app/components/sections/ProjectsHeroSection"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
});

const ProjectsGridSection = dynamic(() => import("@/app/components/sections/ProjectsGridSection"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
});

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
        <ProjectsHeroSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}>
        <ProjectsGridSection />
      </Suspense>
    </div>
  );
}
