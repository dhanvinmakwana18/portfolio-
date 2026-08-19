import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXPERIENCES, EDUCATION } from '../data/portfolioData';
import { Briefcase, GraduationCap, Calendar, MapPin, ChevronDown, CheckCircle2, Building, Sparkles } from 'lucide-react';

interface ExperienceEducationProps {
  isDark: boolean;
}

export const ExperienceEducation: React.FC<ExperienceEducationProps> = ({ isDark }) => {
  const [expandedExp, setExpandedExp] = useState<string | null>(EXPERIENCES[0]?.id || null);

  const toggleExp = (id: string) => {
    setExpandedExp(expandedExp === id ? null : id);
  };

  return (
    <section
      id="experience"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Experience Timeline */}
        <div className="lg:col-span-7">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career History & Internships</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Experience
            </h2>
            <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Hands-on contributions in machine learning research, data preprocessing, and statistical modeling.
            </p>
          </div>

          <div className="space-y-4">
            {EXPERIENCES.map((exp) => {
              const isExpanded = expandedExp === exp.id;
              return (
                <div
                  key={exp.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isDark
                      ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-zinc-700'
                      : 'bg-white/80 border-zinc-200/90 hover:border-zinc-300 shadow-sm'
                  } backdrop-blur-md`}
                >
                  <button
                    onClick={() => toggleExp(exp.id)}
                    className="w-full p-6 sm:p-7 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className={`text-xl font-bold font-display tracking-tight ${
                            isDark ? 'text-white' : 'text-zinc-900'
                          }`}>
                            {exp.role}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {exp.type}
                          </span>
                        </div>
                        <div className={`text-sm font-semibold text-blue-400 mb-2`}>
                          {exp.company}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-2 rounded-full transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 bg-zinc-800 text-white' : 'bg-transparent text-zinc-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 sm:px-7 pb-7 pt-2 border-t border-zinc-800/50"
                      >
                        <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {exp.description}
                        </p>

                        <div className="space-y-2.5 mb-5">
                          {exp.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/40">
                          {exp.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className={`px-2.5 py-0.5 rounded text-[11px] font-mono ${
                                isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-800'
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Education List */}
        <div className="lg:col-span-5">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Background</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Education
            </h2>
            <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Formal engineering degree and mathematical science foundation.
            </p>
          </div>

          <div className="space-y-5">
            {EDUCATION.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                  isDark
                    ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                    : 'bg-white/80 border-zinc-200/90 hover:border-zinc-300 shadow-sm'
                } backdrop-blur-md`}
              >
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{edu.period}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{edu.location}</span>
                </div>

                <h3 className={`text-xl font-bold font-display tracking-tight mb-1 ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                  {edu.institution}
                </h3>

                <div className="text-sm font-semibold text-indigo-400 mb-2">
                  {edu.degree}
                </div>

                <div className="text-xs font-mono text-zinc-400 mb-4">
                  {edu.field}
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800/50">
                  {edu.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-zinc-300' : 'text-zinc-600'}>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
