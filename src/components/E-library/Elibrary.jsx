import React, { useMemo, useState, useEffect } from "react";
import "./Elibrary.css";

/* ------------------------------------------------------------------ */
/*  Faculties -> Departments (edit to match your database)             */
/* ------------------------------------------------------------------ */
const FACULTIES = {
  Informatics: ["Computer Science", "Information Technology", "Information Systems", "Software Engineering"],
  "Technology & Engineering": ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering"],
  "Medicine & Health Sciences": ["Medicine", "Anesthesia", "Nursing", "Pharmacy"],
  "Social Science": ["Law", "Economics"],
  Agriculture: ["Plant Science", "Animal Science"],
};

const DEPT_TO_FACULTY = Object.entries(FACULTIES).reduce((acc, [f, depts]) => {
  depts.forEach((d) => (acc[d] = f));
  return acc;
}, {});

/* Resource types a student can choose from */
const TYPES = [
  { key: "ppt", label: "Class PPT", hint: "Lecture slides from your instructors" },
  { key: "pdf", label: "PDF Notes", hint: "Handouts, modules and past exams" },
  { key: "book", label: "Author Books", hint: "Textbooks written by authors" },
];
const TYPE_LABEL = Object.fromEntries(TYPES.map((t) => [t.key, t.label]));

/* ------------------------------------------------------------------ */
/*  Sample data – replace with your API (Supabase).                    */
/*  type: "ppt" | "pdf" | "book"   classYear: 1..5                     */
/* ------------------------------------------------------------------ */
const mk = (id, type, department, classYear, course, title, author, publisher, year, addedDaysAgo, pages, description, tags = []) => ({
  id, type, department, classYear, course, title, author, publisher, year, addedDaysAgo, pages, description, tags,
  format: type === "ppt" ? "PPTX" : "PDF",
  url: "#",
});

