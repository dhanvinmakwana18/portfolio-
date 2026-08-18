import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ArrowUpRight, Github, Brain, Eye, Sparkles, Activity, Layers } from 'lucide-react';

interface ProjectsSectionProps {
  isDark: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ isDark }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured AI Engineering Case Studies</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            Key Projects
          </h2>
          <p className={`mt-3 text-base sm:text-lg max-w-2xl ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            Focusing on production-grade Large Language Model systems (Agentic RAG) and Edge-Optimized Computer Vision perception pipelines.
          </p>
        </div>

        <div className={`text-xs font-mono px-3.5 py-1.5 rounded-full border self-start md:self-auto ${
          isDark ? 'bg-zinc-900/80 text-zinc-400 border-zinc-800' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
        }`}>
          <span>2 Flagship Implementations</span>
        </div>
      </div>

      {/* Projects Grid: 2 High-Craft Key Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PROJECTS.map((project, index) => {
          const isLLM = project.category === 'LLMs & GenAI';
          return (
            <motion.div
              key={project.id}
              id={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isDark
                  ? 'bg-zinc-900/60 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 shadow-xl shadow-black/40 hover:shadow-2xl'
                  : 'bg-white/80 hover:bg-white border-zinc-200/90 hover:border-zinc-300 shadow-lg shadow-zinc-200/50 hover:shadow-xl'
              } backdrop-blur-lg`}
            >
              {/* Project Card Media / Graphic Visual Area */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-90"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-900/90 border border-zinc-700/70 text-zinc-200 backdrop-blur-md">
                    {isLLM ? (
                      <Brain className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-teal-400" />
                    )}
                    <span>{project.category}</span>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                    {project.badge}
                  </span>
                </div>

                {/* Key Metrics Chips on bottom of image */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 z-10">
                  {project.metrics.slice(0, 2).map((metric, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900/85 border border-zinc-700/60 backdrop-blur-md"
                    >
                      <div className="text-[10px] font-mono text-zinc-400">{metric.label}</div>
                      <div className="text-sm font-bold font-display text-white">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Content Area */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className={`text-2xl font-bold font-display tracking-tight mb-2 group-hover:text-blue-400 transition-colors ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {project.title}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-6 ${
                    isDark ? 'text-zinc-300' : 'text-zinc-600'
                  }`}>
                    {project.description}
                  </p>

                  {/* Architecture quick preview */}
                  <div className={`p-3.5 rounded-2xl mb-6 border font-mono text-xs ${
                    isDark ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                  }`}>
                    <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                      <Layers className="w-3.5 h-3.5" /> Pipeline Architecture
                    </div>
                    <p className="line-clamp-2">{project.architectureOverview}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium ${
                          isDark
                            ? 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-3">
                  <button
                    id={`view-study-btn-${project.id}`}
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>View Case Study & Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View source code on GitHub"
                      className={`p-2.5 rounded-full border transition-colors ${
                        isDark
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
                      }`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        isDark={isDark}
      />
    </section>
  );
};
