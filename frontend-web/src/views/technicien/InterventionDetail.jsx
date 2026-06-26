import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function Interventions() {
  const [interventions, setInterventions] = useState([
    { id: 'INT-042', materiel: 'Vidéoprojecteur Epson', panne: 'Lampe grillée', statut: 'En cours', date: '24/06/2026' },
    { id: 'INT-040', materiel: 'Dell XPS 13', panne: 'Batterie gonflée', statut: 'En cours', date: '24/06/2026' },
  ]);

  const [selectedInt, setSelectedInt] = useState(null);
  const [rapport, setRapport] = useState('');
  const [statutFinal, setStatutFinal] = useState('Réparé');

  const handleResolution = (e) => {
    e.preventDefault();
    
    // Mise à jour locale de l'état (simulation de la mise à jour de l'API)
    setInterventions(interventions.map(item => 
      item.id === selectedInt.id 
        ? { ...item, statut: statutFinal === 'Réparé' ? 'Terminée' : 'Incurable' }
        : item
    ));

    alert(`✅ Rapport enregistré pour l'intervention ${selectedInt.id}`);
    setSelectedInt(null);
    setRapport('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Interventions en Cours</h3>
        <p className="text-xs text-slate-400">Rédigez vos rapports techniques pour clore les pannes.</p>
      </div>

      {/* Formulaire de traitement d'une panne */}
      {selectedInt && (
        <form onSubmit={handleResolution} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl animate-fadeIn">
          <h4 className="font-bold text-slate-700 text-sm border-b pb-2">
            Résolution de l'incident : <span className="text-[#1E40AF]">{selectedInt.id} - {selectedInt.materiel}</span>
          </h4>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Diagnostic & Rapport technique *</label>
            <textarea
              required
              rows="3"
              value={rapport}
              onChange={(e) => setRapport(e.target.value)}
              placeholder="Décrivez les actions menées (ex: Remplacement de la pièce, nettoyage des filtres...)"
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          <div className="w-48">
            <label className="block text-xs font-semibold text-slate-500 mb-1">État du matériel</label>
            <select
              value={statutFinal}
              onChange={(e) => setStatutFinal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              <option value="Réparé">🟢 Réparé (Remis en stock)</option>
              <option value="Incurable">🔴 Incurable (Mise au rebut)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
              Valider l'intervention
            </button>
            <button type="button" onClick={() => setSelectedInt(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des tâches */}
      <DataTable
        title="Vos tâches actives"
        headers={['ID', 'Matériel', 'Panne signalée', 'Date affectation', 'Action']}
        data={interventions.filter(i => i.statut === 'En cours')}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{item.id}</td>
            <td className="px-6 py-4 font-medium text-slate-700">{item.materiel}</td>
            <td className="px-6 py-4 text-slate-500">{item.panne}</td>
            <td className="px-6 py-4 text-xs text-slate-400">{item.date}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => setSelectedInt(item)}
                className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Traiter
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
}