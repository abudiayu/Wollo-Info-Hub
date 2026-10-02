import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout         from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage       from './pages/home/HomePage';
import Statistics     from './components/Statistics/Statistics.jsx';
import Admin          from './pages/Admin/Admin.jsx';
import Auth           from './pages/Auth/Auth';
import NotFound       from './components/NotFoundPage/NotFound.jsx';
import DepartmentsPage             from './pages/departmentsPage/DepartmentsPage.jsx';
import AlumniPage                  from './pages/almuniPages/Almuni.jsx';
import MotivationStandalonePage    from './pages/motivationPage/MotivationStandalonePage.jsx';
import OpportunitiesStandalonePage from './pages/opportunitiesPage/OpportunitiesStandalonePage.jsx';
import SearchPage                  from './pages/SearchPage/SearchPage.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── Routes with shared Navbar + Footer ── */}
        <Route element={<Layout />}>
          <Route path="/"              element={<HomePage />} />
          <Route path="/departments"   element={<DepartmentsPage />} />
          <Route path="/alumni"        element={<AlumniPage />} />
          <Route path="/motivation"    element={<MotivationStandalonePage />} />
          <Route path="/opportunities" element={<OpportunitiesStandalonePage />} />
          <Route path="/statistics"    element={<Statistics />} />
          <Route path="/search"        element={<SearchPage />} />
        </Route>

        {/* ── Standalone pages — no shared Navbar/Footer ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="*"     element={<NotFound />} />
      </Routes>
    </Router>
  );
}
