import React from 'react';
import { 
  FolderIcon, ClipboardListIcon, CalendarIcon, 
  WrenchIcon, HistoryIcon, UsersIcon, BellRingIcon 
} from 'lucide-react';

export default function Sidebar({ role, activeTab, setActiveTab }) {
  // Configuration des menus selon le rôle
  const menuConfig = role === 'Admin' ? {
    sections: [
      {
        title: 'APPLICATIONS',
        items: [
          { id: 'catalogue', label: 'Catalogue', icon: FolderIcon },
          { id: 'emprunts', label: 'Emprunts', icon: ClipboardListIcon, badge: 5 },
          { id: 'rendezvous', label: 'Rendez-vous', icon: CalendarIcon },
          { id: 'maintenance', label: 'Pannes & Maintenance', icon: WrenchIcon, badge: 3 },
          { id: 'historique', label: 'Historique & Logs', icon: HistoryIcon },
        ]
      },
      {
        title: 'ADMINISTRATION',
        items: [
          { id: 'utilisateurs', label: 'Utilisateurs', icon: UsersIcon },
          { id: 'notifications', label: 'Notifications', icon: BellRingIcon },
        ]
      }
    ]
  } : {
    sections: [
      {
        title: 'MON ESPACE',
        items: [
          { id: 'catalogue', label: 'Catalogue', icon: FolderIcon },
          { id: 'mes-emprunts', label: 'Mes Emprunts', icon: ClipboardListIcon, badge: 2 },
          { id: 'mes-rendezvous', label: 'Mes Rendez-vous', icon: CalendarIcon },
          { id: 'notifications', label: 'Notifications', icon: BellRingIcon, badge: 3 },
        ]
      }
    ]
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col py-6 px-4 overflow-y-auto select-none">
      {menuConfig.sections.map((section, sIndex) => (
        <div key={section.title} className={sIndex > 0 ? 'mt-8' : ''}>
          <p className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 px-3">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#1A3673] text-white shadow-sm shadow-blue-900/10' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-500 text-slate-900' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}