import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './DepartmentHead.css';
import Logo from '../../assets/wolloLogo.png';

const BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API = `${BASE}/api/department-head`;
const TOKEN_KEY = 'dept_head_token';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'info', label: 'Department info', icon: 'building' },
  { id: 'courses', label: 'Courses', icon: 'book' },
  { id: 'students', label: 'Interested students', icon: 'users' },
  { id: 'content', label: 'Content', icon: 'megaphone' },
];

const CONTENT_LABELS = {
  opportunity: 'Opportunity',
  motivation: 'Motivation',
  document: 'Library document',
};

const ICONS = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  building: 'M5 21V5l7-3 7 3v16M9 21v-4h6v4M9 8h2M13 8h2M9 12h2M13 12h2',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7',
  users: 'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M15.5 4.2a3.5 3.5 0 0 1 0 6.6',
  megaphone: 'M3 11v3a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  menu: 'M4 6h16M4 12h16M4 18h16',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  cap: 'M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 2.5 9 2.5 12 0v-5',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 18l-6-6 6-6',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  home: 'M3 11 12 3l9 8M5 10v10h14V10',
  edit: 'M4 20h4L19 9l-4-4L4 16v4z',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3',
  refresh: 'M20 11a8 8 0 0 0-14.8-4M4 5v4h4M4 13a8 8 0 0 0 14.8 4M20 19v-4h-4',
};

function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name] || ''} />
    </svg>
  );
}

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

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
    const err = new Error(
      data.message || data.error || `Request failed (${res.status})`
    );
    err.status = res.status;
    throw err;
  }

  return data;
}

/* =========================
   OVERVIEW
========================= */

function Overview({ me, stats, goTo }) {
  const cards = [
    {
      label: 'Interested students',
      value: stats.students ?? 0,
      icon: 'users',
      tone: 'blue',
    },
    {
      label: 'Courses listed',
      value: stats.courses ?? 0,
      icon: 'book',
      tone: 'teal',
    },
    {
      label: 'Content items',
      value: stats.content ?? 0,
      icon: 'megaphone',
      tone: 'amber',
    },
    {
      label: 'Graduates',
      value: me.graduates_count ?? 0,
      icon: 'cap',
      tone: 'violet',
    },
    {
      label: 'Program length',
      value: me.duration_years ?? 0,
      icon: 'building',
      tone: 'rose',
    },
  ];

  return (
    <>
      <div className="dh-page-header">
        <div>
          <p className="dh-eyebrow">Department console</p>
          <h1 className="dh-title">Department overview</h1>
          <p className="dh-subtitle">
            Manage your department information, courses, students and public content.
          </p>
        </div>

        <button className="dh-btn dh-btn-primary" onClick={() => goTo('content')}>
          <Icon name="plus" size={16} />
          Publish content
        </button>
      </div>

      <section className="dh-welcome">
        <div>
          <span className="dh-welcome-label">
            {me.department_name} Department
          </span>

          <h2>
            {greeting()}, {me.name}
          </h2>

          <p>
            Here is how your department looks to students today.
          </p>

          <div className="dh-welcome-actions">
            <button
              className="dh-btn dh-btn-light"
              onClick={() => goTo('courses')}
            >
              <Icon name="plus" size={15} />
              Add course
            </button>

            <button
              className="dh-btn dh-btn-outline"
              onClick={() => goTo('content')}
            >
              <Icon name="megaphone" size={15} />
              Publish content
            </button>
            <button
              className="dh-btn dh-btn-outline"
              onClick={() => goTo('content')}
            >
              <Icon name="megaphone" size={15} />
              Send To Manager
            </button>

          </div>
        </div>

        <div className="dh-welcome-icon">
          <Icon name="cap" size={70} />
        </div>
      </section>

      <div className="dh-stat-grid">
        {cards.map((card) => (
          <section className="dh-stat-card" key={card.label}>
            <div className={`dh-stat-icon dh-${card.tone}`}>
              <Icon name={card.icon} size={19} />
            </div>

            <div>
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </div>
          </section>
        ))}
      </div>

      <section className="dh-card dh-quick-card">
        <div className="dh-card-head">
          <div>
            <h2>Department management</h2>
            <p>Quick access to the most important department actions.</p>
          </div>
        </div>

        <div className="dh-quick-grid">
          <button onClick={() => goTo('info')}>
            <span className="dh-quick-icon">
              <Icon name="building" />
            </span>
            <span>
              <strong>Department info</strong>
              <small>Update public department information</small>
            </span>
            <Icon name="arrow" size={16} />
          </button>

          <button onClick={() => goTo('courses')}>
            <span className="dh-quick-icon">
              <Icon name="book" />
            </span>
            <span>
              <strong>Manage courses</strong>
              <small>Add, edit or remove courses</small>
            </span>
            <Icon name="arrow" size={16} />
          </button>

          <button onClick={() => goTo('students')}>
            <span className="dh-quick-icon">
              <Icon name="users" />
            </span>
            <span>
              <strong>Interested students</strong>
              <small>View students interested in your department</small>
            </span>
            <Icon name="arrow" size={16} />
          </button>

          <button onClick={() => goTo('content')}>
            <span className="dh-quick-icon">
              <Icon name="megaphone" />
            </span>
            <span>
              <strong>Public content</strong>
              <small>Publish opportunities and motivation</small>
            </span>
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </section>
    </>
  );
}

