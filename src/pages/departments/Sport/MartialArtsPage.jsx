import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/Sport.png';

export default function MartialArtsPage() {
  return (
    <DepartmentDetailPage
      accent="#be123c" accentDark="#9f1239"
      collegeLabel="Sport & Physical Education"
      name="Martial Arts"
      tagline="Build strength, discipline, and self-defence skills with certified instructors."
      image={img} imageAlt="Martial arts training in the sports hall"
      duration="Year-round" degree="Extracurricular — Taekwondo & Judo"
      parentRoute="/department/sport" parentLabel="Sport"
      overview="Wollo University Martial Arts Club offers Taekwondo and Judo training under certified national federation instructors. The club trains five days per week in the dedicated martial arts area of the sports hall. Students can grade for belts and compete in inter-university championships. The program emphasises physical fitness, mental discipline, respect, and self-defence."
      highlights={[
        { icon: 'users', title: 'Certified Instructors', desc: 'National Taekwondo and Judo federation certified coaches.' },
        { icon: 'lab',   title: 'Dedicated Dojang',      desc: 'Sprung floor mat area with mirrors and training equipment.' },
        { icon: 'star',  title: 'Belt Grading',          desc: 'Official belt grading examinations every semester.' },
        { icon: 'globe', title: 'Inter-Uni Competition', desc: 'Annual inter-university Taekwondo and Judo championships.' },
      ]}
      curriculum={[
        { year: 'White to Yellow Belt', subjects: ['Basic Stances', 'Fundamental Kicks & Punches', 'Falls & Breakfalls', 'Club Etiquette & Safety'] },
        { year: 'Yellow to Green Belt', subjects: ['Combination Techniques', 'Sparring Introduction', 'Poomsae/Kata Forms', 'Physical Conditioning'] },
        { year: 'Green to Blue Belt', subjects: ['Competition Rules', 'Advanced Sparring', 'Grappling & Throws (Judo)', 'Belt Grading Preparation'] },
        { year: 'Blue to Black Belt', subjects: ['Advanced Poomsae', 'Competition Tactics', 'Instructing Junior Students', 'Championship Preparation'] },
      ]}
      careers={['Martial Arts Instructor', 'PE Teacher', 'Sports Coach', 'Security Professional', 'Youth Mentorship Worker']}
      requirements={['Must be an enrolled student', 'Medical clearance for contact sports', 'No prior experience required for white belt', 'Minimum GPA 2.0']}
    />
  );
}
