import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Sparkles, Send, Menu, X } from 'lucide-react';

interface NavigationProps {
  isDark: boolean;
  onToggleTheme: () => void;
  activeSection: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  isDark,
  onToggleTheme,
  activeSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navigation-header"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none transition-all duration-300"
    >
      {/* Floating Pill Nav */}
      <nav
        id="navbar-pill"
        className={`pointer-events-auto flex items-center justify-between gap-1 sm:gap-3 px-3 py-2 rounded-full transition-all duration-300 ${
          scrolled
            ? isDark
              ? 'bg-zinc-900/85 border border-zinc-800 shadow-2xl shadow-black/80 backdrop-blur-xl'
              : 'bg-white/85 border border-zinc-200/90 shadow-xl shadow-zinc-300/40 backdrop-blur-xl'
            : isDark
            ? 'bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-md'
            : 'bg-white/60 border border-zinc-200/60 backdrop-blur-md'
        }`}
      >
        {/* Brand / Logo */}
        <button
          id="nav-logo-button"
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 px-2.5 py-1 text-left rounded-full hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-extrabold font-display">
            DM
          </div>
          <span className={`text-xs sm:text-sm font-bold tracking-tight font-display hidden md:inline-block ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            Dhanvin Makwana
          </span>
        </button>

        {/* Desktop Nav Links with animated active pill */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 ${
                  isActive
                    ? isDark
                      ? 'text-white font-semibold'
                      : 'text-zinc-900 font-semibold'
                    : isDark
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={`absolute inset-0 rounded-full ${
                      isDark ? 'bg-zinc-800/90 border border-zinc-700/60' : 'bg-zinc-200/90 border border-zinc-300/60'
                    }`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action controls (Theme Toggle + Contact CTA) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle with smooth rotation */}
          <button
            id="theme-toggle-button"
            onClick={onToggleTheme}
            aria-label="Toggle dark/light theme"
            className={`p-2 rounded-full transition-all duration-200 ${
              isDark
                ? 'bg-zinc-800/80 hover:bg-zinc-700 text-amber-300 border border-zinc-700/60'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Direct CTA */}
          <button
            id="nav-contact-cta"
            onClick={() => scrollToSection('contact')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-3 h-3" />
            <span>Get in Touch</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full ${
              isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-800'
            }`}
            aria-label="Open mobile navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className={`pointer-events-auto absolute top-20 left-4 right-4 p-4 rounded-2xl md:hidden ${
            isDark
              ? 'bg-zinc-900/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl'
              : 'bg-white/95 border border-zinc-200 shadow-2xl backdrop-blur-2xl'
          }`}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? isDark
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'bg-zinc-100 text-zinc-900 font-semibold'
                    : isDark
                    ? 'text-zinc-300 hover:bg-zinc-800/50'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Contact Dhanvin
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};
