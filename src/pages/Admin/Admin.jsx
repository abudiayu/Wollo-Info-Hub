import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  API_BASE, request, normalizeList, normalizeUser, rowKey, formatDate,
  pageList, passwordStrength, Icon, Avatar, RoleBadge,
} from './AdminShared/AdminShared';
import AdminSidebar    from "./AdminSideBar/AdminSidebar";
import { StatCards, SignupsChart, RoleDonut } from './AdminChart/AdminChart';
import ContentManager  from './ContentManager/ContentManager';
import MediaLibrary    from './ContentManager/MediaLibrary';
import './Admin.css';
import './AdminChart/AdminChart.css';

const PAGE_SIZE = 10;
const ROLES = ['user', 'staff', 'admin'];

/* ─── toast ─── */
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

/* ─── confirm delete modal ─── */
function ConfirmDeleteModal({ user, onConfirm, onCancel, busy }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, busy]);

  return (
    <div
      className="adm-backdrop"
      onClick={(e) => { if (!busy && e.target === e.currentTarget) onCancel(); }}
      role="dialog" aria-modal="true" aria-label="Confirm deletion"
    >
      <div className="adm-confirm-modal">
        <div className="adm-confirm-icon" aria-hidden="true">
          <Icon name="trash" size={24} />
        </div>
        <h2 className="adm-confirm-title">Delete account?</h2>
        <p className="adm-confirm-text">
          This will permanently remove <strong>{user.full_name}</strong>&apos;s account
          ({user.email}). This action cannot be undone.
        </p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm} disabled={busy}>
            {busy ? <span className="adm-spinner" /> : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── edit drawer ─── */
function EditDrawer({ user, token, onClose, onSaved, onDeleted, pushToast, meId }) {
  const [name,     setName]     = useState(user.full_name);
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [role,     setRole]     = useState(user.role || 'user');
  const [showPw,   setShowPw]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const firstRef = useRef(null);

  const isSelf = String(meId) === String(user.id);

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

  const hasChanges = name.trim() !== user.full_name || password.length > 0 || role !== user.role;
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
      // Update name / password
      const body = { full_name: name.trim() };
      if (password) body.password = password;
      const res = await request('PUT', `/api/admin/users/${user.id}`, body, token);
      let merged = normalizeUser({ ...user, ...(res?.user ?? res?.data ?? res ?? {}), role, id: user.id });

      // Update role if changed
      if (role !== user.role) {
        const roleRes = await request('PATCH', `/api/admin/users/${user.id}/role`, { role }, token);
        merged = normalizeUser({ ...merged, ...(roleRes?.user ?? roleRes?.data ?? roleRes ?? {}), role });
      }

      onSaved(merged);
      pushToast(`${merged.full_name} was updated.`, 'success');
      onClose();
    } catch (err) {
      pushToast(err.message || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleteBusy(true);
    try {
      await request('DELETE', `/api/admin/users/${user.id}`, null, token);
      onDeleted(user.id);
      pushToast(`${user.full_name}'s account was deleted.`, 'success');
      onClose();
    } catch (err) {
      pushToast(err.message || 'Delete failed.', 'error');
      setDeleteBusy(false);
      setShowDelete(false);
    }
  }

  return (
    <>
      <div
        className="adm-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog" aria-modal="true" aria-label="Edit user"
      >
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
            <div className="adm-drawer-profile-info">
              <p className="adm-drawer-name">{user.full_name}</p>
              <p className="adm-drawer-email">{user.email}</p>
              <div className="adm-drawer-meta">
                <RoleBadge role={user.role} />
                <span className="adm-id">ID #{user.id}</span>
              </div>
            </div>
          </div>

          <form className="adm-form" onSubmit={handleSave} noValidate>
            {/* Name */}
            <div className="adm-field">
              <label htmlFor="em-name" className="adm-label">Full name</label>
              <div className={`adm-input-wrap ${errors.name ? 'is-error' : ''}`}>
                <Icon name="user" size={16} />
                <input
                  ref={firstRef} id="em-name" className="adm-input" value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                />
              </div>
              {errors.name && <span className="adm-field-err">{errors.name}</span>}
            </div>

            {/* Role */}
            <div className="adm-field">
              <label htmlFor="em-role" className="adm-label">
                Role
                {isSelf && <span className="adm-label-hint">You cannot change your own role</span>}
              </label>
              <div className="adm-input-wrap">
                <Icon name="shield" size={16} />
                <select
                  id="em-role"
                  className="adm-input adm-select"
                  value={role}
                  disabled={isSelf}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="adm-field">
              <label htmlFor="em-pw" className="adm-label">
                New password
                <span className="adm-label-hint">Leave blank to keep the current one</span>
              </label>
              <div className={`adm-input-wrap ${errors.password ? 'is-error' : ''}`}>
                <Icon name="lock" size={16} />
                <input
                  id="em-pw" type={showPw ? 'text' : 'password'} className="adm-input"
                  placeholder="Enter a new password" autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                />
                <button
                  type="button" className="adm-eye"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
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
                  <input
                    id="em-confirm" type={showPw ? 'text' : 'password'} className="adm-input"
                    placeholder="Repeat the new password" autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })); }}
                  />
                </div>
                {errors.confirm && <span className="adm-field-err">{errors.confirm}</span>}
              </div>
            )}

            <div className="adm-drawer-actions">
              <button
                type="button"
                className="adm-btn adm-btn--danger-ghost"
                disabled={isSelf || saving}
                onClick={() => setShowDelete(true)}
                title={isSelf ? 'You cannot delete your own account' : 'Delete this account'}
              >
                <Icon name="trash" size={14} /> Delete
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn--primary" disabled={saving || !hasChanges}>
                  {saving ? <span className="adm-spinner" /> : 'Save changes'}
                </button>
              </div>
            </div>
          </form>
        </aside>
      </div>

      {showDelete && (
        <ConfirmDeleteModal
          user={user}
          busy={deleteBusy}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

/* ─── main page ─── */
export default function Admin() {
  const { user: me, token: ctxToken, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [users,    setUsers]    = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);
  const [search,   setSearch]   = useState('');
  const [sort,     setSort]     = useState('newest');
  const [roleTab,  setRoleTab]  = useState('all');
  const [page,     setPage]     = useState(1);
  const [editing,  setEditing]  = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view,     setView]     = useState('dashboard'); // 'dashboard' | 'users' | 'content' | 'media'
  const [contentSlug, setContentSlug] = useState(null);
  const { toasts, push: pushToast } = useToast();

  const myRole = me?.role ? String(me.role).toLowerCase() : '';
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
  const counts = {
    all:   users.length,
    user:  countOf('user'),
    staff: countOf('staff'),
    admin: countOf('admin'),
  };

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
  const safePage   = Math.min(page, totalPages);
  const pageUsers  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd   = Math.min(safePage * PAGE_SIZE, filtered.length);

  const recent = [...users]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 4);

  function handleSaved(updated) {
    setUsers((prev) => prev.map((u) => (rowKey(u) === rowKey(updated) ? { ...u, ...updated } : u)));
  }

  function handleDeleted(deletedId) {
    setUsers((prev) => prev.filter((u) => String(u.id) !== String(deletedId)));
    setEditing(null);
  }

  function pickRole(key) {
    setRoleTab(key);
    setPage(1);
    setMenuOpen(false);
  }

  const isMe = (u) => me && String(me.id) === String(u.id);

  if (authLoading) return null;

  const myName = me?.full_name || me?.name || me?.fullName || 'Admin';

  const renderError = () => {
    const status = fetchErr.status;
    const title  = status === 403 ? "You don't have admin access" : "Couldn't load users";
    const text   = status === 401 ? 'Your session expired. Please log in again.' : fetchErr.message;
    return (
      <div className="adm-error-state">
        <span className="adm-state-icon adm-state-icon--danger"><Icon name="alert" size={22} /></span>
        <p className="adm-state-title">{title}</p>
        <p className="adm-state-text">{text}</p>
        <p className="adm-state-code">GET {API_BASE}/api/admin/users{status ? ` · HTTP ${status}` : ''}</p>
        {status === 401
          ? <button className="adm-btn adm-btn--primary" onClick={() => navigate('/auth')}>Go to login</button>
          : <button className="adm-btn adm-btn--primary" onClick={fetchUsers}>Try again</button>
        }
      </div>
    );
  };

  const tabs = [
    { key: 'all',   label: 'All',    count: counts.all   },
    { key: 'user',  label: 'Users',  count: counts.user  },
    { key: 'staff', label: 'Staff',  count: counts.staff },
    { key: 'admin', label: 'Admins', count: counts.admin },
  ];

  const emptyText = `No accounts found${search ? ` for "${search}"` : ''}.`;

  return (
    <div className="adm-app">
      <Toast toasts={toasts} />

      <AdminSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        view={view}
        onView={(v) => { setView(v); }}
        roleTab={roleTab}
        onPick={pickRole}
        counts={counts}
        loading={fetching}
        name={myName}
        role={myRole}
        onHome={() => navigate('/')}
        onLogout={typeof logout === 'function' ? () => logout() : undefined}
        contentSlug={contentSlug}
        onContentSlug={setContentSlug}
      />

      <div className="adm-main">
        {/* ── Sticky top bar ── */}
        <header className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={20} />
          </button>
          <div className="adm-search-wrap adm-search-wrap--top">
            <Icon name="search" size={16} />
            <input
              type="search" className="adm-search"
              placeholder="Search by name, email or ID"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              aria-label="Search users"
            />
          </div>
          <div className="adm-topbar-actions">
            <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => navigate('/')}>
              <Icon name="arrowLeft" size={15} /><span className="adm-hide-sm">Back to site</span>
            </button>
            <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={fetchUsers} disabled={fetching}>
              <span className={fetching ? 'adm-spin' : ''}><Icon name="refresh" size={15} /></span>
              <span className="adm-hide-sm">Refresh</span>
            </button>
          </div>
        </header>

        <main className="adm-content">

          {/* ── Content Manager ── */}
          {view === 'content' && (
            <ContentManager token={ctxToken} section={contentSlug} onView={(v) => setView(v)} />
          )}

          {/* ── Media Library ── */}
          {view === 'media' && (
            <MediaLibrary token={ctxToken} onClose={() => setView('dashboard')} />
          )}

          {/* ── Dashboard ── */}
          {view === 'dashboard' && (
            <>
              <div className="adm-header">
                <p className="adm-eyebrow">Admin console</p>
                <h1 className="adm-title">Dashboard</h1>
                <p className="adm-subtitle">Overview of all registered accounts and activity.</p>
              </div>
              <StatCards users={users} loading={fetching} />
              <div className="ch-row">
                <SignupsChart users={users} loading={fetching} />
                <RoleDonut users={users} loading={fetching} />
              </div>
              <div className="adm-grid" style={{ marginTop: 16 }}>
                <section className="adm-card adm-card--pad">
                  <h2 className="adm-card-title">Recently joined</h2>
                  <p className="adm-card-sub">Latest accounts created</p>
                  <ul className="adm-recent">
                    {fetching
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <li key={i}>
                            <span className="adm-skeleton adm-skeleton--avatar" />
                            <div style={{ flex: 1 }}>
                              <span className="adm-skeleton" style={{ width: '60%' }} />
                              <span className="adm-skeleton" style={{ width: '40%', marginTop: 6 }} />
                            </div>
                          </li>
                        ))
                      : recent.length === 0
                        ? <li className="adm-recent-empty">No accounts yet.</li>
                        : recent.map((u) => (
                            <li key={rowKey(u)}>
                              <Avatar user={u} />
                              <div className="adm-recent-info">
                                <span className="adm-user-name">{u.full_name}</span>
                                <span className="adm-user-email">{formatDate(u.created_at)}</span>
                              </div>
                              <RoleBadge role={u.role} />
                            </li>
                          ))
                    }
                  </ul>
                </section>
                <div className="adm-side">
                  <section className="adm-card adm-card--pad">
                    <h2 className="adm-card-title">Quick access</h2>
                    <p className="adm-card-sub">Jump to account sections</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                      {[
                        { key: 'all',   label: 'All accounts', count: counts.all,   icon: 'users'  },
                        { key: 'user',  label: 'Users',        count: counts.user,  icon: 'user'   },
                        { key: 'staff', label: 'Staff',        count: counts.staff, icon: 'staff'  },
                        { key: 'admin', label: 'Admins',       count: counts.admin, icon: 'shield' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          className="adm-btn adm-btn--ghost"
                          style={{ justifyContent: 'space-between', width: '100%' }}
                          onClick={() => { setView('users'); pickRole(item.key); }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name={item.icon} size={15} />{item.label}
                          </span>
                          <span className="adm-tab-count">{fetching ? '…' : item.count}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* ── Users ── */}
          {view === 'users' && (
            <>
              <div className="adm-header">
                <p className="adm-eyebrow">Admin console</p>
                <h1 className="adm-title">User management</h1>
                <p className="adm-subtitle">View, edit roles, and manage every account on Wollo-Info Hub.</p>
              </div>
              <div className="adm-grid">
                <section className="adm-card">
                  <div className="adm-card-head">
                    <div>
                      <h2 className="adm-card-title">All accounts</h2>
                      <p className="adm-card-sub">Edit name, password and role for any account</p>
                    </div>
                    <select
                      className="adm-sort" value={sort}
                      onChange={(e) => { setSort(e.target.value); setPage(1); }}
                      aria-label="Sort users"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="name">Name A to Z</option>
                    </select>
                  </div>

                  <div className="adm-tabs" role="tablist" aria-label="Filter by role">
                    {tabs.map((t) => (
                      <button
                        key={t.key} role="tab" aria-selected={roleTab === t.key}
                        className={`adm-tab ${roleTab === t.key ? 'is-active' : ''}`}
                        onClick={() => { setRoleTab(t.key); setPage(1); }}
                      >
                        {t.label}
                        <span className="adm-tab-count">{fetching ? '…' : t.count}</span>
                      </button>
                    ))}
                  </div>

                  {fetchErr ? renderError() : (
                    <>
                      <div className="adm-table-wrap">
                        <table className="adm-table" aria-label="Users">
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>ID</th>
                              <th>Role</th>
                              <th>Joined</th>
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
                                        <button
                                          className="adm-icon-btn adm-icon-btn--bordered"
                                          onClick={() => setEditing(u)}
                                          aria-label={`Edit ${u.full_name}`}
                                          title="Edit"
                                        >
                                          <Icon name="edit" size={16} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                            }
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile list */}
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
                                  <button
                                    className="adm-icon-btn adm-icon-btn--bordered"
                                    onClick={() => setEditing(u)}
                                    aria-label={`Edit ${u.full_name}`}
                                  >
                                    <Icon name="edit" size={16} />
                                  </button>
                                </div>
                              ))
                        }
                      </div>

                      {!fetching && filtered.length > 0 && (
                        <footer className="adm-pagination">
                          <span className="adm-page-info">
                            Showing {rangeStart}–{rangeEnd} of {filtered.length}
                          </span>
                          {totalPages > 1 && (
                            <nav className="adm-page-nav" aria-label="Pagination">
                              <button
                                className="adm-page-btn"
                                disabled={safePage === 1}
                                onClick={() => setPage(safePage - 1)}
                                aria-label="Previous page"
                              >
                                <Icon name="left" size={16} />
                              </button>
                              {pageList(totalPages, safePage).map((p, i) =>
                                p === '…'
                                  ? <span key={`g${i}`} className="adm-page-gap">…</span>
                                  : (
                                    <button
                                      key={p}
                                      className={`adm-page-btn ${p === safePage ? 'is-active' : ''}`}
                                      onClick={() => setPage(p)}
                                      aria-current={p === safePage ? 'page' : undefined}
                                    >{p}</button>
                                  )
                              )}
                              <button
                                className="adm-page-btn"
                                disabled={safePage === totalPages}
                                onClick={() => setPage(safePage + 1)}
                                aria-label="Next page"
                              >
                                <Icon name="right" size={16} />
                              </button>
                            </nav>
                          )}
                        </footer>
                      )}
                    </>
                  )}
                </section>

                <div className="adm-side">
                  <section className="adm-card adm-card--pad">
                    <h2 className="adm-card-title">Recently joined</h2>
                    <p className="adm-card-sub">Latest accounts created</p>
                    <ul className="adm-recent">
                      {fetching
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <li key={i}>
                              <span className="adm-skeleton adm-skeleton--avatar" />
                              <div style={{ flex: 1 }}>
                                <span className="adm-skeleton" style={{ width: '60%' }} />
                                <span className="adm-skeleton" style={{ width: '40%', marginTop: 6 }} />
                              </div>
                            </li>
                          ))
                        : recent.length === 0
                          ? <li className="adm-recent-empty">No accounts yet.</li>
                          : recent.map((u) => (
                              <li key={rowKey(u)}>
                                <Avatar user={u} />
                                <div className="adm-recent-info">
                                  <span className="adm-user-name">{u.full_name}</span>
                                  <span className="adm-user-email">{formatDate(u.created_at)}</span>
                                </div>
                                <RoleBadge role={u.role} />
                              </li>
                            ))
                      }
                    </ul>
                  </section>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {editing && (
        <EditDrawer
          user={editing}
          token={ctxToken}
          meId={me?.id}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          pushToast={pushToast}
        />
      )}
    </div>
  );
}
