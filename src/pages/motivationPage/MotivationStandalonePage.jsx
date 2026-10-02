import { Link } from 'react-router-dom';
import MotivationPage from './MotivationPage';
import './MotivationStandalonePage.css';

export default function MotivationStandalonePage() {
  return (
    <div className="motiv-standalone">
      <header className="motiv-standalone-hero">
        <div className="motiv-standalone-inner">
          <nav className="motiv-standalone-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>Motivation</span>
          </nav>
          <h1 className="motiv-standalone-title">Motivation & Student Stories</h1>
          <p className="motiv-standalone-sub">
            Real stories from students and staff to keep you going through every semester.
          </p>
        </div>
      </header>

      {/* Reuse the existing MotivationPage section component */}
      <MotivationPage />
    </div>
  );
}