/* =========================
   DEPARTMENT INFO
========================= */

function Info({ me, reload, notify }) {
  const [form, setForm] = useState({
    description: me.description || '',
    graduates_count: me.graduates_count ?? 0,
    duration_years: me.duration_years ?? 4,
  });

  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await apiFetch('/department', {
        method: 'PUT',
        body: JSON.stringify(form),
      });

      notify('Department information saved successfully.');
      reload();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Department management"
        title="Department information"
        subtitle={`Students see this information on the ${me.department_name} page.`}
      />

      <form className="dh-card dh-form" onSubmit={save}>
        <div className="dh-card-head">
          <div>
            <h2>Public department information</h2>
            <p>Keep the information students see on the public page updated.</p>
          </div>
        </div>

        <label>
          About the department
          <textarea
            rows={7}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Describe what makes this department special..."
          />
        </label>

        <div className="dh-form-grid">
          <label>
            Number of graduates
            <input
              type="number"
              min="0"
              value={form.graduates_count}
              onChange={(e) =>
                setForm({
                  ...form,
                  graduates_count: e.target.value,
                })
              }
            />
          </label>

          <label>
            Duration (years)
            <input
              type="number"
              min="1"
              max="8"
              value={form.duration_years}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration_years: e.target.value,
                })
              }
            />
          </label>
        </div>

        <div className="dh-form-actions">
          <button className="dh-btn dh-btn-primary" disabled={busy}>
            {busy ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </>
  );
}

/* =========================
   COURSES
========================= */

