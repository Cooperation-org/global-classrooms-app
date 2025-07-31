import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">EGR</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
          <Link href="/courses" className="transition-colors hover:text-foreground/80">
            Courses
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80">
            Contact
          </Link>
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