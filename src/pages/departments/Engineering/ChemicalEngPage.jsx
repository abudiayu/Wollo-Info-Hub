import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/engineering.png';

export default function ChemicalEngPage() {
  return (
    <DepartmentDetailPage
      accent="#0d9488" accentDark="#0f766e"
      collegeLabel="Institute of Technology"
      name="Chemical Engineering"
      tagline="Transform raw materials into valuable products that drive Ethiopia's industrial growth."
      image={img} imageAlt="Chemical engineering process plant"
      duration="5 Years" degree="Bachelor of Science in Chemical Engineering"
      parentRoute="/department/engineering" parentLabel="Engineering"
      overview="Chemical Engineering applies chemistry, physics, and mathematics to design industrial processes — from food processing and cement production to pharmaceutical manufacturing and water treatment. Graduates are highly sought in Ethiopia's expanding industrial sector, including the industrial parks at Hawassa, Bole Lemi, and Kombolcha."
      highlights={[
        { icon: 'lab',   title: 'Process Laboratory',   desc: 'Distillation, reaction kinetics, and pilot plant equipment.' },
        { icon: 'glob',  title: 'Industrial Parks Link', desc: 'Internship pipeline into Kombolcha and Bole Lemi parks.' },
        { icon: 'book',  title: 'Process Simulation',   desc: 'Aspen Plus and MATLAB for process modelling.' },
        { icon: 'star',  title: 'Green Chemistry',       desc: 'Sustainable process design integrated from Year 3.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Engineering Mathematics', 'General Chemistry', 'Physics', 'Engineering Drawing', 'Introduction to ChE'] },
        { year: 'Year 2', subjects: ['Physical Chemistry', 'Material & Energy Balances', 'Fluid Flow', 'Thermodynamics', 'Organic Chemistry'] },
        { year: 'Year 3', subjects: ['Heat Transfer', 'Mass Transfer', 'Reaction Engineering', 'Process Control', 'Chemical Technology'] },
        { year: 'Year 4', subjects: ['Process Design I', 'Process Simulation', 'Environmental Engineering', 'Food & Fermentation Technology', 'Safety & Hazards'] },
        { year: 'Year 5', subjects: ['Process Design II', 'Industrial Attachment', 'Final Year Project', 'Project Management'] },
      ]}
      careers={['Process Engineer', 'Production Engineer', 'Quality Control Engineer', 'Environmental Engineer', 'Food Technology Engineer', 'Petroleum & Gas Engineer']}
      requirements={['EUEE — Natural Science stream', 'Chemistry and Mathematics grade A or B']}
    />
  );
}
