// src/components/Sidebar.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Icon = {
  Home:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Box:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Logs:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Calendar:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Emprunts:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Wrench:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  History:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/></svg>,
  Bell:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Search:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Alert:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Logout:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const menus = {
  ADMIN: [
    { name: 'Accueil',            path: '/',               icon: Icon.Home,     exact: true },
    { divider: 'GESTION' },
    { name: 'Utilisateurs',       path: '/admin/users',        icon: Icon.Users },
    { name: 'Matériels & Stocks', path: '/admin/materiels',    icon: Icon.Box },
    { name: 'Emprunts',           path: '/admin/emprunts',     icon: Icon.Emprunts },
    { name: 'Maintenances',       path: '/admin/maintenances', icon: Icon.Wrench },
    { divider: 'SUIVI' },
    { name: 'Rendez-vous',        path: '/admin/rendez-vous',  icon: Icon.Calendar },
    { name: 'Journalisation',     path: '/admin/logs',         icon: Icon.Logs },
    { name: 'Notifications',      path: '/admin/notifications',icon: Icon.Bell },
  ],
  TECHNICIEN: [
    { name: 'Accueil',            path: '/',                icon: Icon.Home,    exact: true },
    { divider: 'MES TÂCHES' },
    { name: 'Mes Interventions',  path: '/technicien/maintenances',  icon: Icon.Wrench },
    { name: 'Matériels en panne', path: '/technicien/pannes',        icon: Icon.Alert },
    { name: 'Historique',         path: '/technicien/historique',    icon: Icon.History },
    { divider: 'SUIVI' },
    { name: 'Notifications',      path: '/technicien/notifications', icon: Icon.Bell },
  ],
  USER: [
    { name: 'Accueil',          path: '/',                   icon: Icon.Home,     exact: true },
    { divider: 'MATÉRIELS' },
    { name: 'Catalogue',        path: '/user/catalogue',     icon: Icon.Search },
    { name: 'Nouvelle demande', path: '/user/demande',       icon: Icon.Plus },
    { name: 'Mes Emprunts',     path: '/user/mes-emprunts',  icon: Icon.Emprunts },
    { name: 'Historique',       path: '/user/historique',    icon: Icon.History },
    { divider: 'PLANNING' },
    { name: 'Rendez-vous',      path: '/user/rendez-vous',   icon: Icon.Calendar },
    { name: 'Notifications',    path: '/user/notifications', icon: Icon.Bell },
  ],
};

const roleConfig = {
  ADMIN:      { label: 'Administrateur', accent: 'bg-blue-50 text-blue-700 border-blue-200' },
  TECHNICIEN: { label: 'Technicien',     accent: 'bg-amber-50 text-amber-700 border-amber-200' },
  ETUDIANT:   { label: 'Étudiant',       accent: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ENSEIGNANT: { label: 'Enseignant',     accent: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  USER:       { label: 'Utilisateur',    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export default function Sidebar({ onLogout, role, actualRole, userType, onNavigate }) {
  const location = useLocation();
  const navigate  = useNavigate();

  const currentRole  = role || 'USER';
  const currentItems = menus[currentRole] || menus['USER'];

  const roleForLabel = (actualRole || currentRole || '').toUpperCase();
  const config = roleConfig[roleForLabel] || roleConfig[currentRole] || roleConfig['USER'];

  const handleNavigate = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  return (
    /* Changement ici : Suppression de rounded-2xl, border global et shadow-sm. 
       Ajout de border-r pour fusionner proprement sous la Navbar. */
    <div className="
      w-72
      shrink-0
      bg-gradient-to-b
      from-[#0C326F]
      via-[#114A9E]
      to-[#1E5BBF]
      text-white
      flex
      flex-col
      h-full
      shadow-2xl
      border-r
      border-blue-900/30
      ">

      {/* Badge de rôle */}
      <div className="px-5 py-5 border-b border-slate-100">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${config.accent}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {userType || config.label}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {currentItems.map((item, index) => {

          if (item.divider) {
            return (
              <div key={index} className="px-3 pt-6 pb-2 first:pt-2">
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.18em]">
                  {item.divider}
                </span>
              </div>
            );
          }

          const active = isActive(item);
          const IconComp = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                active
  ? 'bg-white text-[#0C326F] font-semibold shadow-md'
  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className={`w-5 h-5 shrink-0 transition-colors ${
                active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <IconComp />
              </span>
              <span className="truncate">{item.name}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 group"
        >
          <span className="w-5 h-5 shrink-0 group-hover:text-rose-500 transition-colors">
            <Icon.Logout />
          </span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}