import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMatos from '../assets/Logo.png';
import api from '../api/api';
import { useAuth } from "../hooks/useAuth";
import { getPhotoUrl } from '../utils/media';

// Polices cohérentes avec le reste de l'app (Home.jsx). Si tu as déjà ajouté
// les liens Google Fonts dans index.html, ce bloc ne fait rien de plus —
// il sert de solution de repli.
function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@500;600&display=swap');
      .font-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
      .font-mono-brand { font-family: 'JetBrains Mono', monospace; }
    `}</style>
  );
}

// ─── Icônes ──────────────────────────────────────────────────────────
function BellIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ─── Utilitaires ────────────────────────────────────────────────────
function normalizeRole(role) {
  if (!role) return 'USER';
  const upperRole = role.toUpperCase();
  if (['ADMIN', 'TECHNICIEN', 'ETUDIANT', 'ENSEIGNANT'].includes(upperRole)) return upperRole;
  return 'USER';
}

// ─── Avatar ──────────────────────────────────────────────────────────
function Avatar({ user, size = 'md', currentRole }) {
  const [imgError, setImgError] = useState(false);

  // Le champ réel du modèle Django est "photo_profil" (voir UtilisateurSerializer).
  // On garde les autres noms en repli au cas où le hook useAuth normalise différemment.
  const rawPhoto = user?.photo_profil || user?.photo || user?.avatar || user?.photo_url || null;
  const photoUrl = rawPhoto ? getPhotoUrl(rawPhoto) : null;

  const sizeClass = size === 'lg' ? 'h-11 w-11' : 'h-8 w-8';
  const isClient = ['ETUDIANT', 'ENSEIGNANT', 'USER'].includes(currentRole);
  const borderClass = isClient
    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
    : 'border-blue-500 ring-2 ring-blue-500/20';

  useEffect(() => { setImgError(false); }, [photoUrl]);

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt="Avatar"
        className={`${sizeClass} rounded-full object-cover border-2 shadow-sm shrink-0 ${borderClass}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${sizeClass} bg-slate-100 border rounded-full flex items-center justify-center text-slate-400 shadow-sm shrink-0 relative overflow-hidden ${borderClass}`}>
      <svg className="w-full h-full p-1.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

// ─── Composant Principal ────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const dropdownRef = useRef(null);

  const currentRole = normalizeRole(user?.role);
  const isClientRole = ['USER', 'ETUDIANT', 'ENSEIGNANT'].includes(currentRole);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifs = async () => {
      try {
        const res = await api.get('notifications/');
        if (!isMounted) return;
        const data = res.data?.results || res.data || [];
        const nonLues = Array.isArray(data)
          ? data.filter(n => !n.lu && !n.read && !n.is_read).length
          : 0;
        setNotifCount(nonLues);
      } catch {
        if (isMounted) setNotifCount(0);
      }
    };
    if (user) fetchNotifs();
    return () => { isMounted = false; };
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabels = {
    ADMIN: 'Administrateur',
    TECHNICIEN: 'Technicien',
    ETUDIANT: 'Étudiant',
    ENSEIGNANT: 'Enseignant',
    USER: 'Utilisateur',
  };
  const displayRoleLabel = roleLabels[currentRole] || 'Utilisateur';

  const badgeColorClass = isClientRole
    ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
    : currentRole === 'ADMIN'
      ? 'text-blue-700 bg-blue-50 border-blue-100'
      : 'text-amber-700 bg-amber-50 border-amber-100';

  const handleLogoClick = () => {
    if (currentRole === 'ADMIN') navigate('/admin');
    else if (currentRole === 'TECHNICIEN') navigate('/technicien');
    else navigate('/user');
  };

  const handleNotifClick = () => {
    if (currentRole === 'ADMIN') navigate('/admin/notifications');
    else if (currentRole === 'TECHNICIEN') navigate('/technicien/notifications');
    else navigate('/user/notifications');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm text-slate-800 border-b border-slate-200 px-4 md:px-6 py-3 sticky top-0 z-40">
      <FontImport />
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">

        {/* LOGO */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={handleLogoClick}>
          <img
            src={logoMatos}
            alt="Logo GM"
            className="w-9 h-9 object-contain shrink-0 transition-transform group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="hidden sm:block leading-tight">
            <h1 className="font-display font-bold text-[15px] tracking-tight text-[#0C326F]">Gestion-Matériel</h1>
            <p className="font-mono-brand text-[10px] text-slate-400 tracking-wide">UFR/SEA · DÉPT. INFORMATIQUE</p>
          </div>
        </div>

        <div className="flex-1 hidden md:block" />

        {/* DROITE */}
        <div className="flex items-center gap-3 shrink-0">

          {/* NOTIFICATIONS */}
          <div
            onClick={handleNotifClick}
            className="relative p-2 rounded-full transition cursor-pointer hover:bg-slate-100 text-slate-500 hover:text-[#0C326F]"
            title="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            {notifCount > 0 && (
              <span className="absolute top-0.5 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-white">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              </span>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* PROFIL DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 cursor-pointer px-2.5 py-1.5 rounded-xl transition select-none hover:bg-slate-100"
            >
              <Avatar user={user} size="md" currentRole={currentRole} />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-slate-800">
                  {user?.prenom || user?.username || 'Utilisateur'}
                </p>
                <p className={`font-mono-brand text-[9px] mt-0.5 uppercase tracking-wide inline-block px-1.5 py-0.5 rounded border ${badgeColorClass}`}>
                  {displayRoleLabel}
                </p>
              </div>
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 text-slate-400 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 mb-1 bg-slate-50/50">
                  <Avatar user={user} size="lg" currentRole={currentRole} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user?.prenom || user?.username || 'Utilisateur'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || ''}</p>
                    <p className={`font-mono-brand text-[9px] uppercase inline-block mt-1.5 px-1.5 py-0.5 rounded border ${badgeColorClass}`}>
                      {displayRoleLabel}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setDropdownOpen(false); navigate(isClientRole ? '/user/profil' : '/admin/settings'); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  Mon Profil
                </button>

                <button
                  onClick={() => { setDropdownOpen(false); handleNotifClick(); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                >
                  <BellIcon className="h-4 w-4 text-slate-400" />
                  Notifications
                  {notifCount > 0 && (
                    <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {notifCount}
                    </span>
                  )}
                </button>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-3 font-semibold"
                >
                  <LogoutIcon className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;