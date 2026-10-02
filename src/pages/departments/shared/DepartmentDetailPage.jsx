/**
 * DepartmentDetailPage — shared template for every individual department page.
 *
 * Props:
 *  accent        string   — CSS colour for accent (e.g. '#e63946')
 *  accentDark    string   — darker shade
 *  collegeLabel  string   — e.g. "College of Health Sciences"
 *  name          string   — e.g. "Pharmacy"
 *  tagline       string   — one-sentence description
 *  image         string   — imported image asset
 *  imageAlt      string   — alt text
 *  duration      string   — e.g. "5 Years"
 *  degree        string   — e.g. "Bachelor of Pharmacy (B.Pharm)"
 *  parentRoute   string   — e.g. "/department/medicine"
 *  parentLabel   string   — e.g. "Health Sciences"
 *  overview      string   — 2–3 sentences about the program
 *  highlights    Array<{ icon, title, desc }>
 *  curriculum    Array<{ year, subjects: string[] }>
 *  careers       string[]
 *  requirements  string[]
 */

import { Link } from 'react-router-dom';
import './DepartmentDetailPage.css';

/* ── Small inline SVG icons used in highlights ── */
const ICONS = {
  clock: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M12 2l3.09 9.26H22l-7 5.27 2.54 8.47L12 20.27l-5.54 4.73L9 15.53l-7-5.27h6.91z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M9 3h6M10 3v7L7 17a2 2 0 0 0 1.8 2.9h6.4A2 2 0 0 0 17 17l-3-7V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
};

export default function DepartmentDetailPage({
  accent      = '#1e3a8a',
  accentDark  = '#1e3a8a',
  collegeLabel,
  name,
  tagline,
  image,
  imageAlt,
  duration,
  degree,
  parentRoute = '/departments',
  parentLabel = 'Departments',
  overview,
  highlights  = [],
  curriculum  = [],
  careers     = [],
  requirements= [],
}) {
  return (
    <div className="ddp-page" style={{ '--ddp-accent': accent, '--ddp-accent-dark': accentDark }}>

      {/* ── Hero ── */}
      <header className="ddp-hero">
        {image && (
          <div className="ddp-hero-bg">
            <img src={image} alt={imageAlt || name} className="ddp-hero-img" />
            <div className="ddp-hero-scrim" aria-hidden="true" />
          </div>
        )}
        <div className="ddp-hero-content">
          <nav className="ddp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/departments">Departments</Link>
            {parentRoute !== '/departments' && (
              <>
                <span aria-hidden="true">›</span>
                <Link to={parentRoute}>{parentLabel}</Link>
              </>
            )}
            <span aria-hidden="true">›</span>
            <span>{name}</span>
          </nav>

          {collegeLabel && <p className="ddp-college-label">{collegeLabel}</p>}
          <h1 className="ddp-name">{name}</h1>
          {tagline && <p className="ddp-tagline">{tagline}</p>}

          <div className="ddp-hero-badges">
            {duration && (
              <span className="ddp-badge">
                {ICONS.clock} {duration}
              </span>
            )}
            {degree && (
              <span className="ddp-badge">
                {ICONS.book} {degree}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="ddp-main">

        {/* ── Overview ── */}
        {overview && (
          <section className="ddp-section ddp-section--overview">
            <div className="ddp-container ddp-overview-grid">
              <div>
                <h2 className="ddp-section-title">Program Overview</h2>
                <p className="ddp-body-text">{overview}</p>
              </div>

              {highlights.length > 0 && (
                <ul className="ddp-highlights-list">
                  {highlights.map((h, i) => (
                    <li key={i} className="ddp-highlight-item">
                      <span className="ddp-highlight-icon" aria-hidden="true">
                        {ICONS[h.icon] || ICONS.star}
                      </span>
                      <div>
                        <p className="ddp-highlight-title">{h.title}</p>
                        <p className="ddp-highlight-desc">{h.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* ── Curriculum ── */}
        {curriculum.length > 0 && (
          <section className="ddp-section ddp-section--dark">
            <div className="ddp-container">
              <h2 className="ddp-section-title ddp-section-title--light">Curriculum</h2>
              <div className="ddp-curriculum-grid">
                {curriculum.map((yr, i) => (
                  <div key={i} className="ddp-year-card">
                    <div className="ddp-year-label">{yr.year}</div>
                    <ul className="ddp-subjects">
                      {yr.subjects.map((s, j) => (
                        <li key={j} className="ddp-subject">{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Careers + Requirements ── */}
        {(careers.length > 0 || requirements.length > 0) && (
          <section className="ddp-section">
            <div className="ddp-container ddp-bottom-grid">

              {careers.length > 0 && (
                <div className="ddp-careers-box">
                  <h2 className="ddp-section-title">Career Paths</h2>
                  <ul className="ddp-tag-list">
                    {careers.map((c, i) => (
                      <li key={i} className="ddp-tag">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {requirements.length > 0 && (
                <div className="ddp-req-box">
                  <h2 className="ddp-section-title">Entry Requirements</h2>
                  <ul className="ddp-req-list">
                    {requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="ddp-section ddp-section--cta">
          <div className="ddp-container">
            <div className="ddp-cta-band">
              <div>
                <h2 className="ddp-cta-title">Interested in {name}?</h2>
                <p className="ddp-cta-sub">Explore more programs or discover opportunities at Wollo University.</p>
              </div>
              <div className="ddp-cta-actions">
                <Link to={parentRoute} className="ddp-btn ddp-btn--ghost">← Back to {parentLabel}</Link>
                <Link to="/opportunities" className="ddp-btn ddp-btn--primary">View Opportunities</Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
