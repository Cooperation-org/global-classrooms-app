"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { icons } from '../icons/icons';

const stats = [
  {
    icon: icons.impact, // Replace with a tree icon if available
    value: '3500+',
    label: 'Trees Planted',
  },
  {
    icon: icons.schools,
    value: '2',
    label: 'Schools Participated',
  },
  {
    icon: icons.collaborations, // Replace with a globe icon if available
    value: '1',
    label: 'Countries Engaged',
  },
  {
    icon: icons.projects, // Replace with a teacher icon if available
    value: '50+',
    label: 'Teachers Onboarded',
  },
  {
    icon: icons.rewards, // Replace with a graduate icon if available
    value: '150+',
    label: 'Students Impacted',
  },
  
];

export default function GlobalImpactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          Our Global Impact
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl bg-[#f6f8fa] flex flex-col items-center justify-center p-8 text-center shadow-sm"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <span className="text-green-600 text-4xl mb-3">{stat.icon}</span>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-base font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 