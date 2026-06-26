import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles, userRole }) {
  if (!allowedRoles.includes(userRole)) {
    // Redirige vers son propre dashboard si accès non autorisé
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'TECHNICIEN') return <Navigate to="/technicien" replace />;
    return <Navigate to="/user" replace />;
  }
  return children;
}