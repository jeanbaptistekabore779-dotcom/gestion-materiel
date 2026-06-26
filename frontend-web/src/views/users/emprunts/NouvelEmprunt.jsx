// src/views/users/emrpunts/NouvelEmprunt.jsx
import React, { useState } from 'react';

export default function NouvelEmprunt() {
  const [formData, setFormData] = useState({
    materiel: '',
    dateDebut: '',
    dateFin: '',
    motif: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi réussi
    setSuccess(true);
    // Réinitialisation du formulaire
    setFormData({ materiel: '', dateDebut: '', dateFin: '', motif: '' });
    
    // Effacer le message de succès après 4 secondes
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Faire une demande d'emprunt</h3>
        <p className="text-xs text-slate-400">Remplissez ce formulaire pour réserver un équipement pédagogique pour vos TP.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium animate-fadeIn">
          🎉 Votre demande d'emprunt a été soumise avec succès ! Elle est en attente de validation par l'administration.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Équipement / Matériel souhaité *</label>
          <input
            type="text"
            required
            value={formData.materiel}
            onChange={(e) => setFormData({...formData, materiel: e.target.value})}
            placeholder="Ex: Valise réseau pédagogique, Oscilloscope, Kit Arduino..."
            className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date de retrait *</label>
            <input
              type="date"
              required
              value={formData.dateDebut}
              onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date de retour prévue *</label>
            <input
              type="date"
              required
              value={formData.dateFin}
              onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Motif de l'emprunt / Cadre pédagogique *</label>
          <textarea
            required
            rows="3"
            value={formData.motif}
            onChange={(e) => setFormData({...formData, motif: e.target.value})}
            placeholder="Ex: Réalisation du projet de fin de cycle (Gestion du matériel et traçabilité des TP)."
            className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shadow-sm"
          >
            🚀 Soumettre la demande
          </button>
        </div>
      </form>
    </div>
  );
}