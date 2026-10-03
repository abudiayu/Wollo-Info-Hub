import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Medicine.css';
import healthImg from '../../../assets/health.png';

/* ───────────────────────── DATA ───────────────────────── */

const PROGRAMS = [
  {
    id: 'md',
    name: 'Medicine (MD)',
    short: 'Medicine',
    degree: 'Doctor of Medicine',
    years: 6,
    clinicalFrom: 3,
    focus: 'Diagnosing and treating patients',
    desc: 'A comprehensive medical degree combining basic sciences, clinical rotations, research, and community health practice.',
    route: '/department/medicine/md',
    extra: [
      'Strong results in Biology, Chemistry, Physics, and Mathematics',
      'Highest entrance-exam cut-off among the health programs',
    ],
    phases: [
      { when: 'Years 1–2', title: 'Basic medical sciences', text: 'Anatomy, physiology, biochemistry, and early patient contact.' },
      { when: 'Years 3–4', title: 'Clinical sciences', text: 'Internal medicine, surgery, paediatrics, obstetrics, and gynaecology.' },
      { when: 'Years 5–6', title: 'Clerkship and internship', text: 'Full-time rotations in teaching hospitals plus a community health attachment.' },
    ],
    careers: ['General practitioner', 'Specialist (after residency)', 'Public health officer', 'Medical researcher', 'Medical educator'],
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy (B.Pharm)',
    short: 'Pharmacy',
    degree: 'Bachelor of Pharmacy',
    years: 5,
    clinicalFrom: 4,
    focus: 'Medicines, safety, and patient counselling',
    desc: 'Study pharmacology, drug formulation, and clinical pharmacy for hospital and community practice.',
    route: '/department/medicine/pharmacy',
    extra: [
      'Strong results in Chemistry and Biology',
      'Comfort with calculations and laboratory work',
    ],
    phases: [
      { when: 'Years 1–2', title: 'Foundation sciences', text: 'Pharmaceutical chemistry, anatomy, physiology, and microbiology.' },
      { when: 'Year 3', title: 'Pharmaceutical sciences', text: 'Pharmacology, pharmaceutics, and drug formulation in the lab.' },
      { when: 'Years 4–5', title: 'Clinical pharmacy and internship', text: 'Dispensing, patient counselling, and supervised hospital placements.' },
    ],
    careers: ['Hospital pharmacist', 'Community pharmacist', 'Drug regulator', 'Pharmaceutical industry', 'Supply chain manager'],
  },
  {
    id: 'nursing',
    name: 'Nursing (BSc)',
    short: 'Nursing',
    degree: 'Bachelor of Science in Nursing',
    years: 4,
    clinicalFrom: 2,
    focus: 'Hands-on, patient-centred care',
    desc: 'Patient-centred nursing education with practical placements at referral hospitals.',
    route: '/department/medicine/nursing',
    extra: [
      'Good results in Biology and English',
      'Willingness to work shifts in hospital wards',
    ],
    phases: [
      { when: 'Year 1', title: 'Nursing foundations', text: 'Anatomy, physiology, and basic nursing skills in the skills lab.' },
      { when: 'Years 2–3', title: 'Clinical nursing', text: 'Medical-surgical, maternal, child health, and mental health placements.' },
      { when: 'Year 4', title: 'Practicum and community', text: 'Leadership, community health, and an extended supervised practicum.' },
    ],
    careers: ['Ward nurse', 'Emergency and critical care nurse', 'Community health nurse', 'Nurse educator', 'Health programme manager'],
  },
  {
    id: 'midwifery',
    name: 'Midwifery (BSc)',
    short: 'Midwifery',
    degree: 'Bachelor of Science in Midwifery',
    years: 4,
    clinicalFrom: 2,
    focus: 'Mothers and newborns',
    desc: 'Specialised training in maternal and neonatal health, a critical priority across Ethiopia.',
    route: '/department/medicine/midwifery',
    extra: [
      'Good results in Biology and English',
      'Readiness to support women through pregnancy and childbirth',
    ],
    phases: [
      { when: 'Year 1', title: 'Foundations', text: 'Anatomy, physiology, and the basics of reproductive health.' },
      { when: 'Years 2–3', title: 'Maternal and newborn care', text: 'Antenatal care, safe delivery, postnatal care, and newborn resuscitation.' },
      { when: 'Year 4', title: 'Practicum', text: 'Supervised deliveries and outreach at hospitals and health centres.' },
    ],
    careers: ['Midwife', 'Maternal health programme officer', 'Health centre lead', 'Family planning specialist', 'Midwifery educator'],
  },
  {
    id: 'veterinary',
    name: 'Veterinary Medicine (DVM)',
    short: 'Veterinary',
    degree: 'Doctor of Veterinary Medicine',
    years: 5,
    clinicalFrom: 3,
    focus: 'Animal health and food safety',
    desc: 'Animal health, public health, and food safety — a rare program in the region.',
    route: '/department/medicine/veterinary',
    extra: [
      'Strong results in Biology and Chemistry',
      'Comfort working around livestock and animals',
    ],
    phases: [
      { when: 'Years 1–2', title: 'Animal biology', text: 'Anatomy, physiology, and animal nutrition across species.' },
      { when: 'Years 3–4', title: 'Clinical veterinary science', text: 'Surgery, pathology, parasitology, and herd health.' },
      { when: 'Year 5', title: 'Internship and field work', text: 'Clinic rotations, food hygiene, and field disease control.' },
    ],
    careers: ['Veterinarian', 'Livestock health officer', 'Meat inspector', 'Disease control officer', 'Animal health researcher'],
  },
];

