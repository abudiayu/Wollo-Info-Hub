import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/informatics.png';

export default function CSPage() {
  return (
    <DepartmentDetailPage
      accent="#2563eb" accentDark="#1d4ed8"
      collegeLabel="College of Informatics"
      name="Computer Science"
      tagline="Build algorithms, AI systems, and software that solve real problems."
      image={img} imageAlt="Computer Science lab"
      duration="4 Years" degree="Bachelor of Science in Computer Science"
      parentRoute="/department/computer-science" parentLabel="Informatics"
      overview="Computer Science at Wollo University focuses on theoretical foundations and practical implementation of computing. Students study algorithms, data structures, operating systems, artificial intelligence, and software engineering. The department runs an AI research cluster and partners with AppFactory Academy for applied project work."
      highlights={[
        { icon: 'lab',   title: 'AI & ML Lab',          desc: 'GPU-accelerated systems for deep learning research.' },
        { icon: 'users', title: 'AppFactory Incubator',  desc: 'Build and launch real apps with industry mentors.' },
        { icon: 'book',  title: 'Algorithms Focus',      desc: 'Rigorous competitive programming training every semester.' },
        { icon: 'star',  title: 'Final Year Project',    desc: 'Full-stack application or research paper for every graduate.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Introduction to Programming (Python)', 'Discrete Mathematics', 'Digital Logic', 'Calculus', 'English Communication'] },
        { year: 'Year 2', subjects: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Database Systems', 'Computer Architecture', 'Statistics'] },
        { year: 'Year 3', subjects: ['Operating Systems', 'Computer Networks', 'Software Engineering', 'Artificial Intelligence', 'Web Development'] },
        { year: 'Year 4', subjects: ['Machine Learning', 'Mobile App Development', 'Capstone Project', 'Professional Ethics', 'Internship'] },
      ]}
      careers={['Software Engineer', 'AI/ML Engineer', 'Backend Developer', 'Data Scientist', 'DevOps Engineer', 'Systems Analyst', 'Tech Entrepreneur']}
      requirements={['EUEE — Natural Science stream', 'Mathematics grade A or B', 'Logical reasoning assessment']}
    />
  );
}
