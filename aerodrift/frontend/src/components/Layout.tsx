import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Server, ShieldAlert, FileOutput, Gauge, History, GitBranch } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
      isActive 
        ? "bg-slate-800/80 text-sky-400 border border-slate-700/50 shadow-inner" 
        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm tracking-wide">{label}</span>
  </NavLink>
);

export const Layout = () => {
  return (
    <div className="min-h-screen flex bg-[#0a0e17] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/60 bg-[#0c111c]/80 backdrop-blur-xl flex flex-col relative z-20">
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Activity className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              AERODRIFT
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">Control Room</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem to="/" icon={Gauge} label="Fleet Overview" />
          <SidebarItem to="/telemetry" icon={Activity} label="Live Telemetry" />
          <SidebarItem to="/drift" icon={ShieldAlert} label="Drift Center" />
          <SidebarItem to="/models" icon={GitBranch} label="Model Center" />
          <SidebarItem to="/events" icon={History} label="Event Audit" />
        </nav>

        <div className="p-4 border-t border-slate-800/60 text-xs text-slate-500 flex items-center justify-between">
          <span>v1.0.0</span>
          <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> API Online</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
