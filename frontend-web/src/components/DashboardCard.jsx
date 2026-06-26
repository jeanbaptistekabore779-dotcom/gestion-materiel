import React from 'react';

export default function DashboardCard({ title, value, icon: Icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">{title}</p>
      </div>
    </div>
  );
}