/**
 * src/components/ProtectedRoute.jsx
 *
 * Role-aware route guard.
 *
 * Props:
 *   children        — the protected page/component
 *   requiredRole    — 'admin' | 'head' | 'staff' | 'student' (optional)
 *                     If omitted, any authenticated user is allowed.
 *   redirectTo      — where to send unauthenticated users (default: '/auth')
 *   unauthorizedTo  — where to send wrong-role users (default: role-based home)
 *
 * Usage:
 *   <ProtectedRoute><Admin /></ProtectedRoute>
 *   <ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>
 *   <ProtectedRoute requiredRole="head"><DepartmentHead /></ProtectedRoute>
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Where each role lands after login. */
const ROLE_HOME = {
  admin:   '/admin',
  head:    '/department-head',
  staff:   '/admin',
  student: '/',
};

function ProtectedRoute({
  children,
  requiredRole   = null,
  redirectTo     = '/auth',
  unauthorizedTo = null,
}) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Wait for session restoration before making a decision
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: 14,
          color: '#64748b',
        }}
        aria-live="polite"
        aria-label="Checking authentication…"
      >
        <span
          style={{
            width: 24,
            height: 24,
            border: '3px solid #e2e8f0',
            borderTopColor: '#1d6b66',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
            marginRight: 10,
          }}
        />
        Loading…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in → redirect to login, preserving current path
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Role check
  if (requiredRole && role !== requiredRole) {
    // Admins can always access admin pages even if requiredRole is 'staff', etc.
    const isAdminAccessingAnyStaffPage =
      role === 'admin' && ['head', 'staff'].includes(requiredRole);

    if (!isAdminAccessingAnyStaffPage) {
      const fallback = unauthorizedTo ?? ROLE_HOME[role] ?? '/';
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
