import { useState, useEffect, createContext, useContext, createElement } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); }
      catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const login = (role) => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role) { setUser(parsed); return; }
      } catch {}
    }
    const userData = { role, nom: '', prenom: role };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, setUser, login, logout, loading, isAuthenticated: !!user } },
    children
  );
};

export default useAuth;