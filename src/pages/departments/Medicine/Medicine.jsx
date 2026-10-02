import { Link } from 'react-router-dom';
import './Medicine.css';
import healthImg from '../../../assets/health.png';

const PROGRAMS = [
  { name: 'Medicine (MD)',         years: 6, desc: 'A comprehensive medical degree combining clinical rotations, research, and community health practice.',         route: '/department/medicine/md' },
  { name: 'Pharmacy (B.Pharm)',    years: 5, desc: 'Study pharmacology, drug formulation, and clinical pharmacy for hospital and community practice.',              route: '/department/medicine/pharmacy' },
  { name: 'Nursing (BSc)',         years: 4, desc: 'Patient-centered nursing education with practical placements at referral hospitals.',                           route: '/department/medicine/nursing' },
  { name: 'Midwifery (BSc)',       years: 4, desc: 'Specialised training in maternal and neonatal health, a critical priority across Ethiopia.',                    route: '/department/medicine/midwifery' },
  { name: 'Veterinary Medicine (DVM)', years: 5, desc: 'Animal health, public health, and food safety — a rare program in the region.',                           route: '/department/medicine/veterinary' },
];

const FACTS = [
  { value: '1,200+', label: 'Enrolled Students' },
  { value: '85+',    label: 'Clinical Staff' },
  { value: '6',      label: 'Teaching Hospitals' },
  { value: '98%',    label: 'Licensure Pass Rate' },
];

export default function Medicine() {
  return (
    <div className="med-page">

      {/* ── Hero ── */}
      <header className="med-hero">
        <div className="med-hero-bg">
          <img src={healthImg} alt="Health Sciences campus" className="med-hero-img" />
          <div className="med-hero-scrim" aria-hidden="true" />
        </div>
        <div className="med-hero-content">
          <nav className="med-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">›</span>
            <Link to="/departments">Departments</Link><span aria-hidden="true">›</span>
            <span>Health Sciences</span>
          </nav>
          <p className="med-eyebrow">College of Health Sciences</p>
          <h1 className="med-title">Medicine &amp; Health Sciences</h1>
          <p className="med-sub">
            Training compassionate clinicians, pharmacists, nurses, and veterinarians
            who serve Ethiopia and beyond.
          </p>
        </div>
      </header>

      {/* ── Facts bar ── */}
      <div className="med-facts-bar">
        {FACTS.map(f => (
          <div key={f.label} className="med-fact">
            <span className="med-fact-value">{f.value}</span>
            <span className="med-fact-label">{f.label}</span>
          </div>
        ))}
      </div>

      {/* ── About ── */}
      <section className="med-section">
        <div className="med-container">
          <div className="med-about-grid">
            <div>
              <h2 className="med-section-title">About the College</h2>
              <p className="med-body-text">
                The College of Health Sciences at Wollo University is one of the largest
                health-training institutions in the Amhara region. Established to address
                the severe shortage of health professionals in northeast Ethiopia, the college
                has graduated thousands of practitioners now serving across the country.
              </p>
              <p className="med-body-text">
                Students benefit from partnerships with Dessie Referral Hospital, Boru Meda
                Hospital, and several district health centres — providing real clinical
                exposure from Year 2 onwards.
              </p>
            </div>
            <div className="med-highlight-card">
              <div className="med-highlight-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
                  <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"
                    stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Accredited Programs</h3>
              <p>All programs are accredited by the Ethiopian Higher Education Relevance and Quality Agency (HERQA).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section className="med-section med-section--alt">
        <div className="med-container">
          <h2 className="med-section-title">Programs Offered</h2>
          <div className="med-programs-grid">
            {PROGRAMS.map(p => (
              <Link key={p.name} to={p.route} className="med-program-card" style={{ textDecoration: 'none' }}>
                <div className="med-program-header">
                  <h3 className="med-program-name">{p.name}</h3>
                  <span className="med-program-years">{p.years} years</span>
                </div>
                <p className="med-program-desc">{p.desc}</p>
                <span className="med-program-cta">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="med-section">
        <div className="med-container">
          <div className="med-cta-band">
            <div>
              <h2 className="med-cta-title">Ready to begin your medical career?</h2>
              <p className="med-cta-sub">Explore admission requirements and apply for the next intake.</p>
            </div>
            <div className="med-cta-actions">
              <Link to="/departments" className="med-btn med-btn--ghost">All Departments</Link>
              <Link to="/opportunities" className="med-btn med-btn--primary">View Opportunities</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
