import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem('wou_token'));
  const [loading, setLoading] = useState(true); // true until session is restored

  /* ── Restore session on mount ── */
  useEffect(() => {
    async function restore() {
      const stored = localStorage.getItem('wou_token');
      if (!stored) { setLoading(false); return; }
      try {
        const me = await api.get('/api/auth/me');
        setUser(me);
        setToken(stored);
      } catch {
        // token invalid/expired — clear it
        localStorage.removeItem('wou_token');
        localStorage.removeItem('wou_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  const persist = useCallback((tok, usr) => {
    localStorage.setItem('wou_token', tok);
    localStorage.setItem('wou_user',  JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await api.post('/api/auth/login', { email, password });
      persist(data.token, data.user);
      return data.user;
    } catch (err) {
      throw new Error(err.data?.error || err.message || 'Login failed.');
    }
  }, [persist]);

  const register = useCallback(async (full_name, email, password) => {
    const data = await api.post('/api/auth/register', { full_name, email, password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem('wou_token');
    localStorage.removeItem('wou_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
