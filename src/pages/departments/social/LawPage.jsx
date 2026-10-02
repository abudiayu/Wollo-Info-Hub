import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function LawPage() {
  return (
    <DepartmentDetailPage
      accent="#1e3a8a" accentDark="#1e40af"
      collegeLabel="College of Social Sciences & Humanities"
      name="Law (LLB)"
      tagline="Practise justice, defend rights, and shape Ethiopia's legal landscape."
      image={img} imageAlt="Law students in moot court"
      duration="5 Years" degree="Bachelor of Laws (LLB)"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="The LLB program covers constitutional law, criminal law, commercial law, family law, and international law. Students gain practical experience through the university's free Legal Aid Clinic and annual Moot Court competitions. Graduates pursue careers in law firms, the judiciary, prosecution, corporate legal departments, and the diplomatic service."
      highlights={[
        { icon: 'users', title: 'Moot Court',       desc: 'Compete in regional and national moot court tournaments.' },
        { icon: 'book',  title: 'Legal Aid Clinic',  desc: 'Provide real legal advice to the Dessie community.' },
        { icon: 'globe', title: 'International Law', desc: 'African Union and international humanitarian law tracks.' },
        { icon: 'star',  title: 'Bar Exam Prep',     desc: 'Structured Ethiopian Federal Bar Examination preparation.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Legal Method & Writing', 'Constitutional Law I', 'Law of Persons', 'Introduction to Ethiopian Legal System', 'English for Law'] },
        { year: 'Year 2', subjects: ['Constitutional Law II', 'Contract Law', 'Tort Law', 'Criminal Law I', 'Property Law'] },
        { year: 'Year 3', subjects: ['Criminal Law II', 'Commercial Law', 'Family Law', 'Administrative Law', 'Evidence'] },
        { year: 'Year 4', subjects: ['Civil Procedure', 'Criminal Procedure', 'Labour Law', 'International Law', 'Tax Law'] },
        { year: 'Year 5', subjects: ['Moot Court', 'Internship', 'Research Paper', 'Dispute Resolution', 'Legal Ethics'] },
      ]}
      careers={['Lawyer / Advocate', 'Judge', 'Public Prosecutor', 'Legal Advisor (Corporate)', 'Government Law Officer', 'Human Rights Officer', 'Diplomat']}
      requirements={['EUEE — Social Science stream', 'Amharic and English language proficiency', 'Written aptitude assessment']}
    />
  );
}
