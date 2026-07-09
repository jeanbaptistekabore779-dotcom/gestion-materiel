// src/components/DashboardCard.jsx
import React from 'react';

const colorMap = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-100',    bar: 'bg-blue-500',    glow: 'shadow-blue-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100',   bar: 'bg-amber-500',   glow: 'shadow-amber-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', bar: 'bg-emerald-500', glow: 'shadow-emerald-100' },
  red:     { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100',     bar: 'bg-red-500',     glow: 'shadow-red-100' },
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-100',  bar: 'bg-indigo-500',  glow: 'shadow-indigo-100' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-100',  bar: 'bg-orange-500',  glow: 'shadow-orange-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    bar: 'bg-rose-500',    glow: 'shadow-rose-100' },
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,        // ex: '+12%' ou '-3%'
  trendLabel,   // ex: 'ce mois'
  subtitle,     // ex: 'sur 20 total'
  loading = false,
  onClick,
}) {
  const c = colorMap[color] || colorMap['blue'];
  const isPositive = trend && !trend.startsWith('-');

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      {/* Accent bar en haut */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar} opacity-60 rounded-t-2xl`} />

      {/* Ligne icône + tendance */}
      <div className="flex items-start justify-between pt-1">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${c.bg} ${c.border} shadow-sm ${c.glow}`}>
          {loading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40" />
          ) : (
            Icon && <Icon className={`h-5 w-5 ${c.text}`} />
          )}
        </span>

        {trend && !loading && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isPositive
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-rose-50 text-rose-600'
          }`}>
            {isPositive ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      {/* Valeur principale */}
      <div>
        {loading ? (
          <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-slate-800 tracking-tight leading-none">{value ?? '—'}</p>
        )}
        <p className="text-xs text-slate-400 font-medium mt-1 leading-tight">{title}</p>
        {subtitle && !loading && (
          <p className="text-[11px] text-slate-300 mt-0.5">{subtitle}</p>
        )}
        {trendLabel && trend && !loading && (
          <p className="text-[10px] text-slate-300 mt-0.5">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}