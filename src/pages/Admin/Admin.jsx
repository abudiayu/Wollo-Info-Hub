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

/* ─── generic confirm modal ─── */
function ConfirmModal({ title, text, onConfirm, onCancel, busy, danger = true }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && !busy) onCancel(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onCancel, busy]);
  return (
    <div className="adm-backdrop"
      onClick={(e) => { if (!busy && e.target === e.currentTarget) onCancel(); }}
      role="dialog" aria-modal="true">
      <div className="adm-confirm-modal">
        <div className="adm-confirm-icon" aria-hidden="true">
          <Icon name={danger ? 'trash' : 'alert'} size={24} />
        </div>
        <h2 className="adm-confirm-title">{title}</h2>
        <p className="adm-confirm-text">{text}</p>
        <div className="adm-confirm-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className={`adm-btn ${danger ? 'adm-btn--danger' : 'adm-btn--primary'}`}
            onClick={onConfirm} disabled={busy}>
            {busy ? <span className="adm-spinner" /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── edit user drawer ─── */
function EditDrawer({ user, token, onClose, onSaved, onDeleted, pushToast, meId }) {
  const [name,       setName]       = useState(user.full_name);
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [role,       setRole]       = useState(user.role || 'user');
  const [showPw,     setShowPw]     = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [errors,     setErrors]     = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const firstRef = useRef(null);
  const isSelf   = String(meId) === String(user.id);

  useEffect(() => {
    firstRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', h); };
  }, [onClose]);

  const strength = passwordStrength(password);
  const strengthLabel = ['Too short', 'Weak', 'Good', 'Strong'][strength];
  const hasChanges = name.trim() !== user.full_name || password.length > 0 || role !== user.role;

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
      const res = await request('PUT', `/api/admin/users/${user.id}`, body, token);
      let merged = normalizeUser({ ...user, ...(res?.user ?? res?.data ?? res ?? {}), role, id: user.id });
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
      <div className="adm-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
              <label htmlFor="em-role" className="adm-label">
                Role {isSelf && <span className="adm-label-hint">You cannot change your own role</span>}
              </label>
              <div className="adm-input-wrap">
                <Icon name="shield" size={16} />
                <select id="em-role" className="adm-input adm-select" value={role}
                  disabled={isSelf} onChange={(e) => setRole(e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="adm-field">
              <label htmlFor="em-pw" className="adm-label">
                New password <span className="adm-label-hint">Leave blank to keep current</span>
              </label>
              <div className={`adm-input-wrap ${errors.password ? 'is-error' : ''}`}>
                <Icon name="lock" size={16} />
                <input id="em-pw" type={showPw ? 'text' : 'password'} className="adm-input"
                  placeholder="Enter a new password" autoComplete="new-password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }} />
                <button type="button" className="adm-eye"
                  onClick={() => setShowPw((v) => !v)}
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
                    placeholder="Repeat the new password" autoComplete="new-password" value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })); }} />
                </div>
                {errors.confirm && <span className="adm-field-err">{errors.confirm}</span>}
              </div>
            )}
            <div className="adm-drawer-actions">
              <button type="button" className="adm-btn adm-btn--danger-ghost"
                disabled={isSelf || saving} onClick={() => setShowDelete(true)}
                title={isSelf ? 'Cannot delete your own account' : 'Delete account'}>
                <Icon name="trash" size={14} /> Delete
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn--primary" disabled={saving || !hasChanges}>
                  {saving ? <span className="adm-spinner" /> : 'Save changes'}
                </button>
              </div>
            </div>
          </form>
        </aside>
      </div>
      {showDelete && (
        <ConfirmModal title="Delete account?"
          text={`This will permanently remove ${user.full_name}'s account (${user.email}). This action cannot be undone.`}
          onConfirm={handleDelete} onCancel={() => setShowDelete(false)} busy={deleteBusy} />
      )}
    </>
  );
}

