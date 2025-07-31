"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DonationSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [donationAmount] = useState(100); // Default, will be fetched from session

  useEffect(() => {
    // In a real app, you would fetch session details from your backend
    if (sessionId) {
      // Simulate loading and fetch donation details
      setTimeout(() => {
        setLoading(false);
        // Here you would fetch the actual donation amount from the session
      }, 1000);
    }
  }, [sessionId]);

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch('/api/download-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const htmlContent = await response.text();
        // Open receipt in new tab
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
      } else {
        console.error('Failed to generate receipt');
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch('/api/download-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const htmlContent = await response.text();
        // Open certificate in new tab
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
      } else {
        console.error('Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your donation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* Clapping Hands Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="text-3xl">👏</div>
            {/* Radiating lines effect */}
            <div className="absolute inset-0 rounded-full border-2 border-yellow-200 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border border-yellow-300 animate-ping"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank you for your donation
          </h1>
          
          {/* Sub-heading */}
          <p className="text-gray-600 mb-6">
            A receipt has been sent to your email
          </p>

          {/* Donation Summary */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Your Donation</span>
            </div>
            <span className="text-xl font-bold text-gray-900">${donationAmount}</span>
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleDownloadReceipt}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg"
            >
              View Receipt
            </Button>
            
            <Button 
              onClick={handleDownloadCertificate}
              variant="outline"
              className="w-full border-gray-900 text-gray-900 hover:bg-gray-50 font-medium py-3 rounded-lg"
            >
              View Certificate of Honor
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Questions about your donation? Contact us at{' '}
              <a href="mailto:support@globalclassrooms.org" className="text-green-600 hover:underline">
                support@globalclassrooms.org
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSuccessPage; 