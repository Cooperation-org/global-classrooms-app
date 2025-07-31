import WhatWeOfferSection from '../../components/sections/WhatWeOfferSection';

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
        <WhatWeOfferSection />
      </div>
    </main>
  );
} 