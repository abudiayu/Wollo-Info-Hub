import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function AccountingPage() {
  return (
    <DepartmentDetailPage
      accent="#0f766e" accentDark="#0d6b63"
      collegeLabel="College of Social Sciences & Humanities"
      name="Accounting"
      tagline="Master financial reporting, auditing, and fiscal management for Ethiopia's growing economy."
      image={img} imageAlt="Accounting students in computer lab"
      duration="4 Years" degree="Bachelor of Science in Accounting"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="Accounting at Wollo University trains students in financial reporting, cost accounting, auditing, taxation, and public sector finance. The curriculum follows International Financial Reporting Standards (IFRS) and prepares graduates for the Ethiopian Accounting and Auditing Board certification. Practical placements with banks, government agencies, and NGOs are integrated from Year 3."
      highlights={[
        { icon: 'book',  title: 'IFRS Standards',     desc: 'Full alignment with international financial reporting standards.' },
        { icon: 'lab',   title: 'Accounting Software', desc: 'QuickBooks, Peachtree, and Excel modelling in practicals.' },
        { icon: 'users', title: 'Audit Internship',    desc: 'Structured audit firm attachment in Year 4.' },
        { icon: 'star',  title: 'CPA Preparation',     desc: 'Ethiopian CPA exam preparation modules in final year.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Principles of Accounting', 'Business Mathematics', 'Economics', 'Business Communication', 'Computer Applications'] },
        { year: 'Year 2', subjects: ['Financial Accounting I', 'Managerial Accounting', 'Business Statistics', 'Microeconomics', 'Commercial Law'] },
        { year: 'Year 3', subjects: ['Financial Accounting II', 'Cost Accounting', 'Auditing I', 'Taxation', 'Financial Management'] },
        { year: 'Year 4', subjects: ['Auditing II', 'Public Sector Accounting', 'Accounting Information Systems', 'Research Project', 'Internship'] },
      ]}
      careers={['Accountant', 'Auditor', 'Finance Manager', 'Tax Consultant', 'Budget Analyst', 'Bank Officer', 'CFO (with experience)']}
      requirements={['EUEE — Social Science stream', 'Mathematics pass', 'Written numeracy test']}
    />
  );
}
