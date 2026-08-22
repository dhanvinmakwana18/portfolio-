import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMachineDetail, fetchMachineShap } from '../lib/api';
import { ArrowLeft, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { cn } from '../components/Layout';
import { motion } from 'framer-motion';

export const MachineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [shap, setShap] = useState<any[]>([]);
  
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const hist = await fetchMachineDetail(id);
        setHistory(hist);
        const shapData = await fetchMachineShap(id);
        if (Array.isArray(shapData)) setShap(shapData);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const latest = history[history.length - 1];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <header className="mb-8">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-sky-400 flex items-center text-sm font-medium transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> BACK TO FLEET
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight flex items-center">
              <Cpu className="w-8 h-8 mr-4 text-sky-400" /> 
              Unit-{id} Profile
            </h1>
            <p className="text-slate-400 mt-2 font-mono text-sm">LATEST CYCLE: {latest?.cycle || '-'}</p>
          </div>
          {latest && (
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className={cn("px-4 py-2 rounded-lg border flex items-center text-sm font-bold tracking-widest shadow-lg", 
              latest.risk_probability > 0.8 ? "bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-rose-500/20" : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20")}>
              {latest.risk_probability > 0.8 ? <ShieldAlert className="w-4 h-4 mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
              {latest.risk_probability > 0.8 ? 'CRITICAL RISK' : 'HEALTHY'}
            </motion.div>
          )}
        </div>
      </header>

      {/* Probability Chart */}
      <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[80px] rounded-full pointer-events-none"></div>
        <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-6 relative z-10">Failure Probability Timeline</h2>
        <div className="h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="cycle" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickMargin={10} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 1]} tickMargin={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="risk_probability" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorProb)" activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features */}
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none"></div>
          <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-6 relative z-10">Live Sensor Telemetry</h2>
          {latest ? (
            <div className="space-y-3 relative z-10">
              {Object.keys(latest.features).slice(0, 8).map(k => (
                <div key={k} className="flex justify-between items-center py-3 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30 px-2 rounded transition-colors">
                  <span className="text-slate-400 font-mono text-xs uppercase">{k}</span>
                  <span className="text-sky-400 font-mono font-medium">{latest.features[k].toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic">No telemetry data.</div>
          )}
        </div>

        {/* SHAP */}
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] rounded-full pointer-events-none"></div>
          <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-6 relative z-10">SHAP Explanation</h2>
          {shap.length > 0 ? (
            <div className="space-y-5 relative z-10">
              {shap.map((s: any) => {
                const isPositive = s.impact > 0;
                return (
                  <div key={s.feature}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400 font-mono uppercase truncate w-1/2">{s.feature}</span>
                      <span className={cn("font-mono", isPositive ? "text-rose-400" : "text-emerald-400")}>
                        {isPositive ? '+' : ''}{s.impact.toFixed(4)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800/80 rounded-full flex overflow-hidden shadow-inner">
                      {isPositive ? (
                        <>
                          <div className="w-1/2 border-r border-slate-700"></div>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(s.impact * 100, 50)}%` }} className="bg-gradient-to-r from-rose-500 to-rose-400 h-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"></motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(Math.abs(s.impact) * 100, 50)}%` }} className="bg-gradient-to-l from-emerald-500 to-emerald-400 h-full ml-auto shadow-[0_0_8px_rgba(16,185,129,0.5)] border-r border-slate-700"></motion.div>
                          <div className="w-1/2"></div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-500 italic flex items-center justify-center h-full pb-8">
              Waiting for model explanation...
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
