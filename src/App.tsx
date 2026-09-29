import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Auth from './pages/Auth/Auth';
import NotFound from "./components/NotFoundPage/NotFound.jsx";
import Statistics from './components/Statistics/Statistics.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/statistics' element={<Statistics/>}/>
      </Routes>
    </Router>
  );
}
