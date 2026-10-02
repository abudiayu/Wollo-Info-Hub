import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/Sport.png';

export default function BasketballPage() {
  return (
    <DepartmentDetailPage
      accent="#ea580c" accentDark="#c2410c"
      collegeLabel="Sport & Physical Education"
      name="Basketball"
      tagline="Men and women compete in the regional university basketball league."
      image={img} imageAlt="Basketball players in the sports hall"
      duration="Year-round" degree="Extracurricular — men and women"
      parentRoute="/department/sport" parentLabel="Sport"
      overview="Wollo University Basketball Club runs separate men and women competitive teams. Both teams compete in the Amhara region university basketball league. Training takes place in the university indoor sports hall, which has two full-size courts. The club accepts new players through tryouts held every October."
      highlights={[
        { icon: 'users', title: "Men's & Women's Teams", desc: 'Separate squads for men and women with equal resources.' },
        { icon: 'lab',   title: 'Indoor Sports Hall',    desc: 'Two full-size hardwood courts with scoreboard.' },
        { icon: 'star',  title: 'Regional League',       desc: 'Compete against universities across the Amhara region.' },
        { icon: 'clock', title: 'October Tryouts',       desc: 'Open tryouts held every October for all enrolled students.' },
      ]}
      curriculum={[
        { year: 'Pre-Season', subjects: ['Fitness Testing', 'Fundamentals Camp', 'Team Selection', 'Tactical Systems'] },
        { year: 'In-Season', subjects: ['Weekly League Fixtures', 'Film Sessions', 'Strength & Conditioning', 'Recovery'] },
        { year: 'Development', subjects: ['Individual Skills Coaching', '3-on-3 Tournaments', 'Youth Outreach Clinics'] },
      ]}
      careers={['Basketball Player', 'Basketball Coach', 'Sports Administrator', 'PE Teacher', 'Sports Analyst']}
      requirements={['Must be an enrolled student', 'October tryout', 'Minimum GPA 2.0', 'Commitment to training']}
    />
  );
}
