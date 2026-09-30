import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps any route that requires authentication.
 * - While session is being restored → show a full-page spinner.
 * - Not logged in → redirect to /auth, saving where they wanted to go.
 * - Logged in → render the page normally.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', fontSize: '1rem', color: '#6b7280',
      }}>
        <span style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid #e5e7eb', borderTopColor: '#1a3c6e',
          animation: 'spin 0.7s linear infinite', display: 'inline-block',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    // save the page they tried to visit so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
