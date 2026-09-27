import { useTranslation } from 'react-i18next';
import MotivationCard from './MotivationCard';
import './MotivationPage.css';

import socialImg      from '../../assets/social.png';
import healthImg      from '../../assets/health.png';
import informaticsImg from '../../assets/informatics.png';
import engineeringImg from '../../assets/engineering.png';

const CARDS = [
  { cardKey: 'card1', image: socialImg      },
  { cardKey: 'card2', image: healthImg      },
  { cardKey: 'card3', image: informaticsImg },
  { cardKey: 'card4', image: engineeringImg },
];

export default function MotivationPage() {
  const { t } = useTranslation();

  return (
    <section className="motiv-section" aria-label="Motivation">
      <div className="motiv-inner">
        <h2 className="motiv-heading">{t('motivation.heading')}</h2>
        <hr className="motiv-rule" />

        <div className="motiv-grid">
          {CARDS.map((c) => (
            <MotivationCard
              key={c.cardKey}
              cardKey={c.cardKey}
              image={c.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
