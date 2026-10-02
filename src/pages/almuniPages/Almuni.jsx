import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Almuni.css';
import teamImg from '../../assets/team.jpg';

const API = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/* Notable alumni — static showcase data */
const NOTABLE_ALUMNI = [
  {
    id: 1,
    name:    'Dr. Abebe Girma',
    faculty: 'College of Health Sciences',
    year:    '2005',
    role:    'Chief Physician, Dessie Referral Hospital',
    bio:     'Pioneer in maternal health programs across the Amhara region.',
    color:   '#e63946',
    initials:'AG',
  },
  {
    id: 2,
    name:    'Eng. Fatima Yimer',
    faculty: 'Institute of Technology',
    year:    '2009',
    role:    'Lead Structural Engineer, Ethiopian Roads Authority',
    bio:     'Oversaw the design of more than 200 km of rural infrastructure.',
    color:   '#f59e0b',
    initials:'FY',
  },
  {
    id: 3,
    name:    'Meron Haile',
    faculty: 'College of Informatics',
    year:    '2014',
    role:    'CTO, Ethio Tech Solutions PLC',
    bio:     'Built one of Ethiopia\'s fastest-growing fintech startups from a campus side project.',
    color:   '#2563eb',
    initials:'MH',
  },
  {
    id: 4,
    name:    'Prof. Dawit Bekele',
    faculty: 'College of Social Sciences',
    year:    '2001',
    role:    'Professor of Economics, Addis Ababa University',
    bio:     'Published researcher on rural development and poverty reduction policy.',
    color:   '#10b981',
    initials:'DB',
  },
  {
    id: 5,
    name:    'Hana Tessema',
    faculty: 'College of Health Sciences',
    year:    '2017',
    role:    'WHO Country Representative — Ethiopia',
    bio:     'Leading public health reform with international reach.',
    color:   '#e63946',
    initials:'HT',
  },
  {
    id: 6,
    name:    'Siraj Mohammed',
    faculty: 'College of Informatics',
    year:    '2018',
    role:    'Machine Learning Engineer, Google Africa',
    bio:     'One of the youngest Ethiopian engineers to join Google\'s Africa office.',
    color:   '#2563eb',
    initials:'SM',
  },
];

const STATS = [
  { value: '280K+', label: 'Graduates' },
  { value: '40+',   label: 'Countries reached' },
  { value: '1985',  label: 'Founded' },
  { value: '95%',   label: 'Employment rate' },
];

export default function AlumniPage() {
  const cardsRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Hero entrance
    const t = setTimeout(() => setHeroVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Scroll-reveal alumni cards */
  useEffect(() => {
    const root = cardsRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = root.querySelectorAll('.alm-card');
    if (reduceMotion) { cards.forEach(el => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    cards.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="alm-page">

      {/* ── Hero ── */}
      <header className={`alm-hero ${heroVisible ? 'alm-hero--visible' : ''}`}>
        <div className="alm-hero-bg">
          <img src={teamImg} alt="Wollo University campus" className="alm-hero-photo" />
          <div className="alm-hero-scrim" aria-hidden="true" />
        </div>
        <div className="alm-hero-content">
          <nav className="alm-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>Alumni</span>
          </nav>
          <p className="alm-hero-eyebrow">Wollo University</p>
          <h1 className="alm-hero-title">Alumni Network</h1>
          <p className="alm-hero-sub">
            From the classrooms of Dessie to boardrooms, hospitals, and research labs around the world —
            Wollo graduates are shaping Ethiopia's future.
          </p>
        </div>
      </header>

      {/* ── Stats bar ── */}
      <div className="alm-stats-bar">
        {STATS.map(s => (
          <div key={s.label} className="alm-stat">
            <span className="alm-stat-value">{s.value}</span>
            <span className="alm-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Notable alumni ── */}
      <section className="alm-section" aria-labelledby="notable-title">
        <div className="alm-container">
          <div className="alm-section-header">
            <h2 id="notable-title" className="alm-section-title">Notable Alumni</h2>
            <p className="alm-section-sub">
              A small sample of the thousands of graduates who have gone on to make a difference.
            </p>
          </div>

          <div className="alm-grid" ref={cardsRef}>
            {NOTABLE_ALUMNI.map((a, i) => (
              <article
                key={a.id}
                className="alm-card"
                style={{ transitionDelay: `${i * 80}ms`, '--alm-color': a.color }}
              >
                <div className="alm-card-avatar" style={{ background: a.color }} aria-hidden="true">
                  {a.initials}
                </div>
                <div className="alm-card-body">
                  <h3 className="alm-card-name">{a.name}</h3>
                  <p  className="alm-card-role">{a.role}</p>
                  <p  className="alm-card-bio">{a.bio}</p>
                  <div className="alm-card-meta">
                    <span className="alm-card-tag">{a.faculty}</span>
                    <span className="alm-card-year">Class of {a.year}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stay connected CTA ── */}
      <section className="alm-cta-section" aria-label="Stay connected">
        <div className="alm-container">
          <div className="alm-cta-card">
            <h2 className="alm-cta-title">Stay connected with Wollo</h2>
            <p className="alm-cta-sub">
              Whether you graduated last year or two decades ago, your story matters.
              Share your journey and inspire the next generation.
            </p>
            <div className="alm-cta-actions">
              <Link to="/" className="alm-cta-btn alm-cta-btn--primary">Share your story</Link>
              <Link to="/opportunities" className="alm-cta-btn alm-cta-btn--ghost">Explore opportunities</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
