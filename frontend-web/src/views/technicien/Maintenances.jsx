// src/views/technicien/Maintenance.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function Maintenance() {
  const [interventions, setInterventions] = useState([]);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [rapport, setRapport] = useState({ action: '', statutFinal: 'Réparé' });

  // Bouton de simulation pour faire apparaître un ordre de travail en direct devant le jury
  const simulerReceptionOrdre = () => {
    const nouvelOrdre = {
      id: `MNT-0${interventions.length + 1}`,
      materiel: 'Vidéoprojecteur Epson (Amphi A)',
      priorite: 'Haute',
      assigneLe: '24/06/2026',
      description: 'L\'image saute toutes les deux minutes.'
    };
    setInterventions([nouvelOrdre, ...interventions]);
  };

  const handleCloturer = (e) => {
    e.preventDefault();
    alert(`✅ Clôture enregistrée : Matériel marqué comme [${rapport.statutFinal}]`);
    
    // On retire l'intervention de la liste des tâches actives après traitement
    setInterventions(interventions.filter(item => item.id !== selectedIntervention.id));
    setSelectedIntervention(null);
    setRapport({ action: '', statutFinal: 'Réparé' });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Mes Interventions Assignées</h3>
          <p className="text-xs text-slate-400">Gérez vos tâches de maintenance actives et rédigez vos rapports.</p>
        </div>
        <button
          onClick={simulerReceptionOrdre}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          📥 Recevoir un ordre de travail
        </button>
      </div>

      {/* Formulaire/Fiche de rapport si une intervention est sélectionnée */}
      {selectedIntervention && (
        <form onSubmit={handleCloturer} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-700 text-sm">Rapport d'intervention : {selectedIntervention.id}</h4>
            <button 
              type="button" 
              onClick={() => setSelectedIntervention(null)} 
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Annuler
            </button>
          </div>
          
          <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
            <p><span className="font-semibold text-slate-500">Équipement :</span> {selectedIntervention.materiel}</p>
            <p><span className="font-semibold text-slate-500">Anomalie :</span> <span className="italic">"{selectedIntervention.description}"</span></p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Actions menées / Diagnostic *</label>
            <textarea
              required
              rows="2"
              value={rapport.action}
              onChange={(e) => setRapport({...rapport, action: e.target.value})}
              placeholder="Ex: Remplacement de la lampe défectueuse et dépoussiérage des filtres."
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Statut final de l'équipement</label>
            <select
              value={rapport.statutFinal}
              onChange={(e) => setRapport({...rapport, statutFinal: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              <option value="Réparé">🟢 Réparé et Fonctionnel</option>
              <option value="Mis au rebut">🔴 Irréparable (Mise au rebut)</option>
            </select>
          </div>

          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            💾 Clôturer et Archiver la tâche
          </button>
        </form>
      )}

      {/* Tableau des tâches de maintenance en cours */}
      <DataTable
        title="Tâches de Maintenance en Cours"
        headers={['Code Tâche', 'Matériel', 'Priorité', 'Assigné le', 'Actions']}
        data={interventions}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors anonymity-fadeIn">
            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{item.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{item.materiel}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                item.priorite === 'Haute' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>{item.priorite}</span>
            </td>
            <td className="px-6 py-4 text-xs text-slate-400">{item.assigneLe}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => setSelectedIntervention(item)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors"
              >
                Rédiger Rapport
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
}