const FACTS = [
  { value: '1,200+', label: 'Enrolled students' },
  { value: '85+', label: 'Clinical staff' },
  { value: '6', label: 'Teaching hospitals' },
  { value: '98%', label: 'Licensure pass rate' },
];

const COMMON_REQS = [
  { title: 'Grade 12 completion', text: 'You have completed secondary school and sat the national entrance exam.' },
  { title: 'Natural Science stream', text: 'Health programs admit students from the Natural Science stream.' },
  { title: 'Ministry cut-off point', text: 'The Ministry of Education sets minimum points each year. Placement follows your score and your program choices.' },
  { title: 'English proficiency', text: 'Lectures and textbooks are in English, so you need to read and write it confidently.' },
];

const DOCUMENTS = [
  'Grade 12 national exam result',
  'Secondary school certificate',
  'Placement letter from the Ministry',
  'Recent passport-size photos',
  'National ID or Kebele ID copy',
];

const STEPS = [
  { title: 'Sit the national exam', text: 'Pass Grade 12 and choose health programs when you submit your university preferences.' },
  { title: 'Receive your placement', text: 'The Ministry assigns students to universities based on score, preference, and available seats.' },
  { title: 'Report to campus', text: 'Bring your original documents to Wollo University for registration.' },
  { title: 'Register and begin', text: 'Complete registration, pay any fees, and start with orientation.' },
];

const SITES = [
  { name: 'Dessie Referral Hospital', text: 'Main referral hospital for northeast Ethiopia. Core site for medicine, nursing, and midwifery.' },
  { name: 'Boru Meda Hospital', text: 'Additional wards for rotations and supervised practice.' },
  { name: 'District health centres', text: 'Primary care and community outreach, where you learn how health works outside a big hospital.' },
];

const FAQ = [
  { q: 'Can I apply to more than one health program?', a: 'Yes. You rank your program choices when you submit your university preferences. Placement depends on your score and the seats available in each program.' },
  { q: 'When do clinical placements start?', a: 'Clinical exposure begins from Year 2 in several programs. Medicine and veterinary students spend the first two years mostly on basic sciences, then move to the wards.' },
  { q: 'What if my score is below the cut-off?', a: 'Cut-offs change every year. If you miss a program, you may still be placed in another health or science program. Ask the admissions office about options for transfer or private-sector study.' },
  { q: 'Is there a licensing exam after graduation?', a: 'Yes. Most health professions require a national licensure exam before you can practise. Our graduates have a strong pass rate.' },
  { q: 'Where can I get the latest admission details?', a: 'Contact the Wollo University registrar or visit the Opportunities page on this site. Requirements and dates are updated each academic year.' },
];

const NAV = [
  { id: 'programs', label: 'Programs' },
  { id: 'compare', label: 'Compare' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'apply', label: 'How to apply' },
  { id: 'training', label: 'Clinical training' },
  { id: 'faq', label: 'FAQ' },
];

/* ───────────────────────── SMALL PIECES ───────────────────────── */

