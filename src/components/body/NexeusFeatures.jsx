import { useTranslation } from 'react-i18next';
import './NexeusFeatures.css';
import Satistics from "../../components/Statistics/Statistics";

/* ── Data ─────────────────────────────────────────────────── */
const STATS = [
  {
    variant: 'featured',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="nf-icon">
        <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M36 24c0-3.314-1.79-6-4-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title:    'WOU Notable Alumni',
    desc:     'Our university has produced numerous notable alumni who lead across every sector.',
    ctaLabel: 'View List ↗',
  },
  {
    variant: 'default',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="nf-icon">
        <polygon points="20,4 24,16 37,16 27,24 31,36 20,28 9,36 13,24 3,16 16,16" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    prefix:   '#',
    number:   'Top 10',
    caption:  'The best university in East Africa',
    subtext:  'QS World University Rankings',
  },
  {
    variant: 'default',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="nf-icon">
        <path d="M8 32 L8 20 L20 8 L32 20 L32 32 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="15" y="24" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="13" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.4"/>
        <rect x="21" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
    number:   '280K+',
    caption:  'All Time Graduates',
    subtext:  'More than 280k+ Graduates',
  },
  {
    variant: 'default',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="nf-icon">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M20 10 L20 20 L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="20" r="2" fill="currentColor"/>
      </svg>
    ),
    number:   '12K+',
    caption:  'Leaders in Research',
    subtext:  '12,293 Scholarly Outputs Since 2014',
  },
];

const QUICK_LINKS = [
  { label: 'Library',       href: '#' },
  { label: 'E-Learning',    href: '#' },
  { label: 'Campus Life',   href: '#' },
  { label: 'Alumni',        href: '#' },
  { label: 'Meet Our Staff',href: '#' },
];

/* ── Arrow icon ───────────────────────────────────────────── */
function Arrow() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true">
      <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────── */
export default function NexeusFeatures() {
  const { t } = useTranslation();

  return (
    <section className="nf-section" aria-label="Impact statistics">
      <div className="nf-inner">

        {/* ── Header row ── */}
        <div className="nf-header">
          <div className="nf-header-left">
            <p className="nf-eyebrow">{t('features.eyebrow')}</p>
            <h2 className="nf-heading">{t('features.heading')}</h2>
            <div className="nf-underline">
              <span className="nf-underline-red"  />
              <span className="nf-underline-blue" />
            </div>
          </div>
          <a className="nf-viewall" href="/Satisistics">{t('features.viewAll')} <Arrow /></a>
        </div>

        {/* ── 4-column strip ── */}
        <div className="nf-strip">
          {STATS.map((s, i) => (
            s.variant === 'featured' ? (
              <div key={i} className="nf-col nf-col--featured">
                <div className="nf-col-icon">{s.icon}</div>
                <h3 className="nf-col-title">{s.title}</h3>
                <p  className="nf-col-desc">{s.desc}</p>
                <a  className="nf-cta-btn" href="#">{s.ctaLabel}</a>
              </div>
            ) : (
              <div key={i} className="nf-col nf-col--stat">
                <div className="nf-col-icon">{s.icon}</div>
                <p className="nf-col-number">
                  {s.prefix && <span className="nf-col-prefix">{s.prefix}</span>}
                  {s.number}
                </p>
                <p className="nf-col-caption">{s.caption}</p>
                <p className="nf-col-subtext">{s.subtext}</p>
              </div>
            )
          ))}
        </div>

        {/* ── Quick links ── */}
        <div className="nf-ql-row">
          <span className="nf-ql-label">{t('features.quickLinks')}</span>
          <div className="nf-ql-pills">
            {QUICK_LINKS.map((ql) => (
              <a key={ql.label} className="nf-ql-pill" href={ql.href}>
                {ql.label} <Arrow />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
