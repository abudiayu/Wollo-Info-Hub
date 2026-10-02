import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './DepartmentsPage.css';

import engineering  from '../../assets/engineering.png';
import health       from '../../assets/health.png';
import informatics  from '../../assets/informatics.png';
import social       from '../../assets/social.png';
import sportImg     from '../../assets/Sport.png';

const API = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/* Each entry maps to a department sub-page route */
const DEPARTMENTS = [
  {
    id:       'health',
    faculty:  'College of Health Sciences',
    color:    '#e63946',
    image:    health,
    route:    '/department/medicine',
    programs: ['Medicine', 'Pharmacy', 'Nursing', 'Midwifery', 'Veterinary Medicine'],
    description:
      'Training compassionate, competent health professionals to serve communities across Ethiopia and beyond.',
  },
  {
    id:       'informatics',
    faculty:  'College of Informatics',
    color:    '#2563eb',
    image:    informatics,
    route:    '/department/computer-science',
    programs: ['Computer Science', 'Information Technology', 'Information Systems', 'Software Engineering'],
    description:
      'Bridging technology and society through rigorous study of computing, data, and software systems.',
  },
  {
    id:       'engineering',
    faculty:  'Institute of Technology',
    color:    '#f59e0b',
    image:    engineering,
    route:    '/department/engineering',
    programs: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Water Resources Engineering'],
    description:
      'Building the infrastructure of tomorrow — from roads and bridges to energy systems and water networks.',
  },
  {
    id:       'social',
    faculty:  'College of Social Sciences & Humanities',
    color:    '#10b981',
    image:    social,
    route:    '/department/social-science',
    programs: ['Law', 'Accounting', 'Management', 'Journalism', 'Political Science', 'Economics', 'Sociology', 'Psychology'],
    description:
      'Understanding human societies and economies to address the challenges of a rapidly changing world.',
  },
  {
    id:       'sport',
    faculty:  'Sport & Physical Education',
    color:    '#f97316',
    image:    sportImg,
    route:    '/department/sport',
    programs: ['Sports Science (BSc)', 'Football', 'Athletics', 'Basketball', 'Volleyball', 'Martial Arts'],
    description:
      'Compete, grow, lead — the sports programme develops athletes and future physical education professionals.',
  },
];

export default function DepartmentsPage() {
  const sectionRef = useRef(null);
  const [cmsItems, setCmsItems] = useState([]);
  const [loaded,   setLoaded]   = useState(false);

  /* Fetch CMS-published department content */
  useEffect(() => {
    fetch(`${API}/api/public/sections/department`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.items?.length) setCmsItems(data.items); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  /* Scroll-reveal cards */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = root.querySelectorAll('.dept-card');
    if (reduceMotion) { cards.forEach(el => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    cards.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [cmsItems, loaded]);

  const hasCms = loaded && cmsItems.length > 0;

  return (
    <div className="dept-page" ref={sectionRef}>

      {/* ── Page header ── */}
      <header className="dept-hero">
        <div className="dept-hero-inner">
          <nav className="dept-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>Departments</span>
          </nav>
          <h1 className="dept-hero-title">Academic Departments</h1>
          <p className="dept-hero-sub">
            Explore the colleges, institutes, and departments that make up Wollo University —
            from health sciences and engineering to social sciences, informatics, and sport.
          </p>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="dept-main">
        <div className="dept-container">
          {hasCms ? (
            /* CMS-managed content */
            <div className="dept-cms-grid">
              {cmsItems.map((item, i) => (
                <article
                  key={item.id}
                  className="dept-card dept-card--cms"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {item.cover_url && (
                    <div className="dept-card-img-wrap">
                      <img src={item.cover_url} alt={item.title} className="dept-card-img" loading="lazy" />
                    </div>
                  )}
                  <div className="dept-card-body">
                    <h2 className="dept-card-title">{item.title}</h2>
                    <div
                      className="dept-card-body-html"
                      dangerouslySetInnerHTML={{ __html: item.body || '' }}
                    />
                    {item.gallery?.length > 0 && (
                      <div className="dept-gallery">
                        {item.gallery.filter(m => m.type === 'image').map(m => (
                          <img key={m.id} src={m.url} alt={m.original_name} loading="lazy" className="dept-gallery-img" />
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Static cards — each has an Explore button linking to its own page */
            <div className="dept-grid">
              {DEPARTMENTS.map((d, i) => (
                <article
                  key={d.id}
                  className="dept-card"
                  style={{ transitionDelay: `${i * 90}ms`, '--dept-color': d.color }}
                >
                  <div className="dept-card-img-wrap">
                    <img src={d.image} alt={d.faculty} className="dept-card-img" loading="lazy" />
                    <div className="dept-card-overlay" aria-hidden="true" />
                  </div>

                  <div className="dept-card-body">
                    <h2 className="dept-card-title">{d.faculty}</h2>
                    <p className="dept-card-desc">{d.description}</p>

                    <div className="dept-programs">
                      <p className="dept-programs-label">Programs offered:</p>
                      <ul className="dept-programs-list">
                        {d.programs.map(p => (
                          <li key={p} className="dept-program-tag">{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* ── Explore button ── */}
                    <Link
                      to={d.route}
                      className="dept-explore-btn"
                      style={{ '--dept-color': d.color }}
                      aria-label={`Explore ${d.faculty}`}
                    >
                      Explore
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                        <path d="M3 8h9M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
