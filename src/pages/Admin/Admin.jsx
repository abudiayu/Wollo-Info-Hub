import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

/* ─── API layer (self-contained, no dependency on api/client) ─ */
const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const TOKEN_KEYS = ['token', 'authToken', 'accessToken', 'jwt', 'auth_token', 'wollo_token', 'wollo-token'];

class ApiError extends Error {
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

async function request(method, path, body, ctxToken) {
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
  try {
    data = text ? JSON.parse(text) : null;
  } catch { /* not JSON */ }

  if (!res.ok) {
    throw new ApiError((data && (data.error || data.message)) || `Request failed (${res.status})`, res.status);
  }
  if (data === null && text) {
    throw new ApiError('The server did not return JSON. Check that VITE_API_URL points to your backend.', res.status);
  }
  return data;
}

/* Accept any common response shape and always return a clean array */
function normalizeList(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.users ?? payload?.accounts ?? payload?.rows ?? [];
  if (!Array.isArray(list)) return [];
  return list.map(normalizeUser);
}

function normalizeUser(u = {}) {
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

/* ─── constants ────────────────────────────────────────────── */
const PAGE_SIZE = 10;

const AVATAR_COLORS = [
  '#1f5d50', '#b4532a', '#35566f', '#9a7419',
  '#5a6b2f', '#9b3b32', '#2f6b73', '#6f4b3e',
];

/* ─── helpers ──────────────────────────────────────────────── */
function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join('');
}
function avatarColor(id) {
  return AVATAR_COLORS[(Number(id) || 0) % AVATAR_COLORS.length];
}
function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function passwordStrength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 3);
}
function pageList(total, cur) {
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
const rowKey = (u) => `${u.role}-${u.id}`;

/* ─── icons ────────────────────────────────────────────────── */
const ICONS = {
  search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  edit:     <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></>,
  close:    <path d="M18 6 6 18M6 6l12 12"/>,
  eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff:   <><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="m1 1 22 22"/></>,
  refresh:  <><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
  users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  check:    <path d="M20 6 9 17l-5-5"/>,
  alert:    <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>,
  left:     <path d="m15 18-6-6 6-6"/>,
  right:    <path d="m9 18 6-6-6-6"/>,
  user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  lock:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  staff:    <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
};

function Icon({ name, size = 18 }) {
  return (
    <svg className="adm-icon" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ─── toast ────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const ctr = useRef(0);
  const push = useCallback((msg, type = 'success') => {
    const id = ++ctr.current;
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

function Toast({ toasts }) {
  return (
    <div className="adm-toast-wrap" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`adm-toast adm-toast--${t.type}`}>
          <Icon name={t.type === 'success' ? 'check' : 'alert'} size={16} />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── sub-components ───────────────────────────────────────── */
function Avatar({ user, large = false }) {
  const cls = `adm-avatar${large ? ' adm-avatar--lg' : ''}`;
  return user.avatar_url
    ? <img src={user.avatar_url} alt={user.full_name} className={`${cls} adm-avatar--img`} />
    : <span className={`${cls} adm-avatar--initials`} style={{ background: avatarColor(user.id) }} aria-hidden="true">
        {initials(user.full_name)}
      </span>;
}

function RoleBadge({ role }) {
  return (
    <span className={`adm-badge adm-badge--${role}`}>
      <span className="adm-badge-dot" />{role}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="adm-skeleton-row">
      <td>
        <div className="adm-user-cell">
          <span className="adm-skeleton adm-skeleton--avatar" />
          <div className="adm-user-info" style={{ flex: 1 }}>
            <span className="adm-skeleton" style={{ width: '45%' }} />
            <span className="adm-skeleton" style={{ width: '65%' }} />
          </div>
        </div>
      </td>
      {[40, 64, 90, 34].map((w, i) => (
        <td key={i}><span className="adm-skeleton" style={{ width: w }} /></td>
      ))}
    </tr>
  );
}

/* ─── edit drawer ──────────────────────────────────────────── */
function EditDrawer({ user, token, onClose, onSaved, pushToast }) {
  const [name, setName] = useState(user.full_name);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const hasChanges = name.trim() !== user.full_name || password.length > 0;
  const strength = passwordStrength(password);
  const strengthLabel = ['Too short', 'Weak', 'Good', 'Strong'][strength];

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (password && password.length < 6) e.password = 'Use at least 6 characters.';
    if (password && password !== confirm) e.confirm = 'Passwords do not match.';
    return e;
  }

  async function handleSave(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const body = { full_name: name.trim() };
      if (password) body.password = password;
      const res = await request('PUT', `/api/admin/users/${user.role}/${user.id}`, body, token);
      const returned = res?.user ?? res?.data ?? res ?? {};
      const merged = normalizeUser({
        ...user,
        ...returned,
        full_name: returned.full_name ?? body.full_name,
        role: user.role,
        id: user.id,
      });
      onSaved(merged);
      pushToast(`${merged.full_name} was updated.`, 'success');
      onClose();
    } catch (err) {
      pushToast(err.message || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Edit user">
      <aside className="adm-drawer">
        <header className="adm-drawer-head">
          <div>
            <p className="adm-eyebrow">Edit user</p>
            <h2 className="adm-drawer-title">Account details</h2>
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        <div className="adm-drawer-profile">
          <Avatar user={user} large />
          <div>
            <p className="adm-drawer-name">{user.full_name}</p>
            <p className="adm-drawer-email">{user.email}</p>
            <div className="adm-drawer-meta">
              <RoleBadge role={user.role} />
              <span className="adm-id">ID #{user.id}</span>
            </div>
          </div>
        </div>

        <form className="adm-form" onSubmit={handleSave} noValidate>
          <div className="adm-field">
            <label htmlFor="em-name" className="adm-label">Full name</label>
            <div className={`adm-input-wrap ${errors.name ? 'is-error' : ''}`}>
              <Icon name="user" size={16} />
              <input ref={firstRef} id="em-name" className="adm-input" value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }} />
            </div>
            {errors.name && <span className="adm-field-err">{errors.name}</span>}
          </div>

          <div className="adm-field">
            <label htmlFor="em-pw" className="adm-label">
              New password
              <span className="adm-label-hint">Leave blank to keep the current one</span>
            </label>
            <div className={`adm-input-wrap ${errors.password ? 'is-error' : ''}`}>
              <Icon name="lock" size={16} />
              <input id="em-pw" type={showPw ? 'text' : 'password'} className="adm-input"
                placeholder="Enter a new password" autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }} />
              <button type="button" className="adm-eye" onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} />
              </button>
            </div>
            {errors.password && <span className="adm-field-err">{errors.password}</span>}
            {password && (
              <div className="adm-strength" data-level={strength}>
                <div className="adm-strength-bars"><span /><span /><span /></div>
                <span className="adm-strength-label">{strengthLabel}</span>
              </div>
            )}
          </div>

          {password && (
            <div className="adm-field">
              <label htmlFor="em-confirm" className="adm-label">Confirm password</label>
              <div className={`adm-input-wrap ${errors.confirm ? 'is-error' : ''}`}>
                <Icon name="lock" size={16} />
                <input id="em-confirm" type={showPw ? 'text' : 'password'} className="adm-input"
                  placeholder="Repeat the new password" autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })); }} />
              </div>
              {errors.confirm && <span className="adm-field-err">{errors.confirm}</span>}
            </div>
          )}

          <div className="adm-drawer-actions">
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={saving || !hasChanges}>
              {saving ? <span className="adm-spinner" /> : 'Save changes'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────────── */
export default function Admin() {
  const { user: me, token: ctxToken, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState(null); // { message, status }
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [roleTab, setRoleTab] = useState('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const { toasts, push: pushToast } = useToast();

  const myRole = me?.role ? String(me.role).toLowerCase() : '';
  /* Only block when we positively know the role is not admin.
     If the role is missing from AuthContext, let the server decide. */
  const canTry = !!me && (!myRole || myRole === 'admin');

  /* guard */
  useEffect(() => {
    if (authLoading) return;
    if (!me) { navigate('/auth', { replace: true }); return; }
    if (myRole && myRole !== 'admin') navigate('/', { replace: true });
  }, [me, myRole, authLoading, navigate]);

  /* fetch */
  const fetchUsers = useCallback(async () => {
    setFetching(true);
    setFetchErr(null);
    try {
      const payload = await request('GET', '/api/admin/users', null, ctxToken);
      setUsers(normalizeList(payload));
    } catch (err) {
      console.error('[Admin] GET /api/admin/users failed:', err);
      setFetchErr({ message: err.message || 'Failed to load users.', status: err.status || 0 });
    } finally {
      setFetching(false);
    }
  }, [ctxToken]);

  useEffect(() => {
    if (!authLoading && canTry) fetchUsers();
  }, [authLoading, canTry, fetchUsers]);

  /* derived */
  const countOf = (role) => users.filter((u) => u.role === role).length;
  const allCount = users.length;
  const userCount = countOf('user');
  const staffCount = countOf('staff');
  const adminCount = countOf('admin');

  const filtered = users
    .filter((u) => roleTab === 'all' || u.role === roleTab)
    .filter((u) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        String(u.id).includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      if (sort === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      return (a.full_name || '').localeCompare(b.full_name || '');
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageUsers = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

  function handleSaved(updated) {
    setUsers((prev) =>
      prev.map((u) => (rowKey(u) === rowKey(updated) ? { ...u, ...updated } : u))
    );
  }

  const isMe = (u) => me && String(me.id) === String(u.id) && (!myRole || myRole === u.role);

  if (authLoading) return null;

  /* error state */
  const renderError = () => {
    const status = fetchErr.status;
    const title = status === 403 ? "You don't have admin access" : "Couldn't load users";
    const text =
      status === 401 ? 'Your session expired. Please log in again.' : fetchErr.message;
    return (
      <div className="adm-error-state">
        <span className="adm-state-icon adm-state-icon--danger"><Icon name="alert" size={22} /></span>
        <p className="adm-state-title">{title}</p>
        <p className="adm-state-text">{text}</p>
        <p className="adm-state-text" style={{ fontFamily: 'monospace', fontSize: 12, marginTop: -8 }}>
          GET {API_BASE}/api/admin/users{status ? ` · HTTP ${status}` : ''}
        </p>
        {status === 401
          ? <button className="adm-btn adm-btn--primary" onClick={() => navigate('/auth')}>Go to login</button>
          : <button className="adm-btn adm-btn--primary" onClick={fetchUsers}>Try again</button>}
      </div>
    );
  };

  const tabs = [
    { key: 'all', label: 'All', count: allCount },
    { key: 'user', label: 'Users', count: userCount },
    { key: 'staff', label: 'Staff', count: staffCount },
    { key: 'admin', label: 'Admins', count: adminCount },
  ];

  const emptyText = `No accounts found${search ? ` for “${search}”` : ''}.`;

  return (
    <div className="adm-page">
      <Toast toasts={toasts} />

      <div className="adm-shell">
        <header className="adm-header">
          <div>
            <p className="adm-eyebrow">Admin console</p>
            <h1 className="adm-title">User management</h1>
            <p className="adm-subtitle">View and manage everyone registered on Wollo-Info Hub.</p>
          </div>
          <button className="adm-btn adm-btn--ghost" onClick={fetchUsers} disabled={fetching}>
            <Icon name="refresh" size={16} />Refresh
          </button>
        </header>

        <section className="adm-stats" aria-label="Summary">
          <div className="adm-stat">
            <span className="adm-stat-icon adm-stat-icon--green"><Icon name="users" /></span>
            <div>
              <span className="adm-stat-label">Total accounts</span>
              <span className="adm-stat-value">{fetching ? '–' : allCount}</span>
            </div>
          </div>
          <div className="adm-stat">
            <span className="adm-stat-icon adm-stat-icon--amber"><Icon name="user" /></span>
            <div>
              <span className="adm-stat-label">Users</span>
              <span className="adm-stat-value">{fetching ? '–' : userCount}</span>
            </div>
          </div>
          <div className="adm-stat">
            <span className="adm-stat-icon adm-stat-icon--amber"><Icon name="staff" /></span>
            <div>
              <span className="adm-stat-label">Staff</span>
              <span className="adm-stat-value">{fetching ? '–' : staffCount}</span>
            </div>
          </div>
          <div className="adm-stat">
            <span className="adm-stat-icon adm-stat-icon--slate"><Icon name="shield" /></span>
            <div>
              <span className="adm-stat-label">Admins</span>
              <span className="adm-stat-value">{fetching ? '–' : adminCount}</span>
            </div>
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-tabs" role="tablist" aria-label="Filter by role">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={roleTab === t.key}
                className={`adm-tab ${roleTab === t.key ? 'is-active' : ''}`}
                onClick={() => { setRoleTab(t.key); setPage(1); }}
              >
                {t.label}
                <span className="adm-tab-count">{fetching ? '…' : t.count}</span>
              </button>
            ))}
          </div>

          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Icon name="search" size={16} />
              <input type="search" className="adm-search"
                placeholder="Search by name, email or ID"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Search users" />
            </div>
            <select className="adm-sort" value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              aria-label="Sort users">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A to Z</option>
            </select>
          </div>

          {fetchErr ? renderError() : (
            <>
              <div className="adm-table-wrap">
                <table className="adm-table" aria-label="Users">
                  <thead>
                    <tr>
                      <th>User</th><th>ID</th><th>Role</th><th>Joined</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {fetching
                      ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                      : pageUsers.length === 0
                        ? (
                          <tr><td colSpan={5}>
                            <div className="adm-empty">
                              <span className="adm-state-icon"><Icon name="users" size={22} /></span>
                              <p className="adm-state-title">{emptyText}</p>
                            </div>
                          </td></tr>
                        )
                        : pageUsers.map((u) => (
                          <tr key={rowKey(u)} className="adm-row">
                            <td>
                              <div className="adm-user-cell">
                                <Avatar user={u} />
                                <div className="adm-user-info">
                                  <span className="adm-user-name">
                                    {u.full_name}
                                    {isMe(u) && <span className="adm-you">You</span>}
                                  </span>
                                  <span className="adm-user-email">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="adm-id">#{u.id}</td>
                            <td><RoleBadge role={u.role} /></td>
                            <td className="adm-date">{formatDate(u.created_at)}</td>
                            <td className="adm-actions-cell">
                              <button className="adm-icon-btn adm-icon-btn--bordered"
                                onClick={() => setEditing(u)}
                                aria-label={`Edit ${u.full_name}`} title="Edit">
                                <Icon name="edit" size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              <div className="adm-mobile-list">
                {fetching
                  ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="adm-mobile-card">
                      <span className="adm-skeleton adm-skeleton--avatar" />
                      <div style={{ flex: 1 }}>
                        <span className="adm-skeleton" style={{ width: '55%' }} />
                        <span className="adm-skeleton" style={{ width: '80%', marginTop: 8 }} />
                      </div>
                    </div>
                  ))
                  : pageUsers.length === 0
                    ? (
                      <div className="adm-empty">
                        <span className="adm-state-icon"><Icon name="users" size={22} /></span>
                        <p className="adm-state-title">{emptyText}</p>
                      </div>
                    )
                    : pageUsers.map((u) => (
                      <div key={rowKey(u)} className="adm-mobile-card">
                        <Avatar user={u} />
                        <div className="adm-mobile-body">
                          <div className="adm-mobile-top">
                            <span className="adm-user-name">
                              {u.full_name}
                              {isMe(u) && <span className="adm-you">You</span>}
                            </span>
                            <RoleBadge role={u.role} />
                          </div>
                          <span className="adm-user-email">{u.email}</span>
                          <div className="adm-mobile-meta">
                            <span className="adm-id">#{u.id}</span>
                            <span className="adm-date">{formatDate(u.created_at)}</span>
                          </div>
                        </div>
                        <button className="adm-icon-btn adm-icon-btn--bordered"
                          onClick={() => setEditing(u)} aria-label={`Edit ${u.full_name}`}>
                          <Icon name="edit" size={16} />
                        </button>
                      </div>
                    ))}
              </div>

              {!fetching && filtered.length > 0 && (
                <footer className="adm-pagination">
                  <span className="adm-page-info">
                    Showing {rangeStart}–{rangeEnd} of {filtered.length}
                  </span>
                  {totalPages > 1 && (
                    <nav className="adm-page-nav" aria-label="Pagination">
                      <button className="adm-page-btn" disabled={safePage === 1}
                        onClick={() => setPage(safePage - 1)} aria-label="Previous page">
                        <Icon name="left" size={16} />
                      </button>
                      {pageList(totalPages, safePage).map((p, i) =>
                        p === '…'
                          ? <span key={`g${i}`} className="adm-page-gap">…</span>
                          : (
                            <button key={p}
                              className={`adm-page-btn ${p === safePage ? 'is-active' : ''}`}
                              onClick={() => setPage(p)}
                              aria-current={p === safePage ? 'page' : undefined}>
                              {p}
                            </button>
                          ))}
                      <button className="adm-page-btn" disabled={safePage === totalPages}
                        onClick={() => setPage(safePage + 1)} aria-label="Next page">
                        <Icon name="right" size={16} />
                      </button>
                    </nav>
                  )}
                </footer>
              )}
            </>
          )}
        </section>
      </div>

      {editing && (
        <EditDrawer
          user={editing}
          token={ctxToken}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
          pushToast={pushToast}
        />
      )}
    </div>
  );
}