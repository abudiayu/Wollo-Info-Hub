import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/health.png';

export default function PharmacyPage() {
  return (
    <DepartmentDetailPage
      accent="#7c3aed" accentDark="#6d28d9"
      collegeLabel="College of Health Sciences"
      name="Pharmacy"
      tagline="Master the science of medicines and become a trusted pharmaceutical professional."
      image={img} imageAlt="Pharmacy students in a dispensary lab"
      duration="5 Years" degree="Bachelor of Pharmacy (B.Pharm)"
      parentRoute="/department/medicine" parentLabel="Health Sciences"
      overview="The Pharmacy program prepares students in pharmaceutical sciences, drug formulation, clinical pharmacy, and pharmacovigilance. Graduates serve in hospital pharmacies, community dispensaries, regulatory bodies, and the pharmaceutical industry across Ethiopia."
      highlights={[
        { icon: 'lab',   title: 'Pharmaceutical Lab',    desc: 'Dedicated dispensing and compounding labs with modern equipment.' },
        { icon: 'clock', title: 'Hospital Internship',   desc: '6-month supervised hospital pharmacy attachment in Year 5.' },
        { icon: 'book',  title: 'Clinical Pharmacy',     desc: 'Patient counselling and drug interaction assessment skills.' },
        { icon: 'star',  title: 'Industry Placement',    desc: 'Partnerships with Ethiopian Pharmaceuticals Supply Agency.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['General Chemistry', 'Biology', 'Mathematics', 'Introduction to Pharmacy', 'Physics'] },
        { year: 'Year 2', subjects: ['Organic Chemistry', 'Biochemistry', 'Anatomy & Physiology', 'Microbiology'] },
        { year: 'Year 3', subjects: ['Pharmacognosy', 'Pharmaceutics I', 'Pharmacology I', 'Pharmaceutical Analysis'] },
        { year: 'Year 4', subjects: ['Pharmaceutics II', 'Pharmacology II', 'Clinical Pharmacy', 'Drug Regulatory Affairs'] },
        { year: 'Year 5', subjects: ['Hospital Pharmacy Internship', 'Community Pharmacy Internship', 'Research Project'] },
      ]}
      careers={['Hospital Pharmacist', 'Community Pharmacist', 'Drug Regulatory Officer', 'Pharmaceutical Industry', 'Clinical Researcher', 'Pharmacy Educator']}
      requirements={['EUEE — Natural Science stream', 'Minimum grade B in Chemistry', 'Aptitude assessment']}
    />
  );
}
