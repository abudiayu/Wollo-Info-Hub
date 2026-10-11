import React, { useMemo, useState, useEffect } from "react";
import "./Elibrary.css";

/* ------------------------------------------------------------------ */
/*  Sample data – replace with your API (e.g. fetch from Supabase).    */
/*  Each book: id, title, author, publisher, genre, tags[], series,    */
/*  year, addedDaysAgo, pages, format, description, url, cover(opt.)   */
/* ------------------------------------------------------------------ */
const SAMPLE_BOOKS = [
  { id: 1, title: "The NeuroICU Book", author: "Kiwon Lee", publisher: "McGraw-Hill", genre: "Critical Care", tags: ["Neurology", "ICU"], series: "", year: 2012, addedDaysAgo: 2, pages: 640, format: "PDF", description: "A practical bedside guide to neurocritical care, covering monitoring, emergencies and management protocols.", url: "#" },
  { id: 2, title: "Anesthesiology, Third Edition", author: "David Longnecker", publisher: "McGraw-Hill", genre: "Anesthesiology", tags: ["Surgery", "Pharmacology"], series: "", year: 2017, addedDaysAgo: 4, pages: 2100, format: "PDF", description: "A comprehensive reference on modern anesthesia practice, from physiology to subspecialty care.", url: "#" },
  { id: 3, title: "Tintinalli's Emergency Medicine Manual", author: "Rita K. Cydulka", publisher: "McGraw-Hill", genre: "Emergency Medicine", tags: ["Emergency", "Manual"], series: "Tintinalli", year: 2018, addedDaysAgo: 12, pages: 1100, format: "PDF", description: "Concise, high-yield emergency medicine reference for fast clinical decisions.", url: "#" },
  { id: 4, title: "Cardiac Surgery in the Adult", author: "Lawrence H. Cohn", publisher: "McGraw-Hill", genre: "Cardiology", tags: ["Surgery", "Heart"], series: "", year: 2011, addedDaysAgo: 30, pages: 1500, format: "PDF", description: "The standard text on adult cardiac surgery techniques and perioperative care.", url: "#" },
  { id: 5, title: "Pharmacotherapy Handbook", author: "Barbara G. Wells", publisher: "McGraw-Hill", genre: "Pharmacology", tags: ["Drugs", "Handbook"], series: "Pharmacotherapy", year: 2015, addedDaysAgo: 1, pages: 900, format: "PDF", description: "Evidence-based drug therapy recommendations for common diseases.", url: "#" },
  { id: 6, title: "Neurology Examination and Board Review", author: "Elizabeth Hartung", publisher: "Wiley", genre: "Neurology", tags: ["Exam", "Board Review"], series: "", year: 2016, addedDaysAgo: 6, pages: 480, format: "PDF", description: "Exam-focused neurology review with clinical cases and practice questions.", url: "#" },
  { id: 7, title: "Neonatal Cardiology", author: "Norman H. Silverman", publisher: "McGraw-Hill", genre: "Cardiology", tags: ["Pediatrics", "Heart"], series: "", year: 2010, addedDaysAgo: 20, pages: 760, format: "PDF", description: "Diagnosis and management of congenital heart disease in newborns.", url: "#" },
  { id: 8, title: "Pediatric Laboratory Medicine", author: "Sarah Jones", publisher: "Elsevier", genre: "Pediatrics", tags: ["Laboratory"], series: "", year: 2014, addedDaysAgo: 45, pages: 520, format: "PDF", description: "Reference ranges and interpretation of lab tests in children.", url: "#" },
  { id: 9, title: "Gray's Anatomy for Students", author: "Richard Drake", publisher: "Elsevier", genre: "Anatomy", tags: ["Textbook", "Anatomy"], series: "Gray's", year: 2019, addedDaysAgo: 3, pages: 1100, format: "PDF", description: "A clear, clinically oriented introduction to human anatomy.", url: "#" },
  { id: 10, title: "Clean Code with JavaScript", author: "Robert Martin", publisher: "Pearson", genre: "Computer Science", tags: ["Programming", "Web"], series: "", year: 2020, addedDaysAgo: 5, pages: 430, format: "PDF", description: "Principles for writing readable, maintainable JavaScript.", url: "#" },
  { id: 11, title: "Database System Concepts", author: "Abraham Silberschatz", publisher: "McGraw-Hill", genre: "Computer Science", tags: ["Database", "SQL"], series: "", year: 2019, addedDaysAgo: 18, pages: 1376, format: "PDF", description: "Foundational theory and practice of modern database systems.", url: "#" },
  { id: 12, title: "Engineering Mechanics: Statics", author: "R. C. Hibbeler", publisher: "Pearson", genre: "Engineering", tags: ["Mechanics", "Textbook"], series: "Engineering Mechanics", year: 2016, addedDaysAgo: 9, pages: 700, format: "PDF", description: "Core statics concepts with step-by-step problem solving.", url: "#" },
  { id: 13, title: "Principles of Economics", author: "N. Gregory Mankiw", publisher: "Cengage", genre: "Economics", tags: ["Textbook", "Business"], series: "", year: 2017, addedDaysAgo: 60, pages: 880, format: "PDF", description: "An accessible introduction to micro and macroeconomics.", url: "#" },
  { id: 14, title: "Crop Production Science", author: "Mark Wood", publisher: "Wiley", genre: "Agriculture", tags: ["Crops", "Field"], series: "", year: 2013, addedDaysAgo: 7, pages: 390, format: "PDF", description: "Modern methods for sustainable crop production.", url: "#" },
  { id: 15, title: "Introduction to Law", author: "Jenny Martin", publisher: "Oxford", genre: "Law", tags: ["Textbook", "Legal"], series: "", year: 2018, addedDaysAgo: 25, pages: 410, format: "PDF", description: "A foundation in legal reasoning, systems and institutions.", url: "#" },
  { id: 16, title: "Emergency Medical Services Handbook", author: "Daniel Limmer", publisher: "Pearson", genre: "Emergency Medicine", tags: ["Handbook", "Emergency"], series: "", year: 2015, addedDaysAgo: 14, pages: 650, format: "PDF", description: "Field-ready protocols for emergency medical responders.", url: "#" },
];

