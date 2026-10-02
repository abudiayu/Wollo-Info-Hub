import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/engineering.png';

export default function ElectricalEngPage() {
  return (
    <DepartmentDetailPage
      accent="#f97316" accentDark="#ea580c"
      collegeLabel="Institute of Technology"
      name="Electrical Engineering"
      tagline="Power Ethiopia's future — from national grid expansion to renewable energy systems."
      image={img} imageAlt="Electrical engineering power lab"
      duration="5 Years" degree="Bachelor of Science in Electrical Engineering"
      parentRoute="/department/engineering" parentLabel="Engineering"
      overview="Electrical Engineering trains students in power systems, electronics, control systems, telecommunications, and renewable energy. Ethiopia's rapid electrification — including solar, wind, and hydro projects — creates enormous demand for qualified electrical engineers. Students work in the power systems and electronics laboratories and undertake attachments with Ethiopian Electric Power (EEP)."
      highlights={[
        { icon: 'lab',   title: 'Power Systems Lab',    desc: 'High-voltage simulation and protection relay practicals.' },
        { icon: 'star',  title: 'Renewable Energy',     desc: 'Solar PV, wind, and hydro modules in the curriculum.' },
        { icon: 'globe', title: 'EEP Internship',       desc: 'Ethiopian Electric Power attachment for top students.' },
        { icon: 'users', title: 'Electronics Workshop', desc: 'PCB design, microcontrollers, and embedded systems.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Engineering Mathematics', 'Physics', 'Introduction to EE', 'Engineering Drawing', 'Circuit Theory I'] },
        { year: 'Year 2', subjects: ['Circuit Theory II', 'Electronics I', 'Electromagnetic Fields', 'Digital Electronics', 'Programming'] },
        { year: 'Year 3', subjects: ['Power Systems I', 'Electronics II', 'Control Systems', 'Signals & Systems', 'Electrical Machines'] },
        { year: 'Year 4', subjects: ['Power Systems II', 'Renewable Energy Systems', 'Power Electronics', 'Telecommunications', 'Microprocessors'] },
        { year: 'Year 5', subjects: ['High Voltage Engineering', 'Industrial Attachment', 'Final Year Project', 'Engineering Management'] },
      ]}
      careers={['Power Systems Engineer', 'Renewable Energy Engineer', 'Control Systems Engineer', 'Telecommunications Engineer', 'Electrical Design Engineer', 'Project Manager']}
      requirements={['EUEE — Natural Science stream', 'Physics and Mathematics grade A or B']}
    />
  );
}
