/**
 * StaffManager.jsx — fixed version
 * - Department dropdown loads via GET /api/admin/departments-list
 *   (backend falls back to direct query if RPC not deployed yet)
 * - No double error messages
 * - Shows loading state in the dept dropdown
 * - Dept dropdown disabled when role = staff (optional)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  request, Icon, RoleBadge, formatDate,
  passwordStrength, initials, avatarColor,
} from '../AdminShared/AdminShared';
import './StaffManager.css';

// ── Field wrapper ─────────────────────────────────────────────
function Field({ label, hint, error, children }) {
  return (
    <div className="sm-field">
      <label className="sm-label">
        {label}
        {hint && <span className="sm-hint">{hint}</span>}
      </label>
      {children}
      {error && <span className="sm-field-err" role="alert">{error}</span>}
    </div>
  );
}

function InputWrap({ icon, error, children }) {
  return (
    <div className={`sm-input-wrap${error ? ' is-error' : ''}`}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </div>
  );
}

// ── Department grouped select ─────────────────────────────────
function DeptSelect({ departments, deptLoading, value, onChange, disableHasHead, excludeUserId }) {
  if (deptLoading) {
    return (
      <div className="sm-input-wrap">
        <Icon name="building" size={15} />
        <span className="sm-input" style={{ color: '#94a3b8' }}>Loading departments…</span>
      </div>
    );
  }

  if (!departments.length) {
    return (
      <div className="sm-input-wrap is-error">
        <Icon name="building" size={15} />
        <span className="sm-input" style={{ color: '#dc2626', fontSize: 13 }}>
          No departments found. Add departments first.
        </span>
      </div>
    );
  }

  // Group by faculty_name
  const groups = {};
  for (const d of departments) {
    const key = d.faculty_name || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(d);
  }

  return (
    <div className="sm-input-wrap">
      <Icon name="building" size={15} />
      <select
        className="sm-input sm-select"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">— select department —</option>
        {Object.entries(groups).map(([faculty, depts]) => (
          <optgroup key={faculty} label={faculty}>
            {depts.map(d => {
              const isOtherHead = disableHasHead && d.has_head && d.id !== excludeUserId;
              return (
                <option key={d.id} value={d.id} disabled={isOtherHead}>
                  {d.name_en}{isOtherHead ? ' (head assigned)' : ''}
                </option>
              );
            })}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

// ── Confirm / delete modal ────────────────────────────────────
function ConfirmModal({ member, onConfirm, onCancel, busy }) {
  const [deleteAccount, setDeleteAccount] = useState(false);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape' && !busy) onCancel(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onCancel, busy]);

  return (
    <div className="sm-backdrop" role="dialog" aria-modal="true"
      onClick={e => { if (!busy && e.target === e.currentTarget) onCancel(); }}>
      <div className="sm-confirm">
        <div className="sm-confirm-icon"><Icon name="trash" size={22} /></div>
        <h2 className="sm-confirm-title">Remove {member.full_name}?</h2>
        <p className="sm-confirm-text">
          This will remove their <strong>{member.role}</strong> role
          {member.department_name ? ` from "${member.department_name}"` : ''}.
        </p>
        <label className="sm-confirm-check">
          <input type="checkbox" checked={deleteAccount}
            onChange={e => setDeleteAccount(e.target.checked)} />
          <span>Also permanently delete this account (cannot be undone)</span>
        </label>
        <div className="sm-confirm-actions">
          <button className="sm-btn sm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="sm-btn sm-btn--danger" onClick={() => onConfirm(deleteAccount)} disabled={busy}>
            {busy ? <span className="sm-spinner" /> : deleteAccount ? 'Delete account' : 'Remove role'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit drawer ─────────────────────────────────────────
function StaffDrawer({ member, departments, deptLoading, token, onClose, onSaved, pushToast }) {
  const isEdit = !!member;

  const [fullName,     setFullName]     = useState(member?.full_name     || '');
  const [username,     setUsername]     = useState(member?.username       || '');
  const [email,        setEmail]        = useState(member?.email          || '');
  const [password,     setPassword]     = useState('');
  const [confirmPw,    setConfirmPw]    = useState('');
  const [showPw,       setShowPw]       = useState(false);
  const [role,         setRole]         = useState(member?.role === 'head' ? 'head' : 'staff');
  const [deptId,       setDeptId]       = useState(member?.department_id  || '');
  const [title,        setTitle]        = useState(member?.title          || '');
  const [officeNumber, setOfficeNumber] = useState(member?.office_number  || '');
  const [errors,       setErrors]       = useState({});
  const [saving,       setSaving]       = useState(false);

  const firstRef   = useRef(null);
  const strength   = passwordStrength(password);
  const strengthLabel = ['Too short', 'Weak', 'Good', 'Strong'][strength];

  // Lock scroll while drawer is open
  useEffect(() => {
    firstRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', h); };
  }, [onClose]);

  // Clear dept when switching to staff
  function handleRoleChange(r) {
    setRole(r);
    if (r === 'staff') setDeptId('');
    setErrors(p => ({ ...p, deptId: '' }));
  }

  function validate() {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    if (!isEdit) {
      if (!email.trim()) e.email = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email.';
      if (!password) e.password = 'Password is required.';
      else if (password.length < 6) e.password = 'At least 6 characters.';
      if (password && password !== confirmPw) e.confirmPw = 'Passwords do not match.';
    } else if (password) {
      if (password.length < 6) e.password = 'At least 6 characters.';
      if (password !== confirmPw) e.confirmPw = 'Passwords do not match.';
    }
    if (role === 'head' && !deptId) e.deptId = 'Select a department for this head.';
    return e;
  }

  async function handleSave(ev) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setErrors({});
    try {
      const body = {
        full_name:     fullName.trim(),
        username:      username.trim() || undefined,
        role,
        department_id: deptId || null,
        title:         title.trim()        || null,
        office_number: officeNumber.trim() || null,
      };

      if (isEdit) {
        if (password) body.password = password;
        const updated = await request('PATCH', `/api/admin/staff/${member.id}`, body, token);
        onSaved(updated, false);
        pushToast(`${fullName} updated.`, 'success');
      } else {
        body.email    = email.trim().toLowerCase();
        body.password = password;
        const created = await request('POST', '/api/admin/staff', body, token);
        onSaved(created, true);
        pushToast(`${fullName} added as ${role}.`, 'success');
      }
      onClose();
    } catch (err) {
      const msg = err.message || 'Save failed.';
      const low = msg.toLowerCase();
      if      (low.includes('email'))                            setErrors(p => ({ ...p, email:    msg }));
      else if (low.includes('username'))                         setErrors(p => ({ ...p, username: msg }));
      else if (low.includes('department') || low.includes('head')) setErrors(p => ({ ...p, deptId:  msg }));
      else                                                       pushToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  // For edit: don't disable the current user's own department
  const excludeUserId = isEdit && member?.role === 'head' ? member?.department_id : null;

  return (
    <div className="sm-backdrop" role="dialog" aria-modal="true"
      aria-label={isEdit ? 'Edit staff member' : 'Add staff member'}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="sm-drawer">

        {/* Header */}
        <header className="sm-drawer-head">
          <div>
            <p className="sm-eyebrow">{isEdit ? 'Edit member' : 'Add member'}</p>
            <h2 className="sm-drawer-title">{isEdit ? member.full_name : 'New staff account'}</h2>
          </div>
          <button className="sm-icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        {/* Profile strip (edit only) */}
        {isEdit && (
          <div className="sm-drawer-profile">
            <span className="sm-avatar sm-avatar--lg sm-avatar--initials"
              style={{ background: avatarColor(member.id) }} aria-hidden="true">
              {initials(member.full_name)}
            </span>
            <div>
              <p className="sm-drawer-name">{member.full_name}</p>
              <p className="sm-drawer-email">{member.email}</p>
              <RoleBadge role={member.role} />
            </div>
          </div>
        )}

        <form className="sm-form" onSubmit={handleSave} noValidate>

          {/* ── Full name ── */}
          <Field label="Full name *" error={errors.fullName}>
            <InputWrap icon="user" error={errors.fullName}>
              <input ref={firstRef} className="sm-input" value={fullName}
                onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                placeholder="e.g. Abebe Bikila" />
            </InputWrap>
          </Field>

          {/* ── Username ── */}
          <Field label="Username" hint="optional" error={errors.username}>
            <InputWrap icon="user" error={errors.username}>
              <input className="sm-input" value={username}
                onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })); }}
                placeholder="e.g. abebe.bikila" autoComplete="off" />
            </InputWrap>
          </Field>

          {/* ── Email (create only) ── */}
          {!isEdit && (
            <Field label="Email *" error={errors.email}>
              <InputWrap icon="user" error={errors.email}>
                <input className="sm-input" type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                  placeholder="staff@wollo.edu" autoComplete="off" />
              </InputWrap>
            </Field>
          )}

          {/* ── Password ── */}
          <Field
            label={isEdit ? 'New password' : 'Password *'}
            hint={isEdit ? 'Leave blank to keep current' : undefined}
            error={errors.password}>
            <InputWrap icon="lock" error={errors.password}>
              <input className="sm-input" type={showPw ? 'text' : 'password'} value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                placeholder={isEdit ? 'Enter new password…' : 'Min 6 characters'}
                autoComplete="new-password" />
              <button type="button" className="sm-eye"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide' : 'Show'}>
                <Icon name={showPw ? 'eyeOff' : 'eye'} size={15} />
              </button>
            </InputWrap>
            {password && (
              <div className="sm-strength" data-level={strength}>
                <div className="sm-strength-bars"><span /><span /><span /></div>
                <span className="sm-strength-label">{strengthLabel}</span>
              </div>
            )}
          </Field>

          {/* ── Confirm password ── */}
          {(password || !isEdit) && (
            <Field label="Confirm password" error={errors.confirmPw}>
              <InputWrap icon="lock" error={errors.confirmPw}>
                <input className="sm-input" type={showPw ? 'text' : 'password'} value={confirmPw}
                  onChange={e => { setConfirmPw(e.target.value); setErrors(p => ({ ...p, confirmPw: '' })); }}
                  placeholder="Repeat password" autoComplete="new-password" />
              </InputWrap>
            </Field>
          )}

          <div className="sm-divider" />

          {/* ── Role toggle ── */}
          <Field label="Role *">
            <div className="sm-role-toggle">
              {['staff', 'head'].map(r => (
                <button key={r} type="button"
                  className={`sm-role-btn${role === r ? ' is-active' : ''}`}
                  onClick={() => handleRoleChange(r)}>
                  <Icon name={r === 'head' ? 'cap' : 'staff'} size={16} />
                  {r === 'head' ? 'Department Head' : 'Staff'}
                </button>
              ))}
            </div>
          </Field>

          {/* ── Department ── only required for Head, shown for both ── */}
          <Field
            label={role === 'head' ? 'Department *' : 'Department'}
            hint={role === 'staff' ? 'optional' : undefined}
            error={errors.deptId}>
            <DeptSelect
              departments={departments}
              deptLoading={deptLoading}
              value={deptId}
              onChange={v => { setDeptId(v); setErrors(p => ({ ...p, deptId: '' })); }}
              disableHasHead={role === 'head'}
              excludeUserId={excludeUserId}
            />
          </Field>

          {/* ── Title ── */}
          <Field label="Title" hint="e.g. Dr., Asst. Prof.">
            <InputWrap icon="cap">
              <input className="sm-input" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Department Head, Lecturer" />
            </InputWrap>
          </Field>

          {/* ── Office number ── */}
          <Field label="Office number">
            <InputWrap icon="building">
              <input className="sm-input" value={officeNumber}
                onChange={e => setOfficeNumber(e.target.value)}
                placeholder="e.g. Block B - Room 204" />
            </InputWrap>
          </Field>

          {/* ── Actions ── */}
          <div className="sm-drawer-actions">
            <button type="button" className="sm-btn sm-btn--ghost"
              onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="sm-btn sm-btn--primary" disabled={saving}>
              {saving ? <span className="sm-spinner" /> : isEdit ? 'Save changes' : 'Add member'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Main StaffManager
// ════════════════════════════════════════════════════════════════
export default function StaffManager({ token, pushToast }) {
  const [list,        setList]        = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(true);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('all');
  const [editTarget,  setEditTarget]  = useState(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(null);
  const [delBusy,     setDelBusy]     = useState(false);

  // ── Load staff list ────────────────────────────────────────
  const loadStaff = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = roleFilter !== 'all' ? `?role=${roleFilter}` : '';
      const data = await request('GET', `/api/admin/staff${params}`, null, token);
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load staff.');
    } finally {
      setLoading(false);
    }
  }, [token, roleFilter]);

  // ── Load departments for the form select ──────────────────
  const loadDepartments = useCallback(async () => {
    setDeptLoading(true);
    try {
      const data = await request('GET', '/api/admin/departments-list', null, token);
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[StaffManager] departments-list failed:', err.message);
      setDepartments([]);
    } finally {
      setDeptLoading(false);
    }
  }, [token]);

  useEffect(() => { loadStaff(); },      [loadStaff]);
  useEffect(() => { loadDepartments(); }, [loadDepartments]);

  // ── Filtered list ──────────────────────────────────────────
  const filtered = list.filter(s => {
    const q = search.trim().toLowerCase();
    return !q
      || s.full_name?.toLowerCase().includes(q)
      || s.email?.toLowerCase().includes(q)
      || s.username?.toLowerCase().includes(q)
      || s.department_name?.toLowerCase().includes(q)
      || s.title?.toLowerCase().includes(q);
  });

  const headCount  = list.filter(s => s.role === 'head').length;
  const staffCount = list.filter(s => s.role === 'staff').length;

  // ── Handlers ───────────────────────────────────────────────
  function handleSaved(member, isNew) {
    setList(prev =>
      isNew
        ? [member, ...prev]
        : prev.map(s => s.id === member.id ? { ...s, ...member } : s)
    );
    loadDepartments(); // refresh has_head flags
  }

  async function handleDelete(member, deleteAccount) {
    setDelBusy(true);
    try {
      const qs = deleteAccount ? '?deleteAccount=true' : '';
      await request('DELETE', `/api/admin/staff/${member.id}${qs}`, null, token);
      setList(prev => prev.filter(s => s.id !== member.id));
      pushToast(
        deleteAccount
          ? `${member.full_name}'s account was permanently deleted.`
          : `${member.full_name}'s ${member.role} role was removed.`,
        'success'
      );
      setConfirmDel(null);
      loadDepartments();
    } catch (err) {
      pushToast(err.message || 'Delete failed.', 'error');
    } finally {
      setDelBusy(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="sm-root">

      {/* Page header */}
      <div className="adm-header">
        <p className="adm-eyebrow">Admin console</p>
        <h1 className="adm-title">Staff &amp; Department Heads</h1>
        <p className="adm-subtitle">
          Create, edit and manage department head and staff accounts.
        </p>
      </div>

      {/* Toolbar */}
      <div className="sm-toolbar">
        <div className="sm-search-wrap">
          <Icon name="search" size={16} />
          <input type="search" className="sm-search"
            placeholder="Search by name, email, department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search staff" />
        </div>

        <div className="sm-filter-tabs" role="tablist">
          {[
            { key: 'all',   label: 'All',         count: list.length  },
            { key: 'head',  label: 'Dept. Heads', count: headCount    },
            { key: 'staff', label: 'Staff',       count: staffCount   },
          ].map(tab => (
            <button key={tab.key} role="tab"
              aria-selected={roleFilter === tab.key}
              className={`sm-tab${roleFilter === tab.key ? ' is-active' : ''}`}
              onClick={() => setRoleFilter(tab.key)}>
              {tab.label}
              <span className="sm-tab-count">{loading ? '…' : tab.count}</span>
            </button>
          ))}
        </div>

        <button className="sm-btn sm-btn--primary" onClick={() => setShowAdd(true)}>
          <Icon name="plus" size={15} /> Add staff
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="sm-error-state">
          <Icon name="alert" size={20} />
          <span>{error}</span>
          <button className="sm-btn sm-btn--ghost sm-btn--sm" onClick={loadStaff}>Retry</button>
        </div>
      )}

      {/* Table */}
      {!error && (
        <section className="adm-card">
          <div className="adm-table-wrap">
            <table className="adm-table" aria-label="Staff members">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Title</th>
                  <th>Office</th>
                  <th>Joined</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="adm-skeleton-row">
                        <td><div className="adm-user-cell">
                          <span className="adm-skeleton adm-skeleton--avatar" />
                          <div style={{ flex: 1 }}>
                            <span className="adm-skeleton" style={{ width: '55%' }} />
                            <span className="adm-skeleton" style={{ width: '75%' }} />
                          </div>
                        </div></td>
                        {[50, 110, 80, 90, 70, 32].map((w, j) => (
                          <td key={j}><span className="adm-skeleton" style={{ width: w }} /></td>
                        ))}
                      </tr>
                    ))
                  : filtered.length === 0
                    ? (
                      <tr><td colSpan={7}>
                        <div className="adm-empty">
                          <Icon name="staff" size={24} />
                          <p className="adm-state-title">
                            {search
                              ? `No results for "${search}"`
                              : 'No staff members yet. Click "Add staff" to create one.'}
                          </p>
                        </div>
                      </td></tr>
                    )
                    : filtered.map(member => (
                        <tr key={member.id} className="adm-row">
                          <td>
                            <div className="adm-user-cell">
                              <span className="adm-avatar adm-avatar--initials"
                                style={{ background: avatarColor(member.id) }}
                                aria-hidden="true">
                                {initials(member.full_name || '?')}
                              </span>
                              <div className="adm-user-info">
                                <span className="adm-user-name">{member.full_name}</span>
                                <span className="adm-user-email">{member.email}</span>
                              </div>
                            </div>
                          </td>
                          <td><RoleBadge role={member.role} /></td>
                          <td className="sm-dept-cell">
                            {member.department_name
                              ? <span className="sm-dept-tag">{member.department_name}</span>
                              : <span className="adm-muted">—</span>}
                          </td>
                          <td className="adm-muted-cell">
                            {member.title || <span className="adm-muted">—</span>}
                          </td>
                          <td className="adm-muted-cell">
                            {member.office_number || <span className="adm-muted">—</span>}
                          </td>
                          <td className="adm-date">{formatDate(member.created_at)}</td>
                          <td className="adm-actions-cell">
                            <button className="adm-icon-btn adm-icon-btn--bordered"
                              onClick={() => setEditTarget(member)}
                              aria-label={`Edit ${member.full_name}`} title="Edit">
                              <Icon name="edit" size={15} />
                            </button>
                            <button className="adm-icon-btn adm-icon-btn--bordered adm-icon-btn--danger"
                              onClick={() => setConfirmDel(member)}
                              aria-label={`Remove ${member.full_name}`} title="Remove">
                              <Icon name="trash" size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                }
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <p className="sm-count-line">
              Showing {filtered.length} of {list.length} member{list.length !== 1 ? 's' : ''}
            </p>
          )}
        </section>
      )}

      {/* Add drawer */}
      {showAdd && (
        <StaffDrawer
          member={null}
          departments={departments}
          deptLoading={deptLoading}
          token={token}
          onClose={() => setShowAdd(false)}
          onSaved={m => handleSaved(m, true)}
          pushToast={pushToast}
        />
      )}

      {/* Edit drawer */}
      {editTarget && (
        <StaffDrawer
          member={editTarget}
          departments={departments}
          deptLoading={deptLoading}
          token={token}
          onClose={() => setEditTarget(null)}
          onSaved={m => handleSaved(m, false)}
          pushToast={pushToast}
        />
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <ConfirmModal
          member={confirmDel}
          onConfirm={deleteAccount => handleDelete(confirmDel, deleteAccount)}
          onCancel={() => setConfirmDel(null)}
          busy={delBusy}
        />
      )}
    </div>
  );
}