function Courses({ notify, refreshStats }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_name: '',
    prerequisites: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const load = useCallback(async () => {
    setLoadingList(true);

    try {
      const data = await apiFetch('/courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      notify(err.message, true);
    } finally {
      setLoadingList(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setForm({
      course_name: '',
      prerequisites: '',
    });

    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (editingId) {
        await apiFetch(`/courses/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });

        notify('Course updated successfully.');
      } else {
        await apiFetch('/courses', {
          method: 'POST',
          body: JSON.stringify(form),
        });

        notify('Course added successfully.');
      }

      reset();
      await load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course?')) return;

    try {
      await apiFetch(`/courses/${id}`, {
        method: 'DELETE',
      });

      notify('Course deleted.');
      await load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Department management"
        title="Courses"
        subtitle="Add and manage the courses students will take."
      />

      <form
        className={`dh-card dh-form ${editingId ? 'dh-form-editing' : ''}`}
        onSubmit={submit}
      >
        <div className="dh-card-head">
          <div>
            <h2>{editingId ? 'Edit course' : 'Add a course'}</h2>
            <p>
              {editingId
                ? 'Update the selected course.'
                : 'Create a new course for your department.'}
            </p>
          </div>
        </div>

        <div className="dh-form-grid">
          <label>
            Course name *
            <input
              required
              value={form.course_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  course_name: e.target.value,
                })
              }
              placeholder="e.g. Anatomy I"
            />
          </label>

          <label>
            Prerequisites
            <input
              value={form.prerequisites}
              onChange={(e) =>
                setForm({
                  ...form,
                  prerequisites: e.target.value,
                })
              }
              placeholder="e.g. Biology, Chemistry"
            />
          </label>
        </div>

        <div className="dh-form-actions">
          <button className="dh-btn dh-btn-primary" disabled={busy}>
            <Icon name="plus" size={15} />
            {busy
              ? 'Saving...'
              : editingId
                ? 'Save course'
                : 'Add course'}
          </button>

          {editingId && (
            <button
              type="button"
              className="dh-btn dh-btn-secondary"
              onClick={reset}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="dh-card">
        <div className="dh-card-head">
          <div>
            <h2>Course directory</h2>
            <p>
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            className="dh-btn dh-btn-secondary dh-btn-small"
            onClick={load}
            disabled={loadingList}
          >
            <Icon name="refresh" size={15} />
            Refresh
          </button>
        </div>

        <div className="dh-table-wrap">
          {loadingList ? (
            <EmptyState loading text="Loading courses..." />
          ) : courses.length === 0 ? (
            <EmptyState text="No courses yet. Add the first course above." />
          ) : (
            <table className="dh-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Prerequisites</th>
                  <th className="dh-actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <strong>{course.course_name}</strong>
                    </td>

                    <td className="dh-muted">
                      {course.prerequisites || '—'}
                    </td>

                    <td>
                      <div className="dh-row-actions">
                        <button
                          className="dh-icon-btn"
                          title="Edit"
                          onClick={() => {
                            setEditingId(course.id);

                            setForm({
                              course_name: course.course_name,
                              prerequisites:
                                course.prerequisites || '',
                            });

                            window.scrollTo({
                              top: 0,
                              behavior: 'smooth',
                            });
                          }}
                        >
                          <Icon name="edit" size={15} />
                        </button>

                        <button
                          className="dh-icon-btn dh-icon-danger"
                          title="Delete"
                          onClick={() => remove(course.id)}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}

/* =========================
   STUDENTS
========================= */

function Students({ notify }) {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState('');
  const [loadingList, setLoadingList] = useState(true);

  const load = useCallback(async () => {
    setLoadingList(true);

    try {
      const data = await apiFetch('/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      notify(err.message, true);
    } finally {
      setLoadingList(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const shown = students.filter((student) =>
    `${student.name} ${student.email}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Student activity"
        title="Interested students"
        subtitle="Students who want to join your department."
      />

      <section className="dh-card dh-search-card">
        <div className="dh-search-wrap">
          <Icon name="search" size={17} />

          <input
            className="dh-search"
            placeholder="Search by name or email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {q && (
            <button
              className="dh-search-clear"
              onClick={() => setQ('')}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      <section className="dh-card">
        <div className="dh-card-head">
          <div>
            <h2>Student directory</h2>
            <p>
              {shown.length} student{shown.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            className="dh-btn dh-btn-secondary dh-btn-small"
            onClick={load}
            disabled={loadingList}
          >
            <Icon name="refresh" size={15} />
            Refresh
          </button>
        </div>

        <div className="dh-table-wrap">
          {loadingList ? (
            <EmptyState loading text="Loading students..." />
          ) : shown.length === 0 ? (
            <EmptyState
              text={
                q
                  ? `No results for "${q}".`
                  : 'No interested students yet.'
              }
            />
          ) : (
            <table className="dh-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Chose on</th>
                </tr>
              </thead>

              <tbody>
                {shown.map((student, index) => (
                  <tr key={student.id}>
                    <td className="dh-muted">{index + 1}</td>

                    <td>
                      <div className="dh-person">
                        <span className="dh-avatar">
                          {initials(student.name)}
                        </span>

                        <strong>{student.name}</strong>
                      </div>
                    </td>

                    <td>{student.email}</td>

                    <td>
                      {student.created_at
                        ? new Date(
                            student.created_at
                          ).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}

/* =========================
   CONTENT
========================= */

function Content({ notify, refreshStats }) {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    type: 'opportunity',
    title: '',
    body: '',
    link_url: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const load = useCallback(async () => {
    setLoadingList(true);

    try {
      const data = await apiFetch('/content');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      notify(err.message, true);
    } finally {
      setLoadingList(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setForm({
      type: 'opportunity',
      title: '',
      body: '',
      link_url: '',
    });

    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (editingId) {
        await apiFetch(`/content/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });

        notify('Content updated successfully.');
      } else {
        await apiFetch('/content', {
          method: 'POST',
          body: JSON.stringify(form),
        });

        notify('Published successfully.');
      }

      reset();
      await load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this content?')) return;

    try {
      await apiFetch(`/content/${id}`, {
        method: 'DELETE',
      });

      notify('Content deleted.');
      await load();
      refreshStats();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Public content"
        title="Content management"
        subtitle="Publish opportunities, motivation and useful library resources."
      />

      <section className="dh-card dh-form">
        <div className="dh-card-head">
          <div>
            <h2>{editingId ? 'Edit content' : 'Publish new content'}</h2>
            <p>
              Published content can be displayed on the department public page.
            </p>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="dh-form-grid">
            <label>
              Content type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              >
                {Object.entries(CONTENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Title *
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Give it a clear title..."
              />
            </label>
          </div>

          <label>
            Details
            <textarea
              rows={6}
              value={form.body}
              onChange={(e) =>
                setForm({
                  ...form,
                  body: e.target.value,
                })
              }
              placeholder="Write the content students should see..."
            />
          </label>

          <label>
            Link (optional)
            <input
              type="url"
              value={form.link_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  link_url: e.target.value,
                })
              }
              placeholder="https://..."
            />
          </label>

          <div className="dh-form-actions">
            <button
              className="dh-btn dh-btn-primary"
              disabled={busy}
            >
              <Icon name={editingId ? 'edit' : 'plus'} size={15} />

              {busy
                ? 'Saving...'
                : editingId
                  ? 'Update content'
                  : 'Publish content'}
            </button>

            {editingId && (
              <button
                type="button"
                className="dh-btn dh-btn-secondary"
                onClick={reset}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="dh-card">
        <div className="dh-card-head">
          <div>
            <h2>Published content</h2>
            <p>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            className="dh-btn dh-btn-secondary dh-btn-small"
            onClick={load}
            disabled={loadingList}
          >
            <Icon name="refresh" size={15} />
            Refresh
          </button>
        </div>

        <div className="dh-content-list">
          {loadingList ? (
            <EmptyState loading text="Loading content..." />
          ) : items.length === 0 ? (
            <EmptyState text="Nothing published yet." />
          ) : (
            items.map((item) => (
              <article className="dh-content-item" key={item.id}>
                <div className="dh-content-main">
                  <span
                    className={`dh-tag dh-tag-${item.type}`}
                  >
                    {CONTENT_LABELS[item.type] || item.type}
                  </span>

                  <h3>{item.title}</h3>

                  {item.body && <p>{item.body}</p>}

                  {item.link_url && (
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open link ↗
                    </a>
                  )}
                </div>

                <div className="dh-row-actions">
                  <button
                    className="dh-icon-btn"
                    title="Edit"
                    onClick={() => {
                      setEditingId(item.id);

                      setForm({
                        type: item.type || 'opportunity',
                        title: item.title || '',
                        body: item.body || '',
                        link_url: item.link_url || '',
                      });

                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                  >
                    <Icon name="edit" size={15} />
                  </button>

                  <button
                    className="dh-icon-btn dh-icon-danger"
                    title="Delete"
                    onClick={() => remove(item.id)}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}

/* =========================
   SHARED UI
========================= */

function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="dh-page-header">
      <div>
        <p className="dh-eyebrow">{eyebrow}</p>
        <h1 className="dh-title">{title}</h1>
        <p className="dh-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyState({ loading, text }) {
  return (
    <div className="dh-empty">
      {loading && <span className="dh-spinner" />}
      {!loading && <Icon name="grid" size={24} />}
      <p>{text}</p>
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function DepartmentHead() {
  const navigate = useNavigate();

  const [authed, setAuthed] = useState(
    !!localStorage.getItem(TOKEN_KEY)
  );

  const [tab, setTab] = useState('overview');
  const [me, setMe] = useState(null);

  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    content: 0,
  });

  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const notify = useCallback((message, isError = false) => {
    setToast({
      message,
      isError,
    });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setMe(null);
    setTab('overview');
  }, []);

  const signOut = useCallback(() => {
    logout();
    navigate('/auth', {
      replace: true,
    });
  }, [logout, navigate]);

  const loadMe = useCallback(async () => {
    try {
      setMe(await apiFetch('/me'));
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout();
      } else {
        notify(err.message, true);
      }
    }
  }, [logout, notify]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await apiFetch('/stats'));
    } catch {
      // Statistics are non-critical.
    }
  }, []);

  useEffect(() => {
    if (authed) {
      loadMe();
      loadStats();
    }
  }, [authed, loadMe, loadStats]);

  if (!authed) {
    return <Navigate to="/auth" replace />;
  }

  if (!me) {
    return (
      <div className="dh-loading">
        <span className="dh-spinner" />
        Loading your department...
      </div>
    );
  }

  const current = TABS.find((item) => item.id === tab);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="dh-app">

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className="dh-scrim"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <button
        className="dh-mobile-menu"
        onClick={() => setMenuOpen((value) => !value)}
        aria-label="Toggle menu"
      >
        <Icon name="menu" size={21} />
      </button>

      {/* Sidebar */}
      <aside className={`dh-sidebar ${menuOpen ? 'open' : ''}`}>

        <div className="dh-brand">
          <img
            src={Logo}
            alt="Wollo Info Hub"
            className="dh-brand-logo"
          />

          <div>
            <strong>Wollo Info Hub</strong>
            <span>{me.department_name}</span>
          </div>
        </div>

        <div className="dh-sidebar-section">
          <span className="dh-sidebar-label">
            Department
          </span>

          <nav className="dh-nav">
            {TABS.map((item) => (
              <button
                key={item.id}
                className={tab === item.id ? 'active' : ''}
                onClick={() => {
                  setTab(item.id);
                  setMenuOpen(false);
                }}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>

                {tab === item.id && (
                  <span className="dh-nav-active-dot" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="dh-sidebar-bottom">

          <div className="dh-user">
            <span className="dh-user-avatar">
              {initials(me.name)}
            </span>

            <div>
              <strong>{me.name}</strong>
              <span>Department Head</span>
            </div>
          </div>

          <button className="dh-logout" onClick={signOut}>
            <Icon name="logout" size={17} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dh-main">

        {/* Topbar */}
        <header className="dh-topbar">

          <div className="dh-topbar-left">
            <button
              className="dh-back-btn"
              onClick={() => navigate('/')}
            >
              <Icon name="arrowLeft" size={16} />
              <span>Back to site</span>
            </button>

            <span className="dh-top-divider" />

            <div className="dh-breadcrumb">
              <span>Dashboard</span>
              <i>/</i>
              <strong>{current?.label}</strong>
            </div>
          </div>

          <div className="dh-topbar-right">
            <span className="dh-date">
              {today}
            </span>

            <button
              className="dh-top-avatar"
              title={me.name}
            >
              {initials(me.name)}
            </button>
          </div>

        </header>

        {/* Content */}
        <main className="dh-content">

          {tab === 'overview' && (
            <Overview
              me={me}
              stats={stats}
              goTo={setTab}
            />
          )}

          {tab === 'info' && (
            <Info
              me={me}
              reload={loadMe}
              notify={notify}
            />
          )}

          {tab === 'courses' && (
            <Courses
              notify={notify}
              refreshStats={loadStats}
            />
          )}

          {tab === 'students' && (
            <Students notify={notify} />
          )}

          {tab === 'content' && (
            <Content
              notify={notify}
              refreshStats={loadStats}
            />
          )}

        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`dh-toast ${
            toast.isError ? 'error' : ''
          }`}
        >
          <span className="dh-toast-dot" />
          {toast.message}
        </div>
      )}
    </div>
  );
}