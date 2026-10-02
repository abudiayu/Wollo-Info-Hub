import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/Sport.png';

export default function AthleticsPage() {
  return (
    <DepartmentDetailPage
      accent="#ca8a04" accentDark="#a16207"
      collegeLabel="Sport & Physical Education"
      name="Athletics"
      tagline="Run, jump, and throw — representing Wollo at regional and national championships."
      image={img} imageAlt="Athletics track and field events"
      duration="Year-round training" degree="Extracurricular — open to all students"
      parentRoute="/department/sport" parentLabel="Sport"
      overview="Wollo University Athletics Club covers track and field disciplines including long distance running, sprints, hurdles, high jump, long jump, shot put, and javelin. The university has produced several national-level competitors and has athletes who have represented Ethiopia in junior continental competitions. The club trains on the certified 400m athletics track and is coached by qualified national athletics federation coaches."
      highlights={[
        { icon: 'lab',   title: '400m Certified Track',   desc: 'IAAF-standard athletics track for training and competition.' },
        { icon: 'star',  title: 'National Champions',     desc: 'Multiple national inter-university medals since 2018.' },
        { icon: 'users', title: 'All Disciplines',        desc: 'Sprint, middle, long distance, hurdles, jumps, and throws.' },
        { icon: 'globe', title: 'Federation Coaches',     desc: 'Certified Ethiopian Athletics Federation coaches on staff.' },
      ]}
      curriculum={[
        { year: 'Sprints', subjects: ['100m, 200m, 400m', 'Relay Training', 'Block Start Technique', 'Speed Endurance'] },
        { year: 'Distance', subjects: ['800m to Marathon', 'Altitude Training', 'Pacing Strategy', 'Cross-Country Running'] },
        { year: 'Field Events', subjects: ['High Jump', 'Long Jump', 'Triple Jump', 'Shot Put', 'Javelin', 'Discus'] },
      ]}
      careers={['Professional Athlete', 'Athletics Coach', 'PE Teacher', 'Athletics Federation Official', 'Sports Science Support', 'Sports Journalist']}
      requirements={['Must be an enrolled student', 'Fitness and performance assessment', 'Commitment to training programme', 'Minimum GPA 2.0']}
    />
  );
}
