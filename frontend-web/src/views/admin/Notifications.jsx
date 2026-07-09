// src/views/admin/Notifications.jsx
import React, { useState } from 'react';

export default function Notifications() {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    alert(`Notification générale envoyée :\n"${message}"`);
    setMessage('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Centre de notifications</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Diffusion de messages d'information et de rappels instantanés aux emprunteurs.
        </p>
      </div>

      <form onSubmit={handleSend} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-1">Diffuser une alerte générale</h4>
          <p className="text-xs text-slate-400">Le message sera visible par l'ensemble des utilisateurs connectés.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500">
            Contenu du message <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Le laboratoire de réseaux sera exceptionnellement fermé ce vendredi..."
            className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-[#0C326F] hover:bg-[#092654] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            Diffuser le message
          </button>
        </div>
      </form>
    </div>
  );
}