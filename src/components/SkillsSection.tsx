import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPETENCY_TIERS, TECH_STACK_GROUPS } from '../data/portfolioData';
import { 
  Sparkles, 
  Brain, 
  Database, 
  Cpu, 
  Layers, 
  Eye, 
  Code2, 
  Terminal, 
  ArrowRight,
  Workflow,
  Search,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Bot,
  Network
} from 'lucide-react';

interface SkillsSectionProps {
  isDark: boolean;
}

type FilterType = 'all' | 'advanced-ai' | 'core-ml-datascience' | 'data-engineering' | 'tech-stack';

export const SkillsSection: React.FC<SkillsSectionProps> = ({ isDark }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const scrollToProject = (projectId?: string) => {
    const targetId = projectId || 'projects';
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getSkillIcon = (skillName: string) => {
    switch (skillName) {
      // Tier 1
      case 'Artificial Intelligence':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'LLMs & Transformers':
        return <Sparkles className="w-4 h-4 text-purple-300" />;
      case 'Generative AI':
        return <Bot className="w-4 h-4 text-violet-400" />;
      case 'Agentic AI & RAG':
        return <Network className="w-4 h-4 text-indigo-400" />;
      case 'Computer Vision':
        return <Eye className="w-4 h-4 text-cyan-400" />;
      
      // Tier 2
      case 'Machine Learning':
        return <Brain className="w-4 h-4 text-blue-400" />;
      case 'Deep Learning':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'Python':
        return <Code2 className="w-4 h-4 text-cyan-400" />;
      case 'Statistics & Mathematics':
        return <TrendingUp className="w-4 h-4 text-sky-400" />;
      case 'Data Science':
        return <Database className="w-4 h-4 text-blue-300" />;
      
      // Tier 3
      case 'Data Wrangling':
        return <Workflow className="w-4 h-4 text-teal-400" />;
      case 'Exploratory Data Analysis':
        return <Search className="w-4 h-4 text-emerald-400" />;
      case 'Data Cleaning':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      case 'Data Preparation':
        return <Sliders className="w-4 h-4 text-emerald-300" />;
      case 'SQL & Data Pipelines':
        return <Database className="w-4 h-4 text-teal-300" />;

      default:
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTechStackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-4 h-4 text-amber-400" />;
      case 'Brain':
        return <Brain className="w-4 h-4 text-blue-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Eye':
        return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-rose-400" />;
      default:
        return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Skills' },
    { id: 'advanced-ai', label: 'Advanced AI' },
    { id: 'core-ml-datascience', label: 'Core ML & Data Science' },
    { id: 'data-engineering', label: 'Data Engineering' },
    { id: 'tech-stack', label: 'Tools & Frameworks' },
  ];

  const visibleTiers = COMPETENCY_TIERS.filter(tier => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'tech-stack') return false;
    return tier.id === activeFilter;
  });

  const showTechStack = activeFilter === 'all' || activeFilter === 'tech-stack';

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-8 bg-blue-500"></span>
          <span className="text-xs font-mono tracking-widest text-blue-400 uppercase font-semibold">
            Technical Competencies
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Skills & Expertise
            </h2>
            <p className={`mt-3 text-base sm:text-lg max-w-3xl ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Technical competencies across AI engineering, LLM systems, computer vision, machine learning, and data science — organized by depth and application.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`filter-${opt.id}`}
                  onClick={() => setActiveFilter(opt.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500'
                      : isDark
                      ? 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Competency Tiers Container */}
      <div className="space-y-12">
        <AnimatePresence mode="wait">
          {visibleTiers.map((tier, tierIdx) => {
            const isPurple = tier.theme === 'purple';
            const isBlue = tier.theme === 'blue';
            const isEmerald = tier.theme === 'emerald';

            const tierGradientBg = isPurple
              ? isDark
                ? 'bg-gradient-to-b from-purple-950/20 via-zinc-900/70 to-zinc-950/80 border-purple-500/30'
                : 'bg-gradient-to-b from-purple-50/70 via-white to-zinc-50 border-purple-200'
              : isBlue
              ? isDark
                ? 'bg-gradient-to-b from-blue-950/20 via-zinc-900/70 to-zinc-950/80 border-blue-500/30'
                : 'bg-gradient-to-b from-blue-50/70 via-white to-zinc-50 border-blue-200'
              : isDark
              ? 'bg-gradient-to-b from-emerald-950/20 via-zinc-900/70 to-zinc-950/80 border-emerald-500/30'
              : 'bg-gradient-to-b from-emerald-50/70 via-white to-zinc-50 border-emerald-200';

            const badgeStyles = isPurple
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : isBlue
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

            const hoverBorderClass = isPurple
              ? 'group-hover:border-purple-500/50'
              : isBlue
              ? 'group-hover:border-blue-500/50'
              : 'group-hover:border-emerald-500/50';

            return (
              <motion.div
                key={tier.id}
                id={tier.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, delay: tierIdx * 0.08 }}
                className={`relative rounded-3xl p-6 sm:p-8 lg:p-10 border backdrop-blur-xl transition-all duration-300 shadow-xl ${tierGradientBg}`}
              >
                {/* Ambient Aura */}
                <div
                  className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-30 ${
                    isPurple
                      ? 'bg-purple-500'
                      : isBlue
                      ? 'bg-blue-500'
                      : 'bg-emerald-500'
                  }`}
                />

                {/* Tier Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/50">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold tracking-wider uppercase border ${badgeStyles}`}>
                        {tier.label}
                      </span>
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-display ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {tier.title}
                    </h3>
                  </div>

                  <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                    <span>{tier.skills.length} Competencies</span>
                  </div>
                </div>

                {/* 5 Skills Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tier.skills.map((skill, sIdx) => {
                    const isLastOdd = sIdx === 4 && tier.skills.length === 5;

                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: sIdx * 0.05 }}
                        whileHover={{ y: -4 }}
                        className={`group relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between ${hoverBorderClass} ${
                          isDark
                            ? 'bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-900 shadow-md shadow-black/30'
                            : 'bg-white/90 border-zinc-200/90 hover:bg-white shadow-sm shadow-zinc-200/50'
                        } ${isLastOdd ? 'md:col-span-2 lg:col-span-1' : ''}`}
                      >
                        {/* Top Content */}
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3.5">
                            <div className={`p-2.5 rounded-xl border ${
                              isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                            }`}>
                              {getSkillIcon(skill.name)}
                            </div>

                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                              0{sIdx + 1}
                            </span>
                          </div>

                          <h4 className={`text-lg font-bold font-display tracking-tight mb-2 transition-colors ${
                            isDark ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'
                          }`}>
                            {skill.name}
                          </h4>

                          <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                            isDark ? 'text-zinc-400' : 'text-zinc-600'
                          }`}>
                            {skill.description}
                          </p>
                        </div>

                        {/* Bottom Technologies & Project Evidence Link */}
                        <div className="pt-3 border-t border-zinc-800/40">
                          {/* Technology Chips */}
                          <div className="mb-4">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                              Technologies
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {skill.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium transition-colors ${
                                    isDark
                                      ? 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 group-hover:border-zinc-600'
                                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200/90 group-hover:border-zinc-300'
                                  }`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* View Projects Evidence Action */}
                          <button
                            type="button"
                            onClick={() => scrollToProject(skill.projectId)}
                            className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold transition-all group/link cursor-pointer ${
                              isPurple
                                ? 'text-purple-400 hover:text-purple-300'
                                : isBlue
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-emerald-400 hover:text-emerald-300'
                            }`}
                          >
                            <span>View Projects</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* DEDICATED TECH STACK SECTION */}
        {showTechStack && (
          <motion.div
            id="tech-stack"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className={`relative rounded-3xl p-6 sm:p-8 lg:p-10 border backdrop-blur-xl transition-all duration-300 shadow-xl ${
              isDark
                ? 'bg-zinc-900/60 border-zinc-800/80'
                : 'bg-white/80 border-zinc-200/80'
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-6 border-b border-zinc-800/50">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    ECOSYSTEM MATRIX
                  </span>
                </div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-display ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                  Tech Stack
                </h3>
              </div>
              <p className="text-xs font-mono text-zinc-500 self-start sm:self-auto">
                Verified technologies across production systems
              </p>
            </div>

            {/* 6 Technology Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TECH_STACK_GROUPS.map((group, gIdx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: gIdx * 0.05 }}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl p-5 border transition-all duration-300 ${
                    isDark
                      ? 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                      : 'bg-zinc-50/80 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className={`p-2 rounded-lg border ${
                      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                    }`}>
                      {getTechStackIcon(group.iconName)}
                    </div>
                    <h4 className={`text-sm font-bold font-mono tracking-tight uppercase ${
                      isDark ? 'text-zinc-200' : 'text-zinc-800'
                    }`}>
                      {group.category}
                    </h4>
                  </div>

                  {/* Items Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                          isDark
                            ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-blue-500/40 hover:text-white'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-blue-500/40 hover:text-zinc-900'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
