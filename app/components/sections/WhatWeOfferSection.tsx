"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { icons } from '../icons/icons';

const features = [
  {
    icon: icons.schools,
    label: 'Global Collaborations',
    title: <><b>Create & Join Global Projects</b></>,
  },
  {
    icon: icons.impact,
    label: 'Education Features',
    title: <><b>Student Progress Tracking</b></>,
  },
  {
    icon: icons.schools,
    label: 'Education Features',
    title: <><b>Teacher-friendly Dashboards</b></>,
  },
  {
    icon: icons.rewards,
    label: 'Rewards',
    title: <><b>Earn rewards via GoodDollar UBI</b></>,
  },
  {
    icon: icons.schools,
    label: 'Community Tools',
    title: <><b>Cross-school Collaboration</b></>,
  },
  {
    icon: icons.impact,
    label: 'Community Tools',
    title: <><b>Shareable Certificates</b></>,
  },
];

export default function WhatWeOfferSection() {
  return (
    <section className="py-24">
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
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 whitespace-nowrap">What We Offer</h2>
          <span className="flex-1 h-px bg-gray-300 ml-4 hidden sm:block" />
        </motion.div>
        <motion.p
          className="text-center text-xl text-gray-500 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          A platform for regenerative education, built for scale.
        </motion.p>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Features grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="rounded-xl bg-[#f6fcf8] p-6 flex items-center gap-4 shadow-sm"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <span className="w-12 h-12 rounded-lg bg-[#e6f4ea] flex items-center justify-center text-2xl text-green-600">
                  {f.icon}
                </span>
                <div>
                  <div className="text-green-600 font-semibold text-sm mb-1">{f.label}</div>
                  <div className="font-bold text-gray-900 text-base leading-snug">{f.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Right: Image */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <img
              src="/what-we-offer.jpg"
              alt="Classroom"
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
              style={{ aspectRatio: '4/3' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 