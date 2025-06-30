import React from 'react';
import LandingHeader from "../components/layout/LandingHeader";
import Footer from "../components/layout/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      {children}
      <Footer />
    </>
  );
} 