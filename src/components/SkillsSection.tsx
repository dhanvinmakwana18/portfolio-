import React from 'react';
import { motion } from 'motion/react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { PhysicsTechStack } from './PhysicsTechStack';
import { Cpu, Brain, Eye, Terminal, Sparkles, CheckCircle } from 'lucide-react';

interface SkillsSectionProps {
  isDark: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ isDark }) => {
  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Brain className="w-4 h-4 text-blue-400" />;
      case 1:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 2:
        return <Eye className="w-4 h-4 text-teal-400" />;
      default:
        return <Terminal className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section
      id="skills"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 bg-teal-500/10 text-teal-400 border border-teal-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Capabilities & Toolkit</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          Technical Skills & Physics Sandbox
        </h2>
        <p className={`mt-3 text-base sm:text-lg max-w-2xl ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          Specialized in deep learning architectures, multimodal LLM pipelines, and computer vision deployment.
        </p>
      </div>

      {/* Physics Tech Stack Sandbox (Special Template Feature) */}
      <div className="mb-16">
        <PhysicsTechStack isDark={isDark} />
      </div>

      {/* Skills Grid by Domain */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((cat, catIdx) => (
          <motion.div
            key={catIdx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className={`p-6 sm:p-7 rounded-3xl border transition-all ${
              isDark
                ? 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                : 'bg-white/70 border-zinc-200/90 hover:border-zinc-300 shadow-sm'
            } backdrop-blur-md`}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
                {getCategoryIcon(catIdx)}
              </div>
              <h3 className={`text-lg font-bold font-display tracking-tight ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>
                {cat.title}
              </h3>
            </div>

            <div className="space-y-3.5">
              {cat.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                      {skill.name}
                    </span>
                    <span className="text-zinc-400">{skill.level}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-zinc-800' : 'bg-zinc-200'
                  }`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + skillIdx * 0.05 }}
                      className={`h-full rounded-full ${
                        catIdx === 0
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          : catIdx === 1
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                          : catIdx === 2
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
