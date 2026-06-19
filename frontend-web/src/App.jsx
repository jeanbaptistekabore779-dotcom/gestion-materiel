import React, { useState } from 'react';
import Home from './views/Home'; 
import Login from './views/auth/Login';
import DashboardAdmin from './views/admin/DashboardAdmin'; 
import DashboardUser from './views/users/DashboardUser'; 
import './App.css';

function App() {
  const [view, setView] = useState('user');
  const [role, setRole] = useState('Étudiant');

  const handleLogout = () => {
    localStorage.clear();
    setRole('');
    setView('home'); 
  };

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
    setView('user'); 
  };

  return (
    <>
      {/* 1. Vues publiques */}
      {view === 'home' && <Home onNavigateToLogin={() => setView('login')} />}
      {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      
      {/* 2. Routage dynamique des Dashboards */}
      {view === 'user' && (
        role === 'Admin' 
          ? <DashboardAdmin onLogout={handleLogout} /> 
          : <DashboardUser role={role} onLogout={handleLogout} />
      )}
      
      {/* 3. Barre de développement */}
      <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm p-3 rounded-xl flex flex-wrap gap-2 z-50 shadow-2xl text-xs text-white items-center max-w-sm border border-gray-700">
        <span className="font-semibold text-gray-300 w-full mb-1">Outils de test :</span>
        <button onClick={() => { setView('home'); setRole(''); }} className="px-2 py-1 bg-gray-600 rounded">Accueil</button>
        <button onClick={() => { setRole('Admin'); setView('user'); }} className="px-2 py-1 bg-blue-600 rounded">Forcer Admin</button>
        <button onClick={() => { setRole('Étudiant'); setView('user'); }} className="px-2 py-1 bg-emerald-600 rounded">Forcer Étudiant</button>
      </div>
    </>
  );
}

export default App;