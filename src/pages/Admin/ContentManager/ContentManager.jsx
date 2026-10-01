import { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE, request, Icon } from '../AdminShared/AdminShared';
import ContentEditor from './ContentEditor';
import MediaLibrary  from './MediaLibrary';
import './ContentManager.css';

const SECTIONS = [
  { slug: 'motivation',  label: 'Motivation',   icon: 'activity' },
  { slug: 'opportunity', label: 'Opportunities', icon: 'users'   },
  { slug: 'department',  label: 'Departments',   icon: 'shield'  },
];

const STATUS_TABS = ['all', 'draft', 'published', 'archived'];

function StatusBadge({ status }) {
  return <span className={`cm-badge cm-badge--${status}`}>{status}</span>;
}

function SkeletonCard() {
  return (
    <div className="cm-card cm-card--skeleton">
      <div className="cm-skeleton cm-skeleton--img" />
      <div className="cm-card-body">
        <div className="cm-skeleton" style={{ width: '60%', height: 14 }} />
        <div className="cm-skeleton" style={{ width: '40%', height: 12, marginTop: 6 }} />
      </div>
    </div>
  );
}

function ConfirmModal({ title, text, onConfirm, onCancel }) {
  return (
    <div className="cm-modal-backdrop" role="dialog" aria-modal="true">
      <div className="cm-modal">
        <h3 className="cm-modal-title">{title}</h3>
        <p className="cm-modal-text">{text}</p>
        <div className="cm-modal-actions">
          <button className="cm-btn cm-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="cm-btn cm-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function ContentManager({ token, section: sectionProp, onView }) {
  const [activeSlug, setActiveSlug] = useState(sectionProp || 'motivation');
  const [sections,   setSections]   = useState([]);
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [statusTab,  setStatusTab]  = useState('all');
  const [search,     setSearch]     = useState('');
  const [editing,    setEditing]    = useState(null);   // null | 'new' | item object
  const [deleting,   setDeleting]   = useState(null);   // item to confirm delete
  const [view,       setView]       = useState('content'); // 'content' | 'media'
  const [toast,      setToast]      = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // load sections list once
  useEffect(() => {
    setSections(SECTIONS);
  }, []);

  // load content items when slug or tab changes
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusTab !== 'all') params.set('status', statusTab);
      if (search.trim())       params.set('search', search.trim());

      // Fetch all and filter by slug client-side (since we don't know section_id upfront)
      const all = await request('GET', `/api/content?${params}`, null, token);
      const filtered = Array.isArray(all)
        ? all.filter(i => i.section_slug === activeSlug)
        : [];
      setItems(filtered);
    } catch (err) {
      // Graceful fallback — tables may not exist yet (run migration first)
      if (err.message?.includes('exist') || err.message?.includes('1146') || err.status === 500) {
        setError('Content tables not found. Run the SQL migration first:\nmysql -u root -p wollo-info-hub < Db/content_migration.sql');
      } else {
        setError(err.message || 'Failed to load content.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeSlug, statusTab, search, token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function handleDelete(item) {
    try {
      await request('DELETE', `/api/content/${item.id}`, null, token);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast('Content deleted.', 'success');
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    } finally {
      setDeleting(null);
    }
  }

  async function togglePublish(item) {
    const endpoint = item.status === 'published' ? 'unpublish' : 'publish';
    try {
      await request('PATCH', `/api/content/${item.id}/${endpoint}`, null, token);
      setItems(prev => prev.map(i =>
        i.id === item.id
          ? { ...i, status: endpoint === 'publish' ? 'published' : 'draft' }
          : i
      ));
      showToast(endpoint === 'publish' ? 'Published!' : 'Moved to draft.', 'success');
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    }
  }

  async function handleDuplicate(item) {
    try {
      const created = await request('POST', '/api/content', {
        section_id:     item.section_id,
        title:          `${item.title} (copy)`,
        body:           item.body,
        status:         'draft',
        cover_media_id: item.cover_media_id,
      }, token);
      setItems(prev => [created, ...prev]);
      showToast('Duplicated as draft.', 'success');
    } catch (err) {
      showToast(err.message || 'Duplicate failed.', 'error');
    }
  }

  function handleSaved(saved) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...prev[idx], ...saved };
        return next;
      }
      return [saved, ...prev];
    });
    setEditing(null);
    showToast('Saved.', 'success');
  }

  // If editing, show editor full-screen
  if (editing !== null) {
    const sectionObj = SECTIONS.find(s => s.slug === activeSlug);
    return (
      <ContentEditor
        item={editing === 'new' ? null : editing}
        sectionSlug={activeSlug}
        token={token}
        onSaved={handleSaved}
        onClose={() => setEditing(null)}
      />
    );
  }

  if (view === 'media') {
    return <MediaLibrary token={token} onClose={() => setView('content')} />;
  }

  const displayItems = items.filter(i => {
    if (statusTab !== 'all' && i.status !== statusTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return i.title?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="cm-page">
      {/* Toast */}
      {toast && (
        <div className={`cm-toast cm-toast--${toast.type}`} aria-live="polite">
          <Icon name={toast.type === 'success' ? 'check' : 'alert'} size={15} />
          {toast.msg}
        </div>
      )}

      {/* Confirm delete modal */}
      {deleting && (
        <ConfirmModal
          title="Delete content?"
          text={`"${deleting.title}" will be permanently deleted.`}
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}

      {/* Header */}
      <div className="cm-header">
        <div>
          <p className="cm-eyebrow">Content Manager</p>
          <h1 className="cm-title">
            {SECTIONS.find(s => s.slug === activeSlug)?.label || 'Content'}
          </h1>
        </div>
        <div className="cm-header-actions">
          <button
            className="cm-btn cm-btn--ghost"
            onClick={() => setView('media')}
          >
            <Icon name="image" size={15} /> Media Library
          </button>
          <button
            className="cm-btn cm-btn--primary"
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={15} /> New Content
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="cm-section-tabs" role="tablist">
        {SECTIONS.map(s => (
          <button
            key={s.slug}
            role="tab"
            aria-selected={activeSlug === s.slug}
            className={`cm-section-tab ${activeSlug === s.slug ? 'is-active' : ''}`}
            onClick={() => { setActiveSlug(s.slug); setStatusTab('all'); setSearch(''); }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="cm-toolbar">
        <div className="cm-status-tabs" role="tablist">
          {STATUS_TABS.map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={statusTab === t}
              className={`cm-status-tab ${statusTab === t ? 'is-active' : ''}`}
              onClick={() => setStatusTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="cm-search-wrap">
          <Icon name="search" size={15} />
          <input
            type="search"
            className="cm-search"
            placeholder="Search content…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search content"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="cm-error">
          <Icon name="alert" size={18} /> {error}
          <button className="cm-btn cm-btn--ghost" onClick={fetchItems}>Retry</button>
        </div>
      )}

      {/* Content grid */}
      <div className="cm-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : displayItems.length === 0
            ? (
              <div className="cm-empty">
                <div className="cm-empty-icon">📄</div>
                <p className="cm-empty-title">No content yet</p>
                <p className="cm-empty-sub">
                  {search ? `No results for "${search}"` : 'Click "New Content" to add something.'}
                </p>
                <button className="cm-btn cm-btn--primary" onClick={() => setEditing('new')}>
                  <Icon name="plus" size={15} /> New Content
                </button>
              </div>
            )
            : displayItems.map(item => (
              <div className="cm-card" key={item.id}>
                {/* Cover */}
                <div className="cm-card-cover">
                  {item.cover_url
                    ? <img src={item.cover_url} alt={item.title} loading="lazy" />
                    : <div className="cm-card-no-cover"><Icon name="image" size={28} /></div>
                  }
                  <StatusBadge status={item.status} />
                </div>

                {/* Body */}
                <div className="cm-card-body">
                  <h3 className="cm-card-title">{item.title}</h3>
                  <p className="cm-card-meta">
                    {item.status === 'published' && item.published_at
                      ? `Published ${new Date(item.published_at).toLocaleDateString()}`
                      : `Updated ${new Date(item.updated_at).toLocaleDateString()}`
                    }
                  </p>
                </div>

                {/* Actions */}
                <div className="cm-card-actions">
                  <button
                    className="cm-icon-btn"
                    title="Edit"
                    onClick={() => setEditing(item)}
                  >
                    <Icon name="edit" size={15} />
                  </button>
                  <button
                    className="cm-icon-btn"
                    title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                    onClick={() => togglePublish(item)}
                  >
                    <Icon name={item.status === 'published' ? 'eyeOff' : 'eye'} size={15} />
                  </button>
                  <button
                    className="cm-icon-btn"
                    title="Duplicate"
                    onClick={() => handleDuplicate(item)}
                  >
                    <Icon name="copy" size={15} />
                  </button>
                  <button
                    className="cm-icon-btn cm-icon-btn--danger"
                    title="Delete"
                    onClick={() => setDeleting(item)}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}
