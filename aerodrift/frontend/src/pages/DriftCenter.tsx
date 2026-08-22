import React, { useEffect, useState } from 'react';
import { fetchDriftStatus } from '../lib/api';
import { ShieldAlert, CheckCircle, Activity, BarChart2 } from 'lucide-react';
import { cn } from '../components/Layout';
import { motion } from 'framer-motion';

export const DriftCenter = () => {
  const [drift, setDrift] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkDrift = async () => {
    setLoading(true);
    try {
      const data = await fetchDriftStatus();
      setDrift(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDrift();
  }, []);

  if (loading && !drift) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400 space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
        <p className="tracking-widest uppercase text-sm font-semibold">Analyzing Distribution Drift...</p>
      </div>
    );
  }

  const isDrifted = drift?.drift_detected;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Drift Center</h1>
          <p className="text-slate-400 mt-2 font-light">Distribution stability monitoring via Evidently AI</p>
        </div>
        <button 
          onClick={checkDrift}
          disabled={loading}
          className="px-6 py-2.5 bg-slate-800 text-sky-400 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors font-bold tracking-widest text-xs disabled:opacity-50 shadow-lg"
        >
          {loading ? 'ANALYZING...' : 'RUN DRIFT ANALYSIS'}
        </button>
      </header>

      {drift?.status ? (
        <div className="glass-panel p-8 text-center text-slate-400 rounded-xl">
          {drift.status}
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Status */}
          <motion.div variants={item} className={cn(
            "col-span-full glass-panel p-10 rounded-xl flex items-center justify-between relative overflow-hidden",
            isDrifted ? "border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]" : "border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          )}>
            <div className={cn("absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none", isDrifted ? "bg-gradient-to-r from-rose-500 to-transparent" : "bg-gradient-to-r from-emerald-500 to-transparent")}></div>
            
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-2">Overall Status</p>
              <h2 className={cn("text-5xl font-extralight tracking-tight", isDrifted ? "text-rose-400" : "text-emerald-400")}>
                {isDrifted ? "DATA DRIFT DETECTED" : "DISTRIBUTION STABLE"}
              </h2>
              {isDrifted && <p className="text-slate-300 mt-3 text-lg font-light">Current telemetry significantly diverges from training reference data.</p>}
            </div>
            
            <div className="relative z-10">
              {isDrifted ? (
                <ShieldAlert className="w-24 h-24 text-rose-500 opacity-80 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
              ) : (
                <CheckCircle className="w-24 h-24 text-emerald-500 opacity-80 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              )}
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div variants={item} className="glass-panel p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4 flex items-center"><Activity className="w-4 h-4 mr-2" /> Observations Analyzed</h3>
            <p className="text-5xl font-light text-slate-200">{drift?.num_inferences_analyzed}</p>
            <p className="text-sm text-slate-500 mt-3 font-light">Live inferences compared against baseline</p>
          </motion.div>

          <motion.div variants={item} className="glass-panel p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4 flex items-center"><BarChart2 className="w-4 h-4 mr-2" /> Drifted Columns</h3>
            <p className="text-5xl font-light text-slate-200">{(drift?.share_of_drifted_columns * 100).toFixed(1)}%</p>
            <p className="text-sm text-slate-500 mt-3 font-light">Features showing significant distribution shift</p>
          </motion.div>
          
          <motion.div variants={item} className="glass-panel p-8 rounded-xl flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-6">Threshold Configuration</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-slate-500">Threshold</span>
                <span className="text-slate-300">50.0%</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-slate-500">Current Share</span>
                <span className={drift?.share_of_drifted_columns >= 0.5 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                  {(drift?.share_of_drifted_columns * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden flex">
                <div 
                  className={cn("h-full transition-all duration-1000", drift?.share_of_drifted_columns >= 0.5 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-emerald-500")}
                  style={{ width: `${Math.min(drift?.share_of_drifted_columns * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
