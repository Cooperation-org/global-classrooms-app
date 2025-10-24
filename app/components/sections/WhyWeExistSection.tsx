"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaUserFriends, FaSchool, FaGlobe, FaSeedling } from 'react-icons/fa';
import { useViewportScroll, useTransform } from 'framer-motion';

const features = [
  {
    icon: <FaUserFriends className="text-2xl text-green-700" />,
    title: 'Empower Students',
    desc: 'Let them lead real-world climate projects and initiatives',
  },
  {
    icon: <FaSchool className="text-2xl text-green-700" />,
    title: 'Equip Schools',
    desc: 'Provide comprehensive resources, tools, and visibility',
  },
  {
    icon: <FaGlobe className="text-2xl text-green-700" />,
    title: 'Unite Globally',
    desc: 'Connect schools across borders for common environmental goals',
  },
  {
    icon: <FaSeedling className="text-2xl text-green-700" />,
    title: 'Make Impact Measurable',
    desc: 'Track trees planted, students reached, and actions taken',
  },
];

const cardVariants = {
  offscreen: { opacity: 0, y: 60, scale: 0.95, rotate: -6 },
  onscreen: { opacity: 1, y: 0, scale: 1, rotate: 0 },
};

export default function WhyWeExistSection() {
  const { scrollY } = useViewportScroll();
  // Parallax: image moves at 40% of scroll speed up to -200px
  const y = useTransform(scrollY, [0, 500], [0, -200]);

  return (
    <section className="relative py-28 bg-white overflow-hidden">
      {/* Parallax eco-themed image background */}
      <motion.img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        alt="Seedling growing in hands"
        style={{
          y,
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.18,
          pointerEvents: 'none',
          filter: 'blur(1.5px) saturate(1.1)',
        }}
      />
      {/* Animal decorations - responsive positioning */}
      <motion.div
        className='absolute inset-0 opacity-40 pointer-events-none'
      >
        <motion.img
          src="/vecteezy-flock-of-birds.png"
          alt="Cut out flock of birds flying"
          className='w-24 sm:w-32 md:w-36 lg:w-40'
          style={{
            position: 'absolute',
            bottom: '85%',
            right: '80%',
            objectFit: 'cover',
            zIndex: 5,
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.img
          src="/vecteezy-white-arctic-hare-rabbit.png"
          alt="White hare"
          className='w-16 sm:w-20 md:w-24'
          style={{
            position: 'absolute',
            bottom: '40%',
            right: '90%',
            objectFit: 'cover',
            zIndex: 5,
          }}
        />
        <motion.img
          src="/vecteezy-squirrel.png"
          alt="Squirrel side profile"
          className='right-[50%] sm:right-[40%] w-14 sm:w-16 md:w-16 lg:w-18'
          style={{
            position: 'absolute',
            bottom: '40%',
            objectFit: 'cover',
            zIndex: 4,
          }}
        />
        <motion.img
          src="/vecteezy-deer.png"
          alt="Adult male deer side profile in 3D"
          className='right-0 sm:right-[5%] md:right-[7%] lg:right-[9%] w-36 sm:w-40 md:w-48 lg:w-56 object-contain'
          style={{
            position: 'absolute',
            bottom: '38%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
        <motion.img
          src="/vecteezy-young-deer.png"
          alt="Little fawn side profile in 3D"
          className='right-[20%] sm:right-[15%] md:right-[17%] lg:right-[19%] w-16 sm:w-18 md:w-22 lg:w-24 object-contain'
          style={{
            position: 'absolute',
            bottom: '40%',
            objectFit: 'cover',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />
      </motion.div>
      
      {/* Animated SVG eco background */}
      <motion.svg
        className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.2 }}
      >
        <motion.path
          d="M0,400 Q360,300 720,400 T1440,400 V600 H0 Z"
          fill="#27ae60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="1200"
          cy="120"
          r="80"
          fill="#145a32"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
        />
        <motion.circle
          cx="300"
          cy="80"
          r="40"
          fill="#27ae60"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, delay: 0.7, type: 'spring' }}
        />
      </motion.svg>
      <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Content and cards (image is now background) */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 text-center drop-shadow-lg">
              Why We Exist
            </h2>
            <p className="mt-4 text-xl sm:text-2xl font-medium text-green-800 text-center max-w-2xl mx-auto animate-pulse">
              Because education should <span className="text-green-600">grow more than minds</span>.
            </p>
          </motion.div>
          {/* Animated feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mt-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-7 flex flex-col items-center text-center border border-green-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
                transition={{
                  type: 'spring',
                  bounce: 0.35,
                  duration: 0.8,
                  delay: 0.2 + i * 0.13,
                }}
              >
                <span className="bg-green-100 group-hover:bg-green-200 rounded-full p-4 mb-4 shadow-md transition-colors duration-300">
                  {f.icon}
                </span>
                <div className="font-bold text-green-900 mb-1 text-lg">{f.title}</div>
                <div className="text-green-700 text-sm leading-snug">{f.desc}</div>
                {/* Floating animated leaf SVG */}
                <motion.svg
                  className="absolute -top-6 -right-6 w-8 h-8 opacity-30"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', delay: i * 0.3 }}
                >
                  <path d="M16 2C10 10 2 16 16 30C30 16 22 10 16 2Z" fill="#27ae60" />
                </motion.svg>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 