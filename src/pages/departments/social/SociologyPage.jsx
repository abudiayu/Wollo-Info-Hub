import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function SociologyPage() {
  return (
    <DepartmentDetailPage
      accent="#7c3aed" accentDark="#6d28d9"
      collegeLabel="College of Social Sciences & Humanities"
      name="Sociology"
      tagline="Understand Ethiopian society, culture, and community dynamics from the ground up."
      image={img} imageAlt="Sociology students doing fieldwork"
      duration="4 Years" degree="Bachelor of Arts in Sociology (BA)"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="Sociology at Wollo University explores social structures, institutions, inequality, gender, ethnicity, migration, and community development in the Ethiopian context. Students conduct fieldwork in urban and rural communities around Dessie, applying sociological methods to document and analyse real social change. Graduates work in community development, social research, NGOs, and government agencies."
      highlights={[
        { icon: 'users', title: 'Community Fieldwork',  desc: 'Semester-long field placements in Dessie and surrounding zones.' },
        { icon: 'book',  title: 'Gender Studies',       desc: 'Dedicated gender equity and women empowerment module.' },
        { icon: 'globe', title: 'Migration Research',   desc: 'Urban-rural migration is a key research strand at the department.' },
        { icon: 'star',  title: 'NGO Partnerships',     desc: 'Research partnerships with CARE Ethiopia and Save the Children.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Introduction to Sociology', 'Social Anthropology', 'Research Methods I', 'Ethiopian History & Society', 'Communication'] },
        { year: 'Year 2', subjects: ['Social Theory', 'Research Methods II', 'Gender & Society', 'Urban Sociology', 'Rural Sociology'] },
        { year: 'Year 3', subjects: ['Social Statistics', 'Development Sociology', 'Ethnicity & Conflict', 'Migration Studies', 'Community Development'] },
        { year: 'Year 4', subjects: ['Applied Research Project', 'Social Policy', 'Fieldwork', 'Sociology of Religion', 'Internship'] },
      ]}
      careers={['Social Researcher', 'Community Development Officer', 'NGO Programme Manager', 'Government Social Affairs Officer', 'Policy Researcher', 'Lecturer']}
      requirements={['EUEE — Social Science stream', 'English language proficiency', 'Written assessment']}
    />
  );
}
