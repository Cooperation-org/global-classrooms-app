'use client';

import { useEffect } from 'react';

export default function DonatePage() {
  useEffect(() => {
    // Redirect to GoodCollective
    window.location.href = 'https://goodcollective.xyz/collective/0xf3d629a2c198fc91d7d3f18217684166c83c7312';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to GoodCollective...</h2>
        <p className="text-gray-600">
          If you're not redirected automatically, 
          <a 
            href="https://goodcollective.xyz/collective/0xf3d629a2c198fc91d7d3f18217684166c83c7312" 
            className="text-green-600 hover:text-green-700 underline ml-1"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}