// src/views/users/rendezvous/NouveauRendezVous.jsx
import React, { useState } from 'react';

export default function NouveauRendezVous() {
  const [formData, setFormData] = useState({ date: '', heure: '', motif: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({ date: '', heure: '', motif: '' });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Planifier un Rendez-vous</h3>
        <p className="text-xs text-slate-400">Prenez rendez-vous avec le laboratoire pour récupérer ou restituer un lot de matériel.</p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium animate-fadeIn">
          📅 Demande de rendez-vous enregistrée ! En attente de confirmation technique.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date souhaitée *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Heure *</label>
            <input
              type="time"
              required
              value={formData.heure}
              onChange={(e) => setFormData({...formData, heure: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Objet / Matériel concerné *</label>
          <input
            type="text"
            required
            value={formData.motif}
            onChange={(e) => setFormData({...formData, motif: e.target.value})}
            placeholder="Ex: Retrait de la valise de TP Réseaux (Groupe L3 Info)"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
          />
        </div>
        <button type="submit" className="bg-[#1E40AF] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">
          🗓️ Réserver le créneau
        </button>
      </form>
    </div>
  );
}