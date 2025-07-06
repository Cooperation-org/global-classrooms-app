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

export default function HeroSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Main content */}
        <motion.div
          className="flex-1 max-w-2xl flex flex-col items-start justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight text-left"
            variants={fadeUp}
          >
            Environmental<br />Education<br />Reimagined
          </motion.h1>
          <motion.h2
            className="text-xl sm:text-2xl text-gray-700 font-medium mb-4 text-left"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
          >
            Cross-Community STEM Learning for Sustainable Development
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-500 mb-8 text-left max-w-xl"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
          >
            Join a global community of students and educators working together on hands-on environmental projects. Make real impact while earning rewards for your contributions to sustainable development.
          </motion.p>
          <motion.div
            className="flex gap-4"
            variants={fadeUp}
            transition={{ delay: 0.45 }}
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
        </motion.div>
        {/* Right: Feature cards */}
        <motion.div
          className="flex-1 w-full max-w-md flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              className="rounded-2xl bg-gradient-to-br from-[#f6fcf8] to-white border border-gray-200 p-6 flex items-start gap-4 shadow-sm"
              variants={fadeUp}
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
        </motion.div>
      </div>
    </section>
  );
} 