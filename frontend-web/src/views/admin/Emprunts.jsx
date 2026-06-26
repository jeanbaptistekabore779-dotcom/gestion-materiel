// src/views/admin/Emprunts.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function Emprunts() {
  const [demandes, setDemandes] = useState([]);

  // Cette fonction te servira si tu veux ajouter une demande fictive d'un clic devant le jury
  const simulerDemandeEtudiant = () => {
    const nouvelle = {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      demandeur: 'Saratou Rufai (Étudiant)',
      materiel: 'Valise réseau pédagogique',
      periode: 'Du 25/06/2026 au 28/06/2026',
      statut: 'En Attente'
    };
    setDemandes([nouvelle, ...demandes]);
  };

  const handleAction = (id, nouveauStatut) => {
    setDemandes(demandes.map(d => d.id === id ? { ...d, statut: nouveauStatut } : d));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Validation des Emprunts</h3>
          <p className="text-xs text-slate-400">Gérez les demandes de sortie de matériel.</p>
        </div>
        <button
          onClick={simulerDemandeEtudiant}
          className="text-xs bg-slate-900 text-white font-medium px-3 py-2 rounded-xl hover:bg-slate-800"
        >
          📲 Simuler une demande d'étudiant
        </button>
      </div>

      <DataTable
        title="Flux des Demandes d'Emprunts"
        headers={['Code', 'Demandeur', 'Équipement', 'Période', 'Statut', 'Actions']}
        data={demandes}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors animate-fadeIn">
            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{item.id}</td>
            <td className="px-6 py-4 font-medium text-slate-700">{item.demandeur}</td>
            <td className="px-6 py-4 text-slate-600">{item.materiel}</td>
            <td className="px-6 py-4 text-xs text-slate-400">{item.periode}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                item.statut === 'Approuvé' ? 'bg-emerald-50 text-emerald-700' :
                item.statut === 'Rejeté' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
              }`}>{item.statut}</span>
            </td>
            <td className="px-6 py-4 flex gap-2">
              {item.statut === 'En Attente' && (
                <>
                  <button onClick={() => handleAction(item.id, 'Approuvé')} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Accepter</button>
                  <button onClick={() => handleAction(item.id, 'Rejeté')} className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-bold">Refuser</button>
                </>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
}