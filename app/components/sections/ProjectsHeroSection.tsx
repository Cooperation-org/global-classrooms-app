import React from 'react';

const ProjectsHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Projects
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover collaborative environmental education projects that connect schools worldwide, 
          fostering global awareness and sustainable practices.
        </p>
        
        {/* Stats Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-12">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-400">50+</div>
            <div className="text-sm sm:text-base text-gray-200">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-400">200+</div>
            <div className="text-sm sm:text-base text-gray-200">Participating Schools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-400">15,000+</div>
            <div className="text-sm sm:text-base text-gray-200">Students Engaged</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsHeroSection;
