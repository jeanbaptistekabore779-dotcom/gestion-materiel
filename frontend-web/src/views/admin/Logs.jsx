// src/views/admin/Logs.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const ACTION_STYLES = {
  CREATION:     { label: 'Création',     bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  MODIFICATION: { label: 'Modification', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  SUPPRESSION:  { label: 'Suppression',  bg: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-500' },
  EMPRUNT:      { label: 'Emprunt',      bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  RETOUR:       { label: 'Retour',       bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500' },
  MAINTENANCE:  { label: 'Maintenance',  bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  RENDEZVOUS:   { label: 'Rendez vous',  bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500' },
  VALIDATION:   { label: 'Validation',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  REJET:        { label: 'Rejet',        bg: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-500' },
};

function ActionBadge({ action }) {
  const c = ACTION_STYLES[action] ?? { label: action ?? 'Autre', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  TECHNICIEN: 'Technicien',
  ETUDIANT: 'Étudiant',
  ENSEIGNANT: 'Enseignant',
};

function RoleBadge({ role }) {
  if (!role) return null;
  return (
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function RefreshIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4v6h6" />
      <path d="M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4 4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtreAction, setFiltreAction] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('historiques/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setLogs(data);
    } catch (err) {
      console.error('Erreur chargement logs:', err.response?.data);
      setError("Impossible de charger les journaux d'audit.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'Inconnue';
    try {
      return new Date(d).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return d;
    }
  };

  const filtered = logs.filter((log) => {
    const matchAction = !filtreAction || log.action === filtreAction;
    const matchSearch = !searchQuery ||
      (log.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.utilisateur ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchAction && matchSearch;
  });

  const actionsPresentes = [...new Set(logs.map((l) => l.action))];

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Journaux d'audit</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Historique complet des actions effectuées sur le système.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="text-xs bg-slate-100 text-slate-600 font-semibold px-3.5 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
          Actualiser
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="h-4 w-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par description ou utilisateur"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all"
          />
        </div>
        {actionsPresentes.length > 0 && (
          <select
            value={filtreAction}
            onChange={(e) => setFiltreAction(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:border-[#0C326F] transition-all"
          >
            <option value="">Toutes les catégories</option>
            {actionsPresentes.map((a) => (
              <option key={a} value={a}>{ACTION_STYLES[a]?.label ?? a}</option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-7 h-7 border-4 border-blue-100 border-t-[#0C326F] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Chargement des journaux</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-400 font-medium">
            {searchQuery || filtreAction
              ? 'Aucune entrée ne correspond à votre recherche.'
              : "Aucune entrée dans le journal d'audit pour le moment."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-700">Traçabilité du système</h4>
            <span className="text-xs text-slate-400 font-medium">
              {filtered.length} entrée{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  {['Catégorie', 'Description', 'Opérateur', 'Horodatage'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-md">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                          {log.utilisateur}
                        </span>
                        <RoleBadge role={log.role_utilisateur} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {formatDate(log.date_action)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}