// src/views/admin/Materiels.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function Materiels() {
  const [showForm, setShowForm] = useState(false);
  
  // Tableau initialisé complètement VIDE pour ta démonstration en direct
  const [materiels, setMateriels] = useState([]);

  const [formData, setFormData] = useState({
    designation: '',
    categorie: 'Informatique',
    quantite: 1,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Génération d'un code dynamique basé sur l'heure ou la taille
    const newId = `MAT-00${materiels.length + 1}`;
    
    const newMateriel = {
      id: newId,
      designation: formData.designation,
      categorie: formData.categorie,
      quantite: parseInt(formData.quantite, 10),
      statut: 'Disponible',
      description: formData.description
    };

    // Ajout immédiat en haut du tableau
    setMateriels([newMateriel, ...materiels]);
    setShowForm(false);
    
    // Réinitialisation du formulaire
    setFormData({ designation: '', categorie: 'Informatique', quantite: 1, description: '' });
  };

  const handleActionSupprimer = (id) => {
    if (window.confirm(`Voulez-vous vraiment retirer le matériel ${id} ?`)) {
      setMateriels(materiels.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Inventaire du matériel</h3>
          <p className="text-xs text-slate-400">Ajoutez un équipement en direct pour alimenter l'inventaire.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm ${
            showForm 
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' 
              : 'bg-[#1E40AF] text-white hover:bg-blue-800'
          }`}
        >
          {showForm ? '✕ Fermer le formulaire' : '➕ Enregistrer un matériel'}
        </button>
      </div>

      {/* Formulaire d'ajout dynamique */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl animate-fadeIn">
          <h4 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-2">Nouvel Équipement Pédagogique</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Désignation / Modèle *</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                placeholder="Ex: Commutateur Cisco Catalyst 2960"
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Catégorie du matériel</label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              >
                <option value="Informatique">💻 Informatique</option>
                <option value="Audiovisuel">📹 Audiovisuel / Projecteur</option>
                <option value="Laboratoire">🔬 Équipement de Laboratoire</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Quantité globale *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantite}
                onChange={(e) => setFormData({...formData, quantite: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Emplacement / Affectation</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Salle de TP L3 Info"
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              💾 Enregistrer en direct
            </button>
          </div>
        </form>
      )}

      {/* Liste complète qui réagit instantanément */}
      <DataTable
        title="Parc de Matériel Référencé"
        headers={['Code Unique', 'Désignation', 'Catégorie', 'Quantité', 'Statut', 'Actions']}
        data={materiels}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors animate-fadeIn">
            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{item.id}</td>
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-700">{item.designation}</div>
              <div className="text-xs text-slate-400 font-normal">{item.description}</div>
            </td>
            <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.categorie}</td>
            <td className="px-6 py-4 font-mono text-sm text-slate-600 font-semibold">{item.quantite} unité(s)</td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {item.statut}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleActionSupprimer(item.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Retirer
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
}