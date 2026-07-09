// src/views/users/notifications/NotificationUser.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

const TYPE_TITRES = {
  EMPRUNT: '📦 Emprunt / Retour',
  ALERTE: '⚠️ Alerte',
  INFO: 'ℹ️ Information',
};

function formatDate(dateIso) {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function NotificationUser() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('notifications/');
      const results = Array.isArray(data) ? data : (data.results ?? []);
      setNotifications(results);
    } catch (err) {
      setError("Impossible de charger vos notifications pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const marquerCommeLue = async (id) => {
    // Mise à jour optimiste
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lue: true } : n));
    try {
      await api.post(`notifications/${id}/marquer-lue/`);
    } catch (err) {
      // Rollback en cas d'échec
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lue: false } : n));
    }
  };

  const supprimerNotification = async (id) => {
    const backup = notifications;
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.delete(`notifications/${id}/`);
    } catch (err) {
      setNotifications(backup);
    }
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
          onClick={fetchNotifications}
          className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors"
        >
          ⟳ Actualiser
        </button>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-7 h-7 border-4 border-blue-100 border-t-[#0C326F] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Chargement des notifications...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{error}</div>
      ) : notifications.length === 0 ? (
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
                  <h4 className="font-bold text-sm text-slate-800">
                    {notif.type_display ?? TYPE_TITRES[notif.typeNotification] ?? 'Notification'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                <span className="block text-[10px] text-slate-400 pt-1 font-medium">{formatDate(notif.dateNotification)}</span>
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
