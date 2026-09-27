import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './OpportunitiesPage.css';

import muday      from '../../assets/muday.png';
import appfactory from '../../assets/appfactory.png';
import techclub     from '../../assets/techclub.png';
import sport from '../../assets/Sport.png';

const OPP_KEYS = [
  { id: 'muday-art',  tKey: 'mudayArt',   image: muday ,      featured: false },
  { id: 'appfactory', tKey: 'appFactory',  image: appfactory, featured: false },
  { id: 'tech-clubs', tKey: 'techClubs',   image: techclub, featured: false },
  { id: 'football',   tKey: 'football',    image: sport,       featured: true  },
];

export default function OpportunitiesPage() {
  const { t } = useTranslation();
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
      { threshold: 0.15 }
    );

    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="opp-section" ref={sectionRef} aria-label="Student opportunities">
      <div className="opp-inner">
        <p className="opp-eyebrow">{t('opportunities.eyebrow')}</p>
        <h2 className="opp-heading">{t('opportunities.heading')}</h2>
        <p className="opp-sub">{t('opportunities.sub')}</p>

        <div className="opp-grid">
          {OPP_KEYS.map((o, i) => (
            <article
              className={`opp-card${o.featured ? ' opp-card-featured' : ''}`}
              key={o.id}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              {/* ── Image ── */}
              <div className="opp-image-wrap">
                <img
                  src={o.image}
                  alt={t(`opportunities.items.${o.tKey}.title`)}
                  className="opp-image"
                  loading="lazy"
                />
                {/* featured badge overlay */}
                {o.featured && (
                  <span className="opp-featured-badge">
                    {t(`opportunities.items.${o.tKey}.tag`)}
                  </span>
                )}
              </div>

              {/* ── Body ── */}
              <div className="opp-body">
                {!o.featured && (
                  <span className="opp-tag">
                    {t(`opportunities.items.${o.tKey}.tag`)}
                  </span>
                )}
                <h3 className="opp-title">
                  {t(`opportunities.items.${o.tKey}.title`)}
                </h3>
                <p className="opp-desc">
                  {t(`opportunities.items.${o.tKey}.desc`)}
                </p>
                <a className="opp-link" href="#">
                  {t('opportunities.learnMore')}
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path
                      d="M3 8h9M8 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
