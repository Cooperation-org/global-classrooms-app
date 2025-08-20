import React from 'react';

const ImpactHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Impact
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Measuring our collective environmental impact across schools worldwide. 
          See how we&apos;re making a difference for our planet&apos;s future.
        </p>
        
        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a 
            href="#metrics"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            View Our Impact
          </a>
          <a 
            href="/projects"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
          >
            Join a Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default ImpactHeroSection;
