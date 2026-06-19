// src/views/admin/DashboardAdmin.jsx
import React, { useState } from 'react';

/* ========================================================================== */
/* 1. COMPOSANTS D'ICÔNES SVG EXACTES (SANS LIBRAIRIE EXTERNE)                */
/* ========================================================================== */
function LogoCapIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CatalogueIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  )
}

function EmpruntsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5M4 20L20 4M20 20H4M8 4H4v4" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function SlidersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function MaintenanceIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function UsersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function HistoryIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}


/* ========================================================================== */
/* 2. COMPOSANT GENERAL DU DASHBOARD ADMIN                                    */
/* ========================================================================== */
export default function DashboardAdmin({ role, onLogout }) {
  const [activeTab, setActiveTab] = useState('Catalogue');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-800">
      
      {/* TOP NAVBAR INSTITUTIONNELLE BLEUE */}
      <header className="bg-[#1A3673] text-white h-16 px-6 flex items-center justify-between shadow-sm z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl">
            <LogoCapIcon className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none tracking-wide">Gestion-Matériel</h1>
            <p className="text-[11px] text-blue-200/80 font-light mt-1">Portail de gestion du matériel universitaire</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Icône Cloche Notification */}
          <div className="relative cursor-pointer">
            <BellIcon className="h-5 w-5 text-blue-100" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-[9px] font-bold text-slate-900 h-3.5 w-3.5 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          <div className="h-6 w-[1px] bg-blue-800" />

          {/* Profil Utilisateur avec vraie photo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" 
              alt="Profil" 
              className="h-9 w-9 rounded-full object-cover border border-white/20 shadow-sm"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold leading-tight">Jean Baptiste Kaboré</p>
              <p className="text-[10px] text-blue-200 mt-0.5">
                <span className="text-amber-400 font-medium">Admin</span> · Génie Informatique · M-203398
              </p>
            </div>
            <ChevronDownIcon className="h-3.5 w-3.5 text-blue-300" />
          </div>
        </div>
      </header>

      {/* PANNEAU DE NAVIGATION & CONTENU */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* SIDEBAR GAUCHE BLANCHE */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col py-6 px-4 shrink-0 select-none justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 px-3 uppercase">APPLICATIONS</p>
              <nav className="space-y-1">
                <SidebarLink label="Catalogue" active={activeTab === 'Catalogue'} onClick={() => setActiveTab('Catalogue')} icon={<CatalogueIcon className="h-5 w-5" />} />
                <SidebarLink label="Emprunts" active={activeTab === 'Emprunts'} onClick={() => setActiveTab('Emprunts')} badge="5" icon={<EmpruntsIcon className="h-5 w-5" />} />
                <SidebarLink label="Rendez-vous" active={activeTab === 'Rendez-vous'} onClick={() => setActiveTab('Rendez-vous')} icon={<CalendarIcon className="h-5 w-5" />} />
                <SidebarLink label="Pannes & Maintenance" active={activeTab === 'Maintenance'} onClick={() => setActiveTab('Maintenance')} badge="3" icon={<MaintenanceIcon className="h-5 w-5" />} />
                <SidebarLink label="Historique & Logs" active={activeTab === 'Logs'} onClick={() => setActiveTab('Logs')} icon={<HistoryIcon className="h-5 w-5" />} />
              </nav>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 px-3 uppercase">ADMINISTRATION</p>
              <nav className="space-y-1">
                <SidebarLink label="Utilisateurs" active={activeTab === 'Utilisateurs'} onClick={() => setActiveTab('Utilisateurs')} icon={<UsersIcon className="h-5 w-5" />} />
                <SidebarLink label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} icon={<BellIcon className="h-5 w-5" />} />
              </nav>
            </div>
          </div>

          {/* Déconnexion */}
          <div className="pt-4 border-t border-slate-100">
            <button 
              onClick={onLogout}
              className="w-full text-left text-sm font-semibold text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ESPACE DE TRAVAIL PRINCIPAL DROIT */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] px-8 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Titre dynamique */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tableau de bord du matériel</h2>
              <p className="text-sm text-slate-400 mt-1">Gerez le catalogue, les emprunts, la maintenance et l'historique en un seul endroit.</p>
            </div>

            {/* Grille des 4 Blocs Compteurs */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Matériels disponibles" value="142" icon={<CatalogueIcon className="h-6 w-6" />} bgIcon="bg-blue-50 text-blue-700" />
              <StatCard title="Emprunts actifs" value="37" icon={<EmpruntsIcon className="h-5 w-5" />} bgIcon="bg-indigo-50 text-indigo-600" />
              <StatCard title="En attente de validation" value="5" icon={<CalendarIcon className="h-5 w-5" />} bgIcon="bg-amber-50 text-amber-700" highlight />
              <StatCard title="En maintenance" value="3" icon={<MaintenanceIcon className="h-5 w-5" />} bgIcon="bg-orange-50 text-orange-700" />
            </div>

            {/* Barre de Recherche + Boutons actions */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un matériel, une référence..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none focus:border-blue-700 shadow-sm transition-colors"
                />
              </div>
              <button className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                <SlidersIcon className="h-4 w-4 text-slate-500" />
                <span>Filtres</span>
              </button>
              <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#1E40AF] px-5 text-sm font-medium text-white hover:bg-blue-800 shadow-sm transition-colors">
                <span className="text-lg leading-none">+</span>
                <span>Ajouter</span>
              </button>
            </div>

            {/* Pilules de Sélections */}
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full px-5 py-1.5 text-sm font-medium bg-[#1E40AF] text-white shadow-sm">Tous</button>
              <button className="rounded-full px-5 py-1.5 text-sm font-medium bg-white text-slate-500 border border-slate-200 hover:bg-slate-50">Informatique</button>
              <button className="rounded-full px-5 py-1.5 text-sm font-medium bg-white text-slate-500 border border-slate-200 hover:bg-slate-50">Audiovisuel</button>
              <button className="rounded-full px-5 py-1.5 text-sm font-medium bg-white text-slate-500 border border-slate-200 hover:bg-slate-50">Laboratoire</button>
            </div>

            {/* Zone d'affichage des cartes ou tableaux */}
            <div className="bg-white rounded-3xl border border-slate-200/60 p-8 text-center shadow-sm">
              <p className="text-sm text-slate-400">Section en cours de liaison avec l'onglet : <strong className="text-slate-700">{activeTab}</strong></p>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* 3. SOUS-COMPOSANTS LOGIQUES                                                */
/* ========================================================================== */
function SidebarLink({ label, active, onClick, badge, icon }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active ? "bg-[#1E40AF] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, icon, bgIcon, highlight }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${bgIcon}`}>
        {icon}
      </span>
      <div>
        <p className={`text-3xl font-bold tracking-tight ${highlight ? 'text-amber-600' : 'text-slate-800'}`}>{value}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">{title}</p>
      </div>
    </div>
  );
}