const SAMPLE_BOOKS = [
  /* Computer Science */
  mk(1, "ppt", "Computer Science", 2, "Data Structures", "Data Structures – Chapter 1: Arrays & Lists", "Dr. Alemu T.", "Wollo University", 2025, 2, 42, "Class slides covering arrays, linked lists and complexity basics.", ["Slides"]),
  mk(2, "ppt", "Computer Science", 3, "Database Systems", "Database Systems – Normalization", "Mr. Kebede A.", "Wollo University", 2025, 5, 36, "Lecture slides on functional dependencies and normal forms.", ["Slides", "SQL"]),
  mk(3, "pdf", "Computer Science", 2, "Data Structures", "Data Structures Lab Manual", "CS Department", "Wollo University", 2024, 12, 58, "Step-by-step lab exercises with sample solutions.", ["Lab"]),
  mk(4, "pdf", "Computer Science", 3, "Operating Systems", "Operating Systems Past Exams (2021-2024)", "CS Department", "Wollo University", 2024, 40, 30, "Collected midterm and final exams with answers.", ["Exam"]),
  mk(5, "book", "Computer Science", 3, "Database Systems", "Database System Concepts", "Abraham Silberschatz", "McGraw-Hill", 2019, 18, 1376, "Foundational theory and practice of modern database systems.", ["Database", "SQL"]),
  mk(6, "book", "Computer Science", 1, "Programming", "Clean Code with JavaScript", "Robert Martin", "Pearson", 2020, 5, 430, "Principles for writing readable, maintainable JavaScript.", ["Programming", "Web"]),
  /* Information Technology / Systems / SE */
  mk(7, "ppt", "Information Technology", 3, "Computer Networks", "Computer Networks – TCP/IP Model", "Mr. Yimer S.", "Wollo University", 2025, 3, 50, "Layered architecture, addressing and routing basics.", ["Slides", "Network"]),
  mk(8, "book", "Information Systems", 2, "Systems Analysis", "Systems Analysis and Design", "Kenneth Kendall", "Pearson", 2018, 22, 600, "Methods for analysing and designing information systems.", ["Analysis"]),
  mk(9, "pdf", "Software Engineering", 4, "Software Testing", "Software Testing Handout", "SE Department", "Wollo University", 2025, 6, 24, "Unit, integration and system testing techniques.", ["Testing"]),
  /* Engineering */
  mk(10, "book", "Civil Engineering", 2, "Statics", "Engineering Mechanics: Statics", "R. C. Hibbeler", "Pearson", 2016, 9, 700, "Core statics concepts with step-by-step problem solving.", ["Mechanics"]),
  mk(11, "ppt", "Electrical Engineering", 2, "Circuit Analysis", "Circuit Analysis – Kirchhoff's Laws", "Dr. Mulu G.", "Wollo University", 2025, 1, 38, "Slides on KVL, KCL and nodal analysis.", ["Slides"]),
  mk(12, "pdf", "Mechanical Engineering", 3, "Thermodynamics", "Thermodynamics Tutorial Sheets", "ME Department", "Wollo University", 2024, 33, 20, "Practice problems with answers.", ["Tutorial"]),
  /* Medicine & Health */
  mk(13, "book", "Medicine", 3, "Neurology", "Neurology Examination and Board Review", "Elizabeth Hartung", "Wiley", 2016, 6, 480, "Exam-focused neurology review with clinical cases.", ["Neurology"]),
  mk(14, "book", "Anesthesia", 4, "Anesthesiology", "Anesthesiology, Third Edition", "David Longnecker", "McGraw-Hill", 2017, 4, 2100, "A comprehensive reference on modern anesthesia practice.", ["Surgery"]),
  mk(15, "ppt", "Medicine", 2, "Anatomy", "Gross Anatomy – Upper Limb", "Dr. Hana B.", "Wollo University", 2025, 7, 64, "Illustrated lecture slides on upper limb anatomy.", ["Slides", "Anatomy"]),
  mk(16, "pdf", "Nursing", 2, "Fundamentals of Nursing", "Nursing Procedures Checklist", "Nursing Department", "Wollo University", 2024, 15, 32, "Clinical skills checklists for practical exams.", ["Practical"]),
  mk(17, "book", "Pharmacy", 3, "Pharmacotherapy", "Pharmacotherapy Handbook", "Barbara G. Wells", "McGraw-Hill", 2015, 1, 900, "Evidence-based drug therapy recommendations.", ["Drugs"]),
  /* Social Science */
  mk(18, "book", "Law", 1, "Introduction to Law", "Introduction to Law", "Jenny Martin", "Oxford", 2018, 25, 410, "A foundation in legal reasoning and institutions.", ["Legal"]),
  mk(19, "book", "Economics", 1, "Microeconomics", "Principles of Economics", "N. Gregory Mankiw", "Cengage", 2017, 60, 880, "An accessible introduction to micro and macroeconomics.", ["Business"]),
  mk(20, "ppt", "Economics", 2, "Macroeconomics", "Macroeconomics – National Income", "Mr. Tesfa W.", "Wollo University", 2025, 4, 40, "GDP, inflation and unemployment explained with examples.", ["Slides"]),
  /* Agriculture */
  mk(21, "book", "Plant Science", 2, "Crop Production", "Crop Production Science", "Mark Wood", "Wiley", 2013, 7, 390, "Modern methods for sustainable crop production.", ["Crops"]),
  mk(22, "pdf", "Animal Science", 3, "Animal Nutrition", "Animal Nutrition Module", "Agriculture Dept.", "Wollo University", 2024, 28, 76, "Feed formulation and nutrient requirements.", ["Module"]),
];

const TABS = [
  { key: "all", label: "All Resources", facet: "tree" },
  { key: "recent", label: "Last 7 days", facet: "tree" },
  { key: "departments", label: "Departments", facet: "tree" },
  { key: "authors", label: "Authors", facet: "author" },
  { key: "publishers", label: "Publishers", facet: "publisher" },
  { key: "tags", label: "Tags", facet: "tags" },
  { key: "years", label: "Publish Years", facet: "year" },
];
const FACET_TITLE = { tree: "Departments", author: "Authors", publisher: "Publishers", tags: "Tags", year: "Publish Years" };

