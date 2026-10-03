import { useState } from 'react';
import './DepartmentGraduates.css';

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

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

function Avatar({ name, photo }) {
  return photo ? (
    <img src={photo} alt={name} className="dg-avatar" loading="lazy" />
  ) : (
    <span className="dg-avatar dg-avatar--fallback" role="img" aria-label={name}>
      {initials(name)}
    </span>
  );
}

/**
 * graduates: [{ name, photo, year, role, workplace, location, link }]
 */
export default function DepartmentGraduates({
  departmentName = 'this Department',
  universityName = 'Wollo University',
  graduates = [],
  graduatesCount,
  initialVisible = 8,
  accent = '#2563eb',
  accentDark = '#1e3a8a',
}) {
  const [showAll, setShowAll] = useState(false);

  if (!graduates.length) return null;

  const visible = showAll ? graduates : graduates.slice(0, initialVisible);
  const hiddenCount = graduates.length - visible.length;

  return (
    <section
      className="dg-section"
      id="graduates"
      style={{ '--dg-accent': accent, '--dg-accent-dark': accentDark }}
    >
      <div className="dg-container">
        <header className="dg-head">
          <span className="dg-pill">Alumni</span>
          <h2 className="dg-title">
            Students Who Graduated from {universityName} — {departmentName}
          </h2>
          <p className="dg-sub">
            Meet the graduates who started their journey here and are now making an impact
            {graduatesCount ? ` — ${graduatesCount}+ alumni and counting.` : '.'}
          </p>
        </header>

        <div className="dg-grid">
          {visible.map((g, i) => {
            const Action = g.link ? 'a' : 'span';
            const actionProps = g.link
              ? {
                  href: g.link,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  'aria-label': `View ${g.name}'s profile`,
                }
              : { 'aria-hidden': true };

            return (
              <article key={`${g.name}-${i}`} className="dg-card">
                <div className="dg-cover" aria-hidden="true" />

                <div className="dg-body">
                  <Avatar name={g.name} photo={g.photo} />

                  <h3 className="dg-name">{g.name}</h3>
                  {g.role && <p className="dg-role">{g.role}</p>}

                  <ul className="dg-meta">
                    {g.workplace && (
                      <li>{IconBriefcase}<span>{g.workplace}</span></li>
                    )}
                    {g.location && (
                      <li>{IconPin}<span>{g.location}</span></li>
                    )}
                  </ul>

                  <div className="dg-foot">
                    {g.year ? (
                      <span className="dg-year">{IconCap} Class of {g.year}</span>
                    ) : (
                      <span />
                    )}
                    <Action className={`dg-go${g.link ? ' is-link' : ''}`} {...actionProps}>
                      {IconArrowUp}
                    </Action>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {graduates.length > initialVisible && (
          <div className="dg-more">
            <button type="button" className="dg-more-btn" onClick={() => setShowAll((s) => !s)}>
              {showAll ? 'Show fewer' : `Show ${hiddenCount} more graduate${hiddenCount === 1 ? '' : 's'}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}