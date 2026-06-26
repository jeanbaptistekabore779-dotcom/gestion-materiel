// src/views/users/materiels/Detail.jsx
import React from 'react';

export default function Detail({ materiel, onBack }) {
  if (!materiel) {
    return (
      <div className="text-sm text-slate-400 italic py-4">
        Sélectionnez un matériel du catalogue pour afficher sa fiche descriptive.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl animate-fadeIn">
      <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600 mb-2">
        ← Retour au catalogue
      </button>
      <div>
        <h3 className="text-lg font-bold text-slate-800">{materiel.nom}</h3>
        <p className="text-xs font-mono text-slate-400">{materiel.id}</p>
      </div>
      <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl space-y-2">
        <p><span className="font-semibold text-slate-500">Catégorie :</span> {materiel.categorie}</p>
        <p><span className="font-semibold text-slate-500">Spécifications :</span> {materiel.description}</p>
        <p><span className="font-semibold text-slate-500">Statut de l'inventaire :</span> Disponible pour emprunt immédiat.</p>
      </div>
    </div>
  );
}