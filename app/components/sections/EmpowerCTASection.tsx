"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function EmpowerCTASection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <motion.img
            src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
            alt="Empowering Schools"
            className="w-full h-[340px] object-cover object-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          />
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Empowering Schools to Grow a Greener Future
            </motion.h2>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link href="/signin">
                <button className="px-6 py-3 rounded-lg bg-black text-white font-semibold text-lg shadow hover:bg-gray-900 transition">
                  Join as a School
                </button>
              </Link>
              <Link href="/donate">
                <button className="px-6 py-3 rounded-lg bg-white text-black font-semibold text-lg shadow hover:bg-gray-100 transition">
                  Donate
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 