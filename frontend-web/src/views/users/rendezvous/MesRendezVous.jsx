// src/views/users/rendezvous/MesRendezVous.jsx
import React, { useState } from 'react';
import DataTable from '../../../components/DataTable';

export default function MesRendezVous() {
  const [rdvList, setRdvList] = useState([]);

  const simulerRdv = () => {
    const nouveauRdv = {
      id: rdvList.length + 1,
      motif: 'Retrait Kit Arduino (Projet Fin de Cycle)',
      dateHeure: '26/06/2026 à 10:00',
      statut: 'Confirmé'
    };
    setRdvList([nouveauRdv, ...rdvList]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Mes Rendez-vous</h3>
          <p className="text-xs text-slate-400">Consultez l'agenda de vos rendez-vous programmés avec le service technique.</p>
        </div>
        <button
          onClick={simulerRdv}
          className="text-xs bg-slate-900 text-white font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          ➕ Simuler un rendez-hop programmé
        </button>
      </div>

      <DataTable
        title="Planning des Rendez-vous Personnels"
        headers={['ID rdv', 'Objet / Motif', 'Date & Heure', 'Statut']}
        data={rdvList}
        renderRow={(rdv) => (
          <tr key={rdv.id} className="hover:bg-slate-50/50 transition-colors animate-fadeIn">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">#RDV-0{rdv.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{rdv.motif}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{rdv.dateHeure}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                {rdv.statut}
              </span>
            </td>
          </tr>
        )}
      />
    </div>
  );
}