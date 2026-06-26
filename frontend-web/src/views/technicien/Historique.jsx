// src/views/technicien/Historique.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function Historique() {
  const [archives, setArchives] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Historique des Interventions</h3>
        <p className="text-xs text-slate-400">Registre et traçabilité des anciennes réparations effectuées.</p>
      </div>

      <DataTable
        title="Registre d'Archivage Technique"
        headers={['ID Intervention', 'Matériel', 'Technicien', 'Action Réalisée', 'Résultat']}
        data={archives}
        renderRow={(row) => (
          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors animate-fadeIn">
            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{row.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{row.materiel}</td>
            <td className="px-6 py-4 text-slate-500 text-xs">@{row.technicien}</td>
            <td className="px-6 py-4 text-slate-600">{row.action}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700">
                {row.etat}
              </span>
            </td>
          </tr>
        )}
      />
    </div>
  );
}