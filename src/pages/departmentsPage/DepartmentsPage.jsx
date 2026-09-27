import { useTranslation } from 'react-i18next';
import DepartmentCard from './DepartmentCard';
import './DepartmentsPags.css';

import informaticsImg from '../../assets/informatics.png';
import engineeringImg from '../../assets/engineering.png';
import socialImg      from '../../assets/social.png';
import healthImg      from '../../assets/health.png';
import sportImg       from '../../assets/Sport.png';

const DEPT_IMAGES = {
  informatics: informaticsImg,
  engineering: engineeringImg,
  social:      socialImg,
  health:      healthImg,
  sport:       sportImg,
};

const DEPT_IDS = ['informatics', 'engineering', 'social', 'health', 'sport'];

export default function DepartmentsPage() {
  const { t } = useTranslation();

  return (
    <section className="dept-section" aria-label="University departments">
      <div className="dept-inner">
        <p className="dept-eyebrow">{t('departments.eyebrow')}</p>
        <h2 className="dept-heading">{t('departments.heading')}</h2>
        <p className="dept-sub">{t('departments.sub')}</p>

        <div className="dept-grid">
          {DEPT_IDS.map((id) => (
            <DepartmentCard
              key={id}
              deptId={id}
              image={DEPT_IMAGES[id]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
