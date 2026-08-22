import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { POLAROID_SNAPSHOTS } from '../data/portfolioData';
import { Sparkles, Terminal, Code2, Compass, Layers, Zap, Target, Activity } from 'lucide-react';

interface AboutAndPolaroidProps {
  isDark: boolean;
}

const PHILOSOPHY_ITEMS = [
  { icon: Layers, title: "Real Systems Over Demos", desc: "I build robust, working implementations rather than superficial visual demonstrations." },
  { icon: Activity, title: "Measured Results", desc: "Performance is proven through rigorous measurement, not unsupported marketing claims." },
  { icon: Code2, title: "Beyond Abstractions", desc: "I strive to understand the underlying mathematics and algorithms, not just the high-level APIs." },
  { icon: Terminal, title: "Experiment & Iterate", desc: "Rapid prototyping followed by continuous refinement of existing systems." }
];

const EXPLORATION_AREAS = [
  "Agentic AI & RAG", "Deep Learning Architecture", "Edge Computer Vision", "Advanced Data Science", "MLOps Pipelines"
];

export const AboutAndPolaroid: React.FC<AboutAndPolaroidProps> = ({ isDark }) => {
  const [activePhilosophy, setActivePhilosophy] = useState<number | null>(null);

  return (
    <section
      id="about"
      className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Header */}
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Behind the Architecture</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          Dhanvin Makwana
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`mt-4 text-lg md:text-xl font-light ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          AI Engineer & Data Scientist.
        </motion.p>
      </div>

      {/* Progression Section */}
      <div className="flex flex-col gap-24 mb-24 relative">
        {/* Subtle connecting line */}
        <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block ${isDark ? 'bg-gradient-to-b from-transparent via-zinc-800 to-transparent' : 'bg-gradient-to-b from-transparent via-zinc-200 to-transparent'}`} />

        {/* WHO I AM */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="md:text-right">
            <h3 className={`text-xs font-mono tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>01. Who I Am</h3>
            <h4 className={`text-2xl md:text-3xl font-bold font-display mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              The Builder Behind the Code
            </h4>
            <p className={`leading-relaxed text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              I am an AI Engineer and Data Scientist driven by a profound curiosity for how complex systems operate. Beyond the technical roles and project lists, I am a continuous learner who views engineering not just as a job, but as a craft. I thrive on bridging the gap between deep mathematical theory and highly optimized, scalable intelligence.
            </p>
          </div>
          <div className={`p-8 rounded-3xl border backdrop-blur-md ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white/60 border-zinc-200 shadow-sm'}`}>
             <div className="space-y-4">
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-950/50 text-zinc-300' : 'bg-zinc-50 text-zinc-700'}`}>
                  <span className={`block text-xs font-mono mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Identity</span>
                  Engineer, Researcher, Data Scientist
                </div>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-950/50 text-zinc-300' : 'bg-zinc-50 text-zinc-700'}`}>
                  <span className={`block text-xs font-mono mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Mindset</span>
                  First-principles thinking applied to artificial intelligence
                </div>
             </div>
          </div>
        </div>

        {/* WHAT I BUILD & EXPLORE */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center flex-col-reverse md:flex-row">
          <div className={`order-2 md:order-1 p-8 rounded-3xl border backdrop-blur-md ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white/60 border-zinc-200 shadow-sm'}`}>
             <h5 className={`text-sm font-semibold mb-4 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Current Focus Areas</h5>
             <div className="flex flex-wrap gap-2">
               {EXPLORATION_AREAS.map((area, i) => (
                 <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                   {area}
                 </span>
               ))}
             </div>
          </div>
          <div className="order-1 md:order-2">
            <h3 className={`text-xs font-mono tracking-widest uppercase mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>02. What I Build & Explore</h3>
            <h4 className={`text-2xl md:text-3xl font-bold font-display mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Turning Ideas into Infrastructure
            </h4>
            <p className={`leading-relaxed text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              My work centers on developing intelligent systems that solve real-world problems. I construct autonomous Agentic AI architectures, engineer low-latency edge computer vision pipelines, and deploy predictive MLOps platforms. I am deeply interested in the expanding capabilities of Large Language Models, Generative AI, and the rigorous statistical foundations of Data Science.
            </p>
          </div>
        </div>

        {/* HOW I THINK (Interactive Philosophy) */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="md:text-right">
            <h3 className={`text-xs font-mono tracking-widest uppercase mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>03. How I Think</h3>
            <h4 className={`text-2xl md:text-3xl font-bold font-display mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Engineering Philosophy
            </h4>
            <p className={`leading-relaxed text-sm md:text-base mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              I approach technology with a craftsman's mindset. A project is never just a disposable script; it is an evolving system. I believe in continuous learning, iterative improvement, and measuring success through undeniable, reproducible metrics rather than marketing claims.
            </p>
          </div>
          <div className="space-y-3">
            {PHILOSOPHY_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activePhilosophy === idx;
              return (
                <motion.div 
                  key={idx}
                  onHoverStart={() => setActivePhilosophy(idx)}
                  onHoverEnd={() => setActivePhilosophy(null)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-default ${
                    isDark 
                      ? isActive ? 'bg-zinc-800 border-emerald-500/30' : 'bg-zinc-900/40 border-zinc-800' 
                      : isActive ? 'bg-white border-emerald-300 shadow-md' : 'bg-white/60 border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-zinc-950 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.title}</h4>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                              {item.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* WHERE I AM GOING */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center flex-col-reverse md:flex-row">
           <div className={`order-2 md:order-1 p-8 rounded-3xl border backdrop-blur-md text-center flex flex-col justify-center items-center ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white/60 border-zinc-200 shadow-sm'}`}>
             <Target className={`w-10 h-10 mb-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
             <h5 className={`font-display font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>The Next Frontier</h5>
             <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
               Pushing the boundaries of Edge AI, scalable machine learning lifecycles, and completely autonomous reasoning engines.
             </p>
          </div>
          <div className="order-1 md:order-2">
            <h3 className={`text-xs font-mono tracking-widest uppercase mb-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>04. Where I Am Going</h3>
            <h4 className={`text-2xl md:text-3xl font-bold font-display mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Long-Term Technical Direction
            </h4>
            <p className={`leading-relaxed text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              My ultimate goal is to architect intelligent systems that seamlessly integrate into the physical and digital world. I am constantly expanding my expertise in AI Systems Engineering, preparing to tackle increasingly complex challenges at the intersection of Data Science and large-scale software engineering.
            </p>
          </div>
        </div>

      </div>

      {/* Polaroid Photo Strip Gallery */}
      <div className="mt-20 pt-16 border-t border-zinc-800/40">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-8 flex items-center justify-center gap-2">
          <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <span>Research & Engineering Snapshot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {POLAROID_SNAPSHOTS.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
              style={{ rotate: photo.rotation }}
              className={`p-3.5 pb-5 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:shadow-2xl hover:shadow-black/70'
                  : 'bg-white border border-zinc-200 text-zinc-800 hover:shadow-2xl hover:shadow-zinc-400/40'
              }`}
            >
              {/* Photo Frame */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-950 mb-3 relative">
                <img
                  src={photo.img}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 opacity-85 hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
              </div>

              {/* Polaroid Caption */}
              <div className="px-1">
                <h4 className="text-xs font-bold font-display tracking-tight text-zinc-100 truncate">
                  {photo.title}
                </h4>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5 truncate">
                  {photo.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};
