// src/views/technicien/Notifications.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const fmt = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch { return d; }
};

const TYPE_CONFIG = {
  INFO:    { label: 'Information',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ALERTE:  { label: 'Alerte / Panne', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  EMPRUNT: { label: 'Emprunt / Retour', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const BellIcon = (p) => (
  <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('TOUTES'); // TOUTES | NON_LUES
  const [marking, setMarking] = useState(null); // id en cours de traitement

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('notifications/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setNotifications(data);
    } catch (err) {
      console.error('Erreur chargement notifications:', err.response?.data || err);
      setError("Impossible de charger les notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerLue = async (id) => {
    setMarking(id);
    try {
      await api.post(`notifications/${id}/marquer-lue/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lue: true } : n))
      );
    } catch (err) {
      console.error('Erreur marquage lu:', err.response?.data || err);
    } finally {
      setMarking(null);
    }
  };

  const handleToutMarquer = async () => {
    const nonLues = notifications.filter((n) => !n.lue);
    if (nonLues.length === 0) return;
    try {
      await Promise.all(
        nonLues.map((n) => api.post(`notifications/${n.id}/marquer-lue/`))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));
    } catch (err) {
      console.error('Erreur marquage global:', err.response?.data || err);
    }
  };

  const filtered = notifications.filter((n) =>
    filter === 'TOUTES' ? true : !n.lue
  );
  const nbNonLues = notifications.filter((n) => !n.lue).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Chargement des notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {nbNonLues > 0
              ? `${nbNonLues} notification${nbNonLues > 1 ? 's' : ''} non lue${nbNonLues > 1 ? 's' : ''}`
              : 'Vous êtes à jour.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {nbNonLues > 0 && (
            <button
              onClick={handleToutMarquer}
              className="text-xs bg-[#0C326F] hover:bg-blue-900 text-white font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {['TOUTES', 'NON_LUES'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
              filter === f
                ? 'bg-[#0C326F] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {f === 'TOUTES' ? 'Toutes' : 'Non lues'}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <BellIcon className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">
            {filter === 'NON_LUES' ? 'Aucune notification non lue.' : 'Aucune notification pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const conf = TYPE_CONFIG[n.typeNotification] ?? TYPE_CONFIG.INFO;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border shadow-sm transition-colors ${
                  n.lue ? 'bg-white border-slate-200' : 'bg-blue-50/40 border-blue-100'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-xl border ${conf.color}`}>
                  <BellIcon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${conf.color}`}>
                      {n.type_display ?? conf.label}
                    </span>
                    {!n.lue && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                    )}
                    <span className="text-[11px] text-slate-400 ml-auto">{fmt(n.dateNotification)}</span>
                  </div>
                  <p className={`text-sm mt-1 ${n.lue ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                    {n.message}
                  </p>
                </div>

                {!n.lue && (
                  <button
                    onClick={() => handleMarquerLue(n.id)}
                    disabled={marking === n.id}
                    className="shrink-0 text-xs bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 font-semibold px-3 py-1.5 rounded-xl transition-colors"
                  >
                    {marking === n.id ? '...' : 'Marquer lu'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}