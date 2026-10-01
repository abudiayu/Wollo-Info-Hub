import { useState, useEffect, useRef, useCallback } from 'react';
import { request, Icon } from '../AdminShared/AdminShared';
import UploadZone from './UploadZone';
import './ContentManager.css';

const AUTOSAVE_MS = 15000; // 15 s

/* ── minimal rich-text toolbar (no external dep) ─────────────
   Uses document.execCommand for basic formatting.
   For production replace with Tiptap or React-Quill.         */
function RichTextBar({ editorRef }) {
  const cmd = (command, val) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val ?? null);
  };
  const btns = [
    { label: 'B',  title: 'Bold',          action: () => cmd('bold') },
    { label: 'I',  title: 'Italic',        action: () => cmd('italic') },
    { label: 'U',  title: 'Underline',     action: () => cmd('underline') },
    { label: 'H2', title: 'Heading 2',     action: () => cmd('formatBlock', 'h2') },
    { label: 'H3', title: 'Heading 3',     action: () => cmd('formatBlock', 'h3') },
    { label: 'P',  title: 'Paragraph',     action: () => cmd('formatBlock', 'p') },
    { label: '•',  title: 'Bullet list',   action: () => cmd('insertUnorderedList') },
    { label: '1.', title: 'Ordered list',  action: () => cmd('insertOrderedList') },
    { label: '←',  title: 'Align left',    action: () => cmd('justifyLeft') },
    { label: '↔',  title: 'Align center',  action: () => cmd('justifyCenter') },
    { label: '→',  title: 'Align right',   action: () => cmd('justifyRight') },
    { label: '🔗', title: 'Insert link',   action: () => {
        const url = prompt('URL:');
        if (url) cmd('createLink', url);
      }
    },
  ];
  return (
    <div className="cm-rte-bar" role="toolbar" aria-label="Text formatting">
      {btns.map(b => (
        <button
          key={b.title}
          type="button"
          className="cm-rte-btn"
          title={b.title}
          onMouseDown={e => { e.preventDefault(); b.action(); }}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

export default function ContentEditor({ item, sectionSlug, token, onSaved, onClose }) {
  const [title,      setTitle]      = useState(item?.title   || '');
  const [status,     setStatus]     = useState(item?.status  || 'draft');
  const [coverId,    setCoverId]    = useState(item?.cover_media_id || null);
  const [coverUrl,   setCoverUrl]   = useState(item?.cover_url     || null);
  const [gallery,    setGallery]    = useState([]);  // array of media ids
  const [saving,     setSaving]     = useState(false);
  const [dirty,      setDirty]      = useState(false);
  const [preview,    setPreview]    = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [versions,   setVersions]   = useState([]);
  const [showVer,    setShowVer]    = useState(false);
  const [toast,      setToast]      = useState(null);

  const editorRef  = useRef(null);
  const autoTimer  = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // initialise editor HTML
  useEffect(() => {
    if (editorRef.current && item?.body) {
      editorRef.current.innerHTML = item.body;
    }
  }, [item]);

  // autosave
  useEffect(() => {
    if (!dirty) return;
    autoTimer.current = setTimeout(() => handleSave('draft', true), AUTOSAVE_MS);
    return () => clearTimeout(autoTimer.current);
  }, [dirty, title]);

  // warn on unload
  useEffect(() => {
    const handler = e => {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // Ctrl+S
  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave('draft');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [title]);

  async function getSectionId() {
    // Try public API first, fall back to fetching sections list
    try {
      const data = await request('GET', `/api/public/sections/${sectionSlug}`, null, null);
      if (data?.section?.id) return data.section.id;
    } catch { /* ignore */ }
    // Fallback: fetch all content and find matching section_id
    try {
      const all = await request('GET', '/api/content', null, token);
      const match = Array.isArray(all) && all.find(i => i.section_slug === sectionSlug);
      if (match?.section_id) return match.section_id;
    } catch { /* ignore */ }
    return null;
  }

  async function handleSave(forcedStatus, isAuto = false) {
    if (!title.trim()) { showToast('Title is required.', 'error'); return; }
    setSaving(true);
    try {
      const bodyHtml = editorRef.current?.innerHTML || '';
      const payload  = {
        title,
        body:           bodyHtml,
        status:         forcedStatus || status,
        cover_media_id: coverId,
        gallery,
      };

      let saved;
      if (item?.id) {
        saved = await request('PUT', `/api/content/${item.id}`, payload, token);
      } else {
        const secId = await getSectionId();
        if (!secId) { showToast('Section not found.', 'error'); setSaving(false); return; }
        saved = await request('POST', '/api/content', { ...payload, section_id: secId }, token);
      }
      setDirty(false);
      setStatus(saved.status);
      if (!isAuto) onSaved(saved);
      else showToast('Auto-saved.', 'success');
    } catch (err) {
      showToast(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    await handleSave('draft');          // ensure saved first
    if (!item?.id) return;
    try {
      await request('PATCH', `/api/content/${item.id}/publish`, null, token);
      setStatus('published');
      showToast('Published!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function loadVersions() {
    if (!item?.id) return;
    const rows = await request('GET', `/api/content/${item.id}/versions`, null, token);
    setVersions(rows);
    setShowVer(true);
  }

  async function restoreVersion(verId) {
    if (!item?.id) return;
    try {
      const { restored } = await request('POST', `/api/content/${item.id}/restore/${verId}`, null, token);
      if (editorRef.current) editorRef.current.innerHTML = restored.body || '';
      setTitle(restored.title);
      setDirty(true);
      setShowVer(false);
      showToast('Version restored — save to keep it.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function onMediaPicked(media) {
    if (!coverId) {
      setCoverId(media.id);
      setCoverUrl(media.url);
    } else {
      setGallery(prev => [...prev, media.id]);
    }
    setShowUpload(false);
    setDirty(true);
  }

  return (
    <div className="cm-editor">
      {/* Toast */}
      {toast && (
        <div className={`cm-toast cm-toast--${toast.type}`}>{toast.msg}</div>
      )}

      {/* Top bar */}
      <div className="cm-editor-topbar">
        <button className="cm-btn cm-btn--ghost" onClick={() => {
          if (dirty && !confirm('Unsaved changes — leave anyway?')) return;
          onClose();
        }}>
          <Icon name="arrowLeft" size={15} /> Back
        </button>
        <span className="cm-editor-section-label">{sectionSlug}</span>
        <div className="cm-editor-topbar-right">
          <button className="cm-btn cm-btn--ghost" onClick={() => setPreview(p => !p)}>
            <Icon name={preview ? 'eyeOff' : 'eye'} size={15} />
            {preview ? 'Edit' : 'Preview'}
          </button>
          {item?.id && (
            <button className="cm-btn cm-btn--ghost" onClick={loadVersions}>
              History
            </button>
          )}
          <button
            className="cm-btn cm-btn--ghost"
            disabled={saving}
            onClick={() => handleSave('draft')}
          >
            {saving ? '…' : 'Save draft'}
          </button>
          <button
            className="cm-btn cm-btn--primary"
            disabled={saving}
            onClick={handlePublish}
          >
            Publish
          </button>
        </div>
      </div>

      <div className="cm-editor-body">
        {/* Left: main editor */}
        <div className="cm-editor-main">
          <input
            className="cm-title-input"
            placeholder="Content title…"
            value={title}
            onChange={e => { setTitle(e.target.value); setDirty(true); }}
          />

          {preview ? (
            <div
              className="cm-preview-pane"
              dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }}
            />
          ) : (
            <>
              <RichTextBar editorRef={editorRef} />
              <div
                ref={editorRef}
                className="cm-rte"
                contentEditable
                suppressContentEditableWarning
                onInput={() => setDirty(true)}
                aria-label="Content body"
                aria-multiline="true"
                role="textbox"
              />
            </>
          )}
        </div>

        {/* Right: sidebar */}
        <aside className="cm-editor-sidebar">
          {/* Cover image */}
          <div className="cm-sidebar-section">
            <p className="cm-sidebar-label">Cover image</p>
            {coverUrl
              ? (
                <div className="cm-cover-preview">
                  <img src={coverUrl} alt="Cover" />
                  <button
                    className="cm-cover-remove"
                    onClick={() => { setCoverId(null); setCoverUrl(null); setDirty(true); }}
                    aria-label="Remove cover"
                  >✕</button>
                </div>
              )
              : (
                <button
                  className="cm-btn cm-btn--ghost cm-btn--full"
                  onClick={() => setShowUpload(true)}
                >
                  <Icon name="image" size={15} /> Set cover
                </button>
              )
            }
          </div>

          {/* Gallery */}
          <div className="cm-sidebar-section">
            <p className="cm-sidebar-label">Gallery ({gallery.length})</p>
            <button
              className="cm-btn cm-btn--ghost cm-btn--full"
              onClick={() => setShowUpload(true)}
            >
              <Icon name="plus" size={14} /> Add image
            </button>
          </div>

          {/* Status */}
          <div className="cm-sidebar-section">
            <p className="cm-sidebar-label">Status</p>
            <select
              className="cm-select"
              value={status}
              onChange={e => { setStatus(e.target.value); setDirty(true); }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </aside>
      </div>

      {/* Upload zone overlay */}
      {showUpload && (
        <div className="cm-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowUpload(false); }}>
          <div className="cm-modal cm-modal--wide">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="cm-modal-title">Upload / pick media</h3>
              <button className="cm-icon-btn" onClick={() => setShowUpload(false)} aria-label="Close">✕</button>
            </div>
            <UploadZone
              token={token}
              onPick={onMediaPicked}
            />
          </div>
        </div>
      )}

      {/* Version history panel */}
      {showVer && (
        <div className="cm-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowVer(false); }}>
          <div className="cm-modal">
            <h3 className="cm-modal-title">Version history</h3>
            <ul className="cm-version-list">
              {versions.map(v => (
                <li key={v.id} className="cm-version-item">
                  <div>
                    <strong>{v.title}</strong>
                    <span className="cm-version-meta"> · {v.editor_name} · {new Date(v.created_at).toLocaleString()}</span>
                  </div>
                  <button
                    className="cm-btn cm-btn--ghost"
                    onClick={() => restoreVersion(v.id)}
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
            <div className="cm-modal-actions">
              <button className="cm-btn cm-btn--ghost" onClick={() => setShowVer(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
