import React, { useEffect, useState } from 'react';
import { fetchMachines, fetchPredictions } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '../components/Layout';
import { motion } from 'framer-motion';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Fleet Health Overview</h1>
        <p className="text-slate-400 mt-2 font-light">Real-time predictive maintenance monitoring</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-slate-400">Loading telemetry data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Summary KPIs */}
          <motion.div variants={container} initial="hidden" animate="show" className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <motion.div variants={item} className="glass-panel p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Total Monitored</p>
                <p className="text-4xl font-light">{machines.length}</p>
              </div>
              <Activity className="w-10 h-10 text-sky-400 opacity-20 relative z-10" />
            </motion.div>
            <motion.div variants={item} className="glass-panel p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">High Risk Assets</p>
                <p className="text-4xl font-light text-rose-400">{machines.filter(m => m.status === 'Critical').length}</p>
              </div>
              <ShieldAlert className="w-10 h-10 text-rose-400 opacity-20 relative z-10" />
            </motion.div>
            <motion.div variants={item} className="glass-panel p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Active Model</p>
                <p className="text-2xl font-light text-emerald-400">v2.0 (XGBoost)</p>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-400 opacity-20 relative z-10" />
            </motion.div>
          </motion.div>

          {/* Machine Grid */}
          <div className="col-span-full">
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-6 text-slate-400">Asset Grid</h2>
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {machines.map((m) => (
                <motion.div 
                  variants={item}
                  key={m.machine_id}
                  onClick={() => navigate(`/machine/${m.machine_id}`)}
                  className="glass-panel p-5 rounded-xl cursor-pointer hover:bg-slate-800/80 hover:border-slate-600 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-sky-500/10 transition-colors">
                        <Cpu className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors">Unit-{m.machine_id}</h3>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">CYCLE {m.cycle}</p>
                      </div>
                    </div>
                    <div className={cn("px-2 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", getStatusColor(m.status))}>
                      <StatusIcon status={m.status} />
                      {m.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">P(Failure)</span>
                      <span className={m.risk_probability > 0.5 ? "text-rose-400 font-bold" : "text-slate-300"}>
                        {(m.risk_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    {/* Visual bar */}
                    <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(m.risk_probability * 100, 5)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full", 
                          m.risk_probability > 0.8 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : 
                          m.risk_probability > 0.4 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]")}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
