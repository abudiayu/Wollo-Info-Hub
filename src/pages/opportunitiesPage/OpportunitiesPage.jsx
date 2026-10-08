import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './OpportunitiesHero.css';

import muday      from '../../assets/muday.png';
import appfactory from '../../assets/appfactory.png';
import techclub   from '../../assets/techclub.png';
import sport      from '../../assets/Sport.png';

/* ── Static fallback opportunities — NEVER removed ── */
const FALLBACK = [
  { id: 'muday-art',  tKey: 'mudayArt',  image: muday      },
  { id: 'appfactory', tKey: 'appFactory', image: appfactory },
  { id: 'tech-clubs', tKey: 'techClubs',  image: techclub   },
  { id: 'football',   tKey: 'football',   image: sport      },
];

const API = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/* ── Pad array so each row has at least 6 items for a full strip ── */
function pad(arr) {
  if (arr.length === 0) return arr;
  const out = [...arr];
  while (out.length < 6) out.push(...arr);
  return out;
}

/* ── Resolve title / tag / excerpt / image from either source ── */
function resolve(item, t) {
  if (item.tKey) {
    return {
      title:   t(`opportunities.items.${item.tKey}.title`),
      tag:     t(`opportunities.items.${item.tKey}.tag`),
      excerpt: t(`opportunities.items.${item.tKey}.desc`),
      img:     item.image,
    };
  }
  return {
    title:   item.title,
    tag:     null,
    excerpt: (item.body || '').replace(/<[^>]+>/g, '').slice(0, 120),
    img:     item.cover_url || null,
  };
}

/* ── Hero preview card — tilted collage on the right ── */
function HeroCard({ item, t, tiltClass }) {
  const { title, tag, img } = resolve(item, t);
  return (
    <div className={`op-hcard ${tiltClass}`} aria-hidden="true">
      {/* browser chrome bar */}
      <div className="op-hcard-chrome">
        <span className="op-hcard-dot" style={{ background: '#ff5f57' }} />
        <span className="op-hcard-dot" style={{ background: '#febc2e' }} />
        <span className="op-hcard-dot" style={{ background: '#28c840' }} />
      </div>
      <div className="op-hcard-img-wrap">
        {img
          ? <img src={img} alt="" className="op-hcard-img" loading="lazy" />
          : <div className="op-hcard-img-placeholder" />
        }
      </div>
      <div className="op-hcard-footer">
        {tag && <span className="op-hcard-tag">{tag}</span>}
        <p className="op-hcard-title">{title}</p>
      </div>
    </div>
  );
}

/* ── Scrolling strip card ── */
function OppCard({ item, t }) {
  const { title, tag, excerpt, img } = resolve(item, t);
  return (
    <article className="op-card" aria-label={title}>
      <div className="op-card-img-wrap">
        {img
          ? <img src={img} alt={title} className="op-card-img" loading="lazy" />
          : <div className="op-card-img op-card-img--placeholder" aria-hidden="true" />
        }
      </div>
      <div className="op-card-body">
        {tag && <span className="op-card-tag">{tag}</span>}
        <h3 className="op-card-title">{title}</h3>
        <p className="op-card-excerpt">{excerpt}</p>
        <Link to="/opportunities" className="op-card-link">
          {t('opportunities.learnMore')}
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
            <path d="M3 8h9M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7"
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

/* ── One auto-scrolling row ── */
function ScrollRow({ items, direction, t }) {
  const padded = pad(items);
  const track  = [...padded, ...padded]; /* double for seamless loop */

  /* direction drives both the slant angle and which keyframe to use */
  const slantClass = direction === 'ltr' ? 'op-row-slant--up' : 'op-row-slant--down';

  return (
    /* slant wrapper: applies the 2D mountain tilt to the whole row */
    <div className={`op-row-slant ${slantClass}`} aria-hidden="true">
      {/* viewport: clips overflow so scrolling cards don't bleed out */}
      <div className="op-row-viewport">
        <div className={`op-row-track op-row-track--${direction}`}>
          {track.map((item, i) => (
            <OppCard
              key={`${item.id ?? item.tKey}-${i}`}
              item={item}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function OpportunitiesPage() {
  const { t } = useTranslation();
  const [cmsItems, setCmsItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/public/sections/opportunity`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.items?.length) setCmsItems(data.items); })
      .catch(() => {});
  }, []);

  const all  = [...FALLBACK, ...cmsItems];
  const row1 = all.filter((_, i) => i % 2 === 0);
  const row2 = all.filter((_, i) => i % 2 !== 0);

  /* Pick up to 3 cards for the hero collage */
  const heroCards = all.slice(0, 3);

  /* tilt classes for each hero card position */
  const tiltClasses = ['op-hcard--tl', 'op-hcard--tr', 'op-hcard--br'];

  return (
    <section className="op-section" aria-label={t('opportunities.heading')}>

      {/* ════════════════════ HERO ════════════════════ */}
      <div className="op-hero">
        <div className="op-hero-inner">

          {/* ── Left: copy ── */}
          <div className="op-hero-copy">
            <span className="op-badge">{t('opportunities.eyebrow')}</span>

            <h1 className="op-heading">
              {t('opportunities.heading')}
            </h1>

            <p className="op-sub">{t('opportunities.sub')}</p>

            <ul className="op-bullets" aria-label="Highlights">
              {['bullet1', 'bullet2', 'bullet3'].map(key => (
                <li key={key} className="op-bullet">
                  <span className="op-bullet-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t(`opportunities.${key}`)}
                </li>
              ))}
            </ul>

            <div className="op-actions">
              <Link to="/departments" className="op-btn op-btn--primary">
                {t('opportunities.explore')}
              </Link>
              <Link to="/" className="op-btn op-btn--ghost">
                {t('opportunities.contact')}
              </Link>
            </div>
          </div>

          {/* ── Right: tilted card collage ── */}
          <div className="op-hero-collage" aria-hidden="true">
            {heroCards.map((item, i) => (
              <HeroCard
                key={item.id ?? item.tKey}
                item={item}
                t={t}
                tiltClass={tiltClasses[i] ?? tiltClasses[0]}
              />
            ))}
            {/* decorative glow behind the cards */}
            <div className="op-collage-glow" />
          </div>

        </div>
      </div>

      {/* ════════════════════ SCROLLING ROWS ════════════════════ */}
      <div className="op-cards-section">
        <ScrollRow items={row1} direction="ltr" t={t} />
        <ScrollRow items={row2} direction="rtl" t={t} />
      </div>

    </section>
  );
}
