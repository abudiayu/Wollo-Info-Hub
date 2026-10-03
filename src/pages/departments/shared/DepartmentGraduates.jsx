/**
 * DepartmentGraduates.jsx
 *
 * Renders the "Students Who Graduated" section.
 * Fully self-contained — brings its own icons, Avatar, and CSS.
 *
 * Props
 * ─────
 * graduates      {Array}  Required. Each item: { name, photo?, year?,
 *                          role?, workplace?, location?, link? }
 * graduatesCount {number} Optional. Shown in the header if larger than
 *                          graduates.length (e.g. 1200 total, 8 shown).
 * departmentName {string} Inserted into the heading.
 * universityName {string} Inserted into the heading.
 * initialVisible {number} Cards shown before "Show more". Default 8.
 * accent         {string} CSS colour string. Default '#2563eb'.
 * accentDark     {string} CSS colour string. Default '#1e3a8a'.
 */

import { useState } from 'react';
import './DepartmentGraduates.css';

/* ── Icons (inline SVG, no deps) ── */
const IconCap = (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
    <path d="M2 9l10-5 10 5-10 5L2 9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconPin = (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconBriefcase = (
  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconArrowUp = (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Helpers ── */
const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/* ── Avatar: shows photo or coloured initials circle ── */
function Avatar({ name = '', photo }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="dg-avatar"
        loading="lazy"
        /* If the image fails to load, degrade gracefully */
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = 'grid';
        }}
      />
    );
  }
  return (
    <span className="dg-avatar dg-avatar--fallback" role="img" aria-label={name}>
      {getInitials(name)}
    </span>
  );
}

/* ── Single graduate card ── */
function GraduateCard({ graduate: g }) {
  /* Arrow is a real <a> only when g.link exists */
  const isLink = Boolean(g.link);
  const GoEl   = isLink ? 'a' : 'span';
  const goProps = isLink
    ? {
        href:   g.link,
        target: '_blank',
        rel:    'noopener noreferrer',
        'aria-label': `View ${g.name || 'graduate'}'s profile`,
        className: 'dg-go is-link',
      }
    : { 'aria-hidden': true, className: 'dg-go' };

  return (
    <article className="dg-card">
      {/* Gradient cover strip */}
      <div className="dg-cover" aria-hidden="true" />

      <div className="dg-body">
        {/* Photo or initials — negative-margin pulls avatar over the cover */}
        <div className="dg-avatar-wrap">
          <Avatar name={g.name} photo={g.photo} />
          {/* Hidden fallback rendered in DOM for the onError swap */}
          {g.photo && (
            <span
              className="dg-avatar dg-avatar--fallback"
              role="img"
              aria-label={g.name}
              style={{ display: 'none' }}
            >
              {getInitials(g.name)}
            </span>
          )}
        </div>

        <h3 className="dg-name">{g.name || 'Graduate'}</h3>

        {g.role && <p className="dg-role">{g.role}</p>}

        {/* Meta list — only rendered when data exists */}
        {(g.workplace || g.location) && (
          <ul className="dg-meta">
            {g.workplace && (
              <li>
                {IconBriefcase}
                <span>{g.workplace}</span>
              </li>
            )}
            {g.location && (
              <li>
                {IconPin}
                <span>{g.location}</span>
              </li>
            )}
          </ul>
        )}

        {/* Footer: class year + arrow */}
        <div className="dg-foot">
          {g.year ? (
            <span className="dg-year">
              {IconCap}
              Class of {g.year}
            </span>
          ) : (
            /* Keep the flex layout balanced when year is missing */
            <span aria-hidden="true" />
          )}

          <GoEl {...goProps}>{IconArrowUp}</GoEl>
        </div>
      </div>
    </article>
  );
}

/* ── Main exported component ── */
export default function DepartmentGraduates({
  departmentName = 'this Department',
  universityName = 'Wollo University',
  graduates,
  graduatesCount,
  initialVisible = 8,
  accent     = '#2563eb',
  accentDark = '#1e3a8a',
}) {
  const [showAll, setShowAll] = useState(false);

  /* Guard: treat undefined / null / non-array as empty */
  const list = Array.isArray(graduates) ? graduates : [];

  /* Return nothing when there are no graduates at all */
  if (list.length === 0) return null;

  const visible    = showAll ? list : list.slice(0, initialVisible);
  /* How many are still hidden after slicing */
  const hiddenCount = list.length - Math.min(list.length, initialVisible);

  return (
    <section
      className="dg-section"
      id="graduates"
      aria-labelledby="dg-heading"
      style={{ '--dg-accent': accent, '--dg-accent-dark': accentDark }}
    >
      <div className="dg-container">

        {/* ── Section header ── */}
        <header className="dg-head">
          <span className="dg-pill">Alumni</span>
          <h2 className="dg-title" id="dg-heading">
            Students Who Graduated from {universityName} — {departmentName}
          </h2>
          <p className="dg-sub">
            Meet the graduates who started their journey here and are now making an impact
            {graduatesCount
              ? ` — ${graduatesCount.toLocaleString()}+ alumni and counting.`
              : '.'}
          </p>
        </header>

        {/* ── Graduate cards grid ── */}
        <div className="dg-grid">
          {visible.map((g, i) => (
            /*
             * Key: prefer a stable unique field (link or name+year).
             * Fallback to index only when nothing better exists.
             */
            <GraduateCard
              key={g.link || `${g.name ?? 'grad'}-${g.year ?? i}`}
              graduate={g}
            />
          ))}
        </div>

        {/* ── Show more / fewer button — only when list exceeds initialVisible ── */}
        {list.length > initialVisible && (
          <div className="dg-more">
            <button
              type="button"
              className="dg-more-btn"
              onClick={() => setShowAll((s) => !s)}
              aria-expanded={showAll}
            >
              {showAll
                ? 'Show fewer'
                : `Show ${hiddenCount} more graduate${hiddenCount === 1 ? '' : 's'}`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
