/**
 * src/context/AuthContext.jsx  — Supabase edition
 *
 * Provides:
 *   user         — public profile object (from /api/auth/me) or null
 *   session      — raw Supabase session { access_token, refresh_token, … } or null
 *   token        — shortcut to session?.access_token (backward compat)
 *   role         — 'admin' | 'head' | 'staff' | 'student' | null
 *   loading      — true until initial session is restored
 *   login(email, password)  → user object
 *   register(full_name, email, password) → user object
 *   logout()
 *
 * Session is stored by the Supabase client in localStorage under 'wou_session'.
 * The legacy 'wou_token' key is also written for backward compat.
 */

import {
  createContext, useContext, useState, useEffect, useCallback,
} from 'react';
import supabase from '../lib/supabaseClient';
import api, { clearSession } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // public profile from DB
  const [session, setSession] = useState(null);   // Supabase session object
  const [role,    setRole]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Helpers ─────────────────────────────────────────────────
  const token = session?.access_token ?? null;

  /** Persist legacy key for any component still reading localStorage directly. */
  function persistLegacy(accessToken, userObj) {
    if (accessToken) localStorage.setItem('wou_token', accessToken);
    if (userObj)     localStorage.setItem('wou_user', JSON.stringify(userObj));
  }

  /** Load the user profile + role from Express /api/auth/me */
  const loadProfile = useCallback(async () => {
    try {
      const me = await api.get('/api/auth/me');
      setUser(me);
      setRole(me.role || 'student');
      persistLegacy(null, me);
      return me;
    } catch {
      // If /me fails the session is invalid — clear everything
      setUser(null);
      setRole(null);
      clearSession();
      setSession(null);
      return null;
    }
  }, []);

  // ── Restore session on mount ─────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function init() {
      // getSession reads from Supabase's own localStorage key
      const { data: { session: existing } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (existing?.access_token) {
        setSession(existing);
        persistLegacy(existing.access_token, null);
        await loadProfile();
      }

      setLoading(false);
    }

    init();

    // Listen for Supabase auth state changes (token refresh, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          if (newSession?.access_token) {
            persistLegacy(newSession.access_token, null);
          }
          // Only reload profile if we don't have one yet, or token refreshed
          if (!user || event === 'TOKEN_REFRESHED') {
            await loadProfile();
          }
        }

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setRole(null);
          clearSession();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── login ────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    // Use Express endpoint so audit log is written and role is returned
    const data = await api.post('/api/auth/login', { email, password });

    // data = { access_token, refresh_token, expires_in, user, token }
    if (!data?.access_token) {
      throw new Error(data?.error || 'Login failed: no token returned.');
    }

    // Tell the Supabase client about the session so it can auto-refresh
    const { data: { session: supaSession } } = await supabase.auth.setSession({
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
    });

    setSession(supaSession || { access_token: data.access_token, refresh_token: data.refresh_token });
    setUser(data.user);
    setRole(data.user?.role || 'student');
    persistLegacy(data.access_token, data.user);

    return data.user;
  }, []);

  // ── register ─────────────────────────────────────────────────
  const register = useCallback(async (full_name, email, password, username) => {
    const data = await api.post('/api/auth/register', { full_name, email, password, username });

    // Email confirmation may be required — check for that case
    if (data?.code === 'CONFIRM_EMAIL') {
      return { confirmEmail: true, message: data.message };
    }

    if (!data?.access_token) {
      throw new Error(data?.error || 'Registration failed.');
    }

    const { data: { session: supaSession } } = await supabase.auth.setSession({
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
    });

    setSession(supaSession || { access_token: data.access_token, refresh_token: data.refresh_token });
    setUser(data.user);
    setRole(data.user?.role || 'student');
    persistLegacy(data.access_token, data.user);

    return data.user;
  }, []);

  // ── logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await api.post('/api/auth/logout'); } catch { /* ignore */ }
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      token,  // backward compat
      role,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
