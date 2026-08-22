import React, { useEffect, useState } from 'react';
import { fetchModels, triggerRetrain, triggerRollback } from '../lib/api';
import { GitBranch, History, RotateCcw, Play, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../components/Layout';

export const ModelCenter = () => {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadModels = async () => {
    setLoading(true);
    try {
      const data = await fetchModels();
      setModels(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleRetrain = async () => {
    await triggerRetrain();
    alert("Retraining triggered in background.");
  };

  const handleRollback = async () => {
    if (confirm("Are you sure you want to rollback to the backup production model?")) {
      await triggerRollback();
      alert("Rollback successful.");
      loadModels();
    }
  };

  const prodModel = models.find(m => m.stage === 'Production');
  const history = models.filter(m => m.stage !== 'Production').sort((a, b) => b.version - a.version);

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Model Center</h1>
          <p className="text-slate-400 mt-2">MLflow registry and lifecycle management</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleRollback} className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg flex items-center text-sm font-medium transition-colors">
            <RotateCcw className="w-4 h-4 mr-2" /> ROLLBACK
          </button>
          <button onClick={handleRetrain} className="px-4 py-2 bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 rounded-lg flex items-center text-sm font-medium transition-colors">
            <Play className="w-4 h-4 mr-2" /> MANUAL RETRAIN
          </button>
        </div>
      </header>

      {/* Production Model */}
      <div className="glass-panel p-6 rounded-xl border-t-4 border-t-emerald-500">
        <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-400 mb-6 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Current Production Model
        </h2>
        {prodModel ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Version</p>
              <p className="text-2xl font-light text-slate-200">v{prodModel.version}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">F1 Score</p>
              <p className="text-2xl font-light text-emerald-400">{prodModel.metrics?.cand_f1?.toFixed(4) || prodModel.metrics?.f1_score?.toFixed(4) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">False Positive Rate</p>
              <p className="text-2xl font-light text-emerald-400">{prodModel.metrics?.cand_fpr?.toFixed(4) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Run ID</p>
              <p className="text-sm font-mono text-slate-400 truncate">{prodModel.run_id}</p>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 italic">No production model found in registry.</div>
        )}
      </div>

      {/* Model History */}
      <div>
        <h2 className="text-lg font-medium text-slate-200 mb-4 flex items-center"><History className="w-5 h-5 mr-2 text-slate-400" /> Model History</h2>
        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase border-b border-slate-800/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Version</th>
                <th className="px-6 py-4 font-semibold">Stage</th>
                <th className="px-6 py-4 font-semibold">F1 Score</th>
                <th className="px-6 py-4 font-semibold">FPR</th>
                <th className="px-6 py-4 font-semibold">Run ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.map((m) => (
                <tr key={m.version} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">v{m.version}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                      m.stage === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                    )}>
                      {m.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">{m.metrics?.cand_f1?.toFixed(4) || m.metrics?.f1_score?.toFixed(4) || '-'}</td>
                  <td className="px-6 py-4">{m.metrics?.cand_fpr?.toFixed(4) || '-'}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{m.run_id}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No historical models found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
