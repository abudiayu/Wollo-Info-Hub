/**
 * src/context/AuthContext.jsx  — Supabase edition (with Google OAuth)
 *
 * Provides:
 *   user            — public profile object (from /api/auth/me) or null
 *   session         — raw Supabase session { access_token, refresh_token, … } or null
 *   token           — shortcut to session?.access_token (backward compat)
 *   role            — 'admin' | 'head' | 'staff' | 'student' | null
 *   loading         — true until initial session is restored
 *   login(email, password)                → user object
 *   register(full_name, email, password)  → user object | { confirmEmail, message }
 *   loginWithGoogle(returnPath?)          → redirects the browser to Google
 *   logout()
 *
 * Google flow: loginWithGoogle() → Google → Supabase → back to /auth.
 * On return, Supabase restores the session, this provider loads the profile
 * (creating it on the backend for first-time users) and sets `user`.
 *
 * The legacy 'wou_token' / 'wou_user' keys are also written for backward compat.
 */

import {
  createContext, useContext, useState, useEffect, useCallback, useRef,
} from 'react';
import supabase from '../lib/supabaseClient';
import api, { clearSession } from '../lib/api';

const AuthContext = createContext(null);

const GOOGLE_PENDING_KEY = 'google_oauth_pending';
const GOOGLE_FROM_KEY    = 'google_oauth_from';

/** Works whether the api helper throws errors with `status` or axios-style `response.status`. */
function errStatus(err) {
  return err?.status ?? err?.response?.status ?? null;
}

