import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MotivationCard from './MotivationCard';
import './MotivationPage.css';

import socialImg      from '../../assets/social.png';
import healthImg      from '../../assets/health.png';
import informaticsImg from '../../assets/informatics.png';
import engineeringImg from '../../assets/engineering.png';

const FALLBACK_CARDS = [
  { cardKey: 'card1', image: socialImg      },
  { cardKey: 'card2', image: healthImg      },
  { cardKey: 'card3', image: informaticsImg },
  { cardKey: 'card4', image: engineeringImg },
];

const API = (import.meta.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function MotivationPage() {
  const { t } = useTranslation();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/public/sections/motivation`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.items?.length) setItems(data.items); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Show CMS content if available, otherwise fall back to static cards
  const hasCms = !loading && items.length > 0;

  return (
    <section className="motiv-section" aria-label="Motivation">
      <div className="motiv-inner">
        <h2 className="motiv-heading">{t('motivation.heading')}</h2>
        <hr className="motiv-rule" />

        {hasCms ? (
          <div className="motiv-grid">
            {items.map((item) => (
              <article key={item.id} className="motiv-cms-card">
                {item.cover_url && (
                  <div className="motiv-cms-cover">
                    <img src={item.cover_url} alt={item.title} loading="lazy" />
                  </div>
                )}
                <div className="motiv-cms-body">
                  <h3 className="motiv-cms-title">{item.title}</h3>
                  <div
                    className="motiv-cms-text"
                    dangerouslySetInnerHTML={{ __html: item.body || '' }}
                  />
                  {item.gallery?.length > 0 && (
                    <div className="motiv-cms-gallery">
                      {item.gallery.map(m => (
                        m.type === 'image'
                          ? <img key={m.id} src={m.url} alt={m.original_name} loading="lazy" />
                          : <a key={m.id} href={m.url} download={m.original_name} className="motiv-cms-file">
                              📎 {m.original_name}
                            </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="motiv-grid">
            {FALLBACK_CARDS.map((c) => (
              <MotivationCard
                key={c.cardKey}
                cardKey={c.cardKey}
                image={c.image}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
