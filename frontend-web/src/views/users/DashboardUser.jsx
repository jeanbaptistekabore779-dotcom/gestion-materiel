// src/views/users/DashboardUser.jsx
import React, { useState } from 'react'

/* ========================================================================== */
/* 1. ICÔNES SVG EXACTES DE LA MAQUETTE (SANS LIBRAIRIE EXTERNE)             */
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

// Nouvelle icône de dossier pour harmoniser la liste latérale
function FolderIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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


/* ========================================================================== */
/* 2. COMPOSANT DES BLOCS COMPTEURS (STATS)                                   */
/* ========================================================================== */
function StudentStats() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Matériels disponibles */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <CatalogueIcon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">142</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">Matériels<br/>disponibles</p>
        </div>
      </div>

      {/* Mes Emprunts actifs */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <EmpruntsIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">2</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">Mes Emprunts<br/>actifs</p>
        </div>
      </div>

      {/* Mes Demandes en attente */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
          <CalendarIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">1</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">Mes Demandes<br/>en attente</p>
        </div>
      </div>

      {/* Mes Matériels en retard */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-700">
          <CalendarIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">1</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">Mes Matériels<br/>en retard</p>
        </div>
      </div>
    </div>
  )
}


/* ========================================================================== */
/* 3. COMPOSANT DU CATALOGUE ET DES FILTRES                                   */
/* ========================================================================== */
function StudentCatalogue() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const categories = ["Tous", "Informatique", "Audiovisuel", "Laboratoire"];

  return (
    <div className="space-y-6">
      {/* Barre de Recherche + Bouton Filtres */}
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
      </div>

      {/* Pilules de Catégories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
              activeFilter === cat 
                ? "bg-[#1E40AF] text-white shadow-sm" 
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille de Matériels d'après la maquette Figma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carte 1 : Ordinateur */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[340px] group">
          <div className="relative bg-slate-50 flex-1 overflow-hidden flex items-center justify-center p-4">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80" 
              alt="MacBook" 
              className="max-h-full object-contain rounded-lg"
            />
            <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Disponible
            </span>
          </div>
        </div>

        {/* Carte 2 : Vidéoprojecteur */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[340px] group">
          <div className="relative bg-slate-50 flex-1 overflow-hidden flex items-center justify-center p-4">
            <img 
              src="https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80" 
              alt="Projecteur" 
              className="max-h-full object-contain rounded-lg"
            />
            <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Disponible
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}


/* ========================================================================== */
/* 4. COMPOSANT GENERAL DU DASHBOARD                                          */
/* ========================================================================== */
export default function DashboardUser({ role, onLogout }) {
  const [activeTab, setActiveTab] = useState("catalogue");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800 antialiased">
      
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

          {/* Profil Utilisateur mis à jour avec photo réelle */}
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" 
              alt="Profil Étudiant" 
              className="h-9 w-9 rounded-full object-cover border border-white/20 shadow-sm"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold leading-tight">Jean Baptiste Kaboré</p>
              <p className="text-[10px] text-blue-200 mt-0.5">
                <span className="text-amber-400 font-medium">Étudiant</span> · Génie Informatique · M-203398
              </p>
            </div>
            <ChevronDownIcon className="h-3.5 w-3.5 text-blue-300" />
          </div>
        </div>
      </header>

      {/* PANNEAU DE NAVIGATION & CONTENU */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* SIDEBAR GAUCHE BLANCHE */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col py-6 px-4 shrink-0 select-none justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 px-3 uppercase">MON ESPACE</p>
              
              <div className="space-y-1">
                {/* Catalogue */}
                <button
                  onClick={() => setActiveTab("catalogue")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "catalogue" ? "bg-[#1E40AF] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CatalogueIcon className="h-5 w-5" />
                    <span>Catalogue</span>
                  </div>
                </button>

                {/* Mes Emprunts */}
                <button
                  onClick={() => setActiveTab("emprunts")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "emprunts" ? "bg-[#1E40AF] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <EmpruntsIcon className="h-5 w-5" />
                    <span>Mes Emprunts</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'emprunts' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'}`}>2</span>
                </button>

                {/* Mes Rendez-vous */}
                <button
                  onClick={() => setActiveTab("rdv")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "rdv" ? "bg-[#1E40AF] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Mes Rendez-vous</span>
                  </div>
                </button>

                {/* Notifications */}
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "notifications" ? "bg-[#1E40AF] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BellIcon className="h-5 w-5" />
                    <span>Notifications</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'notifications' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'}`}>3</span>
                </button>
              </div>
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
            
            {/* Salutations Maquette */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bonjour, Jean Baptiste</h2>
              <p className="text-sm text-slate-400 mt-1">Parcourez le catalogue, suivez vos emprunts et vos rendez-vous en un seul endroit.</p>
            </div>

            {/* Vues Dynamiques */}
            {activeTab === "catalogue" && (
              <>
                <StudentStats />
                <StudentCatalogue />
              </>
            )}

            {activeTab !== "catalogue" && (
              <div className="bg-white rounded-3xl border border-slate-200/60 p-8 text-center shadow-sm">
                <p className="text-sm text-slate-400">Section en cours de liaison avec l'onglet : <strong className="text-slate-700 uppercase">{activeTab}</strong></p>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  )
}