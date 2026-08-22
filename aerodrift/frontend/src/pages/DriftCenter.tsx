import React, { useEffect, useState } from 'react';
import { fetchDriftStatus } from '../lib/api';
import { ShieldAlert, CheckCircle, Activity, BarChart2 } from 'lucide-react';
import { cn } from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    return <div className="flex items-center justify-center h-64 text-slate-400">Analyzing distribution drift across features...</div>;
  }

  const isDrifted = drift?.drift_detected;

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Drift Center</h1>
          <p className="text-slate-400 mt-2">Distribution stability monitoring via Evidently AI</p>
        </div>
        <button 
          onClick={checkDrift}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 text-sky-400 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
        >
          {loading ? 'ANALYZING...' : 'RUN DRIFT ANALYSIS'}
        </button>
      </header>

      {drift?.status ? (
        <div className="glass-panel p-8 text-center text-slate-400 rounded-xl">
          {drift.status}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Status */}
          <div className={cn(
            "col-span-full glass-panel p-8 rounded-xl flex items-center justify-between border-l-4",
            isDrifted ? "border-l-rose-500 bg-rose-500/5" : "border-l-emerald-500 bg-emerald-500/5"
          )}>
            <div>
              <p className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-2">Overall Status</p>
              <h2 className={cn("text-4xl font-light", isDrifted ? "text-rose-400" : "text-emerald-400")}>
                {isDrifted ? "DATA DRIFT DETECTED" : "DISTRIBUTION STABLE"}
              </h2>
              {isDrifted && <p className="text-slate-300 mt-2">Current telemetry significantly diverges from training reference data.</p>}
            </div>
            {isDrifted ? <ShieldAlert className="w-16 h-16 text-rose-500 opacity-80" /> : <CheckCircle className="w-16 h-16 text-emerald-500 opacity-80" />}
          </div>

          {/* Metrics */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-slate-400 uppercase tracking-wider text-xs font-bold mb-4 flex items-center"><Activity className="w-4 h-4 mr-2" /> Observations Analyzed</h3>
            <p className="text-4xl font-light text-slate-200">{drift?.num_inferences_analyzed}</p>
            <p className="text-sm text-slate-500 mt-2">Live inferences compared against baseline</p>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-slate-400 uppercase tracking-wider text-xs font-bold mb-4 flex items-center"><BarChart2 className="w-4 h-4 mr-2" /> Drifted Columns</h3>
            <p className="text-4xl font-light text-slate-200">{(drift?.share_of_drifted_columns * 100).toFixed(1)}%</p>
            <p className="text-sm text-slate-500 mt-2">Features showing significant distribution shift</p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-center">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Threshold</span>
                <span className="text-slate-200">50%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Share</span>
                <span className={drift?.share_of_drifted_columns >= 0.5 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                  {(drift?.share_of_drifted_columns * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
