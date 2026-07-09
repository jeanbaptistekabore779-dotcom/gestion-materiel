// src/views/auth/Login.jsx
import React, { useState } from 'react';
import api from '../../api/api';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';


function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@500;600&display=swap');
      .font-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
      .font-mono-brand { font-family: 'JetBrains Mono', monospace; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  );
}

// ─── Icônes ───────────────────────────────────────────────────────
function LogInIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
}
function EyeIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
function AlertIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function CheckCircleIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

function CircuitBackdrop() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-login" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" fill="none" stroke="#0E3980" strokeWidth="0.4" />
        </pattern>
      </defs>
      {[[150,150],[350,150],[140,360],[300,400],[200,600],[240,640]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#3b82f6" />
      ))}
    </svg>
  );
}

export default function Login({ onLoginSuccess, onNavigateToHome, onNavigateToRegister }) {
  const { setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tokenRes = await api.post('token/', { username, password });
      const { access, refresh } = tokenRes.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const payload = JSON.parse(atob(access.split('.')[1]));
      const trueRole = (payload.role || 'ETUDIANT').toUpperCase();

      const userData = {
        id:       payload.user_id,
        username: payload.username || username,
        prenom:   payload.prenom   || username,
        nom:      payload.nom      || '',
        email:    payload.email    || '',
        role:     trueRole,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      if (setUser) setUser(userData);
      if (setIsAuthenticated) setIsAuthenticated(true);

      if (trueRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (trueRole === 'TECHNICIEN') {
        navigate('/technicien', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }

      if (onLoginSuccess) onLoginSuccess(trueRole);

    } catch (err) {
      console.error('Erreur connexion:', err);
      if (err.response?.status === 401) {
        setError("Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe.");
      } else if (!err.response) {
        setError('Impossible de contacter le serveur. Vérifiez que le backend est lancé.');
      } else {
        setError('Une erreur est survenue. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  const btnContent = loading
    ? (
      <span className="flex items-center justify-center gap-2">
        <span style={{
          display: 'inline-block', width: '1rem', height: '1rem',
          border: '2px solid rgba(8, 53, 119, 0.3)', borderTopColor: 'white',
          borderRadius: '50%', animation: 'spin 0.7s linear infinite',
        }} />
        <span>Connexion en cours...</span>
      </span>
    )
    : (
      <span className="flex items-center justify-center gap-2">
        <LogInIcon className="h-4 w-4" />
        <span>Se connecter</span>
      </span>
    );

  return (
    <div className="min-h-screen flex font-sans">
      <FontImport />

      {/* ── Panneau institutionnel (BLEU CLAIR) ──────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#093062] via-[#07336D] to-[#093062] flex-col justify-between p-12 text-slate-800 border-r border-blue-100">
        <CircuitBackdrop />
        
        <div className="relative flex items-center gap-3">
          <img src={Logo} alt="GM" className="h-10 w-10 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }} />
          <div>
            <p className="font-display font-bold text-[15px] text-[#D3DBE6]">Gestion-Matériel</p>
            <p className="font-mono-brand text-[10px] text-slate-400 tracking-wide">UFR/SEA · DÉPT. INFORMATIQUE</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="font-display text-3xl font-bold leading-tight text-[#E19090]">
            Gérez le matériel pédagogique en toute simplicité
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed  text-[#F8FAFD]">
            Connectez-vous pour accéder à votre espace.
          </p>
          
        
        </div>

        <p className="relative font-mono-brand text-[15px] text-slate-400">
          © 2026 · Projet de Fin de Cycle · Département Informatique
        </p>
      </div>

      {/* ── Formulaire ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md space-y-6">

          {/* Logo visible seulement sur mobile */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-4">
            <img src={Logo} alt="GM" className="h-14 w-14 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            <p className="font-display font-bold text-[#1B4F9C]">Gestion-Matériel</p>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Accéder à votre espace</h1>
            <p className="text-sm text-slate-500 mt-1">Entrez vos identifiants pour continuer.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Nom utilisateur <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-[#1B4F9C] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-[#1B4F9C] focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500 transition-colors"
                  tabIndex={-1}>
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading || !username || !password}
              className="w-full py-3 bg-[#0A3576] hover:bg-[#09377C] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-200/40 mt-2">
              {btnContent}
            </button>
          </form>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="font-mono-brand text-[10px] text-slate-300 uppercase">ou</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">Pas encore de compte ?</p>
            <button onClick={onNavigateToRegister}
              className="w-full py-2.5 border-2 border-[#0B336E] text-[#0F3670] hover:bg-blue-50 font-bold rounded-xl text-sm transition-colors">
              Créer un compte étudiant
            </button>
          </div>

          {onNavigateToHome && (
            <div className="text-center pt-1">
              <button onClick={onNavigateToHome}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}