import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function PsychologyPage() {
  return (
    <DepartmentDetailPage
      accent="#0d9488" accentDark="#0f766e"
      collegeLabel="College of Social Sciences & Humanities"
      name="Psychology"
      tagline="Understand the human mind and support mental health across Ethiopian communities."
      image={img} imageAlt="Psychology students in counselling practice"
      duration="4 Years" degree="Bachelor of Arts in Psychology (BA)"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="Psychology at Wollo University covers counselling, developmental, organisational, clinical, and community psychology. Ethiopia has a critical shortage of mental health professionals, and graduates from this program are among the most urgently needed in the health system. Students gain practical counselling hours in the university wellness centre and partner health facilities."
      highlights={[
        { icon: 'users', title: 'Counselling Practicum', desc: '200+ supervised counselling hours before graduation.' },
        { icon: 'lab',   title: 'Psychometrics Lab',     desc: 'Psychological testing and assessment tools in practicals.' },
        { icon: 'globe', title: 'School Placements',     desc: 'School counselling attachments in Dessie and nearby towns.' },
        { icon: 'star',  title: 'Mental Health Awareness', desc: 'Annual campus mental health campaign organised by students.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Introduction to Psychology', 'Biology for Psychologists', 'Research Methods I', 'Communication Skills', 'Ethiopian Society'] },
        { year: 'Year 2', subjects: ['Developmental Psychology', 'Social Psychology', 'Abnormal Psychology', 'Research Methods II', 'Counselling Skills'] },
        { year: 'Year 3', subjects: ['Clinical Psychology', 'Organisational Psychology', 'Psychometrics & Testing', 'Health Psychology', 'Counselling Practicum I'] },
        { year: 'Year 4', subjects: ['Community Psychology', 'Counselling Practicum II', 'Internship', 'Research Project', 'Ethics in Psychology'] },
      ]}
      careers={['School Counsellor', 'Clinical Psychologist (with MSc)', 'HR/Organisational Psychologist', 'Community Mental Health Worker', 'Researcher', 'Social Worker', 'NGO Mental Health Officer']}
      requirements={['EUEE — Social Science stream', 'English language proficiency', 'Empathy and communication aptitude assessment']}
    />
  );
}
