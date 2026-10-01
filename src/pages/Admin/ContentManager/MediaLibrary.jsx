import { useState, useEffect, useCallback } from 'react';
import { request, Icon } from '../AdminShared/AdminShared';
import UploadZone from './UploadZone';
import './ContentManager.css';

function formatSize(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

export default function MediaLibrary({ token, onClose, onPick }) {
  const [files,      setFiles]      = useState([]);
  const [folders,    setFolders]    = useState([]);
  const [folderId,   setFolderId]   = useState(null);   // current folder
  const [breadcrumb, setBreadcrumb] = useState([]);     // [{id, name}]
  const [loading,    setLoading]    = useState(true);
  const [viewMode,   setViewMode]   = useState('grid'); // 'grid' | 'list'
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [preview,    setPreview]    = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [toast,      setToast]      = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (folderId !== null) params.set('folder_id', folderId ?? '');
      if (search.trim())     params.set('search', search.trim());
      if (typeFilter !== 'all') params.set('type', typeFilter);
      const data = await request('GET', `/api/media?${params}`, null, token);
      setFiles(data.files || []);
      setFolders(data.folders?.filter(f => f.parent_id === folderId) || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [folderId, search, typeFilter, token]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  function openFolder(folder) {
    setFolderId(folder.id);
    setBreadcrumb(prev => [...prev, { id: folder.id, name: folder.name }]);
  }

  function goToFolder(idx) {
    if (idx < 0) {
      setFolderId(null);
      setBreadcrumb([]);
    } else {
      const crumb = breadcrumb[idx];
      setFolderId(crumb.id);
      setBreadcrumb(prev => prev.slice(0, idx + 1));
    }
  }

  async function createFolder() {
    const name = prompt('Folder name:');
    if (!name?.trim()) return;
    try {
      const folder = await request('POST', '/api/media/folder', { name, parent_id: folderId }, token);
      setFolders(prev => [...prev, folder]);
      showToast('Folder created.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function deleteFile(file) {
    if (!confirm(`Delete "${file.original_name}"?`)) return;
    try {
      await request('DELETE', `/api/media/${file.id}`, null, token);
      setFiles(prev => prev.filter(f => f.id !== file.id));
      showToast('Deleted.', 'success');
      if (preview?.id === file.id) setPreview(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url).then(
      () => showToast('URL copied!', 'success'),
      () => showToast('Copy failed.', 'error')
    );
  }

  const isImage = (f) => f.mime_type?.startsWith('image/');

  return (
    <div className="cm-media-library">
      {toast && <div className={`cm-toast cm-toast--${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div className="cm-ml-header">
        <div className="cm-ml-header-left">
          <h2 className="cm-title">Media Library</h2>
          {/* Breadcrumb */}
          <nav className="cm-breadcrumb" aria-label="Folder path">
            <button onClick={() => goToFolder(-1)}>All files</button>
            {breadcrumb.map((c, i) => (
              <span key={c.id}>
                <span className="cm-bread-sep"> / </span>
                <button onClick={() => goToFolder(i)}>{c.name}</button>
              </span>
            ))}
          </nav>
        </div>
        <div className="cm-ml-header-right">
          <button className="cm-btn cm-btn--ghost" onClick={createFolder}>+ Folder</button>
          <button className="cm-btn cm-btn--primary" onClick={() => setShowUpload(v => !v)}>
            ↑ Upload
          </button>
          {onClose && (
            <button className="cm-icon-btn" onClick={onClose} aria-label="Close">
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Upload zone */}
      {showUpload && (
        <div style={{ margin: '0 0 16px' }}>
          <UploadZone
            token={token}
            folderId={folderId}
            onPick={(media) => {
              setFiles(prev => [media, ...prev]);
              setShowUpload(false);
            }}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="cm-ml-toolbar">
        <div className="cm-search-wrap" style={{ flex: 1, maxWidth: 320 }}>
          <Icon name="search" size={14} />
          <input
            type="search"
            className="cm-search"
            placeholder="Search files…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="cm-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="image">Images</option>
          <option value="file">Files</option>
        </select>
        <button
          className={`cm-icon-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
          title="Grid"
        >▦</button>
        <button
          className={`cm-icon-btn ${viewMode === 'list' ? 'is-active' : ''}`}
          onClick={() => setViewMode('list')}
          aria-label="List view"
          title="List"
        >☰</button>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="cm-folder-row">
          {folders.map(f => (
            <button key={f.id} className="cm-folder-btn" onClick={() => openFolder(f)}>
              📁 {f.name}
            </button>
          ))}
        </div>
      )}

      {/* Files */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'cm-ml-grid' : 'cm-ml-list'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="cm-ml-item cm-ml-item--skeleton">
              <div className="cm-skeleton" style={{ width: '100%', height: viewMode === 'grid' ? 100 : 32 }} />
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="cm-empty">
          <div className="cm-empty-icon">🖼</div>
          <p className="cm-empty-title">No files here</p>
          <p className="cm-empty-sub">Upload something to get started.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="cm-ml-grid">
          {files.map(f => (
            <div
              key={f.id}
              className="cm-ml-item"
              onClick={() => setPreview(f)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setPreview(f)}
              aria-label={f.original_name}
            >
              {isImage(f)
                ? <img src={f.url} alt={f.original_name} loading="lazy" />
                : <div className="cm-ml-file-icon">📄</div>
              }
              <p className="cm-ml-item-name">{f.original_name}</p>
            </div>
          ))}
        </div>
      ) : (
        <table className="cm-ml-table">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Size</th><th>Uploaded</th><th /></tr>
          </thead>
          <tbody>
            {files.map(f => (
              <tr key={f.id}>
                <td>
                  {isImage(f) && <img src={f.url} alt="" className="cm-ml-list-thumb" />}
                  {f.original_name}
                </td>
                <td>{f.mime_type}</td>
                <td>{formatSize(f.size)}</td>
                <td>{new Date(f.created_at).toLocaleDateString()}</td>
                <td className="cm-ml-actions">
                  <button className="cm-btn cm-btn--ghost cm-btn--sm" onClick={() => copyUrl(f.url)}>Copy URL</button>
                  {onPick && (
                    <button className="cm-btn cm-btn--primary cm-btn--sm" onClick={() => onPick(f)}>Insert</button>
                  )}
                  <button className="cm-icon-btn cm-icon-btn--danger" onClick={() => deleteFile(f)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="cm-modal-backdrop"
          onClick={e => { if (e.target === e.currentTarget) setPreview(null); }}
        >
          <div className="cm-modal cm-modal--wide">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 className="cm-modal-title">{preview.original_name}</h3>
              <button className="cm-icon-btn" onClick={() => setPreview(null)}>✕</button>
            </div>
            {isImage(preview) && (
              <img src={preview.url} alt={preview.original_name}
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
            )}
            <div className="cm-modal-actions" style={{ marginTop: 12 }}>
              <button className="cm-btn cm-btn--ghost" onClick={() => copyUrl(preview.url)}>Copy URL</button>
              {onPick && (
                <button className="cm-btn cm-btn--primary" onClick={() => { onPick(preview); setPreview(null); }}>
                  Insert into content
                </button>
              )}
              <button className="cm-btn cm-btn--ghost" onClick={() => deleteFile(preview)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
