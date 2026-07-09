import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au chargement de l'application, on récupère l'utilisateur s'il existe dans le localStorage
  useEffect(() => {
  let isMounted = true;
  const fetchNotifs = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return; // ← ne pas appeler si pas de token
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
  if (user) fetchNotifs(); // ← déjà conditionnel, mais le token peut manquer
  return () => { isMounted = false; };
}, [user]);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // On déduit dynamiquement isAuthenticated pour éviter d'avoir à gérer un troisième useState
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour consommer le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};