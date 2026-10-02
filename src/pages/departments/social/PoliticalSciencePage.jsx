import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function PoliticalSciencePage() {
  return (
    <DepartmentDetailPage
      accent="#1e3a8a" accentDark="#1e40af"
      collegeLabel="College of Social Sciences & Humanities"
      name="Political Science"
      tagline="Understand governance, power, and international relations in a changing Africa."
      image={img} imageAlt="Political science students in debate"
      duration="4 Years" degree="Bachelor of Arts in Political Science (BA)"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="Political Science at Wollo University examines Ethiopian federalism, comparative politics, international relations, public policy, and African Union governance. Students participate in model African Union simulations, policy debates, and research projects on Ethiopian political institutions. Graduates pursue careers in government, diplomacy, the civil service, and research institutions."
      highlights={[
        { icon: 'globe', title: 'Model African Union',  desc: 'Annual simulation of AU summits with universities across Ethiopia.' },
        { icon: 'book',  title: 'Policy Debates',       desc: 'Structured policy debate competitions every semester.' },
        { icon: 'users', title: 'Government Links',     desc: 'Guest lectures from senior government officials and diplomats.' },
        { icon: 'star',  title: 'Research Focus',       desc: 'Ethiopian federalism and decentralisation are key research areas.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Introduction to Political Science', 'Ethiopian History', 'Introduction to International Relations', 'Communication', 'Civics'] },
        { year: 'Year 2', subjects: ['Comparative Politics', 'Ethiopian Government & Politics', 'Political Theory', 'Research Methods', 'African Politics'] },
        { year: 'Year 3', subjects: ['International Relations Theory', 'Public Administration', 'Political Economy', 'Conflict & Peacebuilding', 'Electoral Systems'] },
        { year: 'Year 4', subjects: ['Foreign Policy Analysis', 'Diplomacy', 'Research Project', 'Internship', 'Good Governance'] },
      ]}
      careers={['Government Officer', 'Diplomat / Foreign Service', 'Political Researcher', 'Civil Society Analyst', 'Policy Advisor', 'International Organisation Staff', 'Journalist (Politics)']}
      requirements={['EUEE — Social Science stream', 'English language proficiency', 'Written assessment']}
    />
  );
}
