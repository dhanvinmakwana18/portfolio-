import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { X, ExternalLink, Github, CheckCircle2, Cpu, Layers, Sparkles, Activity } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  isDark,
}) => {
  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div
        id="project-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl border ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
              : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Close button */}
          <button
            id="close-project-modal-btn"
            onClick={onClose}
            aria-label="Close project modal"
            className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
              isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {project.category}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Featured AI Architecture
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight mb-2">
            {project.title}
          </h2>
          <p className={`text-sm sm:text-base mb-6 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
            {project.subtitle}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {project.metrics.map((metric, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="text-[11px] font-mono text-zinc-400">{metric.label}</div>
                <div className="text-lg font-bold font-display text-blue-400 mt-0.5">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Detailed Description */}
          <div className="mb-6">
            <h3 className="text-sm font-bold font-mono tracking-wider text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" /> Executive Overview
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {project.longDescription}
            </p>
          </div>

          {/* Architecture Blueprint */}
          <div className={`p-4 rounded-2xl mb-6 border ${
            isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <h4 className="text-xs font-bold font-mono text-indigo-400 uppercase mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Pipeline Flow & Architecture
            </h4>
            <p className="font-mono text-xs text-zinc-400 leading-relaxed">
              {project.architectureOverview}
            </p>
          </div>

          {/* Key Engineering Features */}
          <div className="mb-6">
            <h3 className="text-sm font-bold font-mono tracking-wider text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-400" /> Key Innovations & Engineering Highlights
            </h3>
            <div className="space-y-2.5">
              {project.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="mb-8">
            <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2.5">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                    isDark
                      ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      : 'bg-zinc-100 text-zinc-800 border border-zinc-300'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
                    : 'bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-300 shadow-sm'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>View Repository</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="ml-auto px-5 py-2.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
