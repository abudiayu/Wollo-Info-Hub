import { useEffect, useRef } from 'react';
import './OpportunitiesPage.css';

/* ── Content ───────────────────────────────────────────────── */
const OPPORTUNITIES = [
  {
    id: 'muday-art',
    tag: 'Creative',
    title: 'Muday Art Club',
    desc: 'A community of painters, sketch artists, and designers who exhibit work every semester and mentor first-year students in visual art.',
    icon: 'palette',
  },
  {
    id: 'appfactory',
    tag: 'Tech',
    title: 'AppFactory Academy',
    desc: 'A hands-on program where students build real mobile and web apps in teams, guided by senior students and industry mentors.',
    icon: 'appfactory',
  },
  {
    id: 'tech-clubs',
    tag: 'Tech',
    title: 'Tech Clubs',
    desc: 'Weekly meetups on programming, robotics, and AI — workshops, hackathons, and a space to build side projects with peers.',
    icon: 'techclub',
  },
  {
    id: 'football',
    tag: 'National Level',
    title: 'Football Club',
    desc: 'Wollo University\u2019s football team competes at national inter-university level, with open tryouts each year for new talent.',
    icon: 'football',
    featured: true,
  },
];

/* ── Topic illustrations — animated inline SVG ────────────────── */
function OpportunityIcon({ type }) {
  switch (type) {
    case 'palette':
      return (
        <svg className="opp-icon opp-icon-palette" viewBox="0 0 64 64" aria-hidden="true">
          <path
            className="opp-icon-blob"
            d="M32 6c14 0 24 9 24 20 0 8-6 10-11 10-3 0-5-2-5-4 0-3 3-3 3-6 0-4-5-6-9-6-9 0-16 8-16 16 0 9 7 16 16 16 14 0 26-11 26-26C60 16 47 4 32 4 17 4 6 16 6 30c0 6 2 11 5 15"
          />
          <circle className="opp-dot d1" cx="24" cy="22" r="3.4" />
          <circle className="opp-dot d2" cx="36" cy="18" r="3" />
          <circle className="opp-dot d3" cx="43" cy="28" r="3.2" />
          <circle className="opp-dot d4" cx="26" cy="34" r="2.8" />
        </svg>
      );
    case 'appfactory':
      return (
        <svg className="opp-icon opp-icon-app" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="18" y="8" width="28" height="48" rx="6" className="opp-phone-body" />
          <rect x="22" y="14" width="20" height="32" rx="2" className="opp-phone-screen" />
          <circle cx="32" cy="50" r="2.2" className="opp-phone-btn" />
          <rect className="opp-app-icon a1" x="25" y="18" width="6" height="6" rx="1.6" />
          <rect className="opp-app-icon a2" x="33" y="18" width="6" height="6" rx="1.6" />
          <rect className="opp-app-icon a3" x="25" y="26" width="6" height="6" rx="1.6" />
          <rect className="opp-app-icon a4" x="33" y="26" width="6" height="6" rx="1.6" />
        </svg>
      );
    case 'techclub':
      return (
        <svg className="opp-icon opp-icon-tech" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M20 46 L8 32 L20 18" className="opp-bracket" />
          <path d="M44 18 L56 32 L44 46" className="opp-bracket" />
          <circle cx="32" cy="32" r="5" className="opp-tech-core" />
        </svg>
      );
    case 'football':
    default:
      return (
        <svg className="opp-icon opp-icon-ball" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="24" className="opp-ball-body" />
          <polygon
            points="32,20 40,26 37,35 27,35 24,26"
            className="opp-ball-panel"
          />
          <path d="M32 8 L32 20 M50 20 L40 26 M50 44 L37 35 M14 44 L27 35 M14 20 L24 26"
            className="opp-ball-seam"
          />
        </svg>
      );
  }
}

export default function OpportunitiesPage() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = root.querySelectorAll('.opp-card');

    if (reduceMotion) {
      cards.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="opp-section" ref={sectionRef} aria-label="Student opportunities">
      <div className="opp-inner">
        <p className="opp-eyebrow">Get involved</p>
        <h2 className="opp-heading">Opportunities at Wollo University</h2>
        <p className="opp-sub">
          Beyond the classroom — clubs, academies, and teams where students build,
          create, and compete.
        </p>

        <div className="opp-grid">
          {OPPORTUNITIES.map((o, i) => (
            <article
              className={`opp-card ${o.featured ? 'opp-card-featured' : ''}`}
              key={o.id}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="opp-icon-wrap">
                <OpportunityIcon type={o.icon} />
              </div>
              <span className="opp-tag">{o.tag}</span>
              <h3 className="opp-title">{o.title}</h3>
              <p className="opp-desc">{o.desc}</p>
              <a className="opp-link" href="#">
                Learn more
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M3 8h9M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}