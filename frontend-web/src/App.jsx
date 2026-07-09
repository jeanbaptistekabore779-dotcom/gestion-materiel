import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/auth/Login';
import RegisterCNIB from './views/auth/RegisterCNIB';
import DashboardUser from './views/users/DashboardUser';
import DashboardTechnicien from './views/technicien/DashboardTechnicien';
import DashboardAdmin from './views/admin/DashboardAdmin';
import { AuthProvider, useAuth } from './hooks/useAuth';

function normalizeRole(role) {
  if (!role) return 'USER';
  return role.toUpperCase();
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div style={{
          width: '2.5rem', height: '2.5rem',
          border: '3px solid #0C326F', borderTopColor: 'transparent',
          borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p className="text-xs text-slate-400 font-medium">Vérification des droits d'accès...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const currentRole = normalizeRole(user?.role);

  const hasAccess = allowedRoles.includes(currentRole) ||
    (allowedRoles.includes('USER') && ['ETUDIANT', 'ENSEIGNANT', 'USER'].includes(currentRole));

  if (!hasAccess) {
    if (currentRole === 'ADMIN')      return <Navigate to="/admin" replace />;
    if (currentRole === 'TECHNICIEN') return <Navigate to="/technicien" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
}

function MainAppContent() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLoginSuccess = (role) => {
    const currentRole = normalizeRole(role);
    if (currentRole === 'ADMIN')           navigate('/admin',      { replace: true });
    else if (currentRole === 'TECHNICIEN') navigate('/technicien', { replace: true });
    else                                   navigate('/user',       { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const userType = user?.role
    ? (normalizeRole(user.role) === 'ENSEIGNANT' ? 'Enseignant' : 'Étudiant')
    : 'Étudiant';

  return (
    <Routes>
      {/* 1. Accueil — toujours accessible, même connecté */}
      <Route path="/" element={
        <Home
          onNavigateToLogin={() => navigate('/login')}
          onNavigateToRegister={() => navigate('/register')}
          isAuthenticated={isAuthenticated}
          onNavigateToDashboard={() => {
            const role = normalizeRole(user?.role);
            if (role === 'ADMIN')           navigate('/admin');
            else if (role === 'TECHNICIEN') navigate('/technicien');
            else                            navigate('/user');
          }}
        />
      } />

      {/* 2. Connexion — redirige vers dashboard si déjà connecté */}
      <Route path="/login" element={
        isAuthenticated ? (
          <Navigate to={
            normalizeRole(user?.role) === 'ADMIN' ? '/admin' :
            normalizeRole(user?.role) === 'TECHNICIEN' ? '/technicien' : '/user'
          } replace />
        ) : (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHome={() => navigate('/')}
            onNavigateToRegister={() => navigate('/register')}
          />
        )
      } />

      {/* 3. Inscription */}
      <Route path="/register" element={
        <RegisterCNIB
          onNavigateToLogin={() => navigate('/login')}
          onSuccess={() => navigate('/login')}
        />
      } />

      {/* 4. Espace Admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <DashboardAdmin onLogout={handleLogout} />
        </ProtectedRoute>
      } />

      {/* 5. Espace Technicien */}
      <Route path="/technicien/*" element={
        <ProtectedRoute allowedRoles={['TECHNICIEN']}>
          <DashboardTechnicien onLogout={handleLogout} />
        </ProtectedRoute>
      } />

      {/* 6. Espace Utilisateur */}
      <Route path="/user/*" element={
        <ProtectedRoute allowedRoles={['USER', 'ETUDIANT', 'ENSEIGNANT']}>
          <DashboardUser onLogout={handleLogout} userType={userType} />
        </ProtectedRoute>
      } />

      <Route path="/portal" element={<Navigate to="/login" replace />} />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}