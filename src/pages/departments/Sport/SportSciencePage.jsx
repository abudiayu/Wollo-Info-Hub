import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/Sport.png';

export default function SportSciencePage() {
  return (
    <DepartmentDetailPage
      accent="#f97316" accentDark="#ea580c"
      collegeLabel="Sport & Physical Education"
      name="Sports Science"
      tagline="Train the next generation of coaches, PE teachers, and sports scientists."
      image={img} imageAlt="Sports science students in the laboratory"
      duration="4 Years" degree="Bachelor of Science in Sports Science"
      parentRoute="/department/sport" parentLabel="Sport"
      overview="Sports Science is a four-year degree covering exercise physiology, biomechanics, sports nutrition, coaching methodology, and sports facility management. Graduates work in schools, national sports federations, professional clubs, and rehabilitation centres. The program integrates laboratory work, field coaching, and placements with Ethiopian athletics teams."
      highlights={[
        { icon: 'lab',   title: 'Exercise Physiology Lab', desc: 'VO2 max testing, lactate threshold analysis, and body composition.' },
        { icon: 'users', title: 'Coaching Practicum',      desc: 'Supervised coaching at Wollo University teams and local schools.' },
        { icon: 'globe', title: 'Athletics Federation Link', desc: 'Placement opportunities with Ethiopian Athletics Federation.' },
        { icon: 'star',  title: 'Sports Nutrition',         desc: 'Practical nutrition planning for elite and recreational athletes.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Anatomy for Sport', 'Introduction to Sports Science', 'Physical Education', 'Research Methods', 'Sports Psychology Intro'] },
        { year: 'Year 2', subjects: ['Exercise Physiology', 'Biomechanics', 'Sports Nutrition', 'Coaching Methodology', 'Sports Injuries & First Aid'] },
        { year: 'Year 3', subjects: ['Strength & Conditioning', 'Sports Psychology', 'Performance Analysis', 'Coaching Practicum I', 'Sports Management'] },
        { year: 'Year 4', subjects: ['Athlete Rehabilitation', 'Coaching Practicum II', 'Research Project', 'Internship', 'Sports Facility Management'] },
      ]}
      careers={['Sports Coach', 'PE Teacher', 'Strength & Conditioning Coach', 'Sports Nutritionist', 'Athletic Trainer', 'Sports Manager', 'Fitness Centre Manager']}
      requirements={['EUEE — Natural Science or Social Science stream', 'Physical fitness test', 'Sports participation record']}
    />
  );
}