const COVER_COLORS = [["#1d4ed8", "#38bdf8"], ["#0f766e", "#2dd4bf"], ["#7c3aed", "#a78bfa"], ["#0369a1", "#7dd3fc"], ["#334155", "#94a3b8"]];
const TYPE_COVER = { ppt: ["#ea580c", "#fbbf24"], pdf: ["#be123c", "#fb7185"] };
const PAGE_SIZE = 8;

/* ------------------------------ icons ------------------------------ */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const SearchIcon = () => <Icon d={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />;
const GridIcon = () => <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />;
const ListIcon = () => <Icon d={<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>} />;
const BookIcon = ({ size }) => <Icon size={size} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>} />;
const PptIcon = ({ size }) => <Icon size={size} d={<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /><path d="m10 8 4 2-4 2z" /></>} />;
const PdfIcon = ({ size }) => <Icon size={size} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>} />;
const GridAllIcon = ({ size }) => <Icon size={size} d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />;
const FolderIcon = ({ size }) => <Icon size={size} d={<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />} />;
const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}><path d="m9 18 6-6-6-6" /></svg>
);
const CloseIcon = () => <Icon d={<path d="M18 6 6 18M6 6l12 12" />} />;
const DownloadIcon = () => <Icon d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>} />;
const FilterIcon = () => <Icon d={<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />} />;

const TypeIcon = ({ type, size = 18 }) =>
  type === "ppt" ? <PptIcon size={size} /> : type === "pdf" ? <PdfIcon size={size} /> : <BookIcon size={size} />;

/* ----------------------------- helpers ----------------------------- */
const hashColor = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
};

