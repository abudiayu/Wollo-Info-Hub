import './StudentTips.css';

const TIPS = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: '#2563eb',
    number: '01',
    title:  'Register Early, Every Semester',
    desc:   'Course registration closes faster than you think. Log into the student portal the first day it opens — popular courses fill in hours. Late registration means missing core subjects and losing an entire semester.',
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M8 30V16l12-8 12 8v14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="15" y="22" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M20 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    accent: '#e63946',
    number: '02',
    title:  'Know Your Academic Advisor',
    desc:   'Your academic advisor can unlock opportunities that classmates never find — exemptions, research placements, scholarship referrals. Visit their office in Week 1, not Week 14 when you are already in trouble.',
  },
  {
    id: 3,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="14" r="6" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M28 18l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: '#10b981',
    number: '03',
    title:  'Build Connections, Not Just Grades',
    desc:   'Ethiopia\'s job market runs on trust and referral. Join at least one club, attend departmental seminars, and introduce yourself to professors. The person next to you in class may be your business partner in five years.',
  },
  {
    id: 4,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="7" y="9" width="26" height="22" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M7 15h26" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M14 9V7M26 9V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M13 22h6M13 26h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    accent: '#f59e0b',
    number: '04',
    title:  'Use the Library — Seriously',
    desc:   'Wollo University\'s library holds past exam papers, thesis archives, and journals unavailable online. Students who use it regularly outscore those who rely on group chats alone. Reserve your study room early during exam season.',
  },
  {
    id: 5,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 6l3.09 9.26H32l-7.27 5.29 2.73 8.45L20 24.18l-7.46 4.82 2.73-8.45L8 15.26h8.91z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    accent: '#7c3aed',
    number: '05',
    title:  'Mental Health Is Academic Performance',
    desc:   'Stress, homesickness, and financial pressure affect every student. The university counselling office is free and confidential. Asking for help is not weakness — it is the smartest academic strategy you will ever use.',
  },
];

export default function StudentTips() {
  return (
    <div className="stip-section" aria-label="5 things every student must know">
      <div className="stip-inner">

        <div className="stip-header">
          <span className="stip-eyebrow">Student Guide</span>
          <h2 className="stip-heading">
            5 Things Every Student<br />Must Know at Wollo University
          </h2>
          <p className="stip-sub">
            Hard-won knowledge that turns a good student into a great one.
          </p>
        </div>

        <ol className="stip-list" aria-label="Student tips">
          {TIPS.map((tip) => (
            <li
              key={tip.id}
              className="stip-card"
              style={{ '--stip-accent': tip.accent }}
            >
              <div className="stip-card-left">
                <div className="stip-icon-wrap" aria-hidden="true">
                  {tip.icon}
                </div>
                <span className="stip-number" aria-hidden="true">{tip.number}</span>
              </div>
              <div className="stip-card-right">
                <h3 className="stip-card-title">{tip.title}</h3>
                <p  className="stip-card-desc">{tip.desc}</p>
              </div>
              <div className="stip-card-accent-bar" aria-hidden="true" />
            </li>
          ))}
        </ol>

      </div>
    </div>
  );
}
