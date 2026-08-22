import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../lib/api';
import { Clock, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '../components/Layout';

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
      case 'CRITICAL': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: ShieldAlert };
      case 'WARNING': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle };
      default: return { color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', icon: Info };
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-white tracking-tight">Event Audit Log</h1>
        <p className="text-slate-400 mt-2">Immutable operational history</p>
      </header>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800/60 bg-slate-900/50 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-slate-400" />
          <span className="font-semibold text-slate-200">System Timeline</span>
        </div>
        
        <div className="p-6">
          <div className="relative border-l border-slate-700 ml-3 space-y-8">
            {events.map((e, i) => {
              const styles = getSeverityStyles(e.severity);
              const Icon = styles.icon;
              return (
                <div key={i} className="relative pl-8">
                  <div className={cn("absolute -left-3 top-1 w-6 h-6 rounded-full border flex items-center justify-center bg-slate-900", styles.border)}>
                    <Icon className={cn("w-3 h-3", styles.color)} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-sm font-bold text-slate-200">{e.event_type}</span>
                      <span className="text-xs text-slate-500 font-mono">{new Date(e.timestamp).toLocaleString()}</span>
                    </div>
                    <div className={cn("inline-block px-3 py-2 rounded-lg border text-sm font-mono mt-2", styles.bg, styles.border, styles.color)}>
                      <pre className="whitespace-pre-wrap">{JSON.stringify(e.context, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              );
            })}
            {events.length === 0 && (
              <div className="pl-8 text-slate-500 italic">No events recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
