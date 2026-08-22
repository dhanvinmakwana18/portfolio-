import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../lib/api';
import { Clock, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

export const EventAudit = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents(100);
        setEvents(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadEvents();
    const interval = setInterval(loadEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'ERROR':
      case 'CRITICAL': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: ShieldAlert, glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' };
      case 'WARNING': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' };
      default: return { color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', icon: Info, glow: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]' };
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Event Audit Log</h1>
        <p className="text-slate-400 mt-2 font-light">Immutable operational history</p>
      </header>

      <div className="glass-panel rounded-xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-full h-24 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none z-0"></div>
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/80 flex items-center relative z-10">
          <Clock className="w-5 h-5 mr-3 text-sky-400" />
          <span className="font-semibold tracking-widest uppercase text-slate-200 text-sm">System Timeline</span>
        </div>
        
        <div className="p-8 relative z-10">
          <div className="relative border-l-2 border-slate-700/50 ml-4 space-y-8">
            <AnimatePresence>
              {events.map((e, i) => {
                const styles = getSeverityStyles(e.severity);
                const Icon = styles.icon;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={`${e.timestamp}-${i}`} 
                    className="relative pl-10 group"
                  >
                    <div className={cn("absolute -left-[17px] top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-slate-900 z-10 transition-transform group-hover:scale-110", styles.border, styles.glow)}>
                      <Icon className={cn("w-4 h-4 drop-shadow-md", styles.color)} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">{e.event_type}</span>
                        <span className="text-xs text-slate-500 font-mono tracking-widest">{new Date(e.timestamp).toLocaleString()}</span>
                      </div>
                      <div className={cn("inline-block px-4 py-3 rounded-lg border text-sm font-mono mt-1 w-full max-w-3xl", styles.bg, styles.border, styles.color)}>
                        <pre className="whitespace-pre-wrap">{JSON.stringify(e.context, null, 2)}</pre>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {events.length === 0 && (
              <div className="pl-10 text-slate-500 italic">No events recorded.</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
