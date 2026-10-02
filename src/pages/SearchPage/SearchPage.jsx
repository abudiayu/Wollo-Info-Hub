import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import './SearchPage.css';

const API = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const SECTION_LABELS = {
  motivation:  'Motivation',
  opportunity: 'Opportunities',
  department:  'Departments',
};

const SECTION_ROUTES = {
  motivation:  '/motivation',
  opportunity: '/opportunities',
  department:  '/departments',
};

export default function SearchPage() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const query           = searchParams.get('q') || '';

  const [input,   setInput]   = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [searched, setSearched] = useState('');
  const inputRef = useRef(null);

  /* Re-sync input when the URL query changes */
  useEffect(() => { setInput(query); }, [query]);

  /* Run search whenever the URL q param changes */
  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(''); return; }

    setLoading(true);
    setError('');
    setSearched(query);

    // Fan out to all 3 public sections in parallel, filter client-side by title/body
    const q = query.trim().toLowerCase();

    Promise.allSettled(
      ['motivation', 'opportunity', 'department'].map((slug) =>
        fetch(`${API}/api/public/sections/${slug}`)
          .then(r => r.ok ? r.json() : { items: [] })
      )
    )
      .then((settled) => {
        const all = [];
        const slugs = ['motivation', 'opportunity', 'department'];
        settled.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            const items = r.value?.items || [];
            items.forEach(item => {
              const inTitle = item.title?.toLowerCase().includes(q);
              const inBody  = item.body?.toLowerCase().includes(q);
              if (inTitle || inBody) {
                all.push({ ...item, sectionSlug: slugs[i] });
              }
            });
          }
        });
        setResults(all);
      })
      .catch(() => setError('Search failed. Please try again.'))
      .finally(() => setLoading(false));
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  /* Strip HTML tags for plain-text excerpt */
  function excerpt(html, len = 160) {
    if (!html) return '';
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return plain.length > len ? plain.slice(0, len) + '…' : plain;
  }

  /* Bold the query match inside a string */
  function highlight(text, q) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="sr-mark">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  }

  return (
    <div className="sr-page">
      <header className="sr-hero">
        <div className="sr-hero-inner">
          <nav className="sr-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>Search</span>
          </nav>
          <h1 className="sr-hero-title">Search</h1>

          {/* Search form */}
          <form className="sr-form" onSubmit={handleSubmit} role="search">
            <div className="sr-input-wrap">
              <svg className="sr-input-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8.5" cy="8.5" r="5.5"/>
                <line x1="13" y1="13" x2="18" y2="18"/>
              </svg>
              <input
                ref={inputRef}
                type="search"
                className="sr-input"
                placeholder="Search departments, stories, opportunities…"
                aria-label="Search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="sr-btn">Search</button>
          </form>
        </div>
      </header>

      <main className="sr-main">
        <div className="sr-container">

          {/* Status line */}
          {searched && !loading && (
            <p className="sr-status">
              {results.length === 0
                ? `No results for "${searched}"`
                : `${results.length} result${results.length !== 1 ? 's' : ''} for "${searched}"`
              }
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="sr-loading" aria-label="Searching…">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="sr-skeleton-card">
                  <div className="sr-skeleton sr-skeleton--tag" />
                  <div className="sr-skeleton sr-skeleton--title" />
                  <div className="sr-skeleton sr-skeleton--body" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && <p className="sr-error">{error}</p>}

          {/* Empty state */}
          {!loading && !error && searched && results.length === 0 && (
            <div className="sr-empty">
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="14" stroke="#9ca3af" strokeWidth="2"/>
                <line x1="30" y1="30" x2="42" y2="42" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="20" x2="26" y2="20" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Nothing matched your search. Try a different keyword.</p>
              <div className="sr-suggestions">
                <span>Try:</span>
                {['Medicine', 'Football', 'Engineering', 'Motivation'].map(s => (
                  <Link key={s} className="sr-suggestion" to={`/search?q=${encodeURIComponent(s)}`}>{s}</Link>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <ul className="sr-results" aria-label="Search results">
              {results.map((item) => (
                <li key={`${item.sectionSlug}-${item.id}`} className="sr-result-card">
                  <div className="sr-result-meta">
                    <Link
                      to={SECTION_ROUTES[item.sectionSlug]}
                      className="sr-section-tag"
                    >
                      {SECTION_LABELS[item.sectionSlug]}
                    </Link>
                    {item.published_at && (
                      <span className="sr-date">
                        {new Date(item.published_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="sr-result-title">
                    <Link to={SECTION_ROUTES[item.sectionSlug]}>
                      {highlight(item.title, searched)}
                    </Link>
                  </h2>
                  {item.body && (
                    <p className="sr-result-excerpt">
                      {highlight(excerpt(item.body), searched)}
                    </p>
                  )}
                  {item.cover_url && (
                    <img
                      src={item.cover_url}
                      alt=""
                      className="sr-result-thumb"
                      loading="lazy"
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* No query yet */}
          {!query && !loading && (
            <div className="sr-start">
              <p>Enter a keyword above to search across all published content.</p>
              <div className="sr-suggestions">
                <span>Popular:</span>
                {['Departments', 'Football', 'AppFactory', 'Scholarship', 'Alumni'].map(s => (
                  <Link key={s} className="sr-suggestion" to={`/search?q=${encodeURIComponent(s)}`}>{s}</Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
