// src/views/admin/RendezVous.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function RendezVous() {
  const [rdv, setRdv] = useState([
    { id: 1, etudiant: 'Saratou Rufai', type: 'Retrait Matériel', date: '25/06/2026', heure: '09h00', guichet: 'Magasin Central UFR/SEA' }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Planification des Rendez-vous</h3>
        <p className="text-xs text-slate-400">Gérez l'affluence aux guichets de distribution.</p>
      </div>

      <DataTable
        title="Agenda des Dépôts et Retraits"
        headers={['ID', 'Bénéficiaire', 'Type d\'action', 'Date & Heure', 'Lieu de RDV']}
        data={rdv}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4 text-slate-400 text-xs">#0{item.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{item.etudiant}</td>
            <td className="px-6 py-4 text-blue-700 font-medium">{item.type}</td>
            <td className="px-6 py-4 text-xs text-slate-600">📅 {item.date} à {item.heure}</td>
            <td className="px-6 py-4 text-slate-500 text-xs">{item.guichet}</td>
          </tr>
        )}
      />
    </div>
  );
}