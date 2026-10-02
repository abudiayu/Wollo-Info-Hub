import { Link } from 'react-router-dom';
import './ComputerScience.css';
import informaticsImg from '../../../assets/informatics.png';

const PROGRAMS = [
  { name: 'Computer Science (BSc)', years: 4, desc: 'Algorithms, data structures, AI, and systems programming at the core of the curriculum.' },
  { name: 'Information Technology (BSc)', years: 4, desc: 'Practical IT management, networking, databases, and enterprise system administration.' },
  { name: 'Information Systems (BSc)', years: 4, desc: 'Bridges business and technology — ERP, system analysis, and organisational informatics.' },
  { name: 'Software Engineering (BSc)', years: 4, desc: 'Rigorous software design, testing, agile methods, and large-scale application development.' },
];

const LABS = [
  { name: 'AI & Machine Learning Lab', desc: 'GPU-accelerated workstations for deep learning research and capstone projects.' },
  { name: 'Networking Lab', desc: 'Cisco-certified equipment for routing, switching, and cybersecurity practicals.' },
  { name: 'Software Dev Lab', desc: '80-seat coding lab with 24/7 access for enrolled students.' },
  { name: 'AppFactory Incubator', desc: 'Student-run startup hub where teams build and launch real mobile apps.' },
];

const FACTS = [
  { value: '900+', label: 'Students' },
  { value: '4',    label: 'Degree Programs' },
  { value: '3',    label: 'Specialist Labs' },
  { value: '200+', label: 'Annual Graduates' },
];

export default function ComputerScience() {
  return (
    <div className="cs-page">

      <header className="cs-hero">
        <div className="cs-hero-bg">
          <img src={informaticsImg} alt="Informatics building" className="cs-hero-img" />
          <div className="cs-hero-scrim" aria-hidden="true" />
        </div>
        <div className="cs-hero-content">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>›</span>
            <Link to="/departments">Departments</Link><span>›</span>
            <span>Informatics</span>
          </nav>
          <p className="cs-eyebrow">College of Informatics</p>
          <h1 className="cs-title">Computer Science &amp; Informatics</h1>
          <p className="cs-sub">
            Where Ethiopia&apos;s next generation of engineers, developers, and data scientists is trained.
          </p>
        </div>
      </header>

      <div className="cs-facts-bar">
        {FACTS.map(f => (
          <div key={f.label} className="cs-fact">
            <span className="cs-fact-value">{f.value}</span>
            <span className="cs-fact-label">{f.label}</span>
          </div>
        ))}
      </div>

      <section className="cs-section">
        <div className="cs-container">
          <h2 className="cs-section-title">Programs Offered</h2>
          <div className="cs-programs-grid">
            {PROGRAMS.map(p => (
              <div key={p.name} className="cs-program-card">
                <div className="cs-program-dot" aria-hidden="true" />
                <div>
                  <div className="cs-program-header">
                    <h3 className="cs-program-name">{p.name}</h3>
                    <span className="cs-badge">{p.years} yrs</span>
                  </div>
                  <p className="cs-program-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-section cs-section--alt">
        <div className="cs-container">
          <h2 className="cs-section-title">Research &amp; Lab Facilities</h2>
          <div className="cs-labs-grid">
            {LABS.map(l => (
              <div key={l.name} className="cs-lab-card">
                <div className="cs-lab-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
                    <rect x="3" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <rect x="18" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <rect x="3" y="18" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <rect x="18" y="18" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </div>
                <h3 className="cs-lab-name">{l.name}</h3>
                <p  className="cs-lab-desc">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-cta-band">
            <div>
              <h2 className="cs-cta-title">Start building the future.</h2>
              <p className="cs-cta-sub">Join Ethiopia&apos;s most active tech community on campus.</p>
            </div>
            <div className="cs-cta-actions">
              <Link to="/departments"  className="cs-btn cs-btn--ghost">All Departments</Link>
              <Link to="/opportunities" className="cs-btn cs-btn--primary">Clubs &amp; Events</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
