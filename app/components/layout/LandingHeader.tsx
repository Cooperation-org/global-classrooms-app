'use client'
import React, { useState } from 'react';
import Link from 'next/link';

// Utility function for smooth scrolling with header offset
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 72; // Height of the sticky header
    const elementPosition = element.offsetTop - headerHeight;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

interface NavLink {
  href?: string;
  sectionId?: string;
  label: string;
  type: 'link' | 'scroll';
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', type: 'link' },
  { sectionId: 'why-we-exist', label: 'Why We Exist', type: 'scroll' },
  { sectionId: 'how-it-works', label: 'How It Works', type: 'scroll' },
  { sectionId: 'what-we-offer', label: 'What We Offer', type: 'scroll' },
  { href: '/projects', label: 'Projects', type: 'link' },
  { href: '/impact', label: 'Impact', type: 'link' },
  { href: '/contact', label: 'Contact', type: 'link' },
];

const LandingHeader: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo and subtitle */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-gray-900">EGR</span>
            <span className="text-xs text-green-700 -mt-1">Educating Global Resilience</span>
          </div>
        </Link>
        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          {navLinks.map(link => (
            link.type === 'scroll' ? (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId!)}
                className="text-gray-700 font-medium hover:text-green-700 transition"
              >
                {link.label}
              </button>
            ) : (
              <Link key={link.href} href={link.href!} className="text-gray-700 font-medium hover:text-green-700 transition">
                {link.label}
              </Link>
            )
          ))}
        </nav>
        {/* Buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/signin">
            <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition">Sign In</button>
          </Link>
          <Link href="/donate">
            <button className="px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-900 transition">Donate</button>
          </Link>
        </div>
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex flex-col" onClick={() => setMobileOpen(false)}>
          <nav
            className="bg-white w-full max-w-xs h-full shadow-xl p-6 flex flex-col animate-slide-in-left relative"
            style={{ minWidth: 260 }}
            onClick={e => e.stopPropagation()}
            aria-label="Mobile menu"
          >
            <button
              className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center space-x-3 mb-8 mt-2">
              <div className="w-8 h-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-lg text-gray-900">EGR</span>
                <span className="text-xs text-green-700 -mt-1">Educating Global Resilience</span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 mb-8">
              {navLinks.map(link => (
                link.type === 'scroll' ? (
                  <button
                    key={link.sectionId}
                    onClick={() => {
                      scrollToSection(link.sectionId!);
                      setMobileOpen(false);
                    }}
                    className="text-gray-700 font-medium hover:text-green-700 transition text-lg text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="text-gray-700 font-medium hover:text-green-700 transition text-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
            <div className="flex flex-col space-y-3 mt-auto">
              <Link href="/signin">
                <button className="w-full px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition">Sign In</button>
              </Link>
              <Link href="/donate">
                <button className="w-full px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-900 transition">Donate</button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader; 