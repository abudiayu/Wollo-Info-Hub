import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/health.png';

/*
 * ──────────────────────────────────────────────────────────────
 *  SAMPLE GRADUATES
 *  The first 4 entries are static examples so the section always
 *  renders. In production a department head logs into the admin
 *  panel and adds real alumni — those come in via the graduates
 *  prop (fetched from the API). The static samples here act as
 *  seed data until the API returns real entries.
 * ──────────────────────────────────────────────────────────────
 */
const SAMPLE_GRADUATES = [
  {
    name:      'Dr. Abebe Girma',
    role:      'General Practitioner',
    workplace: 'Dessie Referral Hospital',
    location:  'Dessie, Ethiopia',
    year:      '2018',
    photo:     null,          // no photo → shows initials
    link:      null,
  },
  {
    name:      'Dr. Fatima Yimer',
    role:      'Obstetrician & Gynaecologist',
    workplace: 'Boru Meda Hospital',
    location:  'Kombolcha, Ethiopia',
    year:      '2019',
    photo:     null,
    link:      null,
  },
  {
    name:      'Dr. Dawit Bekele',
    role:      'Paediatrician',
    workplace: 'St. Paul\'s Hospital',
    location:  'Addis Ababa, Ethiopia',
    year:      '2020',
    photo:     null,
    link:      null,
  },
  {
    name:      'Dr. Hana Tessema',
    role:      'Public Health Officer',
    workplace: 'Amhara Regional Health Bureau',
    location:  'Bahir Dar, Ethiopia',
    year:      '2021',
    photo:     null,
    link:      null,
  },
];

/*
 * ──────────────────────────────────────────────────────────────
 *  SAMPLE REVIEWS
 *  Two starter reviews so the ratings panel is never empty.
 *  Real reviews accumulate from the form below.
 * ──────────────────────────────────────────────────────────────
 */
const SAMPLE_REVIEWS = [
  {
    id:      'sample-1',
    name:    'Selam Tadesse',
    role:    'Graduate',
    rating:  5,
    comment: 'The clinical rotations starting in Year 3 were invaluable. You get real hands-on experience at Dessie Referral Hospital far earlier than at most Ethiopian universities. Highly recommended for anyone serious about medicine.',
    date:    'Mar 2024',
  },
  {
    id:      'sample-2',
    name:    'Yonas Haile',
    role:    'Student',
    rating:  4,
    comment: 'Strong faculty and well-equipped labs. The problem-based learning approach makes you think like a doctor from day one. The campus facilities could use some improvement, but the academic quality is excellent.',
    date:    'Jan 2024',
  },
];

export default function MedicinePage() {
  return (
    <DepartmentDetailPage
      accent="#e63946"
      accentDark="#c1121f"
      collegeLabel="College of Health Sciences"
      name="Medicine (MD)"
      tagline="Become a doctor trained to serve Ethiopia's communities with clinical excellence and compassion."
      image={img}
      imageAlt="Medicine students in a teaching hospital"
      duration="6 Years"
      degree="Doctor of Medicine (MD)"
      parentRoute="/department/medicine"
      parentLabel="Health Sciences"
      overview="The Doctor of Medicine program at Wollo University is a six-year professional degree combining pre-clinical sciences, clinical rotations, and community health practice. Students rotate through Dessie Referral Hospital and partner district hospitals from Year 3, gaining hands-on patient care experience before graduation."
      highlights={[
        { icon: 'lab',   title: 'Clinical Rotations',    desc: 'Over 2,000 hours in teaching hospitals starting Year 3.' },
        { icon: 'users', title: 'Small Group Learning',  desc: 'Problem-based learning in cohorts of 10–15 students.' },
        { icon: 'globe', title: 'Community Postings',    desc: 'Rural health centre rotations in Years 4 and 5.' },
        { icon: 'star',  title: 'Licensure Preparation', desc: '98% first-attempt pass rate on the Ethiopian Medical Licensure Exam.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Anatomy', 'Histology', 'Biochemistry', 'Medical Physics', 'Introduction to Medicine'] },
        { year: 'Year 2', subjects: ['Physiology', 'Microbiology', 'Pathology', 'Pharmacology', 'Parasitology'] },
        { year: 'Year 3', subjects: ['Internal Medicine I', 'Surgery I', 'Obstetrics & Gynaecology I', 'Paediatrics I'] },
        { year: 'Year 4', subjects: ['Internal Medicine II', 'Surgery II', 'Psychiatry', 'Dermatology', 'Ophthalmology'] },
        { year: 'Year 5', subjects: ['Community Health', 'ENT', 'Radiology', 'Orthopaedics', 'Emergency Medicine'] },
        { year: 'Year 6', subjects: ['Internship – Internal Medicine', 'Internship – Surgery', 'Internship – Paediatrics', 'Internship – Obs & Gyn'] },
      ]}
      careers={['General Practitioner', 'Hospital Physician', 'Specialist Residency', 'Public Health Officer', 'Medical Researcher', 'Medical Educator', 'NGO Health Advisor']}
      requirements={[
        'Ethiopian University Entrance Exam (EUEE) — Natural Science stream',
        'Minimum GPA 3.5 in Biology, Chemistry, and Physics',
        'Successful medical aptitude interview',
        'Medical fitness certificate',
      ]}
      /* 4 sample graduates — section is always visible */
      graduates={SAMPLE_GRADUATES}
      graduatesCount={280}
      /* 2 sample reviews — ratings panel is never empty */
      reviews={SAMPLE_REVIEWS}
    />
  );
}
