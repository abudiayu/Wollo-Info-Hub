import { Link } from 'react-router-dom';
import './Engineering.css';
import engineeringImg from '../../../assets/engineering.png';

const PROGRAMS = [
  { name: 'Civil Engineering', years: 5, icon: '🏗', desc: 'Structural design, road construction, hydraulics, and urban infrastructure development.' },
  { name: 'Electrical Engineering', years: 5, icon: '⚡', desc: 'Power systems, electronics, control systems, and renewable energy technology.' },
  { name: 'Mechanical Engineering', years: 5, icon: '⚙️', desc: 'Thermodynamics, machine design, manufacturing processes, and industrial automation.' },
  { name: 'Chemical Engineering', years: 5, icon: '🧪', desc: 'Process engineering, reaction kinetics, and industrial chemistry applications.' },
  { name: 'Water Resources Engineering', years: 5, icon: '💧', desc: "Irrigation systems, dam design, watershed management — critical for Ethiopia's agriculture." },
];

const FACTS = [
  { value: '1,100+', label: 'Students' },
  { value: '5',      label: 'Disciplines' },
  { value: '12',     label: 'Labs & Workshops' },
  { value: '40+',    label: 'Industry Partners' },
];

export default function Engineering() {
  return (
    <div className="eng-page">

      <header className="eng-hero">
        <div className="eng-hero-bg">
          <img src={engineeringImg} alt="Engineering campus" className="eng-hero-img" />
          <div className="eng-hero-scrim" aria-hidden="true" />
        </div>
        <div className="eng-hero-content">
          <nav className="eng-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>›</span>
            <Link to="/departments">Departments</Link><span>›</span>
            <span>Engineering</span>
          </nav>
          <p className="eng-eyebrow">Institute of Technology</p>
          <h1 className="eng-title">Engineering &amp; Technology</h1>
          <p className="eng-sub">
            Building Ethiopia&apos;s roads, bridges, power grids, and water systems —
            one graduate at a time.
          </p>
        </div>
      </header>

      <div className="eng-facts-bar">
        {FACTS.map(f => (
          <div key={f.label} className="eng-fact">
            <span className="eng-fact-value">{f.value}</span>
            <span className="eng-fact-label">{f.label}</span>
          </div>
        ))}
      </div>

      <section className="eng-section">
        <div className="eng-container">
          <h2 className="eng-section-title">Engineering Disciplines</h2>
          <p className="eng-section-sub">
            All programs run for five years, combining theory, laboratory work,
            industrial attachments, and a final-year capstone project.
          </p>
          <div className="eng-programs-grid">
            {PROGRAMS.map(p => (
              <div key={p.name} className="eng-program-card">
                <span className="eng-program-emoji" aria-hidden="true">{p.icon}</span>
                <div>
                  <div className="eng-program-header">
                    <h3 className="eng-program-name">{p.name}</h3>
                    <span className="eng-badge">{p.years} yrs</span>
                  </div>
                  <p className="eng-program-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="eng-section eng-section--dark">
        <div className="eng-container">
          <div className="eng-feature-grid">
            <div className="eng-feature-text">
              <h2 className="eng-feature-title">World-Class Lab Facilities</h2>
              <p className="eng-feature-body">
                The institute runs 12 specialist laboratories including concrete testing, hydraulic
                modelling, electrical power, and CAD/CAM workshops. Students complete over 800 hours
                of practical lab work before graduation.
              </p>
              <p className="eng-feature-body">
                A dedicated industrial attachment programme places students with the Ethiopian Roads
                Authority, Ethiopian Electric Power, and major construction firms each year.
              </p>
            </div>
            <div className="eng-feature-stats">
              <div className="eng-stat-box">
                <span className="eng-stat-num">800+</span>
                <span className="eng-stat-lbl">Practical Lab Hours</span>
              </div>
              <div className="eng-stat-box">
                <span className="eng-stat-num">40+</span>
                <span className="eng-stat-lbl">Industry Partners</span>
              </div>
              <div className="eng-stat-box">
                <span className="eng-stat-num">92%</span>
                <span className="eng-stat-lbl">Employment Rate</span>
              </div>
              <div className="eng-stat-box">
                <span className="eng-stat-num">50+</span>
                <span className="eng-stat-lbl">Faculty Members</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eng-section">
        <div className="eng-container">
          <div className="eng-cta-band">
            <div>
              <h2 className="eng-cta-title">Build something that lasts.</h2>
              <p className="eng-cta-sub">Engineering graduates are among Ethiopia&apos;s most sought-after professionals.</p>
            </div>
            <div className="eng-cta-actions">
              <Link to="/departments"  className="eng-btn eng-btn--ghost">All Departments</Link>
              <Link to="/opportunities" className="eng-btn eng-btn--primary">Opportunities</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
