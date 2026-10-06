import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DepartmentHead.css';

/* Use the same base URL as the rest of the app */
const BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API = `${BASE}/api/department-head`;
const TOKEN_KEY = 'dept_head_token';

const TABS = [
  { id: 'overview', label: 'Overview',            icon: 'grid'      },
  { id: 'info',     label: 'Department info',     icon: 'building'  },
  { id: 'courses',  label: 'Courses',             icon: 'book'      },
  { id: 'students', label: 'Interested students', icon: 'users'     },
  { id: 'content',  label: 'Content',             icon: 'megaphone' },
];

const CONTENT_LABELS = {
  opportunity: 'Opportunity',
  motivation:  'Motivation',
  document:    'Library document',
};

/* ── Inline SVG icon set ── */
const ICONS = {
  grid:      'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  building:  'M5 21V5l7-3 7 3v16M9 21v-4h6v4M9 8h2M13 8h2M9 12h2M13 12h2',
  book:      'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7',
  users:     'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M15.5 4.2a3.5 3.5 0 0 1 0 6.6',
  megaphone: 'M3 11v3a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12',
  logout:    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  menu:      'M4 6h16M4 12h16M4 18h16',
  search:    'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  cap:       'M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 2.5 9 2.5 12 0v-5',
  plus:      'M12 5v14M5 12h14',
  arrow:     'M5 12h14M13 6l6 6-6 6',
  mail:      'M4 6h16v12H4zM4 7l8 6 8-6',
  lock:      'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  home:      'M3 11 12 3l9 8M5 10v10h14V10',
};

function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name] || ''} />
    </svg>
  );
}

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

/* ── Shared fetch wrapper ── */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Cannot reach the server. Make sure the backend is running.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/* ════════════════ LOGIN ════════════════
   Department heads live in their own table, so the main /auth form
   (which checks `users`) cannot sign them in. They sign in here. */
function Login({ onLoggedIn, notice }) {
  const [form,  setForm]  = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dh-login-wrap">
      <div className="dh-login-card">
        <aside className="dh-login-art">
          <span className="dh-brand-mark"><Icon name="cap" size={22} /></span>
          <h2>Wollo Info Hub</h2>
          <p>Your department, in one place. Keep courses, announcements and student interest up to date.</p>
          <ul>
            <li><Icon name="book" size={16} /> Manage courses and prerequisites</li>
            <li><Icon name="users" size={16} /> See who is interested in your department</li>
            <li><Icon name="megaphone" size={16} /> Publish opportunities and advice</li>
          </ul>
        </aside>

        <form className="dh-login" onSubmit={submit}>
          <h1>Department head sign in</h1>
          <p className="dh-login-sub">Use the email and password your administrator created for you.</p>

          {notice && !error && <div className="dh-notice" role="status">{notice}</div>}
          {error && <div className="dh-error" role="alert">{error}</div>}

          <label>
            Email
            <span className="dh-input-icon">
              <Icon name="mail" size={16} />
              <input type="email" required autoComplete="email" placeholder="head@wollo.edu.et"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </span>
          </label>
          <label>
            Password
            <span className="dh-input-icon">
              <Icon name="lock" size={16} />
              <input type="password" required autoComplete="current-password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </span>
          </label>

          <button className="dh-btn dh-btn-block" disabled={busy}>
            {busy ? <span className="dh-spinner dh-spinner-light" /> : <>Sign in <Icon name="arrow" size={16} /></>}
          </button>
          <Link to="/" className="dh-back"><Icon name="home" size={15} /> Back to website</Link>
        </form>
      </div>
    </div>
  );
}

