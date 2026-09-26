import { useState } from 'react';
import "./DepartmentCard.css";

/* ── Arrow icon — rotates on expand ───────────────────────────── */
function ArrowIcon({ open }) {
  return (
    <svg
      className={`dcard-arrow ${open ? 'is-open' : ''}`}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d="M3 8h9M8 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Reusable department card.
 * Props:
 *  - name: string
 *  - description: string
 *  - image: imported image asset
 *  - programs: string[] — the programs/fields under this department
 */
export default function DepartmentCard({ name, description, image, programs = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="dcard">
      <div className="dcard-image-wrap">
        <img src={image} alt={name} className="dcard-image" loading="lazy" />
      </div>

      <div className="dcard-body">
        <h3 className="dcard-name">{name}</h3>
        <p className="dcard-desc">{description}</p>

        <button
          className="dcard-explore"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
        >
          {isOpen ? 'Close' : 'Explore More'}
          <ArrowIcon open={isOpen} />
        </button>

        {/* Expand panel — CSS grid-rows trick for a smooth height animation */}
        <div className={`dcard-programs-wrap ${isOpen ? 'is-open' : ''}`}>
          <div className="dcard-programs-inner">
            <ul className="dcard-programs-list">
              {programs.map((p) => (
                <li key={p} className="dcard-program-item">
                  <span className="dcard-program-dot" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <button
              className="dcard-back-link"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}