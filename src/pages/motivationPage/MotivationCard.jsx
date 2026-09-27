import { useTranslation } from 'react-i18next';
import './MotivationCard.css';

/**
 * Props:
 *  - cardKey : 'card1' | 'card2' | 'card3' | 'card4'
 *  - image   : imported image asset
 *
 * Behaviour:
 *  - Image shows clean by default (no text visible)
 *  - On hover OR focus-within: dark overlay + text slides up into view
 *  - Each card is independently focusable (tabIndex=0, role=article)
 */
export default function MotivationCard({ cardKey, image }) {
  const { t } = useTranslation();

  const title       = t(`motivation.${cardKey}.title`);
  const description = t(`motivation.${cardKey}.description`);
  const cta         = t(`motivation.${cardKey}.cta`);
  const hasDesc     = description && description !== `motivation.${cardKey}.description`;

  return (
    <article
      className="mcard"
      tabIndex={0}
      aria-label={title}
    >
      {/* Full-bleed image — always visible */}
      <img
        src={image}
        alt=""
        className="mcard-img"
        loading="lazy"
        aria-hidden="true"
      />

      {/* Overlay — fades in on hover/focus */}
      <div className="mcard-overlay" aria-hidden="true" />

      {/* Text body — slides up on hover/focus, hidden by default */}
      <div className="mcard-body">
        <h3 className="mcard-title">{title}</h3>
        {hasDesc && <p className="mcard-desc">{description}</p>}

        <div className="mcard-cta">
          <span className="mcard-cta-btn" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
              <path
                d="M3 8h9M8 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <a className="mcard-cta-link" href="#" tabIndex={0}>
            {cta}
          </a>
        </div>
      </div>
    </article>
  );
}
