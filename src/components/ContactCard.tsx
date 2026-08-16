import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import { Copy, Check, Send, Mail, Github, Linkedin, Twitter, Sparkles, ArrowUpRight, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactCardProps {
  isDark: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({ isDark }) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
      subject || 'Inquiry regarding AI / Data Science Role'
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    setSent(true);
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 },
    });
    setTimeout(() => setSent(false), 4000);
  };

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'twitter / x':
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <footer
      id="contact"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Signature Contact Card */}
      <div className={`relative rounded-3xl overflow-hidden p-8 sm:p-12 border transition-all ${
        isDark
          ? 'bg-zinc-900/80 border-zinc-800 shadow-2xl shadow-black/80'
          : 'bg-white/90 border-zinc-200/90 shadow-2xl shadow-zinc-300/40'
      } backdrop-blur-xl`}>
        {/* Background glow lines */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Direct Copy Action & Socials */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Full-time Roles & AI Projects</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Let's Build Something <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
                Intelligent Together.
              </span>
            </h2>

            <p className={`mt-4 text-base sm:text-lg max-w-xl ${
              isDark ? 'text-zinc-300' : 'text-zinc-600'
            }`}>
              Feel free to reach out for machine learning research collaborations, LLM system architecture, or computer vision engineering discussions.
            </p>

            {/* One-click Copy Email Card */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="contact-copy-email-card"
                onClick={handleCopyEmail}
                className={`group flex items-center gap-3 px-6 py-3.5 rounded-2xl border transition-all duration-300 ${
                  isDark
                    ? 'bg-zinc-950/90 hover:bg-zinc-950 border-zinc-700/80 hover:border-blue-500/60 shadow-lg'
                    : 'bg-zinc-100 hover:bg-white border-zinc-300 hover:border-blue-500 shadow-md'
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Email Address</div>
                  <div className={`text-sm sm:text-base font-mono font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {PERSONAL_INFO.email}
                  </div>
                </div>

                <div className="ml-2 pl-3 border-l border-zinc-700/60">
                  {copied ? (
                    <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                      <Check className="w-4 h-4" /> Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-blue-400">
                      <Copy className="w-4 h-4" /> Copy
                    </span>
                  )}
                </div>
              </button>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Compose Mail</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-10 pt-8 border-t border-zinc-800/60">
              <div className="text-xs font-mono text-zinc-400 mb-3">Connect on Social Channels</div>
              <div className="flex flex-wrap items-center gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                      isDark
                        ? 'bg-zinc-950/60 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-50 hover:bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 shadow-sm'
                    }`}
                  >
                    {getSocialIcon(link.name)}
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Message Box */}
          <div className="lg:col-span-5">
            <div className={`p-6 sm:p-7 rounded-2xl border ${
              isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-50/90 border-zinc-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Quick Message Dispatch
                </h3>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Subject / Inquiry</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="AI Engineering / Data Science role inquiry..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi Dhanvin, I came across your portfolio and would like to discuss..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sent ? 'Opening Mail Client...' : 'Send Message to Dhanvin'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="mt-16 pt-8 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div>
          © {new Date().getFullYear()} Dhanvin Makwana. Built with Next.js 16+, React, Motion, WebGL & Lenis.
        </div>
        <div className="flex items-center gap-4">
          <span>AI Engineer & Data Scientist</span>
          <span>•</span>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-blue-400 transition-colors"
          >
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
};
