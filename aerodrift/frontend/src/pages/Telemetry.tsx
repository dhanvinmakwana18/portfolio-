import React, { useState, useEffect } from 'react';
import { startStreamer, stopStreamer, fetchPredictions } from '../lib/api';
import { Play, Square, FastForward, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

export const Telemetry = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [streamMode, setStreamMode] = useState('NORMAL');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isStreaming) {
      interval = setInterval(async () => {
        const data = await fetchPredictions(20);
        setPredictions(data);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleStart = async () => {
    try {
      await startStreamer(streamMode);
      setIsStreaming(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = async () => {
    try {
      await stopStreamer();
      setIsStreaming(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Live Telemetry</h1>
          <p className="text-slate-400 mt-2 font-light">Control the simulation and observe real-time predictions</p>
        </div>
        
        {/* Stream Controls */}
        <div className="glass-panel p-2 rounded-xl flex items-center space-x-3 shadow-xl">
          <div className="relative">
            <select 
              value={streamMode} 
              onChange={e => setStreamMode(e.target.value)}
              disabled={isStreaming}
              className="appearance-none bg-slate-900/80 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg focus:ring-sky-500 focus:border-sky-500 block px-4 py-2.5 outline-none disabled:opacity-50 min-w-[200px]"
            >
              <option value="NORMAL">Normal Operation</option>
              <option value="DRIFT">Data Drift Injection</option>
              <option value="ANOMALY">Spike Anomalies</option>
              <option value="FAILURE_APPROACH">Accelerated Failure</option>
            </select>
          </div>

          {isStreaming ? (
            <button onClick={handleStop} className="flex items-center space-x-2 px-5 py-2.5 bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 rounded-lg transition-colors font-bold tracking-wider text-xs shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <Square className="w-4 h-4 fill-current" />
              <span>STOP STREAM</span>
            </button>
          ) : (
            <button onClick={handleStart} className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 rounded-lg transition-colors font-bold tracking-wider text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Play className="w-4 h-4 fill-current" />
              <span>START STREAM</span>
            </button>
          )}
        </div>
      </header>

      {/* Live Monitor */}
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[600px] border border-slate-700/50 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none z-0"></div>
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/80 flex justify-between items-center relative z-10">
          <h2 className="font-semibold text-slate-200 flex items-center tracking-wide"><Activity className="w-4 h-4 mr-2 text-sky-400" /> INCOMING INFERENCE STREAM</h2>
          {isStreaming ? (
            <div className="flex items-center text-xs font-mono text-emerald-400 font-bold tracking-widest">
              <span className="flex h-2.5 w-2.5 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              ACTIVE
            </div>
          ) : (
            <div className="text-xs font-mono text-slate-500 font-bold tracking-widest">OFFLINE</div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-sm relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {predictions.length === 0 && !isStreaming ? (
            <div className="h-full flex items-center justify-center text-slate-500 italic font-sans text-lg">No live predictions flowing. Press Start to begin simulation.</div>
          ) : (
            <AnimatePresence>
              {predictions.map((p, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  key={`${p.machine_id}-${p.cycle}-${p.timestamp}`} 
                  className={cn(
                  "p-4 rounded-lg border flex justify-between items-center transition-all",
                  p.prediction === 1 ? "bg-rose-500/10 border-rose-500/30 text-rose-200 shadow-[inset_0_0_15px_rgba(244,63,94,0.1)]" : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                )}>
                  <div className="flex space-x-8 items-center">
                    <span className="text-slate-500 text-xs">{new Date(p.timestamp).toLocaleTimeString()}</span>
                    <span className="font-bold text-sky-400 tracking-wider">UNIT-{p.machine_id}</span>
                    <span className="text-slate-400 text-xs uppercase tracking-widest">Cycle {p.cycle}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-slate-400 text-xs">P(FAIL): <span className={cn("text-base font-bold", p.prediction ? 'text-rose-400' : 'text-slate-200')}>{(p.probability * 100).toFixed(1)}%</span></span>
                    {p.prediction === 1 ? (
                      <span className="flex items-center justify-center w-28 py-1 rounded bg-rose-500/20 text-rose-400 uppercase tracking-widest text-[10px] font-bold border border-rose-500/50"><AlertTriangle className="w-3 h-3 mr-1" /> FAILING</span>
                    ) : (
                      <span className="flex items-center justify-center w-28 py-1 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-widest text-[10px] font-bold border border-emerald-500/20">HEALTHY</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};
