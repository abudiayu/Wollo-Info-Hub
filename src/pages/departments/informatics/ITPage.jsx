import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/informatics.png';

export default function ITPage() {
  return (
    <DepartmentDetailPage
      accent="#0891b2" accentDark="#0e7490"
      collegeLabel="College of Informatics"
      name="Information Technology"
      tagline="Manage networks, systems, and IT infrastructure that keeps organisations running."
      image={img} imageAlt="IT networking lab"
      duration="4 Years" degree="Bachelor of Science in Information Technology"
      parentRoute="/department/computer-science" parentLabel="Informatics"
      overview="IT at Wollo University focuses on the practical deployment, management, and security of technology systems. Students learn networking, cybersecurity, cloud computing, IT project management, and systems administration. The department operates a Cisco-certified networking lab and partners with major Ethiopian enterprises for internship placements."
      highlights={[
        { icon: 'lab',   title: 'Cisco Networking Lab', desc: 'Hands-on routing, switching, and firewall configuration.' },
        { icon: 'globe', title: 'Cloud Computing Track', desc: 'AWS and Azure fundamentals integrated into Year 3.' },
        { icon: 'users', title: 'IT Helpdesk Practice',  desc: 'Real IT support experience in university systems.' },
        { icon: 'star',  title: 'Certifications',        desc: 'CompTIA and Cisco exam preparation integrated into coursework.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Computer Fundamentals', 'Programming Basics', 'Mathematics', 'Technical Writing', 'Operating Systems Intro'] },
        { year: 'Year 2', subjects: ['Computer Networking I', 'Database Administration', 'Web Technologies', 'IT Service Management', 'Linux Administration'] },
        { year: 'Year 3', subjects: ['Network Security', 'Cloud Computing', 'Enterprise Systems', 'IT Project Management', 'Wireless Networking'] },
        { year: 'Year 4', subjects: ['Cybersecurity Practicum', 'IT Governance', 'Capstone Project', 'Industry Internship'] },
      ]}
      careers={['Network Administrator', 'IT Manager', 'Cybersecurity Analyst', 'Cloud Engineer', 'Systems Administrator', 'IT Consultant', 'Help Desk Lead']}
      requirements={['EUEE — Natural Science stream', 'Mathematics and Physics pass', 'Technical aptitude test']}
    />
  );
}
