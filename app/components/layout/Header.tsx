import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

// Utility function for smooth scrolling with header offset
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 56; // Height of the sticky header
    const elementPosition = element.offsetTop - headerHeight;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <div className="w-6 h-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span className="font-bold text-green-800">EGR - Educating Global Resilience</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <button 
            onClick={() => scrollToSection('why-we-exist')}
            className="relative transition-all duration-200 hover:text-green-600 hover:scale-105 cursor-pointer font-medium group"
          >
            Why We Exist
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="relative transition-all duration-200 hover:text-green-600 hover:scale-105 cursor-pointer font-medium group"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('what-we-offer')}
            className="relative transition-all duration-200 hover:text-green-600 hover:scale-105 cursor-pointer font-medium group"
          >
            What We Offer
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
          </button>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/signin">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signin">
            <Button size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 