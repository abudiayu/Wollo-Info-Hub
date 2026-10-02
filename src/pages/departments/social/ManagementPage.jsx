import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function ManagementPage() {
  return (
    <DepartmentDetailPage
      accent="#b45309" accentDark="#92400e"
      collegeLabel="College of Social Sciences & Humanities"
      name="Management"
      tagline="Lead teams, build organisations, and drive growth across Ethiopia's private and public sectors."
      image={img} imageAlt="Management students in business class"
      duration="4 Years" degree="Bachelor of Business Administration (BBA)"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="The Management program develops leaders equipped for the complexities of modern organisations. Students study strategic management, human resources, operations, marketing, and entrepreneurship. Case study learning, business plan competitions, and internships with Ethiopian enterprises are central to the program."
      highlights={[
        { icon: 'users', title: 'Business Plan Competition', desc: 'Annual inter-university competition with prize funding.' },
        { icon: 'book',  title: 'Case Study Method',        desc: 'Harvard-style business case analyses every week.' },
        { icon: 'globe', title: 'Entrepreneurship Hub',     desc: 'Seed funding and mentorship for student ventures.' },
        { icon: 'star',  title: 'Industry Mentors',         desc: 'Ethiopian CEOs and managers guest lecture regularly.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Principles of Management', 'Economics', 'Business Mathematics', 'Communication Skills', 'Introduction to Business'] },
        { year: 'Year 2', subjects: ['Organisational Behaviour', 'Marketing Management', 'Financial Accounting', 'Business Law', 'Statistics'] },
        { year: 'Year 3', subjects: ['Strategic Management', 'Human Resource Management', 'Operations Management', 'Entrepreneurship', 'Research Methods'] },
        { year: 'Year 4', subjects: ['International Business', 'Project Management', 'Business Ethics', 'Internship', 'Research Project'] },
      ]}
      careers={['Business Manager', 'HR Manager', 'Marketing Manager', 'Operations Manager', 'Entrepreneur', 'Project Manager', 'Government Administrator']}
      requirements={['EUEE — Social Science stream', 'English language proficiency', 'Written assessment']}
    />
  );
}
