"use client";
import Globe3D from '@/public/earth_globe/Globe3D';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

// Placeholder for Globe3D - replace with your actual import


export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('Earth');

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, #10b981 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, #10b981 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 pt-8">
        
        {/* Content Section */}
        <motion.div
          className="text-center mb-12 relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6"
            variants={fadeUp}
          >
            🌍 Global Environmental Education Platform
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] text-center"
            variants={fadeUp}
          >
            <span className="text-gray-900">Connecting children</span>
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">globally</span><br />
            <span className="text-gray-700">for better tomorrow</span><br />
            
          </motion.h1>
          
          <motion.h2
            className="text-2xl sm:text-3xl text-gray-600 font-medium mb-8 text-center leading-relaxed max-w-2xl mx-auto"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
          >
            Cross-Community STEM Learning for Sustainable Development
          </motion.h2>
          
          <motion.p
            className="text-lg sm:text-xl text-gray-500 mb-12 text-center leading-relaxed max-w-2xl mx-auto"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
          >
            Join a global community of students and educators working together on hands-on environmental projects. Make real impact while earning rewards for your contributions to sustainable development.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeUp}
            transition={{ delay: 0.45 }}
          >
            <button className="group px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
          </motion.div>
        </motion.div>

        {/* Background Globe - Behind content */}
       
      </div>
      <motion.div
          className="absolute bottom-0 inset-0 flex justify-center items-center pointer-events-none"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
          style={{ zIndex: 1 }}
        >
          <div className="w-full h-full opacity-30">
          
            <div className="relative w-full h-full">
              <Globe3D />
            </div>
          </div>
        </motion.div>
    </section>
  );
}