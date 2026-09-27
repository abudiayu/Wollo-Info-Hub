import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './NexeusFeatures.css';

/* Feature icon keys mapped to translation keys */
const FEATURE_KEYS = [
  { id: 'departments', mark: '01', icon: 'building', tKey: 'features.departments' },
  { id: 'students',    mark: '02', icon: 'cap',      tKey: 'features.students'    },
  { id: 'alumni',      mark: '03', icon: 'network',  tKey: 'features.alumni'      },
  { id: 'opportunities', mark: '04', icon: 'spark',  tKey: 'features.opportunities' },
];

const STAT_KEYS = [
  { value: '1,200+', tKey: 'features.stats.students'     },
  { value: '45',     tKey: 'features.stats.departments'  },
  { value: '300+',   tKey: 'features.stats.alumni'       },
  { value: '20',     tKey: 'features.stats.opportunities'},
];

/* ── Topic icons ──────────────────────────────────────────── */
function FeatureIcon({ type }) {
  switch (type) {
    case 'building':
      return (
        <svg className="nx-icon nx-icon-building" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="14" y="22" width="36" height="32" rx="2" className="nx-icon-body" />
          <rect x="20" y="10" width="24" height="14" rx="2" className="nx-icon-roof" />
          <rect className="nx-icon-window w1" x="20" y="30" width="6" height="6" />
          <rect className="nx-icon-window w2" x="30" y="30" width="6" height="6" />
          <rect className="nx-icon-window w3" x="40" y="30" width="6" height="6" />
          <rect className="nx-icon-window w4" x="20" y="40" width="6" height="6" />
          <rect className="nx-icon-window w5" x="30" y="40" width="6" height="6" />
          <rect className="nx-icon-window w6" x="40" y="40" width="6" height="6" />
        </svg>
      );
    case 'cap':
      return (
        <svg className="nx-icon nx-icon-cap" viewBox="0 0 64 64" aria-hidden="true">
          <polygon points="32,14 58,26 32,38 6,26" className="nx-icon-cap-top" />
          <path d="M18 30 V42 Q32 50 46 42 V30" className="nx-icon-cap-band" />
          <line x1="52" y1="27" x2="52" y2="42" className="nx-icon-cap-string" />
          <circle cx="52" cy="44" r="2.2" className="nx-icon-cap-tassel" />
        </svg>
      );
    case 'network':
      return (
        <svg className="nx-icon nx-icon-network" viewBox="0 0 64 64" aria-hidden="true">
          <line x1="32" y1="18" x2="16" y2="46" className="nx-icon-line" />
          <line x1="32" y1="18" x2="48" y2="46" className="nx-icon-line" />
          <line x1="16" y1="46" x2="48" y2="46" className="nx-icon-line" />
          <circle cx="32" cy="18" r="6" className="nx-icon-node n1" />
          <circle cx="16" cy="46" r="6" className="nx-icon-node n2" />
          <circle cx="48" cy="46" r="6" className="nx-icon-node n3" />
        </svg>
      );
    case 'spark':
    default:
      return (
        <svg className="nx-icon nx-icon-spark" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M32 8 L37 27 L56 32 L37 37 L32 56 L27 37 L8 32 L27 27 Z"
            className="nx-icon-spark-shape"
          />
        </svg>
      );
  }
}

export default function NexeusFeatures() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

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
        <p className="nx-feat-eyebrow">{t('features.eyebrow')}</p>
        <h2 className="nx-feat-heading">{t('features.heading')}</h2>

        <div className="nx-feat-grid">
          {FEATURE_KEYS.map((f, i) => (
            <article
              className="nx-feat-card"
              key={f.id}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="nx-feat-icon-wrap">
                <FeatureIcon type={f.icon} />
              </div>
              <span className="nx-feat-mark">{f.mark}</span>
              <h3 className="nx-feat-title">{t(`${f.tKey}.title`)}</h3>
              <p className="nx-feat-desc">{t(`${f.tKey}.desc`)}</p>
            </article>
          ))}
        </div>

        <div className="nx-feat-stats">
          {STAT_KEYS.map((s, i) => (
            <div
              className="nx-feat-stat"
              key={s.tKey}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="nx-feat-stat-value">{s.value}</span>
              <span className="nx-feat-stat-label">{t(s.tKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
