import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { MagneticPortrait } from './MagneticPortrait';
import { ArrowRight, Copy, Check, Terminal, Sparkles, Brain, Eye, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  isDark: boolean;
  onExploreProjects: () => void;
  onOpenContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDark,
  onExploreProjects,
  onOpenContact,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#8b5cf6'],
    });
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline, Bio, and Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-mono backdrop-blur-md transition-all border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>AI Engineer & Data Scientist • Yuvaintern DS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display leading-[1.1] mb-5">
            <span className={isDark ? 'text-white' : 'text-zinc-900'}>
              Hi, I'm{' '}
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              {PERSONAL_INFO.name}
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 font-normal font-sans text-zinc-400">
              Building Next-Gen{' '}
              <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                LLMs & Vision AI
              </span>
            </span>
          </h1>

          {/* Subtitle / Bio */}
          <p className={`text-base sm:text-lg leading-relaxed mb-8 max-w-2xl ${
            isDark ? 'text-zinc-300' : 'text-zinc-600'
          }`}>
            {PERSONAL_INFO.bio}
          </p>

          {/* Interactive Shell / Model Inference Status Badge */}
          <div
            id="terminal-status-pill"
            className={`w-full max-w-xl p-3 rounded-2xl mb-8 font-mono text-xs flex items-center justify-between gap-3 border ${
              isDark
                ? 'bg-zinc-950/80 border-zinc-800 text-zinc-300 shadow-lg'
                : 'bg-white/90 border-zinc-200 text-zinc-700 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-emerald-400 shrink-0">dm@ai-engine:~$</span>
              <span className="truncate text-zinc-400">
                torch.cuda.is_available() ➔ <strong className="text-blue-400">True (vLLM & TensorRT)</strong>
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ready</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
            <button
              id="hero-explore-projects-btn"
              onClick={onExploreProjects}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Key Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-copy-email-btn"
              onClick={handleCopyEmail}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all border ${
                isDark
                  ? 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80'
                  : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-300 shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            <button
              id="hero-contact-modal-btn"
              onClick={onOpenContact}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Get in Touch</span>
            </button>
          </div>

          {/* Quick Domain Focus Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-800/40">
            <span className="text-xs font-mono text-zinc-500 mr-2">Specializations:</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Brain className="w-3.5 h-3.5" />
              <span>LLMs & Agentic RAG</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Eye className="w-3.5 h-3.5" />
              <span>Computer Vision & YOLO</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deep Learning Architectures</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Magnetic Morphing Portrait & Quick Stat Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-center justify-center"
        >
          <MagneticPortrait isDark={isDark} />

          {/* Quick Stats Grid below portrait */}
          <div className="w-full max-w-sm grid grid-cols-2 gap-3 mt-6">
            {PERSONAL_INFO.stats.map((stat, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-200'
                    : 'bg-white/60 border-zinc-200 text-zinc-800 shadow-sm'
                } backdrop-blur-sm`}
              >
                <div className="text-[11px] font-mono text-zinc-400">{stat.label}</div>
                <div className="text-sm font-bold font-display mt-0.5 tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
