// src/views/users/emprunts/Historique.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../api/api';  // ← corrigé (était ../../../services/api)

const STATUTS = {
  RETOURNE:   { label: 'Retourné',       bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400'  },
  REFUSE:     { label: 'Refusé',         bg: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-500'   },
  PERDU:      { label: 'Perdu/Dégradé',  bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-600'    },
  EN_RETARD:  { label: 'En retard',      bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
};

const fmt = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
};

export default function Historique() {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Charger tous les emprunts — filtrer côté frontend les terminés
        const res  = await api.get('emprunts/');
        const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        // Historique = emprunts clôturés (retournés, refusés, perdus)
        setHistorique(data.filter(e => ['RETOURNE', 'REFUSE', 'PERDU', 'EN_RETARD'].includes(e.statut)));
      } catch (err) {
        console.error('Erreur historique:', err.response?.data);
        setError('Impossible de charger votre historique.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Mon Historique</h3>
        <p className="text-xs text-slate-400">Tous vos emprunts terminés ou clôturés.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Chargement…</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{error}</div>
      ) : historique.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-sm text-slate-400 font-medium">Aucun historique disponible pour le moment.</p>
          <p className="text-xs text-slate-300 mt-1">Vos emprunts terminés apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-700">Historique des emprunts</h4>
            <p className="text-xs text-slate-400">{historique.length} emprunt{historique.length > 1 ? 's' : ''} clôturé{historique.length > 1 ? 's' : ''}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Réf.', 'Matériel', 'Date sortie', 'Retour prévu', 'Retour effectif', 'Statut'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historique.map((item) => {
                  const nom = item.materiel_nom ?? item.materiel?.designation ?? item.materiel?.nom ?? `Matériel #${item.materiel}`;
                  const s   = STATUTS[item.statut] ?? STATUTS['RETOURNE'];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-400">
                        REQ-{String(item.id).padStart(3, '0')}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{nom}</td>
                      <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{fmt(item.date_sortie)}</td>
                      <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{fmt(item.date_retour_prevue)}</td>
                      <td className="px-5 py-4 text-xs whitespace-nowrap">
                        {item.date_retour_effective
                          ? <span className="text-emerald-600 font-medium">{fmt(item.date_retour_effective)}</span>
                          : <span className="text-slate-300">—</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}