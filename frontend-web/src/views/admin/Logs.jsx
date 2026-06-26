// src/views/admin/Logs.jsx
import React from 'react';
import DataTable from '../../components/DataTable';

export default function Logs() {
  const logsSysteme = [
    { id: 1, action: 'Connexion réussie', utilisateur: 'admin', ip: '192.168.1.50', date: '24/06/2026 16:12' },
    { id: 2, action: 'Validation Emprunt EMP-201', utilisateur: 'admin', ip: '192.168.1.50', date: '24/06/2026 15:45' },
    { id: 3, action: 'Création de compte étudiant', utilisateur: 'Anonymous', ip: '10.0.2.15', date: '24/06/2026 14:20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Journaux d'Audit (Logs)</h3>
        <p className="text-xs text-slate-400">Historique complet des actions effectuées sur le serveur backend.</p>
      </div>

      <DataTable
        title="Sécurité & Traçabilité du Système"
        headers={['ID', 'Événement / Action', 'Opérateur', 'Adresse IP', 'Horodatage']}
        data={logsSysteme}
        renderRow={(log) => (
          <tr key={log.id} className="hover:bg-slate-50/50 font-mono text-xs text-slate-600 transition-colors">
            <td className="px-6 py-4 text-slate-400">[#{log.id}]</td>
            <td className="px-6 py-4 text-slate-800 font-semibold">{log.action}</td>
            <td className="px-6 py-4 text-blue-700">@{log.utilisateur}</td>
            <td className="px-6 py-4 text-slate-400">{log.ip}</td>
            <td className="px-6 py-4 text-slate-500">{log.date}</td>
          </tr>
        )}
      />
    </div>
  );
}