/** Minimal profile built from the Supabase user, used only if the backend can't supply one. */
function profileFromSupabaseUser(u) {
  const meta = u?.user_metadata || {};
  return {
    id:         u?.id,
    email:      u?.email,
    full_name:  meta.full_name || meta.name || (u?.email ? u.email.split('@')[0] : 'Student'),
    avatar_url: meta.avatar_url || meta.picture || null,
    role:       'student',
    profileIncomplete: true,
  };
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // public profile from DB
  const [session, setSession] = useState(null);   // Supabase session object
  const [role,    setRole]    = useState(null);
  const [loading, setLoading] = useState(true);

  const userRef        = useRef(null);   // always-current user (avoids stale closures)
  const profileRequest = useRef(null);   // de-dupes concurrent profile loads
  const manualAuth     = useRef(false);  // true while login()/register() set the session

  useEffect(() => { userRef.current = user; }, [user]);

  const token = session?.access_token ?? null;

  // ── Helpers ─────────────────────────────────────────────────
  /** Persist legacy keys for any component still reading localStorage directly. */
  function persistLegacy(accessToken, userObj) {
    if (accessToken) localStorage.setItem('wou_token', accessToken);
    if (userObj)     localStorage.setItem('wou_user', JSON.stringify(userObj));
  }

  function resetAuthState() {
    setUser(null);
    setRole(null);
    setSession(null);
    userRef.current = null;
    clearSession();
  }

  /**
   * Load the profile + role from Express /api/auth/me.
   *  - 401/403            → the session is invalid: clear everything.
   *  - any other failure  → likely a first-time (Google) user with no profile row:
   *                         ask the backend to create it (POST /api/auth/oauth-sync,
   *                         optional), retry /me, and as a last resort fall back to a
   *                         minimal profile so the user is not signed out.
   */
  const loadProfile = useCallback((supaUser) => {
    if (profileRequest.current) return profileRequest.current;

    const run = async () => {
      try {
        let me;
        try {
          me = await api.get('/api/auth/me');
        } catch (err) {
          const status = errStatus(err);
          if (status === 401 || status === 403) throw err;

          try { await api.post('/api/auth/oauth-sync', {}); } catch { /* route may not exist */ }

          try {
            me = await api.get('/api/auth/me');
          } catch (retryErr) {
            const retryStatus = errStatus(retryErr);
            if (retryStatus === 401 || retryStatus === 403) throw retryErr;
            if (!supaUser) throw retryErr;
            console.warn('[Auth] /api/auth/me failed; using Supabase profile fallback.', retryErr);
            me = profileFromSupabaseUser(supaUser);
          }
        }

        setUser(me);
        userRef.current = me;
        setRole(me.role || 'student');
        persistLegacy(null, me);
        return me;
      } catch {
        resetAuthState();
        return null;
      } finally {
        profileRequest.current = null;
      }
    };

    profileRequest.current = run();
    return profileRequest.current;
  }, []);

  // ── Restore session on mount (also completes the Google redirect) ──
  useEffect(() => {
    let mounted = true;

    async function init() {
      // getSession waits for Supabase to exchange the ?code= from Google, if present
      const { data: { session: existing } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (existing?.access_token) {
        setSession(existing);
        persistLegacy(existing.access_token, null);
        await loadProfile(existing.user);
      }

      if (mounted) setLoading(false);
    }

    init();

    // Listen for Supabase auth state changes (token refresh, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          if (newSession?.access_token) {
            persistLegacy(newSession.access_token, null);
          }

          // login()/register() set their own user — don't double-load
          if (manualAuth.current) return;

          const alreadyLoaded =
            userRef.current && userRef.current.id === newSession?.user?.id;

          if (!alreadyLoaded || event === 'TOKEN_REFRESHED') {
            // Defer: calling Supabase/API inside this callback can deadlock the client
            setTimeout(() => {
              if (mounted) loadProfile(newSession?.user);
            }, 0);
          }
        }

        if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            if (mounted) resetAuthState();
          }, 0);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // ── login ────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    // Use Express endpoint so audit log is written and role is returned
    const data = await api.post('/api/auth/login', { email, password });

    // data = { access_token, refresh_token, expires_in, user, token }
    if (!data?.access_token) {
      throw new Error(data?.error || 'Login failed: no token returned.');
    }

    manualAuth.current = true;
    try {
      // Tell the Supabase client about the session so it can auto-refresh
      const { data: { session: supaSession } } = await supabase.auth.setSession({
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
      });

      setSession(supaSession || { access_token: data.access_token, refresh_token: data.refresh_token });
    } finally {
      manualAuth.current = false;
    }

    setUser(data.user);
    userRef.current = data.user;
    setRole(data.user?.role || 'student');
    persistLegacy(data.access_token, data.user);

    return data.user;
  }, []);

  // ── register ─────────────────────────────────────────────────
  const register = useCallback(async (full_name, email, password, username, department_id, id_number) => {
    const data = await api.post('/api/auth/register', {
      full_name, email, password, username,
      ...(department_id ? { department_id } : {}),
      ...(id_number     ? { id_number }     : {}),
    });

    // Email confirmation may be required — check for that case
    if (data?.code === 'CONFIRM_EMAIL') {
      return { confirmEmail: true, message: data.message };
    }

    if (!data?.access_token) {
      throw new Error(data?.error || 'Registration failed.');
    }

    manualAuth.current = true;
    try {
      const { data: { session: supaSession } } = await supabase.auth.setSession({
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
      });

      setSession(supaSession || { access_token: data.access_token, refresh_token: data.refresh_token });
    } finally {
      manualAuth.current = false;
    }

    setUser(data.user);
    userRef.current = data.user;
    setRole(data.user?.role || 'student');
    persistLegacy(data.access_token, data.user);

    return data.user;
  }, []);

  // ── Google OAuth ─────────────────────────────────────────────
  /**
   * Sends the browser to Google. The page that called this is replaced, so
   * nothing after a successful call runs. Returns { error } only on failure.
   * returnPath = where to go after login (Auth.jsx reads it from sessionStorage).
   */
  const loginWithGoogle = useCallback(async (returnPath = '/') => {
    sessionStorage.setItem(GOOGLE_PENDING_KEY, '1');
    sessionStorage.setItem(GOOGLE_FROM_KEY, returnPath);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
        queryParams: { prompt: 'select_account' },
      },
    });

    if (error) {
      sessionStorage.removeItem(GOOGLE_PENDING_KEY);
      sessionStorage.removeItem(GOOGLE_FROM_KEY);
      return { error };
    }
    return {};
  }, []);

  // ── logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await api.post('/api/auth/logout'); } catch { /* ignore */ }
    await supabase.auth.signOut();
    resetAuthState();
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
      loginWithGoogle,
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