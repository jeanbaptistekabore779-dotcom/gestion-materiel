// src/views/technicien/MaterielsEnPanne.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function MaterielsEnPanne() {
  const [pannes, setPannes] = useState([]);

  // Bouton de simulation pour la soutenance
  const simulerDeclarationPanne = () => {
    const nouvellePanne = {
      id: `PAN-${Math.floor(100 + Math.random() * 900)}`,
      nom: 'Routeur Cisco 2911',
      labo: 'Réseaux (UFR/SEA)',
      gravite: 'Critique',
      date: '24/06/2026'
    };
    setPannes([nouvellePanne, ...pannes]);
  };

  const prendreEnCharge = (id) => {
    alert(`🛠️ Le matériel ${id} a été ajouté à vos interventions actives !`);
    setPannes(pannes.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Équipements Défectueux</h3>
          <p className="text-xs text-slate-400">Prenez en charge les alertes de pannes émises par les labos.</p>
        </div>
        <button
          onClick={simulerDeclarationPanne}
          className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          ⚠️ Simuler une alerte de panne
        </button>
      </div>

      <DataTable
        title="Flux des Matériels en Attente de Réparation"
        headers={['Code Alerte', 'Désignation', 'Localisation', 'Gravité', 'Date', 'Action']}
        data={pannes}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors animate-fadeIn">
            <td className="px-6 py-4 font-mono text-xs font-bold text-rose-600">{item.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{item.nom}</td>
            <td className="px-6 py-4 text-slate-600 text-sm">{item.labo}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                {item.gravite}
              </span>
            </td>
            <td className="px-6 py-4 text-xs text-slate-400">{item.date}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => prendreEnCharge(item.id)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors"
              >
                Prendre en charge
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
}