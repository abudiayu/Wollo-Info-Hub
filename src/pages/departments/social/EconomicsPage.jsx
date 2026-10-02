import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function EconomicsPage() {
  return (
    <DepartmentDetailPage
      accent="#1d4ed8" accentDark="#1e3a8a"
      collegeLabel="College of Social Sciences & Humanities"
      name="Economics"
      tagline="Analyse markets, design policy, and drive Ethiopia's economic transformation."
      image={img} imageAlt="Economics students in lecture"
      duration="4 Years" degree="Bachelor of Arts in Economics (BA)"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="Economics at Wollo University covers microeconomics, macroeconomics, econometrics, development economics, and policy analysis. Students apply economic theory to real Ethiopian challenges including rural development, inflation, agricultural markets, and public finance. Graduates work in government ministries, banks, research institutes, and international development organisations."
      highlights={[
        { icon: 'book',  title: 'Econometrics Lab',    desc: 'Stata and SPSS software for quantitative data analysis.' },
        { icon: 'users', title: 'Policy Simulations',  desc: 'Real-world budget and trade policy modelling exercises.' },
        { icon: 'globe', title: 'Development Focus',   desc: 'Ethiopian agricultural and rural development case studies.' },
        { icon: 'star',  title: 'Research Publication', desc: 'Top students publish in the university economics journal.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Principles of Economics', 'Mathematics for Economists', 'Business Statistics', 'History of Economic Thought', 'Communication Skills'] },
        { year: 'Year 2', subjects: ['Microeconomics I', 'Macroeconomics I', 'Econometrics I', 'Development Economics', 'Public Finance'] },
        { year: 'Year 3', subjects: ['Microeconomics II', 'Macroeconomics II', 'Econometrics II', 'Agricultural Economics', 'International Economics'] },
        { year: 'Year 4', subjects: ['Economic Policy Analysis', 'Research Methods', 'Internship', 'Final Research Paper'] },
      ]}
      careers={['Economist', 'Policy Analyst', 'Bank Economist', 'Research Fellow', 'Development Consultant', 'Ministry Planning Officer', 'NGO Programme Officer']}
      requirements={['EUEE — Social Science stream', 'Mathematics grade B', 'Written aptitude test']}
    />
  );
}
