import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the heavy component
const WhatWeOfferSection = dynamic(
  () => import('../../components/sections/WhatWeOfferSection'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    ),
  }
);

export default function WhatWeOfferPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#f6fcf8] to-white">
      {/* Static background element - much faster */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 80%, #bbf7d0 0%, transparent 70%)',
          opacity: 0.25,
          zIndex: 0,
        }}
      />
      <div className="relative z-10">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        }>
          <WhatWeOfferSection />
        </Suspense>
      </div>
    </main>
  );
} 