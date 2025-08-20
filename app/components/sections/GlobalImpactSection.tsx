"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { icons } from '../icons/icons';

const stats = [
  {
    icon: icons.impact,
    value: '3,500+',
    label: 'Trees Planted',
  },
  {
    icon: icons.schools,
    value: '5',
    label: 'Schools Participated',
  },
  {
    icon: icons.collaborations,
    value: '3',
    label: 'Countries Engaged',
  },
  {
    icon: icons.projects,
    value: '50+',
    label: 'Teachers Onboarded',
  },
  {
    icon: icons.rewards,
    value: '150+',
    label: 'Students Impacted',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function GlobalImpactSection() {
  return (
    <section className="py-16 bg-white">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10"
          variants={fadeUp}
        >
          Our Global Impact
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl bg-[#f6f8fa] flex flex-col items-center justify-center p-8 text-center shadow-sm"
              variants={fadeUp}
            >
              <span className="text-green-600 text-4xl mb-3">{stat.icon}</span>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-base font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
} 