const TABS = [
  { key: "all", label: "All Books", facet: "genre" },
  { key: "recent", label: "Last 7 days", facet: "genre" },
  { key: "authors", label: "Authors", facet: "author" },
  { key: "publishers", label: "Publishers", facet: "publisher" },
  { key: "genres", label: "Genres", facet: "genre" },
  { key: "tags", label: "Tags", facet: "tags" },
  { key: "series", label: "Series", facet: "series" },
  { key: "years", label: "Publish Years", facet: "year" },
];

const FACET_TITLE = {
  genre: "Genres",
  author: "Authors",
  publisher: "Publishers",
  tags: "Tags",
  series: "Series",
  year: "Publish Years",
};

const COVER_COLORS = [
  ["#1d4ed8", "#38bdf8"],
  ["#0f766e", "#2dd4bf"],
  ["#7c3aed", "#a78bfa"],
  ["#be123c", "#fb7185"],
  ["#b45309", "#fbbf24"],
  ["#0369a1", "#7dd3fc"],
  ["#15803d", "#86efac"],
  ["#334155", "#94a3b8"],
];

const PAGE_SIZE = 8;

/* ------------------------------ icons ------------------------------ */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const SearchIcon = () => <Icon d={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />;
const GridIcon = () => <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />;
const ListIcon = () => <Icon d={<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>} />;
const BookIcon = ({ size }) => <Icon size={size} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>} />;
const CloseIcon = () => <Icon d={<path d="M18 6 6 18M6 6l12 12" />} />;
const DownloadIcon = () => <Icon d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>} />;
const FilterIcon = () => <Icon d={<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />} />;

/* ----------------------------- helpers ----------------------------- */
const hashColor = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
};

