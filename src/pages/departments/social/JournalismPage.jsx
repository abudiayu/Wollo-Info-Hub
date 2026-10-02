import DepartmentDetailPage from '../shared/DepartmentDetailPage';
import img from '../../../assets/social.png';

export default function JournalismPage() {
  return (
    <DepartmentDetailPage
      accent="#dc2626" accentDark="#b91c1c"
      collegeLabel="College of Social Sciences & Humanities"
      name="Journalism"
      tagline="Tell Ethiopia's stories — across print, broadcast, and digital media."
      image={img} imageAlt="Journalism students at campus radio"
      duration="4 Years" degree="Bachelor of Arts in Journalism (BA)"
      parentRoute="/department/social-science" parentLabel="Social Sciences"
      overview="The Journalism program trains reporters, editors, and media producers for Ethiopia's growing media landscape. Students write for the campus newspaper, broadcast on the university FM radio station, and produce digital content across social platforms. The curriculum covers investigative reporting, media law, photojournalism, and broadcast production."
      highlights={[
        { icon: 'users', title: 'Campus FM Radio',        desc: 'Live broadcasts reaching the Dessie community every weekday.' },
        { icon: 'book',  title: 'Investigative Reporting', desc: 'Dedicated module on watchdog journalism and source protection.' },
        { icon: 'lab',   title: 'Digital Media Studio',   desc: 'Podcast, video, and social media production equipment.' },
        { icon: 'star',  title: 'Media Internships',       desc: 'Placements at Ethiopian Broadcasting Corporation and private outlets.' },
      ]}
      curriculum={[
        { year: 'Year 1', subjects: ['Introduction to Mass Communication', 'News Writing', 'English for Media', 'Media History', 'Photography'] },
        { year: 'Year 2', subjects: ['Reporting & Editing', 'Broadcast Journalism', 'Media Law & Ethics', 'Photojournalism', 'Online Journalism'] },
        { year: 'Year 3', subjects: ['Investigative Journalism', 'Feature Writing', 'Radio Production', 'Television Production', 'Development Journalism'] },
        { year: 'Year 4', subjects: ['Media Management', 'Documentary Production', 'Media Research', 'Internship', 'Final Project'] },
      ]}
      careers={['News Reporter', 'Broadcast Journalist', 'Digital Content Creator', 'Editor', 'Media Producer', 'Public Relations Officer', 'Documentary Filmmaker']}
      requirements={['EUEE — Social Science stream', 'English language proficiency', 'Written and oral communication assessment']}
    />
  );
}
