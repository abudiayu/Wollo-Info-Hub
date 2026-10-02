import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/informatics.png';

export default function SoftwareEngPage() {
  return (
    <DepartmentDetailPage
      accent="#059669" accentDark="#047857"
      collegeLabel="College of Informatics"
      name="Software Engineering"
      tagline="Design, build, and ship large-scale software with engineering rigour."
      image={img} imageAlt="Software engineering team working"
      duration="4 Years" degree="Bachelor of Science in Software Engineering"
      parentRoute="/department/computer-science" parentLabel="Informatics"
      overview="Software Engineering at Wollo University teaches systematic approaches to building reliable, scalable, and maintainable software. The curriculum covers software architecture, agile methodology, testing, DevOps, and full-stack development. Students complete a year-long capstone working in teams to deliver production-ready software."
      highlights={[
        { icon: 'lab',   title: 'Agile Studio',          desc: '2-week sprints with code review, standups, and retrospectives.' },
        { icon: 'star',  title: 'Open Source Projects',  desc: 'Students contribute to real open-source codebases in Year 3.' },
        { icon: 'users', title: 'Team-Based Learning',   desc: 'All major projects built in teams of 4–6 students.' },
        { icon: 'book',  title: 'DevOps Pipeline',       desc: 'CI/CD, Docker, and automated testing in every project.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Programming I (Python/Java)', 'Mathematics', 'Introduction to SE', 'Digital Systems', 'Technical Writing'] },
        { year: 'Year 2', subjects: ['OOP & Design Patterns', 'Data Structures', 'Database Systems', 'Software Requirements', 'Web Development'] },
        { year: 'Year 3', subjects: ['Software Architecture', 'Agile Methods', 'Software Testing', 'Mobile Development', 'DevOps & CI/CD'] },
        { year: 'Year 4', subjects: ['Distributed Systems', 'Capstone Project (2 semesters)', 'Software Project Management', 'Ethics in SE'] },
      ]}
      careers={['Full-Stack Developer', 'Software Architect', 'QA Engineer', 'DevOps Engineer', 'Mobile App Developer', 'Engineering Manager', 'Startup Founder']}
      requirements={['EUEE — Natural Science stream', 'Mathematics grade A', 'Logical reasoning and programming aptitude test']}
    />
  );
}