function Cover({ book, large = false }) {
  const [c1, c2] = hashColor(book.title);
  if (book.cover) {
    return (
      <div className={`elib-cover ${large ? "elib-cover--lg" : ""}`}>
        <img src={book.cover} alt={book.title} loading="lazy" />
      </div>
    );
  }
  return (
    <div
      className={`elib-cover elib-cover--gen ${large ? "elib-cover--lg" : ""}`}
      style={{ background: `linear-gradient(145deg, ${c1}, ${c2})` }}
    >
      <span className="elib-cover__spine" />
      <span className="elib-cover__genre">{book.genre}</span>
      <strong className="elib-cover__title">{book.title}</strong>
      <span className="elib-cover__author">{book.author}</span>
    </div>
  );
}

/* ----------------------------- component --------------------------- */
function Elibrary({ books = SAMPLE_BOOKS }) {
  const [tab, setTab] = useState("all");
  const [facetValue, setFacetValue] = useState(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = TABS.find((t) => t.key === tab);
  const facet = activeTab.facet;

  const valuesOf = (book, f) => {
    const v = book[f];
    if (Array.isArray(v)) return v;
    return v === "" || v === undefined || v === null ? [] : [String(v)];
  };

  // Books limited by the tab (e.g. last 7 days)
  const tabBooks = useMemo(
    () => (tab === "recent" ? books.filter((b) => b.addedDaysAgo <= 7) : books),
    [books, tab]
  );

  // Sidebar facet list with counts
  const facetList = useMemo(() => {
    const map = new Map();
    tabBooks.forEach((b) => valuesOf(b, facet).forEach((v) => map.set(v, (map.get(v) || 0) + 1)));
    const arr = [...map.entries()].map(([name, count]) => ({ name, count }));
    return facet === "year"
      ? arr.sort((a, b) => Number(b.name) - Number(a.name))
      : arr.sort((a, b) => a.name.localeCompare(b.name));
  }, [tabBooks, facet]);

  // Final filtered books
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tabBooks.filter((b) => {
      if (facetValue && !valuesOf(b, facet).includes(facetValue)) return false;
      if (!q) return true;
      return [b.title, b.author, b.publisher, b.genre, ...(b.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [tabBooks, facet, facetValue, query]);

  useEffect(() => setVisible(PAGE_SIZE), [tab, facetValue, query]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const changeTab = (key) => {
    setTab(key);
    setFacetValue(null);
  };

  const shown = filtered.slice(0, visible);

  return (
    <div className="elib">
      {/* ------------------------------ hero ------------------------------ */}
      <section className="elib-hero">
        <div className="elib-hero__inner">
          <span className="elib-pill">Wollo University</span>
          <h1>E-Library</h1>
          <p>
            Browse textbooks, references and study materials shared by your
            departments. Search by title, author or subject and start reading.
          </p>

          <div className="elib-search elib-search--hero">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search books, authors, subjects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="button" onClick={() => setVisible(PAGE_SIZE)}>Go!</button>
          </div>

          <div className="elib-stats">
            <div><strong>{books.length}</strong><span>Books</span></div>
            <div><strong>{new Set(books.map((b) => b.genre)).size}</strong><span>Genres</span></div>
            <div><strong>{new Set(books.map((b) => b.author)).size}</strong><span>Authors</span></div>
          </div>
        </div>
      </section>

      {/* ----------------------------- toolbar ---------------------------- */}
      <div className="elib-toolbar">
        <div className="elib-toolbar__inner">
          <div className="elib-brand"><BookIcon size={22} /> <span>Library</span></div>

          <nav className="elib-tabs" aria-label="Browse library">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`elib-tab ${tab === t.key ? "is-active" : ""}`}
                onClick={() => changeTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="elib-views">
            <button type="button" className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><GridIcon /></button>
            <button type="button" className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="List view"><ListIcon /></button>
          </div>
        </div>
      </div>

      {/* ------------------------------ body ------------------------------ */}
      <div className="elib-body">
        <button type="button" className="elib-filter-toggle" onClick={() => setSidebarOpen((s) => !s)}>
          <FilterIcon /> {FACET_TITLE[facet]}
          {facetValue ? `: ${facetValue}` : ""}
        </button>

        {/* sidebar */}
        <aside className={`elib-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <div className="elib-sidebar__head">{FACET_TITLE[facet]}</div>
          <ul>
            <li>
              <button
                type="button"
                className={!facetValue ? "is-active" : ""}
                onClick={() => { setFacetValue(null); setSidebarOpen(false); }}
              >
                <BookIcon size={16} />
                <span>All</span>
                <em>{tabBooks.length}</em>
              </button>
            </li>
            {facetList.map((f) => (
              <li key={f.name}>
                <button
                  type="button"
                  className={facetValue === f.name ? "is-active" : ""}
                  onClick={() => { setFacetValue(f.name); setSidebarOpen(false); }}
                >
                  <BookIcon size={16} />
                  <span>{f.name}</span>
                  <em>{f.count}</em>
                </button>
              </li>
            ))}
            {facetList.length === 0 && <li className="elib-sidebar__empty">Nothing to show here yet.</li>}
          </ul>
        </aside>

        {/* books */}
        <main className="elib-main">
          <div className="elib-main__head">
            <h2>
              {facetValue || activeTab.label}
              <small>{filtered.length} {filtered.length === 1 ? "book" : "books"}</small>
            </h2>
            {facetValue && (
              <button type="button" className="elib-clear" onClick={() => setFacetValue(null)}>
                Clear filter <CloseIcon />
              </button>
            )}
          </div>

          {shown.length === 0 ? (
            <div className="elib-empty">
              <BookIcon size={42} />
              <h3>No books found</h3>
              <p>Try a different search or browse another category.</p>
            </div>
          ) : (
            <div className={`elib-books elib-books--${view}`}>
              {shown.map((b) => (
                <article key={b.id} className="elib-card" onClick={() => setSelected(b)} tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(b)}>
                  <Cover book={b} />
                  <div className="elib-card__info">
                    <h3 title={b.title}>{b.title}</h3>
                    <p className="elib-card__author">{b.author}</p>
                    <p className="elib-card__meta">{b.publisher} · {b.year}</p>
                    <div className="elib-card__tags">
                      <span className="elib-tag elib-tag--main">{b.genre}</span>
                      {view === "list" && b.tags.map((t) => <span key={t} className="elib-tag">{t}</span>)}
                    </div>
                    {view === "list" && <p className="elib-card__desc">{b.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}

          {visible < filtered.length && (
            <div className="elib-more">
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more books
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------ modal ----------------------------- */}
      {selected && (
        <div className="elib-modal" onClick={() => setSelected(null)}>
          <div className="elib-modal__box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="elib-modal__close" onClick={() => setSelected(null)} aria-label="Close">
              <CloseIcon />
            </button>
            <div className="elib-modal__cover"><Cover book={selected} large /></div>
            <div className="elib-modal__content">
              <span className="elib-pill">{selected.genre}</span>
              <h2>{selected.title}</h2>
              <p className="elib-modal__author">by {selected.author}</p>
              <p className="elib-modal__desc">{selected.description}</p>

              <dl className="elib-modal__facts">
                <div><dt>Publisher</dt><dd>{selected.publisher}</dd></div>
                <div><dt>Year</dt><dd>{selected.year}</dd></div>
                <div><dt>Pages</dt><dd>{selected.pages}</dd></div>
                <div><dt>Format</dt><dd>{selected.format}</dd></div>
                {selected.series && <div><dt>Series</dt><dd>{selected.series}</dd></div>}
              </dl>

              <div className="elib-card__tags">
                {selected.tags.map((t) => <span key={t} className="elib-tag">{t}</span>)}
              </div>

              <div className="elib-modal__actions">
                <a className="elib-btn elib-btn--primary" href={selected.url} target="_blank" rel="noreferrer">
                  <BookIcon size={16} /> Read online
                </a>
                <a className="elib-btn elib-btn--ghost" href={selected.url} download>
                  <DownloadIcon /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Elibrary;