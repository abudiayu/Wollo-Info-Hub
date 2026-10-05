/**
 * Thin fetch wrapper.
 * - Attaches Authorization header when a token is in localStorage.
 * - On 401 from the server, clears the stored session and redirects to /auth.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('wou_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  const data = await res.json().catch(() => ({}));

  // auto-logout on 401, except failed login/register (those must show the server error)
  if (res.status === 401 && !path.startsWith('/api/auth/login') && !path.startsWith('/api/auth/register')) {
    localStorage.removeItem('wou_token');
    localStorage.removeItem('wou_user');
    window.location.href = '/auth';
    return;
  }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  return data;
}

export const api = {
  get:    (path, opts)   => request(path, { method: 'GET',    ...opts }),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
};

export default api;
