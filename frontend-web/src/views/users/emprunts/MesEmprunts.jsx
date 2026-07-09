// src/views/users/emprunts/MesEmprunts.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

const STATUTS = {
  EN_ATTENTE:     { label: 'En attente',    bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100',   dot: 'bg-amber-500',   pulse: true  },
  APPROUVE:       { label: 'Approuvé',       bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-100',    dot: 'bg-blue-500',    pulse: false },
  EN_COURS:       { label: 'En cours',       bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', pulse: true  },
  RETOUR_DECLARE: { label: 'Retour déclaré', bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-100',  dot: 'bg-orange-500',  pulse: true  },
  RETOURNE:       { label: 'Retourné',       bg: 'bg-slate-100',  text: 'text-slate-500',   border: 'border-slate-200',   dot: 'bg-slate-400',   pulse: false },
  REFUSE:         { label: 'Refusé',         bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    dot: 'bg-rose-500',    pulse: false },
  EN_RETARD:      { label: 'En retard',      bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-100',  dot: 'bg-orange-500',  pulse: true  },
  PERDU:          { label: 'Perdu / Dégradé', bg: 'bg-red-50',    text: 'text-red-700',     border: 'border-red-100',     dot: 'bg-red-600',     pulse: false },
};

function StatutBadge({ statut }) {
  const s = STATUTS[statut] ?? { label: statut, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400', pulse: false };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
}

const fmt = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
};

// ─── Modal Déclarer le retour ─────────────────────────────────────────────
function ModalDeclarerRetour({ emprunt, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeclarer = async () => {
    setLoading(true); setError('');
    try {
      await api.post(`emprunts/${emprunt.id}/declarer-retour/`);
      onSuccess('RETOUR_DECLARE');
    } catch (err) {
      setError(err.response?.data?.error ?? 'Erreur lors de la déclaration du retour.');
    } finally {
      setLoading(false);
    }
  };

  const nomMateriel = emprunt.materiel_nom
    ?? emprunt.materiel?.designation
    ?? emprunt.materiel?.nom
    ?? `Matériel #${emprunt.materiel}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-[#1E40AF] px-6 py-4 text-white">
          <h3 className="font-bold text-sm">Déclarer le retour du matériel</h3>
          <p className="text-blue-100 text-xs mt-0.5">{nomMateriel}</p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
            En confirmant, vous informez l'administrateur que vous rapportez ce matériel.
            Apportez-le physiquement au point de dépôt — le retour ne sera définitivement
            validé qu'après vérification par l'administrateur.
          </p>
          {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
              Annuler
            </button>
            <button
              onClick={handleDeclarer}
              disabled={loading}
              className="px-5 py-2 bg-[#1E40AF] hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {loading ? 'Envoi...' : '↩ Je rends le matériel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MesEmprunts() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [modalEmprunt, setModalEmprunt] = useState(null);

  useEffect(() => { fetchDemandes(); }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const res  = await api.get('emprunts/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setDemandes(data);
    } catch (err) {
      console.error('Erreur emprunts:', err.response?.data);
      setError('Impossible de charger vos demandes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclareSuccess = (id, nouveauStatut) => {
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: nouveauStatut } : d));
    setModalEmprunt(null);
  };

  return (
    <div className="space-y-6">
      {modalEmprunt && (
        <ModalDeclarerRetour
          emprunt={modalEmprunt}
          onClose={() => setModalEmprunt(null)}
          onSuccess={(s) => handleDeclareSuccess(modalEmprunt.id, s)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Suivi de mes emprunts</h3>
          <p className="text-xs text-slate-400">Consultez l'état de vos demandes et déclarez vos retours.</p>
        </div>
        <button onClick={fetchDemandes}
          className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Chargement…</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{error}</div>
      ) : demandes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-sm text-slate-400 font-medium">Vous n'avez aucune demande en cours.</p>
          <p className="text-xs text-slate-300 mt-1">Consultez le catalogue pour faire votre première demande.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-700">Mes Demandes</h4>
            <p className="text-xs text-slate-400">{demandes.length} demande{demandes.length > 1 ? 's' : ''} au total</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Réf.', 'Matériel', 'Date demande', 'Retour prévu', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {demandes.map((item) => {
                  const nomMateriel = item.materiel_nom
                    ?? item.materiel?.designation
                    ?? item.materiel?.nom
                    ?? `Matériel #${item.materiel}`;

                  const peutDeclarerRetour = ['EN_COURS', 'EN_RETARD'].includes(item.statut);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-400">
                        REQ-{String(item.id).padStart(3, '0')}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{nomMateriel}</td>
                      <td className="px-5 py-4 text-xs text-slate-400">{fmt(item.date_sortie)}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{fmt(item.date_retour_prevue)}</td>
                      <td className="px-5 py-4"><StatutBadge statut={item.statut} /></td>
                      <td className="px-5 py-4">
                        {peutDeclarerRetour ? (
                          <button
                            onClick={() => setModalEmprunt(item)}
                            className="px-3 py-1.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-lg text-[11px] font-bold transition-colors"
                          >
                            ↩ Déclarer le retour
                          </button>
                        ) : item.statut === 'RETOUR_DECLARE' ? (
                          <span className="text-[11px] text-orange-500 italic">En attente de vérification</span>
                        ) : (
                          <span className="text-[11px] text-slate-300">—</span>
                        )}
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