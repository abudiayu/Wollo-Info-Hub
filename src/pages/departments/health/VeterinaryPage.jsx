import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/health.png';

export default function VeterinaryPage() {
  return (
    <DepartmentDetailPage
      accent="#65a30d" accentDark="#4d7c0f"
      collegeLabel="College of Health Sciences"
      name="Veterinary Medicine"
      tagline="Protect animal health, food safety, and public health across Ethiopia."
      image={img} imageAlt="Veterinary students in animal clinic"
      duration="5 Years" degree="Doctor of Veterinary Medicine (DVM)"
      parentRoute="/department/medicine" parentLabel="Health Sciences"
      overview="The DVM program trains veterinarians to diagnose, treat, and prevent diseases in livestock, companion animals, and wildlife. Given Ethiopia's enormous agricultural economy, veterinary graduates play a critical role in food security and rural livelihoods. Clinical training is conducted at the university veterinary clinic and partner farms in the Amhara region."
      highlights={[
        { icon: 'lab',   title: 'Teaching Veterinary Clinic', desc: 'On-campus clinic treating cattle, equines, and small animals.' },
        { icon: 'globe', title: 'Farm Postings',              desc: 'Large animal rotations on partner farms and government ranches.' },
        { icon: 'book',  title: 'One Health Approach',        desc: 'Links animal, human, and environmental health in the curriculum.' },
        { icon: 'star',  title: 'Public Health Track',        desc: 'Zoonotic disease control and meat inspection training.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Animal Anatomy', 'Biochemistry', 'Animal Physiology', 'Introduction to Veterinary Science', 'Animal Husbandry'] },
        { year: 'Year 2', subjects: ['Veterinary Microbiology', 'Pathology', 'Pharmacology', 'Parasitology', 'Immunology'] },
        { year: 'Year 3', subjects: ['Internal Medicine', 'Surgery', 'Reproductive Health', 'Poultry Disease', 'Theriogenology'] },
        { year: 'Year 4', subjects: ['Epidemiology', 'Food Hygiene & Inspection', 'Clinical Rotations I', 'Diagnostic Laboratory'] },
        { year: 'Year 5', subjects: ['Clinical Rotations II', 'Research Project', 'Farm Animal Practice', 'Veterinary Extension'] },
      ]}
      careers={['Government Veterinary Officer', 'Animal Clinic Veterinarian', 'Livestock Development Expert', 'Meat Inspector', 'Zoonotic Disease Researcher', 'International NGO — Animal Health']}
      requirements={['EUEE — Natural Science stream', 'Biology, Chemistry pass', 'Medical fitness certificate']}
    />
  );
}
