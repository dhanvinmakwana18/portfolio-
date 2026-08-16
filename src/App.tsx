import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { WebGLFlowShader } from './components/WebGLFlowShader';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceEducation } from './components/ExperienceEducation';
import { AboutAndPolaroid } from './components/AboutAndPolaroid';
import { ContactCard } from './components/ContactCard';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Sync dark class with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#09090b';
      document.body.style.color = '#f4f4f5';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fafafa';
      document.body.style.color = '#18181b';
    }
  }, [isDark]);

  // Section Observer for active Navigation tracking
  useEffect(() => {
    const sections = ['hero', 'projects', 'skills', 'experience', 'about', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen relative selection:bg-blue-600 selection:text-white ${
      isDark ? 'bg-[#09090b] text-[#f4f4f5]' : 'bg-[#fafafa] text-[#18181b]'
    }`}>
      {/* Signature WebGL Flow Shader Backdrop */}
      <WebGLFlowShader isDark={isDark} interactive={true} />

      {/* Main Navigation */}
      <Navigation
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeSection={activeSection}
      />

      {/* Main Content Layout */}
      <main className="relative z-10">
        <HeroSection
          isDark={isDark}
          onExploreProjects={() => scrollToSection('projects')}
          onOpenContact={() => scrollToSection('contact')}
        />

        <ProjectsSection isDark={isDark} />

        <SkillsSection isDark={isDark} />

        <ExperienceEducation isDark={isDark} />

        <AboutAndPolaroid isDark={isDark} />

        <ContactCard isDark={isDark} />
      </main>
    </div>
  );
}
