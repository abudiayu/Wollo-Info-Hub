import { useState, useRef, useCallback } from 'react';
import { API_BASE, Icon } from '../AdminShared/AdminShared';
import './ContentManager.css';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ mime }) {
  if (mime?.startsWith('image/')) return <span className="cm-file-icon cm-file-icon--img">🖼</span>;
  if (mime?.includes('pdf'))       return <span className="cm-file-icon cm-file-icon--pdf">📄</span>;
  return <span className="cm-file-icon">📎</span>;
}

export default function UploadZone({ token, onPick, folderId }) {
  const [files,    setFiles]    = useState([]);   // { file, id, progress, status, url, media }
  const [dragging, setDragging] = useState(false);
  const inputRef   = useRef(null);
  const folderRef  = useRef(null);
  const counter    = useRef(0);

  function readToken() {
    if (token) return token;
    for (const key of ['wou_token','token']) {
      const v = localStorage.getItem(key);
      if (v) return v.replace(/^"|"$/g,'');
    }
    return '';
  }

  async function uploadFile(fileEntry) {
    const id  = ++counter.current;
    const tok = readToken();

    setFiles(prev => [...prev, {
      id, file: fileEntry, progress: 0, status: 'uploading', url: null, media: null,
      preview: fileEntry.type.startsWith('image/') ? URL.createObjectURL(fileEntry) : null,
    }]);

    const form = new FormData();
    form.append('files', fileEntry);
    if (folderId) form.append('folder_id', folderId);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/api/media/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${tok}`);

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: pct } : f));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201) {
          const data = JSON.parse(xhr.responseText);
          const media = Array.isArray(data) ? data[0] : data;
          setFiles(prev => prev.map(f => f.id === id
            ? { ...f, progress: 100, status: 'done', url: media.url, media }
            : f
          ));
          resolve(media);
        } else {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' } : f));
          resolve(null);
        }
      };
      xhr.onerror = () => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' } : f));
        resolve(null);
      };

      xhr.send(form);
    });
  }

  const processFiles = useCallback(async (fileList) => {
    for (const f of Array.from(fileList)) {
      await uploadFile(f);
    }
  }, [folderId, token]);

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dt = e.dataTransfer;
    if (dt.files.length) processFiles(dt.files);
  }

  // paste from clipboard
  function onPaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) uploadFile(f);
      }
    }
  }

  return (
    <div
      className={`cm-upload-zone ${dragging ? 'is-dragging' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onPaste={onPaste}
      tabIndex={0}
      aria-label="Upload zone — drag and drop files here"
    >
      {/* Drop area */}
      <div className="cm-upload-prompt">
        <span className="cm-upload-icon">☁</span>
        <p className="cm-upload-text">Drag & drop files here, or paste an image</p>
        <div className="cm-upload-btns">
          <button
            type="button"
            className="cm-btn cm-btn--primary"
            onClick={() => inputRef.current?.click()}
          >
            <Icon name="plus" size={14} /> Choose files
          </button>
          <button
            type="button"
            className="cm-btn cm-btn--ghost"
            onClick={() => folderRef.current?.click()}
          >
            Choose folder
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={e => processFiles(e.target.files)}
        />
        <input
          ref={folderRef}
          type="file"
          multiple
          // eslint-disable-next-line react/no-unknown-property
          webkitdirectory="true"
          style={{ display: 'none' }}
          onChange={e => processFiles(e.target.files)}
        />
        <p className="cm-upload-hint">Images up to 5 MB · Files up to 20 MB</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="cm-upload-list">
          {files.map(f => (
            <li key={f.id} className="cm-upload-item">
              {f.preview
                ? <img src={f.preview} alt="" className="cm-upload-thumb" />
                : <FileIcon mime={f.file.type} />
              }
              <div className="cm-upload-info">
                <span className="cm-upload-name">{f.file.name}</span>
                <span className="cm-upload-size">{formatSize(f.file.size)}</span>
                {f.status === 'uploading' && (
                  <div className="cm-progress-bar">
                    <div className="cm-progress-fill" style={{ width: `${f.progress}%` }} />
                  </div>
                )}
                {f.status === 'error' && (
                  <span className="cm-upload-error">
                    Failed —{' '}
                    <button type="button" onClick={() => uploadFile(f.file)}>retry</button>
                  </span>
                )}
              </div>
              {f.status === 'done' && (
                <button
                  type="button"
                  className="cm-btn cm-btn--ghost cm-btn--sm"
                  onClick={() => onPick && onPick(f.media)}
                >
                  Use
                </button>
              )}
              {f.status === 'done' && <span className="cm-upload-done">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
