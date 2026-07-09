// src/views/technicien/Maintenances.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const fmt = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
};

export default function Maintenances() {
  const [maintenances,  setMaintenances]  = useState([]);
  const [selected,      setSelected]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState('');
  const [rapport,       setRapport]       = useState({ action: '', statutMateriel: 'DISPONIBLE' });

  useEffect(() => { fetchMaintenances(); }, []);

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const res  = await api.get('maintenance/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      // Technicien voit seulement les EN_COURS
      setMaintenances(data.filter(m => m.statut === 'EN_COURS'));
    } catch (err) {
      console.error('Erreur chargement:', err.response?.data);
      setError('Impossible de charger les maintenances.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloturer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // 1. Marquer la maintenance comme TERMINEE
      await api.patch(`maintenance/${selected.id}/`, {
        statut: 'TERMINE',
        dateFin: new Date().toISOString().split('T')[0],
      });

      // 2. Mettre à jour le statut du matériel
      if (selected.materiel) {
        await api.patch(`materiels/${selected.materiel}/`, {
          statut: rapport.statutMateriel,
          etat: rapport.statutMateriel === 'DISPONIBLE' ? 'DISPONIBLE' : 'INDISPONIBLE',
        });
      }

      setSelected(null);
      setRapport({ action: '', statutMateriel: 'DISPONIBLE' });
      await fetchMaintenances();
    } catch (err) {
      console.error('Erreur clôture:', err.response?.data);
      setError('Erreur lors de la clôture. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Mes Interventions</h3>
          <p className="text-xs text-slate-400">Clôturez les fiches de maintenance qui vous sont assignées.</p>
        </div>
        <button onClick={fetchMaintenances}
          className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">⚠️ {error}</div>}

      {/* Formulaire de clôture */}
      {selected && (
        <form onSubmit={handleCloturer} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-700 text-sm">
              Rapport d'intervention — MNT-{String(selected.id).padStart(3, '0')}
            </h4>
            <button type="button" onClick={() => setSelected(null)} className="text-xs text-slate-400 hover:text-slate-600">Annuler</button>
          </div>

          {/* Infos de la fiche */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1 text-xs">
            <p><span className="font-semibold text-slate-500">Matériel :</span> {selected.materiel_nom ?? `#${selected.materiel}`}</p>
            <p><span className="font-semibold text-slate-500">Catégorie :</span> {selected.categorie_maintenance_details?.nom ?? '—'}</p>
            <p><span className="font-semibold text-slate-500">Description :</span> <span className="italic text-slate-600">"{selected.description}"</span></p>
            <p><span className="font-semibold text-slate-500">Début :</span> {fmt(selected.dateDebut)}</p>
          </div>

          {/* Actions menées */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Actions menées / Diagnostic <span className="text-rose-500">*</span>
            </label>
            <textarea required rows="3" value={rapport.action}
              onChange={(e) => setRapport({ ...rapport, action: e.target.value })}
              placeholder="Ex: Remplacement du condensateur défectueux, test de fonctionnement effectué..."
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF] resize-none" />
          </div>

          {/* Statut final du matériel */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Statut final du matériel</label>
            <select value={rapport.statutMateriel} onChange={(e) => setRapport({ ...rapport, statutMateriel: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
              <option value="DISPONIBLE">🟢 Réparé et fonctionnel → Disponible</option>
              <option value="REFORME">🔴 Irréparable → Mis au rebut</option>
            </select>
          </div>

          <button type="submit" disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            {submitting ? '⏳ Enregistrement…' : '✅ Clôturer et archiver'}
          </button>
        </form>
      )}

      {/* Liste des maintenances EN_COURS */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Chargement…</span>
        </div>
      ) : maintenances.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-sm text-slate-400 font-medium">Aucune intervention en cours.</p>
          <p className="text-xs text-slate-300 mt-1">Les fiches créées par l'admin apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-700">Tâches en cours</h4>
            <p className="text-xs text-slate-400">{maintenances.length} intervention{maintenances.length > 1 ? 's' : ''} à traiter</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['ID', 'Matériel', 'Catégorie', 'Date début', 'Description', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {maintenances.map((item) => {
                  const nomMateriel  = item.materiel_nom ?? item.materiel?.designation ?? `Matériel #${item.materiel}`;
                  const nomCategorie = item.categorie_maintenance_details?.nom ?? '';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-mono text-xs font-bold text-blue-500">MNT-{String(item.id).padStart(3, '0')}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700 text-sm">{nomMateriel}</td>
                      <td className="px-4 py-4 text-xs text-slate-500">{nomCategorie}</td>
                      <td className="px-4 py-4 text-xs text-slate-400 whitespace-nowrap">{fmt(item.dateDebut)}</td>
                      <td className="px-4 py-4 text-xs text-slate-500 max-w-[200px]">
                        <span className="line-clamp-2">{item.description}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => setSelected(item)}
                          className="text-xs bg-[#0C326F] hover:bg-blue-900 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors">
                          Rédiger rapport
                        </button>
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