import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout         from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage       from './pages/home/HomePage';
import Statistics     from './components/Statistics/Statistics.jsx';
import Admin          from './pages/Admin/Admin.jsx';
import Auth           from './pages/Auth/Auth';
import NotFound       from './components/NotFoundPage/NotFound.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── Routes with shared Navbar + Footer ── */}
        <Route element={<Layout />}>

          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Protected — must be logged in */}
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />

          {/* Admin only — redirect handled inside Admin.jsx */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* ── Standalone pages ── */}
        <Route path="/auth" element={<Auth />} />
        <Route path="*"     element={<NotFound />} />
      </Routes>
    </Router>
  );
}
