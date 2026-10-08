import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
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

const EASE = [0.22, 1, 0.36, 1];

/* ── Pad array so the marquee has at least 6 items for a full strip ── */
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

/* ── Decorative square positions (x%, y%, size px) ── */
const HEADER_SQUARES = [
  [6, 20, 12], [12, 32, 8], [8, 44, 6], [88, 18, 10],
  [92, 30, 14], [85, 42, 7], [90, 52, 5], [14, 56, 5],
];

const CARD_SQUARES = [
  [[5, 30, 16], [10, 42, 10], [3, 52, 7], [80, 70, 14], [85, 82, 9], [78, 60, 6]],
  [[82, 55, 16], [88, 68, 10], [78, 72, 7], [85, 42, 6], [90, 80, 8]],
  [[4, 24, 16], [10, 36, 10], [2, 44, 7], [78, 78, 14], [84, 88, 8]],
  [[82, 26, 14], [88, 38, 10], [78, 44, 7], [84, 54, 5], [90, 60, 8]],
];

const COLS = 12;
const ROWS = 8;

/* ── Header parallax square ── */
function FloatingSquare({ x, y, size, index, progress }) {
  const raw = useTransform(progress, [0, 1], [0, -(80 + index * 30)]);
  const py  = useSpring(raw, { stiffness: 40, damping: 20 });
  return (
    <motion.span className="op-fsq" style={{ left: `${x}%`, top: `${y}%`, y: py }}>
      <motion.span
        className="op-fsq-inner"
        style={{ width: size, height: size }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3 + index * 0.4,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: index * 0.3,
        }}
      />
    </motion.span>
  );
}

/* ── Card magnetic square ── */
function MagneticSquare({ x, y, size, px, py }) {
  const cfg = { stiffness: 80, damping: 18, mass: 0.6 };
  const tx  = useSpring(useTransform(px, v => (v - x / 100) * 40), cfg);
  const ty  = useSpring(useTransform(py, v => (v - y / 100) * 40), cfg);
  return (
    <motion.span
      className="op-msq"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, x: tx, y: ty }}
    />
  );
}

/* ── Pixel-dissolve block ── */
function PixelBlock({ row, col, hovered }) {
  const delayIn  = (row + col) * 0.018;
  const delayOut = ((ROWS - row) + (COLS - col)) * 0.012;
  return (
    <motion.span
      className="op-pixel"
      style={{
        left:   `${(col * 100) / COLS}%`,
        top:    `${(row * 100) / ROWS}%`,
        width:  `${100 / COLS + 0.1}%`,
        height: `${100 / ROWS + 0.1}%`,
      }}
      initial={false}
      animate={
        hovered
          ? { scale: 1, opacity: 1, transition: { duration: 0.25, delay: delayIn } }
          : { scale: 0, opacity: 0, transition: { duration: 0.25, delay: delayOut } }
      }
    />
  );
}

/* ── Case-study style card ── */
function OppCard({ item, t, index }) {
  const { title, tag, excerpt, img } = resolve(item, t);
  const [hovered, setHovered] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const squares = CARD_SQUARES[index % CARD_SQUARES.length];

  const handleMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => {
    setHovered(false);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 4) * 0.1 }}
    >
      <Link
        to="/opportunities"
        className="op-card"
        aria-label={title}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onFocus={() => setHovered(true)}
        onBlur={handleLeave}
      >
        {img
          ? <img src={img} alt={title} className="op-card-img" loading="lazy" />
          : <div className="op-card-img op-card-img--placeholder" aria-hidden="true" />
        }

        {/* pixel-dissolve overlay */}
        <div className="op-pixels" aria-hidden="true">
          {Array.from({ length: ROWS }).map((_, row) =>
            Array.from({ length: COLS }).map((__, col) => (
              <PixelBlock key={`${row}-${col}`} row={row} col={col} hovered={hovered} />
            ))
          )}
        </div>

        {/* excerpt revealed on hover */}
        <p className={`op-card-excerpt${hovered ? ' is-visible' : ''}`}>{excerpt}</p>

        {/* magnetic squares */}
        {squares.map(([x, y, size], i) => (
          <MagneticSquare key={i} x={x} y={y} size={size} px={px} py={py} />
        ))}

        <span className="op-card-plus" aria-hidden="true">+</span>

        <div className="op-card-plate">
          <h3 className="op-card-title">{title}</h3>
          <div className="op-card-meta">
            {tag && <span className="op-card-tag">{tag}</span>}
            <span className="op-card-more">{t('opportunities.learnMore')}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ── Marquee icons ── */
