import React, { useEffect, useState } from 'react';
import { fetchMachines, fetchPredictions } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../components/Layout';

export const FleetOverview = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMachines();
        setMachines(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'Critical': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-white tracking-tight">Fleet Health Overview</h1>
        <p className="text-slate-400 mt-2">Real-time predictive maintenance monitoring</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-slate-400">Loading telemetry data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Summary KPIs */}
          <div className="col-span-full grid grid-cols-3 gap-6 mb-4">
            <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">Total Monitored</p>
                <p className="text-3xl font-light">{machines.length}</p>
              </div>
              <Activity className="w-8 h-8 text-sky-400 opacity-50" />
            </div>
            <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">High Risk Assets</p>
                <p className="text-3xl font-light text-rose-400">{machines.filter(m => m.status === 'Critical').length}</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-rose-400 opacity-50" />
            </div>
            <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">Active Model</p>
                <p className="text-xl font-medium text-emerald-400">v2.0 (XGBoost)</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400 opacity-50" />
            </div>
          </div>

          {/* Machine Grid */}
          <div className="col-span-full">
            <h2 className="text-xl font-medium mb-4 text-slate-200">Asset Grid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {machines.map((m) => (
                <div 
                  key={m.machine_id}
                  onClick={() => navigate(`/machine/${m.machine_id}`)}
                  className="glass-panel p-5 rounded-xl cursor-pointer hover:bg-slate-800/60 hover:border-slate-600 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">Machine {m.machine_id}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">CYCLE {m.cycle}</p>
                    </div>
                    <div className={cn("px-2 py-1 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1", getStatusColor(m.status))}>
                      <StatusIcon status={m.status} />
                      {m.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Failure Prob</span>
                      <span className={m.risk_probability > 0.5 ? "text-rose-400 font-medium" : "text-slate-200"}>
                        {(m.risk_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    {/* Visual bar */}
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", 
                          m.risk_probability > 0.8 ? "bg-rose-500" : 
                          m.risk_probability > 0.4 ? "bg-amber-500" : "bg-emerald-500")}
                        style={{ width: `${Math.max(m.risk_probability * 100, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
