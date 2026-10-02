import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/informatics.png';

export default function InfoSystemsPage() {
  return (
    <DepartmentDetailPage
      accent="#7c3aed" accentDark="#6d28d9"
      collegeLabel="College of Informatics"
      name="Information Systems"
      tagline="Bridge business strategy and technology to build smarter organisations."
      image={img} imageAlt="Information systems students"
      duration="4 Years" degree="Bachelor of Science in Information Systems"
      parentRoute="/department/computer-science" parentLabel="Informatics"
      overview="Information Systems combines business analysis, database design, ERP implementation, and organisational informatics. Graduates work at the intersection of management and technology, designing systems that help hospitals, banks, government agencies, and enterprises operate more efficiently."
      highlights={[
        { icon: 'book',  title: 'ERP Training',          desc: 'SAP and Odoo ERP platforms used in practicals.' },
        { icon: 'users', title: 'Business Analysis',     desc: 'Requirements gathering, UML modelling, and process design.' },
        { icon: 'lab',   title: 'Database Design Lab',   desc: 'Oracle and MySQL-based system design projects.' },
        { icon: 'star',  title: 'Industry Projects',     desc: 'Real organisations provide system design briefs in Year 4.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Intro to Information Systems', 'Programming Fundamentals', 'Business Studies', 'Mathematics', 'Communication'] },
        { year: 'Year 2', subjects: ['Systems Analysis & Design', 'Database Management', 'Accounting', 'Management Information Systems', 'Statistics'] },
        { year: 'Year 3', subjects: ['ERP Systems', 'Business Intelligence', 'Project Management', 'Information Security', 'E-Commerce'] },
        { year: 'Year 4', subjects: ['IS Strategy', 'Capstone System Project', 'Internship', 'Research Methods'] },
      ]}
      careers={['Business Analyst', 'ERP Consultant', 'Systems Designer', 'Data Analyst', 'IT Manager', 'Digital Transformation Lead', 'E-Government Specialist']}
      requirements={['EUEE — Natural Science or Social Science stream', 'Mathematics pass', 'Written assessment']}
    />
  );
}
