/* Shared API layer, helpers and small UI pieces used by every Admin file */

/* ─── API layer ─── */
export const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const TOKEN_KEYS = ['wou_token', 'token', 'authToken', 'accessToken', 'jwt', 'auth_token', 'wollo_token', 'wollo-token'];

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

function readToken(ctxToken) {
  if (ctxToken) return ctxToken;
  for (const store of [localStorage, sessionStorage]) {
    for (const key of TOKEN_KEYS) {
      let v = store.getItem(key);
      if (!v) continue;
      v = v.trim();
      if (v.startsWith('{')) {
        try {
          const parsed = JSON.parse(v);
          if (parsed.token) return parsed.token;
        } catch { /* ignore */ }
      }
      return v.replace(/^"|"$/g, '');
    }
  }
  return '';
}

export async function request(method, path, body, ctxToken) {
  const token = readToken(ctxToken);
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(`Cannot reach the server at ${API_BASE}. Is it running?`, 0);
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* not JSON */ }

  if (!res.ok) {
    throw new ApiError((data && (data.error || data.message)) || `Request failed (${res.status})`, res.status);
  }
  if (data === null && text) {
    throw new ApiError('The server did not return JSON. Check that VITE_API_URL points to your backend.', res.status);
  }
  return data;
}

export function normalizeUser(u = {}) {
  return {
    ...u,
    id: u.id ?? u.user_id ?? u.admin_id ?? u.staff_id,
    full_name: u.full_name ?? u.name ?? u.fullName ?? '',
    email: u.email ?? '',
    avatar_url: u.avatar_url ?? u.avatar ?? u.profile ?? null,
    role: String(u.role ?? u.source ?? 'user').toLowerCase().replace(/s$/, ''),
    created_at: u.created_at ?? u.createdAt ?? null,
  };
}

export function normalizeList(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.users ?? payload?.accounts ?? payload?.rows ?? [];
  if (!Array.isArray(list)) return [];
  return list.map(normalizeUser);
}

/* ─── constants & helpers ─── */
export const ROLE_COLORS = { user: '#0a9d5c', staff: '#f59e0b', admin: '#6366f1' };

const AVATAR_COLORS = [
  '#0a8f5a', '#b4532a', '#35566f', '#9a7419',
  '#5a6b2f', '#9b3b32', '#2f6b73', '#6f4b3e',
];

export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join('');
}
export function avatarColor(id) {
  return AVATAR_COLORS[(Number(id) || 0) % AVATAR_COLORS.length];
}
export function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
export function passwordStrength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 3);
}
export function pageList(total, cur) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  const start = Math.max(2, cur - 1);
  const end = Math.min(total - 1, cur + 1);
  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}
/* Composite key so IDs from different tables never clash */
export const rowKey = (u) => `${u.role}-${u.id}`;

/* ─── icons ─── */
const ICONS = {
  search:    <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  edit:      <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></>,
  close:     <path d="M18 6 6 18M6 6l12 12"/>,
  eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff:    <><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="m1 1 22 22"/></>,
  refresh:   <><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
  users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  check:     <path d="M20 6 9 17l-5-5"/>,
  alert:     <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>,
  left:      <path d="m15 18-6-6 6-6"/>,
  right:     <path d="m9 18 6-6-6-6"/>,
  user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  lock:      <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  staff:     <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  arrowLeft: <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
  home:      <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  menu:      <path d="M3 6h18M3 12h18M3 18h18"/>,
  logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
  activity:  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
};

export function Icon({ name, size = 18 }) {
  return (
    <svg className="adm-icon" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function Avatar({ user, large = false }) {
  const cls = `adm-avatar${large ? ' adm-avatar--lg' : ''}`;
  return user.avatar_url
    ? <img src={user.avatar_url} alt={user.full_name} className={`${cls} adm-avatar--img`} />
    : <span className={`${cls} adm-avatar--initials`} style={{ background: avatarColor(user.id) }} aria-hidden="true">
        {initials(user.full_name)}
      </span>;
}

export function RoleBadge({ role }) {
  return (
    <span className={`adm-badge adm-badge--${role}`}>
      <span className="adm-badge-dot" />{role}
    </span>
  );
}