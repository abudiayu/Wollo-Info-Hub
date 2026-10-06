import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout         from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage       from './pages/home/HomePage';
import Statistics     from './components/Statistics/Statistics.jsx';
import Admin          from './pages/Admin/Admin.jsx';
import Auth           from './pages/Auth/Auth';
import DepartmentHead from './pages/DepartmentHead/DepartmentHead.jsx';
import NotFound       from './components/NotFoundPage/NotFound.jsx';

import DepartmentsPage          from './pages/departmentsPage/DepartmentsPage.jsx';
import AlumniPage               from './pages/almuniPages/Almuni.jsx';
import MotivationStandalonePage from './pages/motivationPage/MotivationStandalonePage.jsx';
import OpportunitiesPage        from './pages/opportunitiesPage/OpportunitiesPage.jsx';
import SearchPage               from './pages/SearchPage/SearchPage.jsx';

/* ── Faculty overview pages ── */
import Medicine        from './pages/departments/Medicine/Medicine.jsx';
import ComputerScience from './pages/departments/ComputerScience/ComputerScience.jsx';
import Engineering     from './pages/departments/Engineering/Engineering.jsx';
import SocialScience   from './pages/departments/SocialScience/SocialScience.jsx';
import Sport           from './pages/departments/Sport/Sport.jsx';

/* ── Health Sciences individual programs ── */
import MedicinePage   from './pages/departments/health/MedicinePage.jsx';
import PharmacyPage   from './pages/departments/health/PharmacyPage.jsx';
import NursingPage    from './pages/departments/health/NursingPage.jsx';
import MidwiferyPage  from './pages/departments/health/MidwiferyPage.jsx';
import VeterinaryPage from './pages/departments/health/VeterinaryPage.jsx';

/* ── Informatics individual programs ── */
import CSPage          from './pages/departments/informatics/CSPage.jsx';
import ITPage          from './pages/departments/informatics/ITPage.jsx';
import InfoSystemsPage from './pages/departments/informatics/InfoSystemsPage.jsx';
import SoftwareEngPage from './pages/departments/informatics/SoftwareEngPage.jsx';

/* ── Engineering individual programs (files live in Engineering/ uppercase) ── */
import CivilEngPage       from './pages/departments/Engineering/CivilEngPage.jsx';
import ElectricalEngPage  from './pages/departments/Engineering/ElectricalEngPage.jsx';
import MechanicalEngPage  from './pages/departments/Engineering/MechanicalEngPage.jsx';
import ChemicalEngPage    from './pages/departments/Engineering/ChemicalEngPage.jsx';
import WaterResourcesPage from './pages/departments/Engineering/WaterResourcesPage.jsx';

/* ── Social Sciences individual programs ── */
import LawPage              from './pages/departments/social/LawPage.jsx';
import AccountingPage       from './pages/departments/social/AccountingPage.jsx';
import ManagementPage       from './pages/departments/social/ManagementPage.jsx';
import JournalismPage       from './pages/departments/social/JournalismPage.jsx';
import EconomicsPage        from './pages/departments/social/EconomicsPage.jsx';
import SociologyPage        from './pages/departments/social/SociologyPage.jsx';
import PsychologyPage       from './pages/departments/social/PsychologyPage.jsx';
import PoliticalSciencePage from './pages/departments/social/PoliticalSciencePage.jsx';

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
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/statistics"    element={<Statistics />} />
          <Route path="/search"        element={<SearchPage />} />

          {/* ── Faculty overview pages ── */}
          <Route path="/department/medicine"         element={<Medicine />} />
          <Route path="/department/computer-science" element={<ComputerScience />} />
          <Route path="/department/engineering"      element={<Engineering />} />
          <Route path="/department/social-science"   element={<SocialScience />} />
          <Route path="/department/sport"            element={<Sport />} />

          {/* ── Health Sciences ── */}
          <Route path="/department/medicine/md"         element={<MedicinePage />} />
          <Route path="/department/medicine/pharmacy"   element={<PharmacyPage />} />
          <Route path="/department/medicine/nursing"    element={<NursingPage />} />
          <Route path="/department/medicine/midwifery"  element={<MidwiferyPage />} />
          <Route path="/department/medicine/veterinary" element={<VeterinaryPage />} />

          {/* ── Informatics ── */}
          <Route path="/department/computer-science/cs"                  element={<CSPage />} />
          <Route path="/department/computer-science/it"                  element={<ITPage />} />
          <Route path="/department/computer-science/information-systems" element={<InfoSystemsPage />} />
          <Route path="/department/computer-science/software-engineering" element={<SoftwareEngPage />} />

          {/* ── Engineering ── */}
          <Route path="/department/engineering/civil"           element={<CivilEngPage />} />
          <Route path="/department/engineering/electrical"      element={<ElectricalEngPage />} />
          <Route path="/department/engineering/mechanical"      element={<MechanicalEngPage />} />
          <Route path="/department/engineering/chemical"        element={<ChemicalEngPage />} />
          <Route path="/department/engineering/water-resources" element={<WaterResourcesPage />} />

          {/* ── Social Sciences ── */}
          <Route path="/department/social-science/law"               element={<LawPage />} />
          <Route path="/department/social-science/accounting"        element={<AccountingPage />} />
          <Route path="/department/social-science/management"        element={<ManagementPage />} />
          <Route path="/department/social-science/journalism"        element={<JournalismPage />} />
          <Route path="/department/social-science/economics"         element={<EconomicsPage />} />
          <Route path="/department/social-science/sociology"         element={<SociologyPage />} />
          <Route path="/department/social-science/psychology"        element={<PsychologyPage />} />
          <Route path="/department/social-science/political-science" element={<PoliticalSciencePage />} />
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
        <Route path="/auth"              element={<Auth />} />
        <Route path="/department-head"   element={<DepartmentHead />} />
        <Route path="*"                  element={<NotFound />} />

      </Routes>
    </Router>
  );
}
