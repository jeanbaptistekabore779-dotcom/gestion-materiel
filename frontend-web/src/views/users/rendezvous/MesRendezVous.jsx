// src/views/users/rendezvous/MesRendezVous.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/DataTable';
import api from '../../../api/api';

const TYPE_LABELS = {
  RETRAIT: 'Retrait de matériel',
  RETOUR:  'Retour de matériel',
};

const STATUT_STYLES = {
  VALIDE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  ANNULE: 'bg-rose-50 text-rose-600 border-rose-100',
};

function formatDateHeure(dateHeureIso) {
  if (!dateHeureIso) return '—';
  const d = new Date(dateHeureIso);
  return d.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).replace(',', ' à');
}

export default function MesRendezVous() {
  const [rdvList, setRdvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchRdv = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('rendezvous/');
      const results = Array.isArray(data) ? data : (data.results ?? []);
      setRdvList(results);
    } catch (err) {
      console.error('Erreur Rendez-vous :', err.response?.data ?? err);
      setError('Impossible de charger vos rendez-vous pour le moment.');
    } finally {
      setLoading(false);  // ← corrigé : toujours exécuté
    }
  };

  useEffect(() => { fetchRdv(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Mes Rendez-vous</h3>
          <p className="text-xs text-slate-400">
            Consultez l'agenda de vos rendez-vous programmés avec le service technique.
          </p>
        </div>
        <button
          onClick={fetchRdv}
          className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-7 h-7 border-4 border-blue-100 border-t-[#0C326F] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Chargement de vos rendez-vous...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{error}</div>
      ) : rdvList.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-sm text-slate-400 font-medium">Aucun rendez-vous programmé pour le moment.</p>
          <p className="text-xs text-slate-300 mt-1">Vos rendez-vous apparaîtront ici après validation d'un emprunt.</p>
        </div>
      ) : (
        <DataTable
          title="Planning des Rendez-vous Personnels"
          headers={['ID RDV', 'Objet / Motif', 'Date & Heure', 'Statut']}
          data={rdvList}
          renderRow={(rdv) => (
            <tr key={rdv.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-slate-400">
                #RDV-{String(rdv.id).padStart(3, '0')}
              </td>
              <td className="px-6 py-4 font-semibold text-slate-700">
                {TYPE_LABELS[rdv.type_rdv] ?? rdv.type_rdv}
                {rdv.emprunt?.materiel?.designation && (
                  <span className="block text-xs font-normal text-slate-400">
                    {rdv.emprunt.materiel.designation}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDateHeure(rdv.date_heure)}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUT_STYLES[rdv.statut] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {rdv.statut === 'VALIDE' ? 'Confirmé' : rdv.statut === 'ANNULE' ? 'Annulé' : rdv.statut}
                </span>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}