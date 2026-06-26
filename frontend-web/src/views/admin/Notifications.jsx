// src/views/admin/Notifications.jsx
import React, { useState } from 'react';

export default function Notifications() {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    alert(`📢 Notification globale envoyée :\n"${message}"`);
    setMessage('');
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Centre d'Alerte & Notifications</h3>
        <p className="text-xs text-slate-400">Envoyez des messages de rappels instantanés aux emprunteurs.</p>
      </div>

      <form onSubmit={handleSend} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-700 text-sm">Diffuser un message d'information général</h4>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Contenu de la notification *</label>
          <textarea
            required
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Attention, le laboratoire de réseaux sera exceptionnellement fermé ce vendredi..."
            className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-colors">
          🚀 Diffuser l'alerte
        </button>
      </form>
    </div>
  );
}