import { Link } from 'react-router-dom';
import './Sport.css';
import sportImg from '../../../assets/Sport.png';

const SPORTS = [
  { name: 'Football',     icon: '⚽', desc: 'University team competes at national inter-university level. Open trials every September.' },
  { name: 'Athletics',    icon: '🏃', desc: 'Track and field disciplines — long distance, sprint, and field events with national representation.' },
  { name: 'Basketball',   icon: '🏀', desc: 'Men\'s and women\'s teams competing in the regional university league.' },
  { name: 'Volleyball',   icon: '🏐', desc: 'Indoor and beach volleyball squads with access to two full-size indoor courts.' },
  { name: 'Table Tennis', icon: '🏓', desc: 'Weekly club play and annual internal championship tournament open to all students.' },
  { name: 'Martial Arts', icon: '🥋', desc: 'Taekwondo and Judo clubs with certified instructors — strength, discipline, and self-defence.' },
];

const FACILITIES = [
  { name: 'Main Stadium',       cap: '5,000 seats',  desc: 'Full-size football pitch with running track.' },
  { name: 'Sports Hall',        cap: '800 seats',     desc: 'Indoor court for basketball, volleyball, and martial arts.' },
  { name: 'Fitness Centre',     cap: 'Open daily',    desc: 'Weight training, cardio equipment, and physiotherapy room.' },
  { name: 'Athletics Track',    cap: '400m certified',desc: 'IAAF-standard track used for regional competitions.' },
];

const FACTS = [
  { value: '800+', label: 'Active Athletes' },
  { value: '6',    label: 'Sports Offered' },
  { value: '12',   label: 'Trophies (2020–24)' },
  { value: '3',    label: 'Olympic Hopefuls' },
];

export default function Sport() {
  return (
    <div className="sp-page">

      <header className="sp-hero">
        <div className="sp-hero-bg">
          <img src={sportImg} alt="Sports field" className="sp-hero-img" />
          <div className="sp-hero-scrim" aria-hidden="true" />
        </div>
        <div className="sp-hero-content">
          <nav className="sp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>›</span>
            <Link to="/departments">Departments</Link><span>›</span>
            <span>Sport</span>
          </nav>
          <p className="sp-eyebrow">Sports Science &amp; Athletics</p>
          <h1 className="sp-title">Sport &amp; Physical Education</h1>
          <p className="sp-sub">
            Compete, grow, lead — Wollo University&apos;s sports programme develops athletes
            and future physical education professionals.
          </p>
        </div>
      </header>

      <div className="sp-facts-bar">
        {FACTS.map(f => (
          <div key={f.label} className="sp-fact">
            <span className="sp-fact-value">{f.value}</span>
            <span className="sp-fact-label">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Sports offered */}
      <section className="sp-section">
        <div className="sp-container">
          <h2 className="sp-section-title">Sports &amp; Activities</h2>
          <p className="sp-section-sub">Open to every enrolled student — no experience needed, just commitment.</p>
          <div className="sp-sports-grid">
            {SPORTS.map(s => (
              <div key={s.name} className="sp-sport-card">
                <span className="sp-sport-icon" aria-hidden="true">{s.icon}</span>
                <h3 className="sp-sport-name">{s.name}</h3>
                <p  className="sp-sport-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="sp-section sp-section--dark">
        <div className="sp-container">
          <h2 className="sp-section-title sp-section-title--light">Facilities</h2>
          <div className="sp-facilities-grid">
            {FACILITIES.map(f => (
              <div key={f.name} className="sp-facility-card">
                <div className="sp-facility-cap">{f.cap}</div>
                <h3 className="sp-facility-name">{f.name}</h3>
                <p  className="sp-facility-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Science program */}
      <section className="sp-section">
        <div className="sp-container">
          <div className="sp-program-banner">
            <div className="sp-program-text">
              <h2 className="sp-program-title">Sports Science Degree (BSc)</h2>
              <p className="sp-program-desc">
                The four-year Sports Science degree prepares students for careers in coaching,
                physical education teaching, sports management, and athletic training. Graduates
                work in schools, national federations, and professional clubs across Ethiopia.
              </p>
              <ul className="sp-program-list">
                <li>Exercise physiology &amp; biomechanics</li>
                <li>Sports nutrition &amp; psychology</li>
                <li>Athletic coaching methodology</li>
                <li>Physical education curriculum design</li>
                <li>Sports facility management</li>
              </ul>
            </div>
            <div className="sp-program-badge">
              <span className="sp-badge-years">4</span>
              <span className="sp-badge-label">Year<br/>Program</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-container">
          <div className="sp-cta-band">
            <div>
              <h2 className="sp-cta-title">Your game. Your future.</h2>
              <p className="sp-cta-sub">Try out for a team or enrol in Sports Science this intake.</p>
            </div>
            <div className="sp-cta-actions">
              <Link to="/departments"  className="sp-btn sp-btn--ghost">All Departments</Link>
              <Link to="/opportunities" className="sp-btn sp-btn--primary">View Opportunities</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
