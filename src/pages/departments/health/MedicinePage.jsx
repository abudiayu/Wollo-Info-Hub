import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/health.png';

export default function MedicinePage() {
  return (
    <DepartmentDetailPage
      accent="#e63946" accentDark="#c1121f"
      collegeLabel="College of Health Sciences"
      name="Medicine (MD)"
      tagline="Become a doctor trained to serve Ethiopia's communities with clinical excellence and compassion."
      image={img} imageAlt="Medicine students in a teaching hospital"
      duration="6 Years" degree="Doctor of Medicine (MD)"
      parentRoute="/department/medicine" parentLabel="Health Sciences"
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
      requirements={['Ethiopian University Entrance Exam (EUEE) — Natural Science stream', 'Minimum GPA 3.5 in Biology, Chemistry, and Physics', 'Successful medical aptitude interview', 'Medical fitness certificate']}
    />
  );
}
