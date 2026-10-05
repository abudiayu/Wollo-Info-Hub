import { useCallback, useEffect, useState } from 'react';
import './DepartmentHead.css';

const API = 'http://localhost:5000/api/department-head'; // change to your backend port
const TOKEN_KEY = 'dept_head_token';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'info', label: 'Department info' },
  { id: 'courses', label: 'Courses' },
  { id: 'students', label: 'Interested students' },
  { id: 'content', label: 'Content' },
];

const CONTENT_LABELS = {
  opportunity: 'Opportunity',
  motivation: 'Motivation',
  document: 'Library document',
};

async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong.');
    err.status = res.status;
    throw err;
  }
  return data;
}

/* ---------------- Login ---------------- */
function Login({ onLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api('/login', { method: 'POST', body: JSON.stringify(form) });
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
      <form className="dh-login" onSubmit={submit}>
        <h1>Department head sign in</h1>
        <p>Manage your department's information for Wollo University students.</p>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {error && <div className="dh-error" role="alert">{error}</div>}
        <button className="dh-btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview({ me, stats }) {
  const cards = [
    { label: 'Interested students', value: stats.students },
    { label: 'Courses listed', value: stats.courses },
    { label: 'Content items', value: stats.content },
    { label: 'Graduates', value: me.graduates_count },
    { label: 'Program length (years)', value: me.duration_years },
  ];
  return (
    <>
      <h2 className="dh-title">Welcome, {me.name}</h2>
      <p className="dh-sub">You are managing the {me.department_name} department.</p>
      <div className="dh-stats">
        {cards.map((c) => (
          <div className="dh-stat" key={c.label}>
            <strong>{c.value ?? 0}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Department info ---------------- */
function Info({ me, reload, notify }) {
  const [form, setForm] = useState({
    description: me.description || '',
    graduates_count: me.graduates_count ?? 0,
    duration_years: me.duration_years ?? 4,
  });

  const save = async (e) => {
    e.preventDefault();
    try {
      await api('/department', { method: 'PUT', body: JSON.stringify(form) });
      notify('Department info saved.');
      reload();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <>
      <h2 className="dh-title">Department info</h2>
      <p className="dh-sub">Students see this on the {me.department_name} page.</p>
      <form className="dh-card dh-form" onSubmit={save}>
        <label>
          About the department
          <textarea
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="dh-row">
          <label>
            Number of graduates
            <input
              type="number"
              min="0"
              value={form.graduates_count}
              onChange={(e) => setForm({ ...form, graduates_count: e.target.value })}
            />
          </label>
          <label>
            Duration (years)
            <input
              type="number"
              min="1"
              max="8"
              value={form.duration_years}
              onChange={(e) => setForm({ ...form, duration_years: e.target.value })}
            />
          </label>
        </div>
        <button className="dh-btn">Save changes</button>
      </form>
    </>
  );
}

/* ---------------- Courses ---------------- */
function Courses({ notify, refreshStats }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ course_name: '', prerequisites: '' });
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    try {
      setCourses(await api('/courses'));
    } catch (err) {
      notify(err.message, true);
    }
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const reset = () => {
    setForm({ course_name: '', prerequisites: '' });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api(`/courses/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
        notify('Course updated.');
      } else {
        await api('/courses', { method: 'POST', body: JSON.stringify(form) });
        notify('Course added.');
      }
      reset();
      load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api(`/courses/${id}`, { method: 'DELETE' });
      notify('Course deleted.');
      load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <>
      <h2 className="dh-title">Courses and prerequisites</h2>
      <form className="dh-card dh-form" onSubmit={submit}>
        <div className="dh-row">
          <label>
            Course name
            <input
              required
              value={form.course_name}
              onChange={(e) => setForm({ ...form, course_name: e.target.value })}
            />
          </label>
          <label>
            Prerequisites
            <input
              value={form.prerequisites}
              onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
              placeholder="e.g. Anatomy I, Biology"
            />
          </label>
        </div>
        <div className="dh-actions">
          <button className="dh-btn">{editingId ? 'Save course' : 'Add course'}</button>
          {editingId && (
            <button type="button" className="dh-btn dh-btn-ghost" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      <div className="dh-card dh-table-wrap">
        {courses.length === 0 ? (
          <p className="dh-empty">No courses yet. Add the first course above.</p>
        ) : (
          <table className="dh-table">
            <thead>
              <tr><th>Course</th><th>Prerequisites</th><th /></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.course_name}</td>
                  <td>{c.prerequisites || '—'}</td>
                  <td className="dh-cell-actions">
                    <button
                      className="dh-link"
                      onClick={() => {
                        setEditingId(c.id);
                        setForm({ course_name: c.course_name, prerequisites: c.prerequisites || '' });
                      }}
                    >
                      Edit
                    </button>
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

/* ---------------- Students ---------------- */
function Students({ notify }) {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api('/students').then(setStudents).catch((err) => notify(err.message, true));
  }, [notify]);

  const shown = students.filter((s) =>
    `${s.name} ${s.email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <h2 className="dh-title">Interested students</h2>
      <p className="dh-sub">Students who want to join your department.</p>
      <input
        className="dh-search"
        placeholder="Search by name or email"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="dh-card dh-table-wrap">
        {shown.length === 0 ? (
          <p className="dh-empty">No students found.</p>
        ) : (
          <table className="dh-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Chose on</th></tr>
            </thead>
            <tbody>
              {shown.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
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

/* ---------------- Content ---------------- */
function Content({ notify, refreshStats }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: 'opportunity', title: '', body: '', link_url: '' });

  const load = useCallback(async () => {
    try {
      setItems(await api('/content'));
    } catch (err) {
      notify(err.message, true);
    }
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/content', { method: 'POST', body: JSON.stringify(form) });
      notify('Published.');
      setForm({ ...form, title: '', body: '', link_url: '' });
      load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api(`/content/${id}`, { method: 'DELETE' });
      notify('Item deleted.');
      load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <>
      <h2 className="dh-title">Opportunities, motivation and library</h2>
      <form className="dh-card dh-form" onSubmit={submit}>
        <div className="dh-row">
          <label>
            Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(CONTENT_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
        </div>
        <label>
          Details
          <textarea
            rows={4}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
        </label>
        <label>
          Link (optional)
          <input
            type="url"
            placeholder="https://"
            value={form.link_url}
            onChange={(e) => setForm({ ...form, link_url: e.target.value })}
          />
        </label>
        <button className="dh-btn">Publish</button>
      </form>

      <div className="dh-list">
        {items.length === 0 && <p className="dh-empty">Nothing published yet.</p>}
        {items.map((it) => (
          <article className="dh-card dh-item" key={it.id}>
            <div>
              <span className={`dh-tag dh-tag-${it.type}`}>{CONTENT_LABELS[it.type]}</span>
              <h3>{it.title}</h3>
              {it.body && <p>{it.body}</p>}
              {it.link_url && (
                <a href={it.link_url} target="_blank" rel="noreferrer">Open link</a>
              )}
            </div>
            <button className="dh-link dh-danger" onClick={() => remove(it.id)}>Delete</button>
          </article>
        ))}
      </div>
    </>
  );
}

/* ---------------- Page shell ---------------- */
export default function DepartmentHead() {
  const [authed, setAuthed] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [tab, setTab] = useState('overview');
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({ students: 0, courses: 0, content: 0 });
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const notify = useCallback((message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setMe(null);
  }, []);

  const loadMe = useCallback(async () => {
    try {
      setMe(await api('/me'));
    } catch (err) {
      if (err.status === 401 || err.status === 403) logout();
      else notify(err.message, true);
    }
  }, [logout, notify]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await api('/stats'));
    } catch {
      /* stats are non-critical */
    }
  }, []);

  useEffect(() => {
    if (authed) {
      loadMe();
      loadStats();
    }
  }, [authed, loadMe, loadStats]);

  if (!authed) return <Login onLoggedIn={() => setAuthed(true)} />;
  if (!me) return <div className="dh-loading">Loading your department…</div>;

  return (
    <div className="dh-layout">
      <button className="dh-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        ☰
      </button>

      <aside className={`dh-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="dh-brand">
          <strong>Wollo Info Hub</strong>
          <span>{me.department_name}</span>
        </div>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => { setTab(t.id); setMenuOpen(false); }}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button className="dh-logout" onClick={logout}>Log out</button>
      </aside>

      <main className="dh-main">
        {tab === 'overview' && <Overview me={me} stats={stats} />}
        {tab === 'info' && <Info me={me} reload={loadMe} notify={notify} />}
        {tab === 'courses' && <Courses notify={notify} refreshStats={loadStats} />}
        {tab === 'students' && <Students notify={notify} />}
        {tab === 'content' && <Content notify={notify} refreshStats={loadStats} />}
      </main>

      {toast && (
        <div className={`dh-toast ${toast.isError ? 'error' : ''}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
