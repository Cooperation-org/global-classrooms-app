"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFlask, FaGlobe, FaCoins } from 'react-icons/fa';

const features = [
  {
    icon: <FaFlask className="text-2xl text-gray-700" />,
    title: 'Hands-on Learning',
    desc: 'Real technology, real impact',
  },
  {
    icon: <FaGlobe className="text-2xl text-gray-700" />,
    title: 'Global Collaboration',
    desc: 'Connect students worldwide',
  },
  {
    icon: <FaCoins className="text-2xl text-gray-700" />,
    title: 'Earn G$ Tokens',
    desc: 'Environmental action = economic value',
  },
];

export default function HeroSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Main content */}
        <div className="flex-1 max-w-2xl flex flex-col items-start justify-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          >
            Environmental<br />Education<br />Reimagined
          </motion.h1>
          <motion.h2
            className="text-xl sm:text-2xl text-gray-700 font-medium mb-4 text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            Cross-Community STEM Learning for Sustainable Development
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-500 mb-8 text-left max-w-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
          >
            Join a global community of students and educators working together on hands-on environmental projects. Make real impact while earning rewards for your contributions to sustainable development.
          </motion.p>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
          >
            <Link href="/get-started">
              <button className="px-6 py-3 rounded bg-black text-white font-semibold text-lg shadow hover:bg-gray-900 transition">
                Get Started
              </button>
            </Link>
            <Link href="/about">
              <button className="px-6 py-3 rounded border border-gray-400 text-black font-semibold text-lg bg-white hover:bg-gray-100 transition">
                Learn More
              </button>
            </Link>
          </motion.div>
        </div>
        {/* Right: Feature cards */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="rounded-2xl bg-gradient-to-br from-[#f6fcf8] to-white border border-gray-200 p-6 flex items-start gap-4 shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.15, duration: 0.7, ease: 'easeOut' }}
            >
              <span className="flex items-center justify-center w-12 h-12 bg-[#f3f8ef] rounded-lg mr-3">
                {f.icon}
              </span>
              <div>
                <div className="font-semibold text-gray-900 text-lg mb-1">{f.title}</div>
                <div className="text-gray-500 text-sm">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 