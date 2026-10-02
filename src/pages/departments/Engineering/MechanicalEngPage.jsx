import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/engineering.png';

export default function MechanicalEngPage() {
  return (
    <DepartmentDetailPage
      accent="#dc2626" accentDark="#b91c1c"
      collegeLabel="Institute of Technology"
      name="Mechanical Engineering"
      tagline="Design machines, manufacturing processes, and industrial systems for Ethiopia's growing economy."
      image={img} imageAlt="Mechanical engineering workshop"
      duration="5 Years" degree="Bachelor of Science in Mechanical Engineering"
      parentRoute="/department/engineering" parentLabel="Engineering"
      overview="Mechanical Engineering covers thermodynamics, machine design, manufacturing, materials science, and industrial automation. Graduates work in manufacturing plants, automotive workshops, energy facilities, and industrial companies. The department operates a machine shop with lathes, milling machines, and a CAD/CAM computer lab."
      highlights={[
        { icon: 'lab',   title: 'Machine Shop',       desc: 'Lathes, mills, welding bays, and CNC machines.' },
        { icon: 'book',  title: 'CAD/CAM Lab',        desc: 'SolidWorks and AutoCAD for 3D part and assembly design.' },
        { icon: 'users', title: 'Industry Visits',    desc: 'Quarterly visits to manufacturing plants and factories.' },
        { icon: 'star',  title: 'Capstone Design',    desc: 'Teams design and fabricate a working machine in Year 5.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Engineering Maths', 'Physics', 'Engineering Drawing', 'Workshop Practice', 'Materials Science I'] },
        { year: 'Year 2', subjects: ['Statics & Dynamics', 'Thermodynamics I', 'Materials Science II', 'Manufacturing Processes I', 'Fluid Mechanics'] },
        { year: 'Year 3', subjects: ['Machine Design I', 'Thermodynamics II', 'Manufacturing Processes II', 'Heat Transfer', 'Mechanics of Machines'] },
        { year: 'Year 4', subjects: ['Machine Design II', 'Industrial Automation', 'CAD/CAM', 'Quality Engineering', 'Refrigeration & HVAC'] },
        { year: 'Year 5', subjects: ['Industrial Attachment', 'Capstone Machine Design Project', 'Engineering Ethics', 'Entrepreneurship'] },
      ]}
      careers={['Mechanical Design Engineer', 'Manufacturing Engineer', 'Maintenance Engineer', 'HVAC Engineer', 'Automotive Engineer', 'Production Manager']}
      requirements={['EUEE — Natural Science stream', 'Physics and Mathematics pass']}
    />
  );
}
