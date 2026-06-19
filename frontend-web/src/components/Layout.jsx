import React from 'react';
import { BellIcon, ChevronDownIcon, GraduationCapIcon } from 'lucide-react';

export default function Layout({ children, user }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. BARRE SUPÉRIEURE (Bannière Bleue) */}
      <header className="bg-[#1A3673] text-white h-16 px-6 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <GraduationCapIcon className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Gestion-Matériel</h1>
            <p className="text-xs text-blue-200/80 font-light">Portail de gestion du matériel universitaire</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Icône Notification avec badge */}
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <BellIcon className="h-6 w-6 text-blue-100" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-[10px] font-bold text-slate-900 h-4 w-4 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          <div className="h-8 w-[1px] bg-blue-800" />

          {/* Profil Utilisateur Dynamique */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="h-9 w-9 bg-white text-[#1A3673] rounded-full flex items-center justify-center font-bold shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{user.name}</p>
              <p className="text-xs text-blue-200">
                <span className={user.role === 'Admin' ? 'text-amber-400 font-medium' : 'text-blue-300'}>
                  {user.role}
                </span>
                {` · ${user.department} · M-${user.id}`}
              </p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-blue-300 group-hover:text-white transition-colors" />
          </div>
        </div>
      </header>

      {/* 2. CORPS PRINCIPAL */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}