/* ─── Departments management view (Task 5) ─── */
function DepartmentsView({ token, pushToast }) {
  const [faculties, setFaculties] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  /* form state */
  const [showFacForm,  setShowFacForm]  = useState(false);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingFac,   setEditingFac]   = useState(null);  // null = add, obj = edit
  const [editingDept,  setEditingDept]  = useState(null);
  const [parentFacId,  setParentFacId]  = useState('');
  const [facName,      setFacName]      = useState('');
  const [facColor,     setFacColor]     = useState('#2563eb');
  const [facDesc,      setFacDesc]      = useState('');
  const [deptName,     setDeptName]     = useState('');
  const [deptDesc,     setDeptDesc]     = useState('');
  const [saving,       setSaving]       = useState(false);
  const [confirmDel,   setConfirmDel]   = useState(null); // { type:'faculty'|'department', id, name }
  const [delBusy,      setDelBusy]      = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await request('GET', '/api/admin/faculties', null, token);
      setFaculties(res?.data ?? (Array.isArray(res) ? res : []));
    } catch (e) {
      setError(e.message || 'Failed to load faculties.');
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function openAddFaculty() {
    setEditingFac(null); setFacName(''); setFacColor('#2563eb'); setFacDesc('');
    setShowFacForm(true);
  }
  function openEditFaculty(f) {
    setEditingFac(f); setFacName(f.name); setFacColor(f.color || '#2563eb'); setFacDesc(f.description || '');
    setShowFacForm(true);
  }
  function openAddDept(facId) {
    setEditingDept(null); setParentFacId(String(facId)); setDeptName(''); setDeptDesc('');
    setShowDeptForm(true);
  }
  function openEditDept(d, facId) {
    setEditingDept(d); setParentFacId(String(facId)); setDeptName(d.name); setDeptDesc(d.description || '');
    setShowDeptForm(true);
  }

  async function saveFaculty(e) {
    e.preventDefault();
    if (!facName.trim()) return;
    setSaving(true);
    try {
      const body = { name: facName.trim(), color: facColor, description: facDesc };
      if (editingFac) {
        await request('PUT', `/api/admin/faculties/${editingFac.id}`, body, token);
        pushToast('Faculty updated.', 'success');
      } else {
        await request('POST', '/api/admin/faculties', body, token);
        pushToast('Faculty created.', 'success');
      }
      setShowFacForm(false);
      load();
    } catch (err) {
      pushToast(err.message || 'Failed to save faculty.', 'error');
    } finally { setSaving(false); }
  }

  async function saveDept(e) {
    e.preventDefault();
    if (!deptName.trim() || !parentFacId) return;
    setSaving(true);
    try {
      const body = { name: deptName.trim(), description: deptDesc };
      if (editingDept) {
        await request('PUT', `/api/admin/departments/${editingDept.id}`, body, token);
        pushToast('Department updated.', 'success');
      } else {
        await request('POST', `/api/admin/faculties/${parentFacId}/departments`, body, token);
        pushToast('Department added.', 'success');
      }
      setShowDeptForm(false);
      load();
    } catch (err) {
      pushToast(err.message || 'Failed to save department.', 'error');
    } finally { setSaving(false); }
  }

  async function doDelete() {
    if (!confirmDel) return;
    setDelBusy(true);
    try {
      const path = confirmDel.type === 'faculty'
        ? `/api/admin/faculties/${confirmDel.id}`
        : `/api/admin/departments/${confirmDel.id}`;
      await request('DELETE', path, null, token);
      pushToast(`${confirmDel.name} deleted.`, 'success');
      setConfirmDel(null);
      load();
    } catch (err) {
      pushToast(err.message || 'Delete failed.', 'error');
    } finally { setDelBusy(false); }
  }

  return (
    <div>
      <div className="adm-header">
        <p className="adm-eyebrow">Admin console</p>
        <h1 className="adm-title">Departments &amp; Faculties</h1>
        <p className="adm-subtitle">Manage the university's faculties and their academic departments.</p>
      </div>

      {/* top actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="adm-btn adm-btn--primary" onClick={openAddFaculty}>
          <Icon name="plus" size={15} /> Add Faculty
        </button>
      </div>

      {loading && (
        <div className="adm-empty">
          <span className="adm-spinner" style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: 'var(--adm-green)' }} />
          <p className="adm-state-title" style={{ marginTop: 12 }}>Loading…</p>
        </div>
      )}
      {error && (
        <div className="adm-error-state">
          <Icon name="alert" size={22} />
          <p className="adm-state-title">{error}</p>
          <button className="adm-btn adm-btn--primary" onClick={load}>Retry</button>
        </div>
      )}
      {!loading && !error && faculties.length === 0 && (
        <div className="adm-empty">
          <Icon name="building" size={28} />
          <p className="adm-state-title">No faculties yet.</p>
          <button className="adm-btn adm-btn--primary" style={{ marginTop: 12 }} onClick={openAddFaculty}>Add your first faculty</button>
        </div>
      )}

      {/* Faculty list */}
      {!loading && faculties.map(fac => (
        <section key={fac.id} className="adm-dept-faculty">
          <div className="adm-dept-faculty-head">
            <span className="adm-dept-fac-dot" style={{ background: fac.color || '#2563eb' }} />
            <h2 className="adm-dept-fac-name">{fac.name}</h2>
            <span className="adm-dept-fac-count">{(fac.departments || []).length} dept{(fac.departments || []).length !== 1 ? 's' : ''}</span>
            <div className="adm-dept-fac-actions">
              <button className="adm-icon-btn adm-icon-btn--bordered" title="Add department"
                onClick={() => openAddDept(fac.id)}>
                <Icon name="plus" size={15} />
              </button>
              <button className="adm-icon-btn adm-icon-btn--bordered" title="Edit faculty"
                onClick={() => openEditFaculty(fac)}>
                <Icon name="edit" size={15} />
              </button>
              <button className="adm-icon-btn adm-icon-btn--bordered adm-icon-btn--danger" title="Delete faculty"
                onClick={() => setConfirmDel({ type: 'faculty', id: fac.id, name: fac.name })}>
                <Icon name="trash" size={15} />
              </button>
            </div>
          </div>

          {(fac.departments || []).length === 0 ? (
            <p className="adm-dept-empty">No departments yet. <button className="adm-link-btn" onClick={() => openAddDept(fac.id)}>Add one</button></p>
          ) : (
            <ul className="adm-dept-list">
              {(fac.departments || []).map(d => (
                <li key={d.id} className="adm-dept-item">
                  <span className="adm-dept-item-name">{d.name}</span>
                  <span className="adm-dept-item-slug">{d.slug}</span>
                  <div className="adm-dept-item-actions">
                    <button className="adm-icon-btn adm-icon-btn--bordered" title="Edit"
                      onClick={() => openEditDept(d, fac.id)}>
                      <Icon name="edit" size={14} />
                    </button>
                    <button className="adm-icon-btn adm-icon-btn--bordered adm-icon-btn--danger" title="Delete"
                      onClick={() => setConfirmDel({ type: 'department', id: d.id, name: d.name })}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Faculty form modal */}
      {showFacForm && (
        <div className="adm-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowFacForm(false); }}
          role="dialog" aria-modal="true">
          <aside className="adm-drawer">
            <header className="adm-drawer-head">
              <div><p className="adm-eyebrow">Faculties</p>
                <h2 className="adm-drawer-title">{editingFac ? 'Edit Faculty' : 'Add Faculty'}</h2></div>
              <button className="adm-icon-btn" onClick={() => setShowFacForm(false)} aria-label="Close"><Icon name="close" /></button>
            </header>
            <form className="adm-form" onSubmit={saveFaculty} noValidate>
              <div className="adm-field">
                <label className="adm-label">Name *</label>
                <div className="adm-input-wrap">
                  <Icon name="building" size={16} />
                  <input className="adm-input" required value={facName}
                    onChange={e => setFacName(e.target.value)} placeholder="e.g. College of Health Sciences" />
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label">Accent colour</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="color" value={facColor} onChange={e => setFacColor(e.target.value)}
                    style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 6 }} />
                  <span style={{ fontSize: 13, color: '#64748b' }}>{facColor}</span>
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label">Description</label>
                <div className="adm-input-wrap" style={{ alignItems: 'flex-start' }}>
                  <textarea className="adm-input" rows={3} value={facDesc}
                    onChange={e => setFacDesc(e.target.value)} placeholder="Short description…"
                    style={{ resize: 'vertical', paddingTop: 10 }} />
                </div>
              </div>
              <div className="adm-drawer-actions">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setShowFacForm(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn--primary" disabled={saving || !facName.trim()}>
                  {saving ? <span className="adm-spinner" /> : editingFac ? 'Save changes' : 'Create faculty'}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}

      {/* Department form modal */}
      {showDeptForm && (
        <div className="adm-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowDeptForm(false); }}
          role="dialog" aria-modal="true">
          <aside className="adm-drawer">
            <header className="adm-drawer-head">
              <div><p className="adm-eyebrow">Departments</p>
                <h2 className="adm-drawer-title">{editingDept ? 'Edit Department' : 'Add Department'}</h2></div>
              <button className="adm-icon-btn" onClick={() => setShowDeptForm(false)} aria-label="Close"><Icon name="close" /></button>
            </header>
            <form className="adm-form" onSubmit={saveDept} noValidate>
              {!editingDept && (
                <div className="adm-field">
                  <label className="adm-label">Faculty *</label>
                  <div className="adm-input-wrap">
                    <Icon name="building" size={16} />
                    <select className="adm-input adm-select" value={parentFacId}
                      onChange={e => setParentFacId(e.target.value)}>
                      <option value="">Select a faculty…</option>
                      {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div className="adm-field">
                <label className="adm-label">Department name *</label>
                <div className="adm-input-wrap">
                  <Icon name="cap" size={16} />
                  <input className="adm-input" required value={deptName}
                    onChange={e => setDeptName(e.target.value)} placeholder="e.g. Computer Science" />
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label">Description</label>
                <div className="adm-input-wrap" style={{ alignItems: 'flex-start' }}>
                  <textarea className="adm-input" rows={3} value={deptDesc}
                    onChange={e => setDeptDesc(e.target.value)} placeholder="Short description…"
                    style={{ resize: 'vertical', paddingTop: 10 }} />
                </div>
              </div>
              <div className="adm-drawer-actions">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setShowDeptForm(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn--primary"
                  disabled={saving || !deptName.trim() || (!editingDept && !parentFacId)}>
                  {saving ? <span className="adm-spinner" /> : editingDept ? 'Save changes' : 'Add department'}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <ConfirmModal
          title={`Delete ${confirmDel.type === 'faculty' ? 'faculty' : 'department'}?`}
          text={confirmDel.type === 'faculty'
            ? `Deleting "${confirmDel.name}" will also delete all its departments. This cannot be undone.`
            : `"${confirmDel.name}" will be permanently deleted.`}
          onConfirm={doDelete} onCancel={() => setConfirmDel(null)} busy={delBusy} />
      )}
    </div>
  );
}

/* ─── Dept Heads view (Task 2 — no duplicate) ─── */
function DeptHeadsView({ token, pushToast }) {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const payload = await request('GET', '/api/admin/staff', null, token);
      const heads = (Array.isArray(payload) ? payload : [])
        .filter(s => s.source === 'department_heads');
      setList(heads);
    } catch (e) { setError(e.message || 'Failed to load.'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const shown = list.filter(s => {
    const q = search.trim().toLowerCase();
    return !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
      || s.department_name?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="adm-header">
        <p className="adm-eyebrow">Admin console</p>
        <h1 className="adm-title">Department Heads</h1>
        <p className="adm-subtitle">All department head accounts linked to their departments.</p>
      </div>
      <section className="adm-card">
        <div className="adm-card-head">
          <div>
            <h2 className="adm-card-title">Department heads</h2>
            <p className="adm-card-sub">{loading ? '…' : `${list.length} head${list.length !== 1 ? 's' : ''}`}</p>
          </div>
          <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={load} disabled={loading}>
            <span className={loading ? 'adm-spin' : ''}><Icon name="refresh" size={15} /></span>
          </button>
        </div>
        <div className="adm-search-wrap" style={{ padding: '0 0 12px' }}>
          <Icon name="search" size={16} />
          <input type="search" className="adm-search" placeholder="Search by name, email or department…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {error && <p style={{ color: '#dc2626', padding: '8px 0' }}>{error}</p>}
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Joined</th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />) :
                shown.length === 0 ? (
                  <tr><td colSpan={4}>
                    <div className="adm-empty"><Icon name="cap" size={22} />
                      <p className="adm-state-title">{search ? `No results for "${search}"` : 'No department heads yet.'}</p>
                    </div>
                  </td></tr>
                ) : shown.map((s, i) => (
                  <tr key={`dh-${s.id}-${i}`} className="adm-row">
                    <td>
                      <div className="adm-user-cell">
                        <span className="adm-avatar adm-avatar--initials" style={{ background: '#1d6b66' }} aria-hidden="true">
                          {(s.name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')}
                        </span>
                        <div className="adm-user-info"><span className="adm-user-name">{s.name}</span></div>
                      </div>
                    </td>
                    <td className="adm-user-email">{s.email}</td>
                    <td className="adm-muted-cell">{s.department_name || <span className="adm-muted">—</span>}</td>
                    <td className="adm-date">{formatDate(s.created_at)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ─── main Admin page ─── */
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
  const [view,     setView]     = useState('dashboard');
  const [contentSlug, setContentSlug] = useState(null);
  const { toasts, push: pushToast } = useToast();

  /* dept head count for sidebar badge */
  const [deptHeadCount, setDeptHeadCount] = useState(0);

  const myRole = me?.role ? String(me.role).toLowerCase() : '';
  const canTry = !!me && (!myRole || myRole === 'admin');

  useEffect(() => {
    if (authLoading) return;
    if (!me) { navigate('/auth', { replace: true }); return; }
    if (myRole && myRole !== 'admin') navigate('/', { replace: true });
  }, [me, myRole, authLoading, navigate]);

  const fetchUsers = useCallback(async () => {
    setFetching(true); setFetchErr(null);
    try {
      const payload = await request('GET', '/api/admin/users', null, ctxToken);
      setUsers(normalizeList(payload));
    } catch (err) {
      setFetchErr({ message: err.message || 'Failed to load users.', status: err.status || 0 });
    } finally { setFetching(false); }
  }, [ctxToken]);

  /* fetch dept-head count for sidebar */
  const fetchDeptHeadCount = useCallback(async () => {
    try {
      const payload = await request('GET', '/api/admin/staff', null, ctxToken);
      const heads = (Array.isArray(payload) ? payload : []).filter(s => s.source === 'department_heads');
      setDeptHeadCount(heads.length);
    } catch { /* non-critical */ }
  }, [ctxToken]);

  useEffect(() => {
    if (!authLoading && canTry) { fetchUsers(); fetchDeptHeadCount(); }
  }, [authLoading, canTry, fetchUsers, fetchDeptHeadCount]);

  const countOf = (role) => users.filter((u) => u.role === role).length;
  const counts  = { all: users.length, user: countOf('user'), staff: countOf('staff'), admin: countOf('admin') };

  const filtered = users
    .filter((u) => roleTab === 'all' || u.role === roleTab)
    .filter((u) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || String(u.id).includes(q);
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
  const recent     = [...users].sort((a,b) => new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,4);

  function handleSaved(updated) {
    setUsers((prev) => prev.map((u) => (rowKey(u) === rowKey(updated) ? { ...u, ...updated } : u)));
  }
  function handleDeleted(deletedId) {
    setUsers((prev) => prev.filter((u) => String(u.id) !== String(deletedId)));
    setEditing(null);
  }
  function pickRole(key) { setRoleTab(key); setPage(1); setMenuOpen(false); }
  const isMe = (u) => me && String(me.id) === String(u.id);

  if (authLoading) return null;
  const myName = me?.full_name || me?.name || me?.fullName || 'Admin';

  const tabs = [
    { key: 'all',   label: 'All',    count: counts.all   },
    { key: 'user',  label: 'Users',  count: counts.user  },
    { key: 'staff', label: 'Staff',  count: counts.staff },
    { key: 'admin', label: 'Admins', count: counts.admin },
  ];
  const emptyText = `No accounts found${search ? ` for "${search}"` : ''}.`;

  const renderError = () => {
    const status = fetchErr.status;
    return (
      <div className="adm-error-state">
        <span className="adm-state-icon adm-state-icon--danger"><Icon name="alert" size={22} /></span>
        <p className="adm-state-title">{status === 403 ? "No admin access" : "Couldn't load users"}</p>
        <p className="adm-state-text">{status === 401 ? 'Session expired.' : fetchErr.message}</p>
        <button className="adm-btn adm-btn--primary"
          onClick={status === 401 ? () => navigate('/auth') : fetchUsers}>
          {status === 401 ? 'Log in again' : 'Try again'}
        </button>
      </div>
    );
  };

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
        deptHeadCount={deptHeadCount}
      />

      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={20} />
          </button>
          <div className="adm-search-wrap adm-search-wrap--top">
            <Icon name="search" size={16} />
            <input type="search" className="adm-search" placeholder="Search by name, email or ID"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search users" />
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

          {view === 'content' && <ContentManager token={ctxToken} section={contentSlug} onView={(v) => setView(v)} />}
          {view === 'media'   && <MediaLibrary   token={ctxToken} onClose={() => setView('dashboard')} />}

          {/* ── Departments management (Task 5) ── */}
          {view === 'departments' && (
            <DepartmentsView token={ctxToken} pushToast={pushToast} />
          )}

          {/* ── Dept Heads (Task 2 — no duplicate) ── */}
          {view === 'depthead' && (
            <DeptHeadsView token={ctxToken} pushToast={pushToast} />
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
                <RoleDonut    users={users} loading={fetching} />
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
                        { key: 'all',   label: 'All accounts',    count: counts.all,    icon: 'users',    vw: 'users',    rk: 'all'   },
                        { key: 'user',  label: 'Users',           count: counts.user,   icon: 'user',     vw: 'users',    rk: 'user'  },
                        { key: 'staff', label: 'Staff',           count: counts.staff,  icon: 'staff',    vw: 'users',    rk: 'staff' },
                        { key: 'admin', label: 'Admins',          count: counts.admin,  icon: 'shield',   vw: 'users',    rk: 'admin' },
                        { key: 'dh',    label: 'Dept. Heads',     count: deptHeadCount, icon: 'cap',      vw: 'depthead', rk: null    },
                        { key: 'dept',  label: 'Departments',     count: null,          icon: 'building', vw: 'departments', rk: null },
                      ].map((item) => (
                        <button key={item.key} className="adm-btn adm-btn--ghost"
                          style={{ justifyContent: 'space-between', width: '100%' }}
                          onClick={() => { setView(item.vw); if (item.rk) pickRole(item.rk); }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name={item.icon} size={15} />{item.label}
                          </span>
                          {item.count !== null && (
                            <span className="adm-tab-count">{fetching ? '…' : item.count}</span>
                          )}
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
                    <select className="adm-sort" value={sort}
                      onChange={(e) => { setSort(e.target.value); setPage(1); }} aria-label="Sort users">
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="name">Name A to Z</option>
                    </select>
                  </div>
                  <div className="adm-tabs" role="tablist" aria-label="Filter by role">
                    {tabs.map((t) => (
                      <button key={t.key} role="tab" aria-selected={roleTab === t.key}
                        className={`adm-tab ${roleTab === t.key ? 'is-active' : ''}`}
                        onClick={() => { setRoleTab(t.key); setPage(1); }}>
                        {t.label}
                        <span className="adm-tab-count">{fetching ? '…' : t.count}</span>
                      </button>
                    ))}
                  </div>
                  {fetchErr ? renderError() : (
                    <>
                      <div className="adm-table-wrap">
                        <table className="adm-table" aria-label="Users">
                          <thead><tr><th>User</th><th>ID</th><th>Role</th><th>Joined</th><th aria-label="Actions" /></tr></thead>
                          <tbody>
                            {fetching ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />) :
                              pageUsers.length === 0 ? (
                                <tr><td colSpan={5}>
                                  <div className="adm-empty">
                                    <span className="adm-state-icon"><Icon name="users" size={22} /></span>
                                    <p className="adm-state-title">{emptyText}</p>
                                  </div>
                                </td></tr>
                              ) : pageUsers.map((u) => (
                                <tr key={rowKey(u)} className="adm-row">
                                  <td>
                                    <div className="adm-user-cell">
                                      <Avatar user={u} />
                                      <div className="adm-user-info">
                                        <span className="adm-user-name">{u.full_name}{isMe(u) && <span className="adm-you">You</span>}</span>
                                        <span className="adm-user-email">{u.email}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="adm-id">#{u.id}</td>
                                  <td><RoleBadge role={u.role} /></td>
                                  <td className="adm-date">{formatDate(u.created_at)}</td>
                                  <td className="adm-actions-cell">
                                    <button className="adm-icon-btn adm-icon-btn--bordered"
                                      onClick={() => setEditing(u)} aria-label={`Edit ${u.full_name}`} title="Edit">
                                      <Icon name="edit" size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                      <div className="adm-mobile-list">
                        {fetching ? Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="adm-mobile-card">
                            <span className="adm-skeleton adm-skeleton--avatar" />
                            <div style={{ flex: 1 }}>
                              <span className="adm-skeleton" style={{ width: '55%' }} />
                              <span className="adm-skeleton" style={{ width: '80%', marginTop: 8 }} />
                            </div>
                          </div>
                        )) : pageUsers.length === 0 ? (
                          <div className="adm-empty">
                            <span className="adm-state-icon"><Icon name="users" size={22} /></span>
                            <p className="adm-state-title">{emptyText}</p>
                          </div>
                        ) : pageUsers.map((u) => (
                          <div key={rowKey(u)} className="adm-mobile-card">
                            <Avatar user={u} />
                            <div className="adm-mobile-body">
                              <div className="adm-mobile-top">
                                <span className="adm-user-name">{u.full_name}{isMe(u) && <span className="adm-you">You</span>}</span>
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
                          <span className="adm-page-info">Showing {rangeStart}–{rangeEnd} of {filtered.length}</span>
                          {totalPages > 1 && (
                            <nav className="adm-page-nav" aria-label="Pagination">
                              <button className="adm-page-btn" disabled={safePage === 1}
                                onClick={() => setPage(safePage - 1)} aria-label="Previous page">
                                <Icon name="left" size={16} />
                              </button>
                              {pageList(totalPages, safePage).map((p, i) =>
                                p === '…' ? <span key={`g${i}`} className="adm-page-gap">…</span> : (
                                  <button key={p} className={`adm-page-btn ${p === safePage ? 'is-active' : ''}`}
                                    onClick={() => setPage(p)} aria-current={p === safePage ? 'page' : undefined}>{p}</button>
                                )
                              )}
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
                <div className="adm-side">
                  <section className="adm-card adm-card--pad">
                    <h2 className="adm-card-title">Recently joined</h2>
                    <p className="adm-card-sub">Latest accounts created</p>
                    <ul className="adm-recent">
                      {fetching ? Array.from({ length: 3 }).map((_, i) => (
                        <li key={i}>
                          <span className="adm-skeleton adm-skeleton--avatar" />
                          <div style={{ flex: 1 }}>
                            <span className="adm-skeleton" style={{ width: '60%' }} />
                            <span className="adm-skeleton" style={{ width: '40%', marginTop: 6 }} />
                          </div>
                        </li>
                      )) : recent.length === 0 ? (
                        <li className="adm-recent-empty">No accounts yet.</li>
                      ) : recent.map((u) => (
                        <li key={rowKey(u)}>
                          <Avatar user={u} />
                          <div className="adm-recent-info">
                            <span className="adm-user-name">{u.full_name}</span>
                            <span className="adm-user-email">{formatDate(u.created_at)}</span>
                          </div>
                          <RoleBadge role={u.role} />
                        </li>
                      ))}
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
          user={editing} token={ctxToken} meId={me?.id}
          onClose={() => setEditing(null)}
          onSaved={handleSaved} onDeleted={handleDeleted} pushToast={pushToast}
        />
      )}
    </div>
  );
}
