import React from 'react';
import LandingHeader from "../components/layout/LandingHeader";
import Footer from "../components/layout/Footer";
import ClientPathNameSync from '../components/misc/ClientPathNameSync';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <ClientPathNameSync />
      <LandingHeader />
      {children}
      <Footer />
    </>
  );
} 