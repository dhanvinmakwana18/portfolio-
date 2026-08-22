import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMachineDetail, fetchMachineShap } from '../lib/api';
import { ArrowLeft, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '../components/Layout';

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
    <div className="space-y-6 pb-12">
      <header className="mb-8">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-sky-400 flex items-center text-sm font-medium transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO FLEET
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight flex items-center">
              <Cpu className="w-8 h-8 mr-3 text-sky-400" /> 
              Machine {id} Profile
            </h1>
            <p className="text-slate-400 mt-2 font-mono">LATEST CYCLE: {latest?.cycle || '-'}</p>
          </div>
          {latest && (
            <div className={cn("px-4 py-2 rounded-lg border flex items-center text-lg font-bold tracking-widest", 
              latest.risk_probability > 0.8 ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400")}>
              {latest.risk_probability > 0.8 ? <ShieldAlert className="w-5 h-5 mr-2" /> : <Activity className="w-5 h-5 mr-2" />}
              {latest.risk_probability > 0.8 ? 'CRITICAL RISK' : 'HEALTHY'}
            </div>
          )}
        </div>
      </header>

      {/* Probability Chart */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-6">Failure Probability History</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="cycle" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 1]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Line type="monotone" dataKey="risk_probability" stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#38bdf8' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-6">Latest Sensor Telemetry</h2>
          {latest ? (
            <div className="space-y-3">
              {Object.keys(latest.features).slice(0, 8).map(k => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
                  <span className="text-slate-300 font-mono text-sm">{k}</span>
                  <span className="text-sky-400 font-mono">{latest.features[k].toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic">No telemetry data.</div>
          )}
        </div>

        {/* SHAP */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-6">SHAP Explanation (Why is it risky?)</h2>
          {shap.length > 0 ? (
            <div className="space-y-4">
              {shap.map((s: any) => {
                const isPositive = s.impact > 0;
                return (
                  <div key={s.feature}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono truncate w-1/2">{s.feature}</span>
                      <span className={cn("font-bold", isPositive ? "text-rose-400" : "text-emerald-400")}>
                        {isPositive ? '+' : ''}{s.impact.toFixed(4)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full flex">
                      {isPositive ? (
                        <>
                          <div className="w-1/2"></div>
                          <div className="bg-rose-500 h-full rounded-r-full" style={{ width: `${Math.min(s.impact * 100, 50)}%` }}></div>
                        </>
                      ) : (
                        <>
                          <div className="bg-emerald-500 h-full rounded-l-full ml-auto" style={{ width: `${Math.min(Math.abs(s.impact) * 100, 50)}%` }}></div>
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
    </div>
  );
};