function Check() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.14" />
      <path d="M6 10.3l2.6 2.6L14 7.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DurationTrack({ years, clinicalFrom }) {
  return (
    <div className="med-track" role="img" aria-label={`${years} years. Clinical placements start in year ${clinicalFrom}.`}>
      <div className="med-track-bar">
        {Array.from({ length: years }, (_, i) => {
          const y = i + 1;
          return (
            <div key={y} className={`med-track-seg ${y >= clinicalFrom ? 'is-clinical' : 'is-classroom'}`}>
              <span>Y{y}</span>
            </div>
          );
        })}
      </div>
      <div className="med-track-legend">
        <span><i className="med-dot med-dot--classroom" />Classroom and lab</span>
        <span><i className="med-dot med-dot--clinical" />Strong clinical placements</span>
      </div>
    </div>
  );
}

/* ───────────────────────── PAGE ───────────────────────── */

export default function Medicine() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const program = PROGRAMS[active];

  const onTabKey = (e) => {
    const last = PROGRAMS.length - 1;
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

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

          <h1 className="med-title">
            Learn to care for people.<br />
            Start at the College of Health Sciences.
          </h1>
          <p className="med-sub">
            Five programs in medicine, pharmacy, nursing, midwifery, and veterinary medicine at
            Wollo University. See what each one involves, what you need to get in, and how to apply.
          </p>

          <div className="med-hero-actions">
            <a href="#programs" className="med-btn med-btn--gold">Explore programs</a>
            <a href="#requirements" className="med-btn med-btn--outline">Check requirements</a>
          </div>
        </div>

        <svg className="med-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            pathLength="1"
            d="M0 70 H260 L290 70 L310 30 L335 100 L358 8 L385 112 L410 70 H620 L645 70 L665 42 L688 92 L712 70 H1200"
          />
        </svg>
      </header>

      {/* ── Facts ── */}
      <div className="med-facts-wrap">
        <div className="med-facts-bar">
          {FACTS.map((f) => (
            <div key={f.label} className="med-fact">
              <span className="med-fact-value">{f.value}</span>
              <span className="med-fact-label">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── In-page navigation ── */}
      <nav className="med-subnav" aria-label="On this page">
        <div className="med-subnav-inner">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`}>{n.label}</a>
          ))}
        </div>
      </nav>

      {/* ── About ── */}
      <section className="med-section">
        <div className="med-container">
          <div className="med-about-grid">
            <div>
              <h2 className="med-section-title">What is the College of Health Sciences?</h2>
              <p className="med-body-text">
                It is one of the largest health-training institutions in the Amhara region. The college
                was established to address the shortage of health professionals in northeast Ethiopia,
                and its graduates now serve across the country.
              </p>
              <p className="med-body-text">
                You learn alongside Dessie Referral Hospital, Boru Meda Hospital, and district health
                centres, with real clinical exposure from Year 2 onwards.
              </p>
            </div>

            <aside className="med-highlight-card">
              <div className="med-highlight-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" width="34" height="34">
                  <path d="M24 5l15 6v11c0 9.5-6.2 17.2-15 20-8.8-2.8-15-10.5-15-20V11l15-6z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                  <path d="M17 24l5 5 9-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Accredited programs</h3>
              <p>All programs are accredited by the Ethiopian Higher Education Relevance and Quality Agency (HERQA).</p>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Program explorer ── */}
      <section className="med-section med-section--alt" id="programs">
        <div className="med-container">
          <div className="med-section-head">
            <h2 className="med-section-title">Find the program that fits you</h2>
            <p className="med-lede">Pick a program to see how long it takes, what you will study, and where it can lead.</p>
          </div>

          <div className="med-explorer">
            <div className="med-tabs" role="tablist" aria-label="Health science programs" aria-orientation="vertical">
              {PROGRAMS.map((p, i) => (
                <button
                  key={p.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  role="tab"
                  id={`med-tab-${p.id}`}
                  aria-selected={i === active}
                  aria-controls={`med-panel-${p.id}`}
                  tabIndex={i === active ? 0 : -1}
                  className={`med-tab ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                  onKeyDown={onTabKey}
                >
                  <span className="med-tab-name">{p.short}</span>
                  <span className="med-tab-years">{p.years} years</span>
                </button>
              ))}
            </div>

            <div
              key={program.id}
              className="med-panel"
              role="tabpanel"
              id={`med-panel-${program.id}`}
              aria-labelledby={`med-tab-${program.id}`}
            >
              <div className="med-panel-head">
                <div>
                  <h3 className="med-panel-title">{program.name}</h3>
                  <p className="med-panel-degree">{program.degree}</p>
                </div>
                <div className="med-panel-years" aria-label={`${program.years} years`}>
                  <strong>{program.years}</strong>
                  <span>years</span>
                </div>
              </div>

              <p className="med-panel-desc">{program.desc}</p>

              <DurationTrack years={program.years} clinicalFrom={program.clinicalFrom} />

              <div className="med-panel-cols">
                <div>
                  <h4 className="med-h4">What you will study</h4>
                  <ol className="med-phases">
                    {program.phases.map((ph) => (
                      <li key={ph.title}>
                        <span className="med-phase-when">{ph.when}</span>
                        <strong>{ph.title}</strong>
                        <p>{ph.text}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="med-h4">Specific to this program</h4>
                  <ul className="med-checklist">
                    {program.extra.map((r) => (
                      <li key={r}><Check /><span>{r}</span></li>
                    ))}
                  </ul>

                  <h4 className="med-h4 med-h4--spaced">Where it can lead</h4>
                  <ul className="med-chips">
                    {program.careers.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="med-panel-foot">
                <p>Focus: <strong>{program.focus}</strong></p>
                <Link to={program.route} className="med-btn med-btn--primary">See full program details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compare ── */}
      <section className="med-section" id="compare">
        <div className="med-container">
          <div className="med-section-head">
            <h2 className="med-section-title">Programs side by side</h2>
            <p className="med-lede">Not sure which to choose? Compare length, degree, and when you start working with patients.</p>
          </div>

          <div className="med-table-wrap" tabIndex={0} role="region" aria-label="Program comparison table">
            <table className="med-table">
              <thead>
                <tr>
                  <th scope="col">Program</th>
                  <th scope="col">Degree</th>
                  <th scope="col">Length</th>
                  <th scope="col">Clinical focus from</th>
                  <th scope="col">You will focus on</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAMS.map((p) => (
                  <tr key={p.id}>
                    <th scope="row">
                      <Link to={p.route}>{p.short}</Link>
                    </th>
                    <td>{p.degree}</td>
                    <td>{p.years} years</td>
                    <td>Year {p.clinicalFrom}</td>
                    <td>{p.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Requirements ── */}
      <section className="med-section med-section--ink" id="requirements">
        <div className="med-container">
          <div className="med-section-head">
            <h2 className="med-section-title">What you need to get in</h2>
            <p className="med-lede">These apply to every health program. Each program also has its own subject strengths, shown above.</p>
          </div>

          <div className="med-req-grid">
            <ul className="med-req-list">
              {COMMON_REQS.map((r) => (
                <li key={r.title}>
                  <Check />
                  <div>
                    <strong>{r.title}</strong>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="med-docs">
              <h3>Documents to bring</h3>
              <ul>
                {DOCUMENTS.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="med-docs-note">
                Cut-off points and dates change every year. Confirm the latest details with the
                registrar before you travel.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ── How to apply ── */}
      <section className="med-section" id="apply">
        <div className="med-container">
          <div className="med-section-head">
            <h2 className="med-section-title">How to apply</h2>
            <p className="med-lede">Four steps from exam results to your first day.</p>
          </div>

          <ol className="med-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="med-step">
                <span className="med-step-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Clinical training ── */}
      <section className="med-section med-section--alt" id="training">
        <div className="med-container">
          <div className="med-section-head">
            <h2 className="med-section-title">Where you will train</h2>
            <p className="med-lede">You practise in real hospitals and health centres, supervised by clinical staff.</p>
          </div>

          <div className="med-sites">
            {SITES.map((s) => (
              <article key={s.name} className="med-site">
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="med-section" id="faq">
        <div className="med-container med-container--narrow">
          <div className="med-section-head">
            <h2 className="med-section-title">Common questions</h2>
          </div>

          <div className="med-faq">
            {FAQ.map((f) => (
              <details key={f.q} className="med-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="med-section med-section--tight">
        <div className="med-container">
          <div className="med-cta-band">
            <div>
              <h2 className="med-cta-title">Ready to begin your medical career?</h2>
              <p className="med-cta-sub">See admission requirements and apply for the next intake.</p>
            </div>
            <div className="med-cta-actions">
              <Link to="/departments" className="med-btn med-btn--outline-dark">All departments</Link>
              <Link to="/opportunities" className="med-btn med-btn--gold">View opportunities</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}