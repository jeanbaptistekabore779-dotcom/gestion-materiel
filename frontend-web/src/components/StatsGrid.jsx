import React from 'react';
import { PackageIcon, ArrowUpDownIcon, ClockIcon, WrenchIcon, AlertTriangleIcon } from 'lucide-react';

export default function StatsGrid({ role }) {
  // Configuration des cartes selon le rôle d'affichage
  const stats = role === 'Admin' ? [
    { label: 'Matériels disponibles', value: '142', icon: PackageIcon, bg: 'bg-blue-50 text-blue-700' },
    { label: 'Emprunts actifs', value: '37', icon: ArrowUpDownIcon, bg: 'bg-indigo-50 text-indigo-700' },
    { label: 'En attente de validation', value: '5', icon: ClockIcon, bg: 'bg-amber-50 text-amber-700' },
    { label: 'En maintenance', value: '3', icon: WrenchIcon, bg: 'bg-orange-50 text-orange-700' },
  ] : [
    { label: 'Matériels disponibles', value: '142', icon: PackageIcon, bg: 'bg-blue-50 text-blue-700' },
    { label: 'Mes Emprunts actifs', value: '2', icon: ArrowUpDownIcon, bg: 'bg-indigo-50 text-indigo-700' },
    { label: 'Mes Demandes en attente', value: '1', icon: ClockIcon, bg: 'bg-amber-50 text-amber-700' },
    { label: 'Mes Matériels en retard', value: '1', icon: AlertTriangleIcon, bg: 'bg-red-50 text-red-700' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}