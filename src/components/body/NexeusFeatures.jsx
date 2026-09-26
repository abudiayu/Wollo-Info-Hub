import { useEffect, useRef } from 'react';
import './NexeusFeatures.css';

/* ── Content ───────────────────────────────────────────────── */
const FEATURES = [
  {
    id: 'departments',
    mark: '01',
    title: 'Departments',
    desc: 'Browse every faculty and program, from course structure to career paths, all in one place.',
  },
  {
    id: 'students',
    mark: '02',
    title: 'Student Records',
    desc: 'Enrollment, progress, and academic history — organized and accessible whenever you need it.',
  },
  {
    id: 'alumni',
    mark: '03',
    title: 'Alumni Network',
    desc: 'See where graduates are today and connect with a growing community beyond campus.',
  },
  {
    id: 'opportunities',
    mark: '04',
    title: 'Opportunities',
    desc: 'Internships, research, hackathons, and jobs — open doors, updated as they arrive.',
  },
];

const STATS = [
  { value: '1,200+', label: 'Students' },
  { value: '45',     label: 'Departments' },
  { value: '300+',   label: 'Alumni' },
  { value: '20',     label: 'Opportunities' },
];

export default function NexeusFeatures() {
  const sectionRef = useRef(null);

  /* ── scroll-reveal (rise + fade, reuses the SOFT easing feel) ── */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = root.querySelectorAll('.nx-feat-card, .nx-feat-stat');

    if (reduceMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
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

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="nx-features" ref={sectionRef} aria-label="Platform overview">
      <div className="nx-feat-inner">
        <p className="nx-feat-eyebrow">What's inside</p>
        <h2 className="nx-feat-heading">Everything your campus needs</h2>

        <div className="nx-feat-grid">
          {FEATURES.map((f, i) => (
            <article
              className="nx-feat-card"
              key={f.id}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="nx-feat-mark">{f.mark}</span>
              <h3 className="nx-feat-title">{f.title}</h3>
              <p className="nx-feat-desc">{f.desc}</p>
            </article>
          ))}
        </div>

        <div className="nx-feat-stats">
          {STATS.map((s, i) => (
            <div
              className="nx-feat-stat"
              key={s.label}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="nx-feat-stat-value">{s.value}</span>
              <span className="nx-feat-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}