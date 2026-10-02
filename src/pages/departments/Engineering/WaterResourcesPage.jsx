import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/engineering.png';

export default function WaterResourcesPage() {
  return (
    <DepartmentDetailPage
      accent="#0284c7" accentDark="#0369a1"
      collegeLabel="Institute of Technology"
      name="Water Resources Engineering"
      tagline="Manage Ethiopia's rivers, dams, and irrigation systems — securing water for millions."
      image={img} imageAlt="Water resources engineering dam site"
      duration="5 Years" degree="Bachelor of Science in Water Resources Engineering"
      parentRoute="/department/engineering" parentLabel="Engineering"
      overview="Water Resources Engineering is critical to Ethiopia's food security and development. Students learn hydraulics, hydrology, irrigation design, dam engineering, watershed management, and water supply systems. Given Ethiopia's vast river systems and agricultural economy, graduates are among the most in-demand engineers in the country."
      highlights={[
        { icon: 'lab',   title: 'Hydraulics Laboratory', desc: 'Open channel flow, weirs, and pump performance testing.' },
        { icon: 'globe', title: 'Watershed Fieldwork',   desc: 'Real watershed surveys and data collection fieldtrips.' },
        { icon: 'book',  title: 'GIS & Remote Sensing',  desc: 'ArcGIS and QGIS for hydrological analysis.' },
        { icon: 'star',  title: 'Irrigation Design',     desc: 'Full irrigation scheme design project in Year 4.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Engineering Mathematics', 'Physics', 'Engineering Drawing', 'Introduction to WRE', 'Environmental Science'] },
        { year: 'Year 2', subjects: ['Fluid Mechanics', 'Engineering Geology', 'Surveying', 'Hydrology I', 'Soil Mechanics'] },
        { year: 'Year 3', subjects: ['Hydraulics', 'Hydrology II', 'Irrigation Engineering I', 'Water Quality', 'GIS & Remote Sensing'] },
        { year: 'Year 4', subjects: ['Irrigation Engineering II', 'Dam Engineering', 'Urban Water Supply', 'Environmental Impact Assessment', 'Watershed Management'] },
        { year: 'Year 5', subjects: ['Industrial Attachment', 'Final Project — Irrigation Scheme Design', 'Professional Practice', 'Climate & Water Resources'] },
      ]}
      careers={['Hydraulic Engineer', 'Irrigation Engineer', 'Dam Engineer', 'WASH Specialist', 'Watershed Manager', 'Water Supply Engineer', 'Climate Adaptation Specialist']}
      requirements={['EUEE — Natural Science stream', 'Mathematics and Physics pass']}
    />
  );
}