function Cover({ book, large = false }) {
  const [c1, c2] = TYPE_COVER[book.type] || hashColor(book.title);
  if (book.cover) {
    return (
      <div className={`elib-cover ${large ? "elib-cover--lg" : ""}`}>
        <img src={book.cover} alt={book.title} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={`elib-cover elib-cover--gen ${large ? "elib-cover--lg" : ""}`} style={{ background: `linear-gradient(145deg, ${c1}, ${c2})` }}>
      <span className="elib-cover__spine" />
      <span className="elib-cover__genre"><TypeIcon type={book.type} size={12} /> {TYPE_LABEL[book.type]}</span>
      <strong className="elib-cover__title">{book.title}</strong>
      <span className="elib-cover__author">{book.department}</span>
    </div>
  );
}

const valuesOf = (book, f) => {
  const v = book[f];
  if (Array.isArray(v)) return v;
  return v === "" || v === undefined || v === null ? [] : [String(v)];
};

/* ----------------------------- component --------------------------- */
function Elibrary({ books = SAMPLE_BOOKS }) {
  const [tab, setTab] = useState("all");
  const [facetValue, setFacetValue] = useState(null);
  const [selFaculty, setSelFaculty] = useState(null);
  const [selDept, setSelDept] = useState(null);
  const [type, setType] = useState(null); // ppt | pdf | book | null
  const [classYear, setClassYear] = useState(null);
  const [course, setCourse] = useState("");
  const [openFaculties, setOpenFaculties] = useState(() => Object.keys(FACULTIES));
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = TABS.find((t) => t.key === tab);
  const facet = activeTab.facet;
  const isTree = facet === "tree";

  const tabBooks = useMemo(
    () => (tab === "recent" ? books.filter((b) => b.addedDaysAgo <= 7) : books),
    [books, tab]
  );

  /* sidebar: department counts */
  const deptCount = useMemo(() => {
    const m = {};
    tabBooks.forEach((b) => (m[b.department] = (m[b.department] || 0) + 1));
    return m;
  }, [tabBooks]);

  /* sidebar: flat facet list for non-tree tabs */
  const facetList = useMemo(() => {
    if (isTree) return [];
    const map = new Map();
    tabBooks.forEach((b) => valuesOf(b, facet).forEach((v) => map.set(v, (map.get(v) || 0) + 1)));
    const arr = [...map.entries()].map(([name, count]) => ({ name, count }));
    return facet === "year" ? arr.sort((a, b) => Number(b.name) - Number(a.name)) : arr.sort((a, b) => a.name.localeCompare(b.name));
  }, [tabBooks, facet, isTree]);

  /* scope = books inside chosen faculty/department (before type/year/course) */
  const scoped = useMemo(() => {
    return tabBooks.filter((b) => {
      if (isTree) {
        if (selDept && b.department !== selDept) return false;
        if (!selDept && selFaculty && DEPT_TO_FACULTY[b.department] !== selFaculty) return false;
      } else if (facetValue && !valuesOf(b, facet).includes(facetValue)) return false;
      return true;
    });
  }, [tabBooks, isTree, selDept, selFaculty, facet, facetValue]);

  const typeCounts = useMemo(() => {
    const m = { ppt: 0, pdf: 0, book: 0 };
    scoped.forEach((b) => (m[b.type] = (m[b.type] || 0) + 1));
    return m;
  }, [scoped]);

  const afterType = useMemo(() => scoped.filter((b) => !type || b.type === type), [scoped, type]);

  const yearOptions = useMemo(
    () => [...new Set(afterType.map((b) => b.classYear))].sort((a, b) => a - b),
    [afterType]
  );

  const afterYear = useMemo(() => afterType.filter((b) => !classYear || b.classYear === classYear), [afterType, classYear]);

  const courseOptions = useMemo(
    () => [...new Set(afterYear.map((b) => b.course))].sort(),
    [afterYear]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return afterYear.filter((b) => {
      if (course && b.course !== course) return false;
      if (!q) return true;
      return [b.title, b.author, b.publisher, b.department, b.course, ...(b.tags || [])].join(" ").toLowerCase().includes(q);
    });
  }, [afterYear, course, query]);

  useEffect(() => setVisible(PAGE_SIZE), [tab, facetValue, selDept, selFaculty, type, classYear, course, query]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const resetSub = () => { setType(null); setClassYear(null); setCourse(""); };

  const changeTab = (key) => {
    setTab(key);
    setFacetValue(null);
    setSelDept(null);
    setSelFaculty(null);
    resetSub();
  };

  const pickFaculty = (f) => {
    setOpenFaculties((o) => (o.includes(f) ? (selFaculty === f && !selDept ? o.filter((x) => x !== f) : o) : [...o, f]));
    setSelFaculty(f);
    setSelDept(null);
    resetSub();
  };

  const pickDept = (d) => {
    setSelDept(d);
    setSelFaculty(DEPT_TO_FACULTY[d]);
    resetSub();
    setSidebarOpen(false);
  };

  const clearAll = () => {
    setSelDept(null);
    setSelFaculty(null);
    setFacetValue(null);
    resetSub();
  };

  const hasFilter = selDept || selFaculty || facetValue || type || classYear || course;
  const shown = filtered.slice(0, visible);
  const heading = selDept || selFaculty || facetValue || activeTab.label;
  const scopeName = selDept || selFaculty;

  return (
    <div className="elib">
      {/* ------------------------------ hero ------------------------------ */}
      <section className="elib-hero">
        <div className="elib-hero__inner">
          <span className="elib-pill">Wollo University</span>
          <h1>E-Library</h1>
          <p>Find class slides, PDF notes and textbooks for your department. Choose your department, then pick what you need.</p>

          <div className="elib-search elib-search--hero">
            <SearchIcon />
            <input type="text" placeholder="Search titles, courses, authors..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="button" onClick={() => setVisible(PAGE_SIZE)}>Go!</button>
          </div>

          <div className="elib-stats">
            <div><strong>{books.length}</strong><span>Resources</span></div>
            <div><strong>{new Set(books.map((b) => b.department)).size}</strong><span>Departments</span></div>
            <div><strong>{books.filter((b) => b.type === "ppt").length}</strong><span>Class PPTs</span></div>
          </div>
        </div>
      </section>

      {/* ----------------------------- toolbar ---------------------------- */}
      <div className="elib-toolbar">
        <div className="elib-toolbar__inner">
          <div className="elib-brand"><BookIcon size={22} /> <span>Library</span></div>

          <nav className="elib-tabs" aria-label="Browse library">
            {TABS.map((t) => (
              <button key={t.key} type="button" className={`elib-tab ${tab === t.key ? "is-active" : ""}`} onClick={() => changeTab(t.key)}>
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
          <FilterIcon /> {selDept || selFaculty || facetValue || FACET_TITLE[facet]}
        </button>

        {/* sidebar */}
        <aside className={`elib-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <div className="elib-sidebar__head">{FACET_TITLE[facet]}</div>
          <ul>
            <li>
              <button type="button" className={!hasFilter || (!selDept && !selFaculty && !facetValue) ? "is-active" : ""} onClick={() => { clearAll(); setSidebarOpen(false); }}>
                <GridAllIcon size={16} />
                <span>All</span>
                <em>{tabBooks.length}</em>
              </button>
            </li>

            {/* department tree */}
            {isTree && Object.entries(FACULTIES).map(([faculty, depts]) => {
              const visibleDepts = depts.filter((d) => tab !== "recent" || deptCount[d]);
              if (visibleDepts.length === 0) return null;
              const total = depts.reduce((s, d) => s + (deptCount[d] || 0), 0);
              const open = openFaculties.includes(faculty);
              return (
                <li key={faculty} className="elib-group">
                  <button type="button" className={`elib-faculty ${selFaculty === faculty && !selDept ? "is-active" : ""}`} onClick={() => pickFaculty(faculty)}>
                    <FolderIcon size={16} />
                    <span>{faculty}</span>
                    <em>{total}</em>
                    <ChevronIcon open={open} />
                  </button>
                  {open && (
                    <ul className="elib-depts">
                      {visibleDepts.map((d) => (
                        <li key={d}>
                          <button type="button" className={selDept === d ? "is-active" : ""} onClick={() => pickDept(d)}>
                            <span>{d}</span>
                            <em>{deptCount[d] || 0}</em>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}

            {/* flat facets for other tabs */}
            {!isTree && facetList.map((f) => (
              <li key={f.name}>
                <button type="button" className={facetValue === f.name ? "is-active" : ""} onClick={() => { setFacetValue(f.name); setSidebarOpen(false); }}>
                  <BookIcon size={16} />
                  <span>{f.name}</span>
                  <em>{f.count}</em>
                </button>
              </li>
            ))}
            {!isTree && facetList.length === 0 && <li className="elib-sidebar__empty">Nothing to show here yet.</li>}
          </ul>
        </aside>

        {/* main */}
        <main className="elib-main">
          {/* guided chooser */}
          {isTree && (
            <section className="elib-guide">
              <div className="elib-guide__head">
                <h3>{selDept ? `${selDept}: what do you need?` : selFaculty ? `${selFaculty}: pick a department or resource` : "What are you looking for?"}</h3>
                <p>{selDept ? "Choose a resource type, then your class year and course." : "Select your department from the list, then choose a resource type."}</p>
              </div>

              <div className="elib-types">
                <button type="button" className={`elib-type ${!type ? "is-active" : ""}`} onClick={() => { setType(null); setClassYear(null); setCourse(""); }}>
                  <span className="elib-type__icon"><GridAllIcon size={20} /></span>
                  <span className="elib-type__text"><strong>Everything</strong><small>All resource types</small></span>
                  <em>{scoped.length}</em>
                </button>
                {TYPES.map((t) => (
                  <button key={t.key} type="button" className={`elib-type elib-type--${t.key} ${type === t.key ? "is-active" : ""}`} onClick={() => { setType(t.key); setClassYear(null); setCourse(""); }}>
                    <span className="elib-type__icon"><TypeIcon type={t.key} size={20} /></span>
                    <span className="elib-type__text"><strong>{t.label}</strong><small>{t.hint}</small></span>
                    <em>{typeCounts[t.key] || 0}</em>
                  </button>
                ))}
              </div>

              {scopeName && yearOptions.length > 0 && (
                <div className="elib-subfilters">
                  <div className="elib-subfilters__group">
                    <label>Class year</label>
                    <div className="elib-chips">
                      <button type="button" className={!classYear ? "is-active" : ""} onClick={() => { setClassYear(null); setCourse(""); }}>All</button>
                      {yearOptions.map((y) => (
                        <button key={y} type="button" className={classYear === y ? "is-active" : ""} onClick={() => { setClassYear(y); setCourse(""); }}>Year {y}</button>
                      ))}
                    </div>
                  </div>
                  <div className="elib-subfilters__group">
                    <label htmlFor="elib-course">Course</label>
                    <select id="elib-course" value={course} onChange={(e) => setCourse(e.target.value)}>
                      <option value="">All courses</option>
                      {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </section>
          )}

          <div className="elib-main__head">
            <h2>
              {heading}
              {type && <span className="elib-pill elib-pill--sm">{TYPE_LABEL[type]}</span>}
              <small>{filtered.length} {filtered.length === 1 ? "resource" : "resources"}</small>
            </h2>
            {hasFilter && (
              <button type="button" className="elib-clear" onClick={clearAll}>Clear filters <CloseIcon /></button>
            )}
          </div>

          {shown.length === 0 ? (
            <div className="elib-empty">
              <BookIcon size={42} />
              <h3>Nothing here yet</h3>
              <p>Your department head may add this soon. Try another type, year or course.</p>
            </div>
          ) : (
            <div className={`elib-books elib-books--${view}`}>
              {shown.map((b) => (
                <article key={b.id} className="elib-card" onClick={() => setSelected(b)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(b)}>
                  <Cover book={b} />
                  <div className="elib-card__info">
                    <h3 title={b.title}>{b.title}</h3>
                    <p className="elib-card__author">{b.author}</p>
                    <p className="elib-card__meta">{b.department} · Year {b.classYear}</p>
                    <div className="elib-card__tags">
                      <span className={`elib-tag elib-tag--${b.type}`}>{TYPE_LABEL[b.type]}</span>
                      {view === "list" && <span className="elib-tag">{b.course}</span>}
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
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Load more</button>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------ modal ----------------------------- */}
      {selected && (
        <div className="elib-modal" onClick={() => setSelected(null)}>
          <div className="elib-modal__box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="elib-modal__close" onClick={() => setSelected(null)} aria-label="Close"><CloseIcon /></button>
            <div className="elib-modal__cover"><Cover book={selected} large /></div>
            <div className="elib-modal__content">
              <span className={`elib-pill elib-pill--${selected.type}`}>{TYPE_LABEL[selected.type]}</span>
              <h2>{selected.title}</h2>
              <p className="elib-modal__author">{selected.type === "book" ? "by" : "Uploaded by"} {selected.author}</p>
              <p className="elib-modal__desc">{selected.description}</p>

              <dl className="elib-modal__facts">
                <div><dt>Faculty</dt><dd>{DEPT_TO_FACULTY[selected.department]}</dd></div>
                <div><dt>Department</dt><dd>{selected.department}</dd></div>
                <div><dt>Class year</dt><dd>Year {selected.classYear}</dd></div>
                <div><dt>Course</dt><dd>{selected.course}</dd></div>
                <div><dt>{selected.type === "ppt" ? "Slides" : "Pages"}</dt><dd>{selected.pages}</dd></div>
                <div><dt>Format</dt><dd>{selected.format}</dd></div>
              </dl>

              <div className="elib-card__tags">
                {selected.tags.map((t) => <span key={t} className="elib-tag">{t}</span>)}
              </div>

              <div className="elib-modal__actions">
                <a className="elib-btn elib-btn--primary" href={selected.url} target="_blank" rel="noreferrer">
                  <TypeIcon type={selected.type} size={16} /> {selected.type === "ppt" ? "View slides" : "Read online"}
                </a>
                <a className="elib-btn elib-btn--ghost" href={selected.url} download><DownloadIcon /> Download</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Elibrary;