/* ════════════════ OVERVIEW ════════════════ */
function Overview({ me, stats, goTo }) {
  const cards = [
    { label: 'Interested students',    value: stats.students ?? 0,     icon: 'users',     tone: 'blue'   },
    { label: 'Courses listed',         value: stats.courses  ?? 0,     icon: 'book',      tone: 'teal'   },
    { label: 'Content items',          value: stats.content  ?? 0,     icon: 'megaphone', tone: 'amber'  },
    { label: 'Graduates',              value: me.graduates_count ?? 0, icon: 'cap',       tone: 'violet' },
    { label: 'Program length (years)', value: me.duration_years  ?? 0, icon: 'building',  tone: 'rose'   },
  ];

  return (
    <>
      <section className="dh-hero">
        <div>
          <span className="dh-hero-eyebrow">{me.department_name} department</span>
          <h2>{greeting()}, {me.name}</h2>
          <p>Here is how your department looks to students today.</p>
          <div className="dh-hero-actions">
            <button className="dh-btn dh-btn-light" onClick={() => goTo('courses')}>
              <Icon name="plus" size={15} /> Add a course
            </button>
            <button className="dh-btn dh-btn-outline" onClick={() => goTo('content')}>
              <Icon name="megaphone" size={15} /> Publish content
            </button>
          </div>
        </div>
        <span className="dh-hero-icon"><Icon name="cap" size={64} /></span>
      </section>

      <div className="dh-stats">
        {cards.map(c => (
          <div className={`dh-stat tone-${c.tone}`} key={c.label}>
            <span className="dh-stat-icon"><Icon name={c.icon} /></span>
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ════════════════ DEPARTMENT INFO ════════════════ */
function Info({ me, reload, notify }) {
  const [form, setForm] = useState({
    description:     me.description     || '',
    graduates_count: me.graduates_count ?? 0,
    duration_years:  me.duration_years  ?? 4,
  });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiFetch('/department', { method: 'PUT', body: JSON.stringify(form) });
      notify('Department info saved.');
      reload();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="dh-head">
        <h2 className="dh-title">Department info</h2>
        <p className="dh-sub">Students see this on the {me.department_name} page.</p>
      </header>
      <form className="dh-card dh-form" onSubmit={save}>
        <label>
          About the department
          <textarea
            rows={6}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what makes this department special…"
          />
        </label>
        <div className="dh-row">
          <label>
            Number of graduates
            <input type="number" min="0"
              value={form.graduates_count}
              onChange={e => setForm({ ...form, graduates_count: e.target.value })}
            />
          </label>
          <label>
            Duration (years)
            <input type="number" min="1" max="8"
              value={form.duration_years}
              onChange={e => setForm({ ...form, duration_years: e.target.value })}
            />
          </label>
        </div>
        <div className="dh-actions">
          <button className="dh-btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </>
  );
}

/* ════════════════ COURSES ════════════════ */
function Courses({ notify, refreshStats }) {
  const [courses,     setCourses]     = useState([]);
  const [form,        setForm]        = useState({ course_name: '', prerequisites: '' });
  const [editingId,   setEditingId]   = useState(null);
  const [busy,        setBusy]        = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const load = useCallback(async () => {
    setLoadingList(true);
    try {
      setCourses(await apiFetch('/courses'));
    } catch (err) {
      notify(err.message, true);
    } finally {
      setLoadingList(false);
    }
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const reset = () => { setForm({ course_name: '', prerequisites: '' }); setEditingId(null); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) {
        await apiFetch(`/courses/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
        notify('Course updated.');
      } else {
        await apiFetch('/courses', { method: 'POST', body: JSON.stringify(form) });
        notify('Course added.');
      }
      reset(); load(); refreshStats();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await apiFetch(`/courses/${id}`, { method: 'DELETE' });
      notify('Course deleted.'); load(); refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <>
      <header className="dh-head">
        <h2 className="dh-title">Courses and prerequisites</h2>
        <p className="dh-sub">{editingId ? 'Editing a course.' : 'Add the courses students will take.'}</p>
      </header>

      <form className={`dh-card dh-form ${editingId ? 'is-editing' : ''}`} onSubmit={submit}>
        <div className="dh-row">
          <label>
            Course name *
            <input required value={form.course_name}
              onChange={e => setForm({ ...form, course_name: e.target.value })}
              placeholder="e.g. Anatomy I"
            />
          </label>
          <label>
            Prerequisites
            <input value={form.prerequisites}
              onChange={e => setForm({ ...form, prerequisites: e.target.value })}
              placeholder="e.g. Biology, Chemistry"
            />
          </label>
        </div>
        <div className="dh-actions">
          <button className="dh-btn" disabled={busy}>
            <Icon name="plus" size={15} />
            {busy ? 'Saving…' : editingId ? 'Save course' : 'Add course'}
          </button>
          {editingId && (
            <button type="button" className="dh-btn dh-btn-ghost" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      <div className="dh-card dh-table-wrap">
        {loadingList ? (
          <p className="dh-empty"><span className="dh-spinner" />Loading courses…</p>
        ) : courses.length === 0 ? (
          <p className="dh-empty">No courses yet. Add the first one above.</p>
        ) : (
          <table className="dh-table">
            <thead><tr><th>Course</th><th>Prerequisites</th><th /></tr></thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td className="dh-strong">{c.course_name}</td>
                  <td className="dh-muted">{c.prerequisites || '—'}</td>
                  <td className="dh-cell-actions">
                    <button className="dh-link"
                      onClick={() => {
                        setEditingId(c.id);
                        setForm({ course_name: c.course_name, prerequisites: c.prerequisites || '' });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}>Edit</button>
                    <button className="dh-link dh-danger" onClick={() => remove(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ════════════════ STUDENTS ════════════════ */
function Students({ notify }) {
  const [students,    setStudents]    = useState([]);
  const [q,           setQ]           = useState('');
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    setLoadingList(true);
    apiFetch('/students')
      .then(setStudents)
      .catch(err => notify(err.message, true))
      .finally(() => setLoadingList(false));
  }, [notify]);

  const shown = students.filter(s =>
    `${s.name} ${s.email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <header className="dh-head">
        <h2 className="dh-title">Interested students</h2>
        <p className="dh-sub">Students who want to join your department.</p>
      </header>

      <div className="dh-search-wrap">
        <Icon name="search" size={16} />
        <input className="dh-search" placeholder="Search by name or email"
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div className="dh-card dh-table-wrap">
        {loadingList ? (
          <p className="dh-empty"><span className="dh-spinner" />Loading students…</p>
        ) : shown.length === 0 ? (
          <p className="dh-empty">{q ? `No results for "${q}".` : 'No interested students yet.'}</p>
        ) : (
          <table className="dh-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Chose on</th></tr></thead>
            <tbody>
              {shown.map((s, i) => (
                <tr key={s.id}>
                  <td className="dh-muted">{i + 1}</td>
                  <td>
                    <span className="dh-person">
                      <span className="dh-avatar">{initials(s.name)}</span>
                      <span className="dh-strong">{s.name}</span>
                    </span>
                  </td>
                  <td>{s.email}</td>
                  <td>{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

/* ════════════════ CONTENT ════════════════ */
function Content({ notify, refreshStats }) {
  const [items,       setItems]       = useState([]);
  const [form,        setForm]        = useState({ type: 'opportunity', title: '', body: '', link_url: '' });
  const [busy,        setBusy]        = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const load = useCallback(async () => {
    setLoadingList(true);
    try {
      setItems(await apiFetch('/content'));
    } catch (err) {
      notify(err.message, true);
    } finally {
      setLoadingList(false);
    }
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiFetch('/content', { method: 'POST', body: JSON.stringify(form) });
      notify('Published successfully.');
      setForm({ ...form, title: '', body: '', link_url: '' });
      load(); refreshStats();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await apiFetch(`/content/${id}`, { method: 'DELETE' });
      notify('Item deleted.'); load(); refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <>
      <header className="dh-head">
        <h2 className="dh-title">Opportunities, motivation &amp; library</h2>
        <p className="dh-sub">Share what helps students decide and succeed.</p>
      </header>

      <form className="dh-card dh-form" onSubmit={submit}>
        <div className="dh-row">
          <label>
            Type
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {Object.entries(CONTENT_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Title *
            <input required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Give it a clear title…"
            />
          </label>
        </div>
        <label>
          Details
          <textarea rows={4} value={form.body}
            onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Describe this opportunity or piece of advice…"
          />
        </label>
        <label>
          Link (optional)
          <input type="url" placeholder="https://…"
            value={form.link_url}
            onChange={e => setForm({ ...form, link_url: e.target.value })}
          />
        </label>
        <div className="dh-actions">
          <button className="dh-btn" disabled={busy}>
            <Icon name="plus" size={15} />
            {busy ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </form>

      <div className="dh-list">
        {loadingList ? (
          <p className="dh-empty dh-card"><span className="dh-spinner" />Loading…</p>
        ) : items.length === 0 ? (
          <p className="dh-empty dh-card">Nothing published yet.</p>
        ) : items.map(it => (
          <article className="dh-card dh-item" key={it.id}>
            <div>
              <span className={`dh-tag dh-tag-${it.type}`}>{CONTENT_LABELS[it.type] || it.type}</span>
              <h3>{it.title}</h3>
              {it.body && <p>{it.body}</p>}
              {it.link_url && (
                <a href={it.link_url} target="_blank" rel="noreferrer">Open link ↗</a>
              )}
            </div>
            <button className="dh-link dh-danger" onClick={() => remove(it.id)}>Delete</button>
          </article>
        ))}
      </div>
    </>
  );
}

/* ════════════════ PAGE SHELL ════════════════ */
export default function DepartmentHead() {
  const navigate = useNavigate();
  const [authed,   setAuthed]   = useState(!!localStorage.getItem(TOKEN_KEY));
  const [notice,   setNotice]   = useState('');
  const [tab,      setTab]      = useState('overview');
  const [me,       setMe]       = useState(null);
  const [stats,    setStats]    = useState({ students: 0, courses: 0, content: 0 });
  const [toast,    setToast]    = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const notify = useCallback((message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const logout = useCallback((message = '') => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setMe(null);
    setTab('overview');
    setNotice(typeof message === 'string' ? message : '');
  }, []);

  /* Log out button: clear the session and send the user to /auth */
  const signOut = useCallback(() => {
    logout();
    navigate('/auth', { replace: true });
  }, [logout, navigate]);

  const loadMe = useCallback(async () => {
    try {
      setMe(await apiFetch('/me'));
    } catch (err) {
      if (err.status === 401 || err.status === 403) logout('Your session ended. Please sign in again.');
      else notify(err.message, true);
    }
  }, [logout, notify]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await apiFetch('/stats'));
    } catch { /* stats are non-critical */ }
  }, []);

  useEffect(() => {
    if (authed) { loadMe(); loadStats(); }
  }, [authed, loadMe, loadStats]);

  if (!authed) return <Login notice={notice} onLoggedIn={() => { setNotice(''); setAuthed(true); }} />;

  if (!me) {
    return (
      <div className="dh-loading">
        <span className="dh-spinner" />
        Loading your department…
      </div>
    );
  }

  const current = TABS.find(t => t.id === tab);
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="dh-layout">
      {/* Mobile hamburger */}
      <button className="dh-burger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
        <Icon name="menu" size={20} />
      </button>

      {/* Backdrop */}
      {menuOpen && <div className="dh-scrim" onClick={() => setMenuOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`dh-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="dh-brand">
          <span className="dh-brand-mark"><Icon name="cap" size={20} /></span>
          <div>
            <strong>Wollo Info Hub</strong>
            <span>{me.department_name}</span>
          </div>
        </div>

        <nav>
          {TABS.map(t => (
            <button
              key={t.id}
              className={tab === t.id ? 'active' : ''}
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => { setTab(t.id); setMenuOpen(false); }}
            >
              <Icon name={t.icon} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="dh-user">
          <span className="dh-avatar dh-avatar-lg">{initials(me.name)}</span>
          <div>
            <strong>{me.name}</strong>
            <span>Department head</span>
          </div>
        </div>

        <button className="dh-logout" onClick={signOut}>
          <Icon name="logout" />
          Log out
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="dh-main">
        <div className="dh-topbar">
          <span className="dh-crumb">Dashboard <i>/</i> <b>{current?.label}</b></span>
          <span className="dh-date">{today}</span>
        </div>

        <div className="dh-main-inner" key={tab}>
          {tab === 'overview' && <Overview me={me} stats={stats} goTo={setTab} />}
          {tab === 'info'     && <Info     me={me} reload={loadMe} notify={notify} />}
          {tab === 'courses'  && <Courses  notify={notify} refreshStats={loadStats} />}
          {tab === 'students' && <Students notify={notify} />}
          {tab === 'content'  && <Content  notify={notify} refreshStats={loadStats} />}
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className={`dh-toast ${toast.isError ? 'error' : ''}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </div>
  );
}