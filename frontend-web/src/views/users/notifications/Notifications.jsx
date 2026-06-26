// src/views/users/notifications/NotificationUser.jsx
import React, { useState } from 'react';

export default function NotificationUser() {
  const [notifications, setNotifications] = useState([]);

  // Bouton pour simuler l'arrivée d'une notification en direct pendant la soutenance
  const simulerNouvelleNotification = () => {
    const nouvelleNotif = {
      id: Date.now(),
      titre: '✅ Demande d\'emprunt approuvée',
      message: 'Votre demande pour la "Valise Réseau Cisco" a été validée. Vous pouvez récupérer le matériel au laboratoire de l\'UFR/SEA.',
      date: 'À l\'instant',
      lue: false
    };
    setNotifications([nouvelleNotif, ...notifications]);
  };

  const marquerCommeLue = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, lue: true } : n));
  };

  const supprimerNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* En-tête de la section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Centre de Notifications</h3>
          <p className="text-xs text-slate-400">Restez informé des validations d'emprunts et des alertes de retour.</p>
        </div>
        <button
          onClick={simulerNouvelleNotification}
          className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-2 rounded-xl transition-colors shadow-sm"
        >
          🔔 Simuler une notification
        </button>
      </div>

      {/* Contenu principal */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-400 font-medium">Vous n'avez aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3 animate-fadeIn">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex justify-between items-start gap-4 ${
                notif.lue 
                  ? 'bg-white border-slate-200 opacity-75' 
                  : 'bg-blue-50/40 border-blue-100 shadow-sm'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!notif.lue && <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />}
                  <h4 className="font-bold text-sm text-slate-800">{notif.titre}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                <span className="block text-[10px] text-slate-400 pt-1 font-medium">{notif.date}</span>
              </div>

              {/* Actions de gestion */}
              <div className="flex gap-2 shrink-0">
                {!notif.lue && (
                  <button
                    onClick={() => marquerCommeLue(notif.id)}
                    className="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Marquer lue
                  </button>
                )}
                <button
                  onClick={() => supprimerNotification(notif.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}