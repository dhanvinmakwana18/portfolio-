import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Cpu, Sparkles, Binary, Zap } from 'lucide-react';

interface MagneticPortraitProps {
  isDark?: boolean;
}

export const MagneticPortrait: React.FC<MagneticPortraitProps> = ({ isDark = true }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth spring physics for magnetic 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.1, 0.95]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      id="magnetic-portrait-container"
      className="relative flex items-center justify-center p-4"
      style={{ perspective: 1000 }}
    >
      {/* Morphing ambient halo glow */}
      <motion.div
        animate={{
          scale: isHovered ? [1, 1.15, 1.05] : [1, 1.05, 1],
          rotate: [0, 90, 180, 270, 360],
          borderRadius: ['60% 40% 30% 70% / 60% 30% 70% 40%', '30% 60% 70% 40% / 50% 60% 30% 60%', '60% 40% 30% 70% / 60% 30% 70% 40%'],
        }}
        transition={{
          repeat: Infinity,
          duration: isHovered ? 8 : 14,
          ease: 'easeInOut',
        }}
        className={`absolute -inset-4 blur-2xl opacity-40 pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-teal-400/25'
            : 'bg-gradient-to-tr from-blue-300/40 via-indigo-200/30 to-teal-200/40'
        }`}
      />

      {/* Main 3D Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          filter: `brightness(${brightness})`,
        }}
        className={`relative w-72 sm:w-80 md:w-88 rounded-3xl p-3 sm:p-4 transition-shadow duration-500 cursor-pointer ${
          isDark
            ? 'bg-zinc-900/80 border border-zinc-800/80 shadow-2xl shadow-black/80'
            : 'bg-white/90 border border-zinc-200 shadow-2xl shadow-zinc-300/60'
        } backdrop-blur-xl group`}
      >
        {/* Inner Portrait Window */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-950 flex flex-col items-center justify-between p-6">
          {/* Background Neural Grid / Geometry */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

          {/* Morphing Shader Texture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950/90 z-10" />

          {/* Top Status Bar inside card */}
          <div className="relative z-20 w-full flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/60 backdrop-blur-md text-[11px] font-mono text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for AI Roles</span>
            </div>

            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              className="p-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-zinc-400"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </motion.div>
          </div>

          {/* Center Visual: High-Tech Avatar & AI Geometry */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Rotating outer orbital ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-blue-500/40"
              />
              {/* Counter rotating inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-indigo-400/30"
              />

              {/* Core Avatar Sphere with initials & AI motif */}
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-zinc-900 via-neutral-900 to-zinc-800 border-2 border-zinc-700/80 flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                <div className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-teal-300 bg-clip-text text-transparent">
                  DM
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Binary className="w-3 h-3 text-teal-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-400 tracking-wider">AI/ML</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Identity & Focus Tags */}
          <div className="relative z-20 w-full text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-1.5">
                  Dhanvin Makwana
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                </h3>
                <p className="text-xs font-mono text-zinc-400">AI Engineer & Data Scientist</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PyTorch • LLMs
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-indigo-400" /> Edge & Vision
              </span>
              <span>Yuvaintern DS</span>
            </div>
          </div>
        </div>

        {/* Specular Shine Reflection */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </div>
  );
};
