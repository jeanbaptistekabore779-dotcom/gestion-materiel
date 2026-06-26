// src/views/users/emrpunts/MesEmprunts.jsx
import React, { useState } from 'react';
import DataTable from '../../../components/DataTable';

export default function MesEmprunts() {
  const [mesDemandes, setMesDemandes] = useState([]);

  // Permet de simuler un ajout à la volée pendant la présentation
  const simulerAjoutDemande = () => {
    const nouvelle = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      materiel: 'Ordinateur de test Labo',
      dateDemande: '24/06/2026',
      periode: '25/06/2026 au 27/06/2026',
      statut: 'En attente'
    };
    setMesDemandes([nouvelle, ...mesDemandes]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Suivi de mes emprunts</h3>
          <p className="text-xs text-slate-400">Consultez l'état d'approbation de vos demandes d'équipements.</p>
        </div>
        <button
          onClick={simulerAjoutDemande}
          className="text-xs bg-slate-900 text-white font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          ➕ Simuler un emprunt soumis
        </button>
      </div>

      <DataTable
        title="Mes Demandes de Matériels"
        headers={['N° Demande', 'Matériel', 'Date de demande', 'Période d\'emprunt', 'Statut']}
        data={mesDemandes}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors anonymity-fadeIn">
            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{item.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{item.materiel}</td>
            <td className="px-6 py-4 text-xs text-slate-400">{item.dateDemande}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{item.periode}</td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {item.statut}
              </span>
            </td>
          </tr>
        )}
      />
    </div>
  );
}