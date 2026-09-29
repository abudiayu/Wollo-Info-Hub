import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout     from './components/layout/Layout';
import HomePage   from './pages/home/HomePage';
import Statistics from './components/Statistics/Statistics.jsx';
import Auth       from './pages/Auth/Auth';
import NotFound   from './components/NotFoundPage/NotFound.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that share the global Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/"           element={<HomePage />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>

        {/* Standalone pages — no shared Navbar/Footer */}
        <Route path="/auth" element={<Auth />} />
        <Route path="*"     element={<NotFound />} />
      </Routes>
    </Router>
  );
}
