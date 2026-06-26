import React, { useState, useEffect, createContext, useContext } from 'react';
 
const AuthContext = createContext(null);
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Restaurer la session au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); }
      catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);
 
  /**
   * login() — deux usages :
   *  1. Appelé par Login.jsx après Django : on lit le user déjà sauvegardé dans localStorage
   *  2. Appelé avec (role, type) pour la démo rapide (portail)
   */
  const login = (role, typePrecision = '') => {
    // Si Login.jsx a déjà sauvegardé le vrai user, on l'utilise
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // S'assurer que le rôle correspond (sécurité)
        if (parsed.role) {
          setUser(parsed);
          return;
        }
      } catch { /* ignore */ }
    }
 
    // Fallback : création d'un user de démo (portail)
    const userData = {
      role,
      type: typePrecision,
      nom: '',
      prenom: typePrecision || role.charAt(0) + role.slice(1).toLowerCase(),
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
 
  const logout = () => {
    setUser(null);
    localStorage.clear();
  };
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-400 text-sm">Chargement...</div>
      </div>
    );
  }
 
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export default useAuth;