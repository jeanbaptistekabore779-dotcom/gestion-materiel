// src/views/technicien/MaterielsEnPanne.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const fmt = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
};

export default function MaterielsEnPanne() {
  const [materiels, setMateriels] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchPannes(); }, []);

  const fetchPannes = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await api.get('materiels/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      // Garder uniquement les matériels EN_PANNE ou EN_MAINTENANCE
      setMateriels(data.filter(m => ['EN_PANNE', 'EMPRUNTE'].includes(m.statut) || m.etat === 'EN_MAINTENANCE'));
    } catch (err) {
      console.error('Erreur:', err.response?.data);
      setError('Impossible de charger les matériels en panne.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrendreEnCharge = async (materiel) => {
    // Naviguer vers la page maintenances avec le matériel pré-sélectionné
    // L'admin crée la fiche — le technicien la clôture
    navigate('/technicien/maintenances');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Équipements Défectueux</h3>
          <p className="text-xs text-slate-400">Matériels signalés en panne ou en maintenance.</p>
        </div>
        <button onClick={fetchPannes}
          className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">⚠️ {error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Chargement…</span>
        </div>
      ) : materiels.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <svg className="h-10 w-10 text-slate-200 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-sm text-slate-400 font-medium">Aucun matériel en panne actuellement.</p>
          <p className="text-xs text-slate-300 mt-1">Les matériels signalés par l'admin apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-700">Matériels en attente d'intervention</h4>
            <p className="text-xs text-slate-400">{materiels.length} matériel{materiels.length > 1 ? 's' : ''} défectueux</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Code', 'Désignation', 'Catégorie', 'Emplacement', 'État', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {materiels.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs font-bold text-rose-500">
                      {item.code_barre ?? `MAT-${String(item.id).padStart(3,'0')}`}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-700 text-sm">{item.designation}</div>
                      {item.description && <div className="text-xs text-slate-400 line-clamp-1">{item.description}</div>}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">{item.categorie_type ?? '—'}</td>
                    <td className="px-4 py-4 text-xs text-slate-400">{item.emplacement_physique ?? '—'}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        {item.statut === 'EN_PANNE' ? 'En panne' : 'En maintenance'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handlePrendreEnCharge(item)}
                        className="text-xs bg-[#0C326F] hover:bg-blue-900 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Voir interventions →
                      </button>
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