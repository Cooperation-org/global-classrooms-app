import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load all heavy sections
const HeroSection = dynamic(() => import("../components/sections/HeroSection"), {
  loading: () => <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
});

const WhyWeExistSection = dynamic(() => import("../components/sections/WhyWeExistSection"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
});

const HowItWorksSection = dynamic(() => import("../components/sections/HowItWorksSection"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
});

const WhatWeOfferSection = dynamic(() => import("../components/sections/WhatWeOfferSection"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
});

const GlobalImpactSection = dynamic(() => import("../components/sections/GlobalImpactSection"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
});

const EmpowerCTASection = dynamic(() => import("../components/sections/EmpowerCTASection"), {
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
        <HeroSection />
      </Suspense>
      
      <div id="why-we-exist" className="scroll-mt-16">
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}>
          <WhyWeExistSection />
        </Suspense>
      </div>
      
      <div id="how-it-works" className="scroll-mt-16">
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}>
          <HowItWorksSection />
        </Suspense>
      </div>
      
      <div id="what-we-offer" className="scroll-mt-16">
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}>
          <WhatWeOfferSection />
        </Suspense>
      </div>
      
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}>
        <GlobalImpactSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}>
        <EmpowerCTASection />
      </Suspense>
    </div>
  );
}