const ICONS = [
  <svg key="code" width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,4 1,9 6,14" /><polyline points="16,4 21,9 16,14" /><line x1="13" y1="2" x2="9" y2="16" /></svg>,
  <svg key="dots" width="20" height="20" viewBox="0 0 20 20" fill="#000">{[3, 10, 17].flatMap(cx => [3, 10, 17].map(cy => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" />))}</svg>,
  <svg key="ring" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#000" strokeWidth="2"><circle cx="11" cy="11" r="9" /><circle cx="11" cy="11" r="4" /></svg>,
  <svg key="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="16" x2="16" y2="2" /><polyline points="7,2 16,2 16,11" /></svg>,
  <svg key="wave" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#000" strokeWidth="1.5"><circle cx="11" cy="11" r="9" /><path d="M5 11Q8 7 11 11Q14 15 17 11" /></svg>,
  <svg key="lines" width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round"><line x1="0" y1="3" x2="24" y2="3" /><line x1="6" y1="9" x2="24" y2="9" /><line x1="0" y1="15" x2="18" y2="15" /></svg>,
  <svg key="bolt" width="14" height="20" viewBox="0 0 14 20" fill="#000"><polygon points="8,0 0,11 6,11 6,20 14,9 8,9" /></svg>,
  <svg key="plus" width="18" height="18" viewBox="0 0 18 18" fill="#000"><rect x="7.5" y="0" width="3" height="18" /><rect x="0" y="7.5" width="18" height="3" /></svg>,
];

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

  const all = [...FALLBACK, ...cmsItems];

  /* marquee: padded + doubled for a seamless loop */
  const marqueeItems = pad(all);
  const marqueeTrack = [...marqueeItems, ...marqueeItems];

  /* header animation + parallax */
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const inView     = useInView(headerRef, { once: true, margin: '-60px' });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* split heading into black / faded halves (presentation only) */
  const heading = t('opportunities.heading');
  const words   = String(heading).split(' ');
  const mid     = Math.ceil(words.length / 2);
  const headA   = words.slice(0, mid).join(' ');
  const headB   = words.slice(mid).join(' ');

  return (
    <section
      ref={sectionRef}
      className="op-section"
      aria-label={heading}
    >
      {/* ════════════════════ HEADER ════════════════════ */}
      <div className="op-top">
        <div className="op-fsq-layer" aria-hidden="true">
          {HEADER_SQUARES.map(([x, y, size], i) => (
            <FloatingSquare key={i} x={x} y={y} size={size} index={i} progress={scrollYProgress} />
          ))}
        </div>

        <motion.div
          ref={headerRef}
          className="op-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="op-badge">{t('opportunities.eyebrow')}</span>

          <h1 className="op-heading">
            <span className="op-heading-a">{headA}</span>
            {headB && <><br /><span className="op-heading-b">{headB}</span></>}
          </h1>

          <p className="op-sub">{t('opportunities.sub')}</p>
        </motion.div>
      </div>

      {/* ════════════════════ CARD GRID ════════════════════ */}
      <div className="op-grid-wrap">
        <div className="op-grid">
          {all.map((item, i) => (
            <OppCard key={`${item.id ?? item.tKey}-${i}`} item={item} t={t} index={i} />
          ))}
        </div>
      </div>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <div className="op-footer">
        <div className="op-footer-left">
          <span className="op-plus-btn" aria-hidden="true">+</span>

          <ul className="op-bullets" aria-label="Highlights">
            {['bullet1', 'bullet2', 'bullet3'].map(key => (
              <li key={key} className="op-bullet">
                <span className="op-bullet-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t(`opportunities.${key}`)}
              </li>
            ))}
          </ul>

          <div className="op-actions">
            <Link to="/departments" className="op-cta group">
              <span className="op-cta-label">{t('opportunities.explore')}</span>
              <span className="op-cta-badge" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z" />
                </svg>
              </span>
            </Link>
            <Link to="/" className="op-link-ghost">
              {t('opportunities.contact')}
            </Link>
          </div>
        </div>

        <div className="op-footer-right" aria-hidden="true">
          <div className="op-marquee">
            <div className="op-marquee-track">
              {marqueeTrack.map((item, i) => (
                <div key={`${item.id ?? item.tKey}-${i}`} className="op-marquee-item">
                  {ICONS[i % ICONS.length]}
                  <span className="op-marquee-name">{resolve(item, t).title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="op-spacer" />
    </section>
  );
}