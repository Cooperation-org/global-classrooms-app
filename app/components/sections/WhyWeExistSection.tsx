"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaUserFriends, FaSchool, FaGlobe, FaSeedling } from 'react-icons/fa';

const features = [
  {
    icon: <FaUserFriends className="text-lg text-white" />,
    title: 'Empower Students',
    desc: 'Let them lead real-world climate projects and initiatives',
  },
  {
    icon: <FaSchool className="text-lg text-white" />,
    title: 'Equip Schools',
    desc: 'Provide comprehensive resources, tools, and visibility',
  },
  {
    icon: <FaGlobe className="text-lg text-white" />,
    title: 'Unite Globally',
    desc: 'Connect schools across borders for common environmental goals',
  },
  {
    icon: <FaSeedling className="text-lg text-white" />,
    title: 'Make Impact Measurable',
    desc: 'Track trees planted, students reached, and actions taken',
  },
];

export default function WhyWeExistSection() {
  return (
    <section className="bg-[#f7f8fa] py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16 md:gap-20">
        {/* Left: Image */}
        <motion.div
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <img
            src="/why-we-exist.jpg"
            alt="Children planting a tree"
            className="rounded-2xl shadow-lg w-full max-w-lg object-cover"
            style={{ aspectRatio: '4/3' }}
          />
        </motion.div>
        {/* Right: Content */}
        <div className="flex-1 min-w-[320px] flex flex-col items-start">
          {/* Title with lines */}
          <motion.div
            className="flex items-center w-full mb-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <span className="flex-1 h-px bg-gray-300 mr-4 hidden sm:block" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 whitespace-nowrap tracking-tight">Why We Exists</h2>
            <span className="flex-1 h-px bg-gray-300 ml-4 hidden sm:block" />
          </motion.div>
          <motion.p
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-left leading-tight"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Because education should<br />grow more than minds.
          </motion.p>
          {/* Feature list with left border */}
          <motion.div
            className="flex flex-col border-l-2 border-gray-200 pl-6 w-full max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="flex items-start gap-4 py-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <span className="bg-black rounded-lg p-2 flex items-center justify-center min-w-[40px] min-h-[40px]">
                  {f.icon}
                </span>
                <div>
                  <div className="font-bold text-gray-900 mb-1 text-base">{f.title}</div>
                  <div className="text-gray-500 text-sm leading-snug">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 