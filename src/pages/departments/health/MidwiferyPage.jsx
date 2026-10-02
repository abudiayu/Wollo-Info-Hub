import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/health.png';

export default function MidwiferyPage() {
  return (
    <DepartmentDetailPage
      accent="#db2777" accentDark="#be185d"
      collegeLabel="College of Health Sciences"
      name="Midwifery"
      tagline="Safeguard mothers and newborns — one of Ethiopia's highest-priority health roles."
      image={img} imageAlt="Midwifery students in maternal care ward"
      duration="4 Years" degree="Bachelor of Science in Midwifery (BSc)"
      parentRoute="/department/medicine" parentLabel="Health Sciences"
      overview="Midwifery addresses Ethiopia's critical need for skilled birth attendants. The program covers antenatal care, labour management, postnatal care, and emergency obstetrics. Graduates are deployed to hospitals, health centres, and rural maternity units across the country. Ethiopia's maternal mortality reduction depends directly on professionals trained in this field."
      highlights={[
        { icon: 'users', title: '600+ Supervised Deliveries', desc: 'Students assist in deliveries across multiple clinical sites.' },
        { icon: 'globe', title: 'Rural Postings',              desc: 'Mandatory rural health centre posting in Year 3.' },
        { icon: 'lab',   title: 'Obstetric Emergency Drills',  desc: 'Simulated obstetric emergencies for every student.' },
        { icon: 'star',  title: 'High Demand Graduates',       desc: 'Near-100% employment within 3 months of graduation.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Anatomy & Physiology', 'Biochemistry', 'Introduction to Midwifery', 'Health Education'] },
        { year: 'Year 2', subjects: ['Antenatal Care', 'Normal Labour & Delivery', 'Pharmacology', 'Newborn Care'] },
        { year: 'Year 3', subjects: ['High-Risk Obstetrics', 'Family Planning', 'Community Midwifery', 'Nutrition in Pregnancy'] },
        { year: 'Year 4', subjects: ['Emergency Obstetrics', 'Postnatal Care', 'Midwifery Research', 'Final Clinical Attachment'] },
      ]}
      careers={['Midwife — Referral Hospital', 'Community Midwife', 'Family Planning Counsellor', 'Maternal Health Trainer', 'NGO Field Midwife', 'Reproductive Health Educator']}
      requirements={['EUEE — Natural Science stream', 'Biology pass', 'Medical fitness certificate', 'Empathy aptitude assessment']}
    />
  );
}
