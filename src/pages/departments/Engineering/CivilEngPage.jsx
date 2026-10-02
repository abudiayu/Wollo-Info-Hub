import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/engineering.png';

export default function CivilEngPage() {
  return (
    <DepartmentDetailPage
      accent="#f59e0b" accentDark="#d97706"
      collegeLabel="Institute of Technology"
      name="Civil Engineering"
      tagline="Design and build the roads, bridges, and structures that connect Ethiopia."
      image={img} imageAlt="Civil engineering construction site"
      duration="5 Years" degree="Bachelor of Science in Civil Engineering"
      parentRoute="/department/engineering" parentLabel="Engineering"
      overview="Civil Engineering at Wollo University covers structural design, geotechnical engineering, road construction, hydraulics, and urban planning. Graduates work on Ethiopia's massive infrastructure expansion — from GERD-era dams and expressways to urban housing and water supply networks. Students undertake industrial attachments with the Ethiopian Roads Authority and construction firms."
      highlights={[
        { icon: 'lab',   title: 'Structures & Materials Lab', desc: 'Concrete testing, soil analysis, and load testing equipment.' },
        { icon: 'globe', title: 'Site Visits',                desc: 'Supervised visits to active construction projects every semester.' },
        { icon: 'users', title: 'ERA Internship',             desc: 'Ethiopian Roads Authority placement for eligible students.' },
        { icon: 'star',  title: 'AutoCAD & ETABS Training',   desc: 'Professional structural design software in the curriculum.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Engineering Mathematics I', 'Engineering Drawing', 'Physics', 'Chemistry', 'Introduction to Civil Engineering'] },
        { year: 'Year 2', subjects: ['Surveying', 'Engineering Mechanics', 'Strength of Materials', 'Fluid Mechanics', 'Engineering Geology'] },
        { year: 'Year 3', subjects: ['Structural Analysis', 'Concrete Technology', 'Soil Mechanics', 'Highway Engineering', 'Hydrology'] },
        { year: 'Year 4', subjects: ['Reinforced Concrete Design', 'Foundation Engineering', 'Transportation Engineering', 'Water Supply & Sanitation', 'Construction Management'] },
        { year: 'Year 5', subjects: ['Steel Structure Design', 'Industrial Attachment', 'Final Year Project', 'Professional Practice'] },
      ]}
      careers={['Structural Engineer', 'Road Engineer', 'Site Engineer', 'Project Manager', 'Urban Planner', 'Hydraulic Engineer', 'Consultant']}
      requirements={['EUEE — Natural Science stream', 'Mathematics and Physics grade A or B', 'Engineering aptitude assessment']}
    />
  );
}
