import React from "react";
import "./Statistics.css";
import wolloLogo from "../../assets/wolloLogo.png";


/* ---------- Edit your data here ---------- */
const RANKINGS = [
  {
    rank: "1",
    title: "The best Islamic school in the region",
    source: "Regional Education Rankings, 2026",
  },
  {
    rank: "1",
    title: "In the zone for academics, Reputation and Alumni Impact",
    source: "Education Review 2026",
  },
  {
    rank: "1",
    title: "Among the Top Schools",
    source: "Center of School Rankings, 2026",
  },
];

const STATS = [
  {
    value: "5 K+",
    title: "All Time Graduates",
    text: "More than 4,800 graduates",
  },
  {
    value: "300+",
    title: "Qualified Teachers",
    text: "Dedicated staff across all grades",
  },
  {
    value: "98%",
    title: "Pass Rate",
    text: "National exam results since 2020",
  },
];

/* ---------- Icon ---------- */
function ChartIcon() {
  return (
    <svg
      className="stats-icon"
      viewBox="0 0 52 56"
      width="52"
      height="56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="36" width="9" height="17" rx="4.5" />
      <rect x="16" y="28" width="9" height="25" rx="4.5" />
      <rect x="29" y="34" width="9" height="19" rx="4.5" />
      <rect x="42" y="20" width="9" height="33" rx="4.5" />
      <circle cx="6" cy="20" r="3" />
      <circle cx="19" cy="14" r="3" />
      <circle cx="32" cy="18" r="3" />
      <circle cx="46" cy="6" r="3" />
      <path d="M8.5 18.5 16.5 15.5M22 14.5l7.5 2.5M34.5 16.5l9-8" />
    </svg>
  );
}

/* ---------- Section heading with two-tone underline ---------- */
function SectionHeading({ children }) {
  return (
    <div className="stats-heading">
      <h2 className="stats-heading__title">{children}</h2>
      <div className="stats-heading__bars" aria-hidden="true">
        <span className="stats-heading__bar stats-heading__bar--short" />
        <span className="stats-heading__bar stats-heading__bar--long" />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Statistics() {
  return (
    <div className="stats-page">
      {/* Hero */}
      <header className="stats-hero">
        <div className="stats-container">
          <nav className="stats-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Statistics</a>
            <span className="stats-breadcrumb__sep" aria-hidden="true">
              ›
            </span>
            <img src={wolloLogo} alt="" className="stats-hero__seal" aria-hidden="true" />
          </nav>
          <h1 className="stats-hero__title">Statistics and Rankings</h1>
        </div>
        <div className="stats-hero__seal" aria-hidden="true" />
      </header>

      <main className="stats-main">
        <div className="stats-container">
          {/* Rankings */}
          <section className="stats-section" aria-labelledby="rankings-title">
            <SectionHeading>Rankings</SectionHeading>
            <div className="stats-grid stats-grid--3">
              {RANKINGS.map((item, i) => (
                <article className="stats-card stats-card--rank" key={i}>
                  <div className="rank-number">
                    <span className="rank-number__hash">#</span>
                    <span className="rank-number__digit">{item.rank}</span>
                  </div>
                  <h3 className="stats-card__title">{item.title}</h3>
                  <p className="stats-card__text">{item.source}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Statistics */}
          <section className="stats-section" aria-labelledby="statistics-title">
            <SectionHeading>Statistics</SectionHeading>
            <div className="stats-grid stats-grid--stats">
              {STATS.map((item, i) => (
                <article className="stats-card stats-card--stat" key={i}>
                  <ChartIcon />
                  <div className="stat-value">{item.value}</div>
                  <h3 className="stats-card__title">{item.title}</h3>
                  <p className="stats-card__text">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}