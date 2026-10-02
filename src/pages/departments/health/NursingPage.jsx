import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/health.png';

export default function NursingPage() {
  return (
    <DepartmentDetailPage
      accent="#0891b2" accentDark="#0e7490"
      collegeLabel="College of Health Sciences"
      name="Nursing"
      tagline="Deliver life-saving patient-centred care across hospitals and communities."
      image={img} imageAlt="Nursing students in clinical practice"
      duration="4 Years" degree="Bachelor of Science in Nursing (BSc)"
      parentRoute="/department/medicine" parentLabel="Health Sciences"
      overview="Nursing at Wollo University produces highly skilled nurses equipped for hospital wards, intensive care, primary healthcare, and community nursing. The curriculum integrates biomedical sciences with extensive clinical practice, ethics, and leadership. Graduates are eligible for registration with the Ethiopian Health Professionals Council."
      highlights={[
        { icon: 'users', title: '800+ Clinical Hours',    desc: 'Structured ward placements across all major specialties.' },
        { icon: 'lab',   title: 'Simulation Centre',      desc: 'High-fidelity patient mannequins for safe skills practice.' },
        { icon: 'globe', title: 'Community Nursing',      desc: 'Maternal, child, and public health postings in rural areas.' },
        { icon: 'star',  title: 'Leadership Track',       desc: 'Optional nursing management and ward leadership modules.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Anatomy', 'Physiology', 'Fundamentals of Nursing', 'Nutrition', 'Communication Skills'] },
        { year: 'Year 2', subjects: ['Medical-Surgical Nursing', 'Pharmacology', 'Microbiology', 'Health Assessment'] },
        { year: 'Year 3', subjects: ['Paediatric Nursing', 'Obstetric Nursing', 'Psychiatric Nursing', 'Community Health Nursing'] },
        { year: 'Year 4', subjects: ['Critical Care Nursing', 'Nursing Research', 'Management in Nursing', 'Final Clinical Attachment'] },
      ]}
      careers={['Hospital Staff Nurse', 'ICU/Critical Care Nurse', 'Community Health Nurse', 'Midwifery Support', 'Nursing Educator', 'NGO Health Worker', 'Ward Manager']}
      requirements={['EUEE — Natural Science stream', 'Biology and Chemistry pass', 'Medical fitness certificate']}
    />
  );
}
