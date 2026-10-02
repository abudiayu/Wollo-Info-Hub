import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/Sport.png';

export default function FootballPage() {
  return (
    <DepartmentDetailPage
      accent="#16a34a" accentDark="#15803d"
      collegeLabel="Sport & Physical Education"
      name="Football Club"
      tagline="Wollo University Football Club competes at national inter-university level."
      image={img} imageAlt="Football team in training"
      duration="Open tryouts each year" degree="Extracurricular — all students eligible"
      parentRoute="/department/sport" parentLabel="Sport"
      overview="Wollo University Football Club is one of the most active student sports organisations on campus. The team competes in the Ethiopian inter-university football championship and has represented the university in regional competitions. The club holds open tryouts every September and welcomes players of all positions. Regular training sessions run on the main stadium pitch three times per week."
      highlights={[
        { icon: 'star',  title: 'National Competition',  desc: 'Annual Ethiopian inter-university football championship.' },
        { icon: 'users', title: 'Open Tryouts',          desc: 'Every September — all enrolled students can try out.' },
        { icon: 'lab',   title: 'Main Stadium',          desc: 'Full-size FIFA-standard pitch with floodlights.' },
        { icon: 'clock', title: 'Training Schedule',     desc: 'Three sessions per week plus weekly match fixtures.' },
      ]}
      curriculum={[
        { year: 'Pre-Season', subjects: ['Fitness & Conditioning', 'Tactical Briefings', 'Nutritional Guidance', 'Medical Screening'] },
        { year: 'In-Season', subjects: ['Weekly Fixtures', 'Video Analysis', 'Strength Training', 'Recovery Sessions'] },
        { year: 'Off-Season', subjects: ['Individual Skills Development', 'Youth Coaching Volunteering', 'Sports Science Support'] },
      ]}
      careers={['Professional Footballer', 'Football Coach', 'Sports Administrator', 'PE Teacher', 'Youth Academy Coach', 'Sports Journalist']}
      requirements={['Must be an enrolled Wollo University student', 'Pass the September open tryout', 'Maintain academic standing (minimum GPA 2.0)', 'Commit to training schedule']}
    />
  );
}
