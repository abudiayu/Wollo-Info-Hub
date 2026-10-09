/**
 * src/lib/api.js
 *
 * Thin fetch wrapper for all Express API calls.
 *
 * - Reads the Supabase access_token from localStorage (key: wou_session)
 *   OR the legacy wou_token key for backward compat.
 * - Attaches Authorization: Bearer <token> automatically.
 * - On 401 → clears session and redirects to /auth (unless on login/register route).
 * - On token expiry → attempts one silent refresh before redirecting.
 * - Returns parsed JSON on success; throws an Error with .status and .data on failure.
 *
 * Usage:
 *   import api from '../lib/api';
 *   const users = await api.get('/api/admin/users');
 *   const result = await api.post('/api/auth/login', { email, password });
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Token helpers ─────────────────────────────────────────────

/** Read access token — prefers Supabase session, falls back to legacy key. */
function getAccessToken() {
  // Supabase stores the whole session as JSON in localStorage
  try {
    const raw = localStorage.getItem('wou_session');
    if (raw) {
      const session = JSON.parse(raw);
      const token = session?.access_token || session?.currentSession?.access_token;
      if (token) return token;
    }
  } catch { /* ignore parse errors */ }

  // Fallback: old plain token key written by the legacy login flow
  return localStorage.getItem('wou_token') || null;
}

/** Read refresh token from the Supabase session. */
function getRefreshToken() {
  try {
    const raw = localStorage.getItem('wou_session');
    if (raw) {
      const session = JSON.parse(raw);
      return session?.refresh_token || session?.currentSession?.refresh_token || null;
    }
  } catch { /* ignore */ }
  return null;
}

/** Write a new access_token back into the persisted session. */
function persistNewToken(accessToken, refreshToken) {
  try {
    const raw = localStorage.getItem('wou_session');
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.access_token) {
        session.access_token  = accessToken;
        session.refresh_token = refreshToken || session.refresh_token;
        localStorage.setItem('wou_session', JSON.stringify(session));
      }
      if (session?.currentSession?.access_token) {
        session.currentSession.access_token  = accessToken;
        session.currentSession.refresh_token = refreshToken || session.currentSession.refresh_token;
        localStorage.setItem('wou_session', JSON.stringify(session));
      }
    }
    // Also update legacy key
    localStorage.setItem('wou_token', accessToken);
  } catch { /* ignore */ }
}

function clearSession() {
  localStorage.removeItem('wou_session');
  localStorage.removeItem('wou_token');
  localStorage.removeItem('wou_user');
}

// ── Refresh helper ────────────────────────────────────────────
let _refreshPromise = null; // singleton so concurrent requests share one refresh

async function tryRefreshToken() {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${BASE}/api/auth/refresh`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.access_token) {
        persistNewToken(data.access_token, data.refresh_token);
        return data.access_token;
      }
      return null;
    } catch {
      return null;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

// ── Core request ──────────────────────────────────────────────
async function request(path, options = {}, _retry = false) {
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  let data = {};
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  }

  // ── 401 handling ─────────────────────────────────────────────
  if (res.status === 401) {
    // Skip redirect for login / register
    const isAuthRoute = path.startsWith('/api/auth/login') || path.startsWith('/api/auth/register');
    if (isAuthRoute) {
      const err = new Error(data.error || 'Unauthorized');
      err.status = 401;
      err.data   = data;
      throw err;
    }

    // Try one silent token refresh
    if (!_retry) {
      const newToken = await tryRefreshToken();
      if (newToken) {
        return request(path, options, true);  // retry once with new token
      }
    }

    // Refresh failed — clear session and redirect
    clearSession();
    window.location.href = '/auth';
    return;
  }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data   = data;
    err.code   = data.code;
    throw err;
  }

  return data;
}

// ── Public API object ─────────────────────────────────────────
const api = {
  get(path, opts)     { return request(path, { method: 'GET', ...opts }); },
  post(path, body)    { return request(path, { method: 'POST',   body: JSON.stringify(body) }); },
  put(path, body)     { return request(path, { method: 'PUT',    body: JSON.stringify(body) }); },
  patch(path, body)   { return request(path, { method: 'PATCH',  body: JSON.stringify(body) }); },
  delete(path)        { return request(path, { method: 'DELETE' }); },

  /** Upload files using FormData (no Content-Type override). */
  upload(path, formData) {
    const token = getAccessToken();
    return fetch(`${BASE}${path}`, {
      method:  'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body:    formData,
    }).then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || `Upload failed (${res.status})`);
        err.status = res.status;
        err.data   = data;
        throw err;
      }
      return data;
    });
  },
};

export { api, getAccessToken, clearSession };
export default api;
