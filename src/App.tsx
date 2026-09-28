import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Auth from './pages/Auth/Auth';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}
