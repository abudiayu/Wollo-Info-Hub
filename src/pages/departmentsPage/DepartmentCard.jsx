import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DepartmentCard.css';

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
 * Props:
 *  - deptId: string  ('informatics' | 'engineering' | 'social' | 'health' | 'sport')
 *  - image:  imported image asset
 */
export default function DepartmentCard({ deptId, image }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const name        = t(`departments.${deptId}.name`);
  const description = t(`departments.${deptId}.description`);
  // i18next returns the array from JSON directly when returnObjects:true,
  // but we use a safe fallback in case it comes back as a string.
  const programs    = t(`departments.${deptId}.programs`, { returnObjects: true });
  const programList = Array.isArray(programs) ? programs : [];

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
          {isOpen ? t('departments.close') : t('departments.exploreMore')}
          <ArrowIcon open={isOpen} />
        </button>

        <div className={`dcard-programs-wrap ${isOpen ? 'is-open' : ''}`}>
          <div className="dcard-programs-inner">
            <ul className="dcard-programs-list">
              {programList.map((p) => (
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
              {t('departments.back')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
