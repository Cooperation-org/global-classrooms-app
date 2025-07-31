import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#E5E7EB] flex flex-col">
      {/* Navigation */}
      <nav className="w-full p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">EGR</span>
          </div>
          
          {/* Navigation items can be added here if needed */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Add nav items here if needed */}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center space-x-6 text-xs text-gray-500">
            <span>© 2025 EGR</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}