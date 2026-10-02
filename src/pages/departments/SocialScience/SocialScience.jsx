import { Link } from 'react-router-dom';
import './SocialScience.css';
import socialImg from '../../../assets/social.png';

const DEPARTMENTS = [
  { name: 'Law (LLB)',            desc: 'Constitutional, commercial, criminal, and international law with moot court practice.' },
  { name: 'Accounting (BSc)',     desc: 'Financial reporting, auditing, tax law, and IFRS-aligned accounting practice.' },
  { name: 'Management (BBA)',     desc: 'Business strategy, human resources, operations, and entrepreneurship.' },
  { name: 'Journalism (BA)',      desc: 'Print, broadcast, and digital media — with a campus radio station for practical training.' },
  { name: 'Economics (BA)',       desc: 'Macro and microeconomics, econometrics, development economics, and policy analysis.' },
  { name: 'Sociology (BA)',       desc: 'Social research methods, gender studies, community development, and Ethiopian society.' },
  { name: 'Psychology (BA)',      desc: 'Counselling, developmental, organisational, and clinical psychology tracks.' },
  { name: 'Political Science (BA)', desc: 'Governance, international relations, public policy, and Ethiopian political history.' },
];

const FACTS = [
  { value: '2,000+', label: 'Students' },
  { value: '8',      label: 'Departments' },
  { value: '60+',    label: 'Faculty Staff' },
  { value: '500+',   label: 'Annual Graduates' },
];

export default function SocialScience() {
  return (
    <div className="soc-page">

      <header className="soc-hero">
        <div className="soc-hero-bg">
          <img src={socialImg} alt="Social Sciences campus" className="soc-hero-img" />
          <div className="soc-hero-scrim" aria-hidden="true" />
        </div>
        <div className="soc-hero-content">
          <nav className="soc-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>›</span>
            <Link to="/departments">Departments</Link><span>›</span>
            <span>Social Sciences</span>
          </nav>
          <p className="soc-eyebrow">College of Social Sciences &amp; Humanities</p>
          <h1 className="soc-title">Social Sciences &amp; Humanities</h1>
          <p className="soc-sub">
            Understanding people, societies, and economies — shaping Ethiopia&apos;s leaders,
            journalists, lawyers, and economists.
          </p>
        </div>
      </header>

      <div className="soc-facts-bar">
        {FACTS.map(f => (
          <div key={f.label} className="soc-fact">
            <span className="soc-fact-value">{f.value}</span>
            <span className="soc-fact-label">{f.label}</span>
          </div>
        ))}
      </div>

      <section className="soc-section">
        <div className="soc-container">
          <h2 className="soc-section-title">Departments &amp; Programs</h2>
          <p className="soc-section-sub">
            The college houses eight distinct departments — each with an active student society,
            research cluster, and community engagement programme.
          </p>
          <div className="soc-dept-grid">
            {DEPARTMENTS.map(d => (
              <div key={d.name} className="soc-dept-card">
                <h3 className="soc-dept-name">{d.name}</h3>
                <p  className="soc-dept-desc">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="soc-section soc-section--green">
        <div className="soc-container">
          <div className="soc-highlight-row">
            <div className="soc-highlight-box">
              <h3>Campus Radio Station</h3>
              <p>Journalism students run a live FM station broadcasting news, culture, and sports to the Dessie community.</p>
            </div>
            <div className="soc-highlight-box">
              <h3>Moot Court</h3>
              <p>Law students compete in national moot court competitions and serve the university&apos;s free legal aid clinic.</p>
            </div>
            <div className="soc-highlight-box">
              <h3>Community Research</h3>
              <p>Sociology and Economics departments partner with local NGOs on poverty, migration, and public health research.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="soc-section">
        <div className="soc-container">
          <div className="soc-cta-band">
            <div>
              <h2 className="soc-cta-title">Shape the world around you.</h2>
              <p className="soc-cta-sub">From courtrooms to newsrooms — Social Sciences graduates lead Ethiopia forward.</p>
            </div>
            <div className="soc-cta-actions">
              <Link to="/departments"  className="soc-btn soc-btn--ghost">All Departments</Link>
              <Link to="/opportunities" className="soc-btn soc-btn--primary">Opportunities</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
