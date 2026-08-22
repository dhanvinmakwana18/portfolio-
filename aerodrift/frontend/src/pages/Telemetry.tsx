import React, { useState, useEffect } from 'react';
import { startStreamer, stopStreamer, fetchPredictions } from '../lib/api';
import { Play, Square, FastForward, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '../components/Layout';

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
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Live Telemetry</h1>
          <p className="text-slate-400 mt-2">Control the simulation and observe real-time predictions</p>
        </div>
        
        {/* Stream Controls */}
        <div className="glass-panel p-2 rounded-xl flex items-center space-x-2">
          <select 
            value={streamMode} 
            onChange={e => setStreamMode(e.target.value)}
            disabled={isStreaming}
            className="bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5 outline-none"
          >
            <option value="NORMAL">Normal Operation</option>
            <option value="DRIFT">Data Drift Injection</option>
            <option value="ANOMALY">Spike Anomalies</option>
            <option value="FAILURE_APPROACH">Accelerated Failure</option>
          </select>

          {isStreaming ? (
            <button onClick={handleStop} className="flex items-center space-x-2 px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 rounded-lg transition-colors font-medium">
              <Square className="w-4 h-4 fill-current" />
              <span>STOP STREAM</span>
            </button>
          ) : (
            <button onClick={handleStart} className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 rounded-lg transition-colors font-medium">
              <Play className="w-4 h-4 fill-current" />
              <span>START STREAM</span>
            </button>
          )}
        </div>
      </header>

      {/* Live Monitor */}
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-800/60 bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-200 flex items-center"><Activity className="w-4 h-4 mr-2 text-sky-400" /> Incoming Inference Stream</h2>
          {isStreaming && <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
          {predictions.length === 0 && !isStreaming ? (
            <div className="h-full flex items-center justify-center text-slate-500 italic">No live predictions flowing. Press Start to begin simulation.</div>
          ) : (
            predictions.map((p, i) => (
              <div key={i} className={cn(
                "p-3 rounded border flex justify-between items-center transition-all",
                p.prediction === 1 ? "bg-rose-500/10 border-rose-500/30 text-rose-200" : "bg-slate-800/40 border-slate-700 text-slate-300"
              )}>
                <div className="flex space-x-6">
                  <span className="text-slate-500">{new Date(p.timestamp).toLocaleTimeString()}</span>
                  <span className="font-bold text-sky-400">Machine {p.machine_id}</span>
                  <span>Cycle {p.cycle}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-slate-400">Prob: <span className={p.prediction ? 'text-rose-400 font-bold' : 'text-slate-200'}>{(p.probability * 100).toFixed(2)}%</span></span>
                  {p.prediction === 1 ? (
                    <span className="flex items-center text-rose-400 uppercase tracking-widest text-xs font-bold"><AlertTriangle className="w-4 h-4 mr-1" /> FAILING</span>
                  ) : (
                    <span className="text-emerald-400 uppercase tracking-widest text-xs font-bold">HEALTHY</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
