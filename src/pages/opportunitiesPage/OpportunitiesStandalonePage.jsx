import { Link } from 'react-router-dom';
import OpportunitiesPage from './OpportunitiesPage';
import './OpportunitiesStandalonePage.css';

export default function OpportunitiesStandalonePage() {
  return (
    <div className="opp-standalone">
      <header className="opp-standalone-hero">
        <div className="opp-standalone-inner">
          <nav className="opp-standalone-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>Opportunities</span>
          </nav>
          <h1 className="opp-standalone-title">Opportunities at Wollo University</h1>
          <p className="opp-standalone-sub">
            Clubs, academies, competitions, and programs — discover everything available beyond the lecture hall.
          </p>
        </div>
      </header>

      {/* Reuse the existing section component */}
      <OpportunitiesPage />
    </div>
  );
}
