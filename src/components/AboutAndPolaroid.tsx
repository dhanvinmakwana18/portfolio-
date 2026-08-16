import React from 'react';
import { motion } from 'motion/react';
import { POLAROID_SNAPSHOTS, PERSONAL_INFO } from '../data/portfolioData';
import { Sparkles, Terminal, Code2, Cpu, Compass } from 'lucide-react';

interface AboutAndPolaroidProps {
  isDark: boolean;
}

export const AboutAndPolaroid: React.FC<AboutAndPolaroidProps> = ({ isDark }) => {
  return (
    <section
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Behind the Code & Research</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          About Dhanvin Makwana
        </h2>
        <p className={`mt-3 text-base sm:text-lg ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          Bridging mathematical foundations with scalable artificial intelligence engineering.
        </p>
      </div>

      {/* Polaroid Photo Strip Gallery */}
      <div className="mb-16">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Research & Engineering Highlights Snapshot</span>
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

      {/* Deep Bio & Engineering Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className={`lg:col-span-8 p-8 rounded-3xl border ${
          isDark ? 'bg-zinc-900/50 border-zinc-800/80' : 'bg-white/70 border-zinc-200/90 shadow-sm'
        } backdrop-blur-md flex flex-col justify-between`}>
          <div>
            <h3 className={`text-2xl font-bold font-display mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Engineering Intelligent Systems with Rigor
            </h3>
            <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p>
                My passion is architecting machine learning systems that move beyond theoretical models into high-reliability production environments. As an AI Engineer and Data Scientist, I combine statistical intuition with modern MLOps pipelines to deliver real-time performance.
              </p>
              <p>
                During my internship at <strong>Yuvaintern</strong>, I specialized in data cleaning workflows, exploratory data analysis, and predictive model benchmarking. Concurrently, my academic path at <strong>Silver Oak University</strong> and foundational science schooling at <strong>Bhagwati Vidyalay</strong> provided the mathematical depth required to understand loss optimization, backpropagation, and transformer attention mechanisms from first principles.
              </p>
              <p>
                Whether fine-tuning quantized LLMs for agentic retrieval or compiling computer vision backbones with TensorRT for edge robotics, I take pride in clean code, reproducible experiments, and low-latency execution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-zinc-800/50">
            <div>
              <div className="text-xs font-mono text-zinc-400">Location</div>
              <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {PERSONAL_INFO.location}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-zinc-400">Current Role</div>
              <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Data Science Intern
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-xs font-mono text-zinc-400">Availability</div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                Open to Opportunities
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars / Values Card */}
        <div className={`lg:col-span-4 p-8 rounded-3xl border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900/50 border-zinc-800/80' : 'bg-white/70 border-zinc-200/90 shadow-sm'
        } backdrop-blur-md`}>
          <div>
            <h3 className={`text-xl font-bold font-display mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Guiding Principles
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">First-Principles ML</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Understanding gradient dynamics and architecture tradeoffs before abstracting.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Edge & Latency First</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Quantization, ONNX, and TensorRT acceleration for instant inference.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Autonomous Reasoning</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Designing self-reflective Agentic RAG and tool-calling loops with zero hallucinations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 mt-6 text-xs font-mono text-zinc-400">
            <span className="text-blue-400 font-bold">&gt;</span> "Transforming raw numbers into predictive intelligence."
          </div>
        </div>
      </div>
    </section>
  );
};
