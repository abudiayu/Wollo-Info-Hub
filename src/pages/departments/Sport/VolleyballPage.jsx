import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/Sport.png';

export default function VolleyballPage() {
  return (
    <DepartmentDetailPage
      accent="#0284c7" accentDark="#0369a1"
      collegeLabel="Sport & Physical Education"
      name="Volleyball"
      tagline="Indoor and beach volleyball with competitive regional league fixtures."
      image={img} imageAlt="Volleyball match in progress"
      duration="Year-round" degree="Extracurricular — open to all"
      parentRoute="/department/sport" parentLabel="Sport"
      overview="Wollo University Volleyball Club operates both indoor and beach volleyball programs. The club has two indoor courts in the sports hall and an outdoor sand court. Teams compete in regional inter-university competitions. Training sessions are held four times per week, and new players are welcomed at the start of each semester."
      highlights={[
        { icon: 'lab',   title: 'Two Indoor Courts',    desc: 'Full-size indoor courts plus an outdoor sand court.' },
        { icon: 'users', title: 'Mixed Club',           desc: 'Open to all students regardless of experience level.' },
        { icon: 'star',  title: 'Regional Competition', desc: 'Compete in Amhara inter-university volleyball league.' },
        { icon: 'clock', title: 'Twice-Semester Intake', desc: 'New players accepted at start of each semester.' },
      ]}
      curriculum={[
        { year: 'Beginner Track', subjects: ['Basic Serving', 'Passing & Setting', 'Spiking Fundamentals', 'Game Rules'] },
        { year: 'Competitive Track', subjects: ['Team Tactics', 'Serve Receive Systems', 'Block & Defence', 'League Fixtures'] },
        { year: 'Beach Volleyball', subjects: ['Sand Court Training', 'Beach Tactics', 'Doubles Strategy', 'Beach Tournaments'] },
      ]}
      careers={['Volleyball Coach', 'PE Teacher', 'Sports Administrator', 'Professional Player', 'Referee / Official']}
      requirements={['Enrolled student', 'No experience required for beginner track', 'Fitness assessment for competitive team', 'Minimum GPA 2.0']}
    />
  );
}
