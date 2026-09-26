import DepartmentCard from './DepartmentCard';
import "./DepartmentsPags.css";

/* ── Images ────────────────────────────────────────────────────
   Drop your own high-quality photos into src/assets/departments/
   with these exact filenames, or update the paths below.        */
import informaticsImg from '../../assets/informatics.png';
import engineeringImg from '../../assets/engineering.png';
import socialImg from '../../assets/social.png';
import healthImg from '../../assets/health.png';
import sportImg from "../../assets/Sport.png";

/* ── Data: existing Wollo University department structure ─────
   (reused as-is from the project's existing department data —
   no duplicate or invented programs added)                     */
const DEPARTMENTS = [
  {
    id: 'informatics',
    name: 'Informatics',
    description:
      'Explore computing, software, and information systems shaping tomorrow\u2019s digital world.',
    image: informaticsImg,
    programs: [
      'Computer Science',
      'Software Engineering',
      'Information Technology',
      'Information Systems',
      'Data Science',
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description:
      'Build the infrastructure, machines, and systems that power modern life.',
    image: engineeringImg,
    programs: [
      'Civil Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Chemical Engineering',
      'Water Resources Engineering',
      'Architecture & Urban Planning',
    ],
  },
  {
    id: 'social',
    name: 'Social Science',
    description:
      'Study society, governance, and the economic forces that shape communities.',
    image: socialImg,
    programs: ['Sociology', 'Economics', 'Law', 'Political Science'],
  },
  {
    id: 'health',
    name: 'Health Science',
    description:
      'Train to diagnose, treat, and care for patients across every stage of life.',
    image: healthImg,
    programs: ['Medicine', 'Nursing', 'Pharmacy', 'Public Health', 'Midwifery'],
  },
  {
    id: 'sport',
    name: 'Sport Science',
    description:
      'Develop athletic performance, coaching expertise, and physical education skills.',
    image: sportImg,
    programs: ['Sport Science', 'Physical Education'],
  },
];

export default function DepartmentsPage() {
  return (
    <section className="dept-section" aria-label="University departments">
      <div className="dept-inner">
        <p className="dept-eyebrow">Academics</p>
        <h2 className="dept-heading">Explore Our Departments</h2>
        <p className="dept-sub">
          Five faculties at Wollo University — select a department to see the
          programs it offers.
        </p>

        <div className="dept-grid">
          {DEPARTMENTS.map((dept) => (
            <DepartmentCard
              key={dept.id}
              name={dept.name}
              description={dept.description}
              image={dept.image}
              programs={dept.programs}
            />
          ))}
        </div>
      </div>
    </section>
  );
}