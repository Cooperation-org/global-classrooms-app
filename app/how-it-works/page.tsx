import HowItWorksSection from '../components/sections/HowItWorksSection';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

export default function HowItWorksPage() {
  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, 500], [0, -120]);
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#f6fcf8] to-white overflow-hidden">
      {/* Parallax background element */}
      <motion.div
        style={{
          y,
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 60% 20%, #bbf7d0 0%, transparent 70%)',
          opacity: 0.25,
        }}
      />
      <div className="relative z-10">
        <HowItWorksSection />
      </div>
    </main>
  );
} 