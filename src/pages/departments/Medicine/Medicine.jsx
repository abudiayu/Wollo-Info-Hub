import { Link } from 'react-router-dom';
import './MedicineHero.css';
import './Medicine.css';
import healthImg from '../../../assets/health.png';

/* Programs listed on the faculty overview card grid */
const PROGRAMS = [
  {
    title: 'Medicine (MD)',
    duration: '6 Years',
    desc: 'A comprehensive medical degree combining clinical rotations, research, and community health practice.',
    route: '/department/medicine/md',
  },
  {
    title: 'Pharmacy (B.Pharm)',
    duration: '5 Years',
    desc: 'Study pharmacology, drug formulation, and clinical pharmacy for hospital and community practice.',
    route: '/department/medicine/pharmacy',
  },
  {
    title: 'Nursing (BSc)',
    duration: '4 Years',
    desc: 'Patient-centered nursing education with practical placements at referral hospitals.',
    route: '/department/medicine/nursing',
  },
  {
    title: 'Midwifery (BSc)',
    duration: '4 Years',
    desc: 'Specialised training in maternal and neonatal health, a critical priority across Ethiopia.',
    route: '/department/medicine/midwifery',
  },
  {
    title: 'Veterinary Medicine (DVM)',
    duration: '5 Years',
    desc: 'Animal health, public health, and food safety — a rare program in the region.',
    route: '/department/medicine/veterinary',
  },
];

export default function Medicine() {
  return (
    <div className="med-faculty-page">

      {/* ── Hero (mh-* classes from MedicineHero.css) ── */}
      <header className="mh">
        <div className="mh-stripes" aria-hidden="true" />

        {/* Right-side photo with fade mask */}
        <div className="mh-media" aria-hidden="true">
          <img
            src={healthImg}
            alt="Health Sciences students and clinical staff"
            className="mh-img"
          />
        </div>

        {/* Decorative burst / lines */}
        <svg className="mh-burst" viewBox="0 0 260 150" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M26 8v14M26 44v14M8 33h14M44 33h14M13.5 20.5l9.5 9.5M29 36l9.5 9.5M38.5 20.5L29 30M23 36l-9.5 9.5" />
          </g>
          <path
            d="M36 52C70 96 130 128 190 118c40-7 62-34 56-62-5-24-30-40-58-34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.55"
          />
        </svg>

        <div className="mh-inner">
          <div className="mh-copy">
            <nav className="mh-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">›</span>
              <Link to="/departments">Departments</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">Health Sciences</span>
            </nav>

            <h1 className="mh-title">College of Health Sciences</h1>

            <p className="mh-sub">
              Training compassionate, competent health professionals to serve
              communities across Ethiopia and beyond.
            </p>

            <div className="mh-actions">
              <Link to="/department/medicine/md" className="mh-btn mh-btn--solid">
                View Programs
              </Link>
              <Link to="/opportunities" className="mh-btn mh-btn--outline">
                Opportunities
              </Link>
            </div>

            {/* Quick-stat cards */}
            <div className="mh-cards">
              <div className="mh-card">
                <span className="mh-card-value">1,200+</span>
                <div className="mh-card-row">
                  <span className="mh-card-label">Enrolled Students</span>
                  <span className="mh-card-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mh-card">
                <span className="mh-card-value">85+</span>
                <div className="mh-card-row">
                  <span className="mh-card-label">Clinical Staff</span>
                  <span className="mh-card-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mh-card">
                <span className="mh-card-value">6</span>
                <div className="mh-card-row">
                  <span className="mh-card-label">Teaching Hospitals</span>
                  <span className="mh-card-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mh-card">
                <span className="mh-card-value">98%</span>
                <div className="mh-card-row">
                  <span className="mh-card-label">Licensure Pass Rate</span>
                  <span className="mh-card-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Programs section (med-* classes from Medicine.css) ── */}
      <section className="med-programs-section">
        <div className="med-programs-container">
          <h2 className="med-programs-heading">Programs Offered</h2>
          <p className="med-programs-sub">
            All programs are accredited by the Ethiopian Higher Education Relevance
            and Quality Agency (HERQA).
          </p>

          <ul className="med-programs-grid">
            {PROGRAMS.map((p) => (
              <li key={p.title} className="med-program-card">
                <div className="med-program-header">
                  <h3 className="med-program-name">{p.title}</h3>
                  <span className="med-program-duration">{p.duration}</span>
                </div>
                <p className="med-program-desc">{p.desc}</p>
                <Link to={p.route} className="med-program-link" aria-label={`Explore ${p.title}`}>
                  Explore
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
}
