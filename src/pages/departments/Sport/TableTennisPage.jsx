import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/Sport.png';

export default function TableTennisPage() {
  return (
    <DepartmentDetailPage
      accent="#7c3aed" accentDark="#6d28d9"
      collegeLabel="Sport & Physical Education"
      name="Table Tennis"
      tagline="Weekly club play and an annual campus championship open to every student."
      image={img} imageAlt="Table tennis players in action"
      duration="Weekly throughout the year" degree="Extracurricular — all welcome"
      parentRoute="/department/sport" parentLabel="Sport"
      overview="The Wollo University Table Tennis Club is one of the most accessible sporting clubs on campus. With 12 tables in the sports hall available during club hours, any student can walk in and play. The club hosts a popular annual internal championship and selects players for regional inter-university tournaments. No experience is required to join."
      highlights={[
        { icon: 'lab',   title: '12 Tables Available',  desc: 'Dedicated table tennis room open six days a week.' },
        { icon: 'users', title: 'Open to Everyone',     desc: 'No skill level required — beginners warmly welcomed.' },
        { icon: 'star',  title: 'Annual Championship',  desc: 'Campus-wide tournament held each March.' },
        { icon: 'clock', title: 'Flexible Hours',       desc: 'Open play available evenings and weekend mornings.' },
      ]}
      curriculum={[
        { year: 'Beginner', subjects: ['Basic Grip & Stance', 'Forehand & Backhand Drive', 'Serve Rules', 'Scoring System'] },
        { year: 'Intermediate', subjects: ['Spin Techniques', 'Footwork Patterns', 'Loop & Chop Strokes', 'Match Strategy'] },
        { year: 'Advanced', subjects: ['Competition Tactics', 'Multi-ball Training', 'Tournament Preparation', 'Mental Resilience'] },
      ]}
      careers={['Table Tennis Coach', 'PE Teacher', 'Sports Official / Referee', 'Recreation Officer']}
      requirements={['Must be an enrolled student', 'No experience required', 'Club membership registration at semester start']}
    />
  );
}
