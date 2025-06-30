"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { icons } from '../icons/icons';

const steps = [
  {
    icon: icons.projects, // Replace with a clipboard icon if available
    title: 'Register your school',
    desc: 'School admins onboard and invite teachers/students',
  },
  {
    icon: icons.schools, // Replace with a book or module icon if available
    title: 'Access learning modules',
    desc: 'Climate & sustainability curriculum integrated into classrooms',
  },
  {
    icon: icons.impact, // Replace with a plant/growth icon if available
    title: 'Take real-world action',
    desc: 'Students complete eco-challenges',
  },
  {
    icon: icons.rewards, // Replace with a trophy icon if available
    title: 'Track and celebrate impact',
    desc: 'Schools receive badges, dashboards, and recognition',
  },
  {}
];

export default function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-b from-[#f6fcf8] to-white py-24">
      <div className="container mx-auto px-4">
        {/* Title with lines */}
        <motion.div
          className="flex items-center justify-center w-full mb-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <span className="flex-1 h-px bg-gray-300 mr-4 hidden sm:block" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 whitespace-nowrap">How It Works</h2>
          <span className="flex-1 h-px bg-gray-300 ml-4 hidden sm:block" />
        </motion.div>
        <motion.p
          className="text-center text-lg sm:text-xl text-gray-500 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          From signup to action — we make climate education easy.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="rounded-2xl bg-white shadow-sm border border-gray-200 flex flex-col items-center p-8 text-center"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <span className="text-green-600 text-2xl font-bold mb-2">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-12 h-12 rounded-full bg-[#e6f4ea] flex items-center justify-center mb-4 text-2xl text-green-600">
                {step.icon}
              </span>
              <div className="font-bold text-lg text-gray-900 mb-2">{step.title}</div>
              <div className="text-gray-500 text-base">{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 