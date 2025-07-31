import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the heavy component
const WhyWeExistSection = dynamic(
  () => import('../../components/sections/WhyWeExistSection'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    ),
  }
);

export default function WhyWeExistPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }>
        <WhyWeExistSection />
      </Suspense>
    </div>
  );
}