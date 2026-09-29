import React, { useState, useEffect, useRef, useCallback } from "react";
import "./CampusLife.css";
import wolloLibraryImg from "../../assets/wollo-library.png";
import wolloTitaImg    from "../../assets/wollo-tita.png";
import kiotImg         from "../../assets/kiot.png";

const items = [
  {
    id: 1,
    image:     wolloLibraryImg,
    heroImage: wolloLibraryImg,
    heroTitle: "WOU LIBRARY",
    category:  "IES, Sidist Kilo Campus",
    title:     "Ethnographic Museum",
    description:
      "Ethiopia's first university museum dating back to the early 1950s, rich with huge collections of artifacts, traditional tools and equipment, historical heritages, and many more.",
    galleryUrl: "#",
  },
  {
    id: 2,
    image:     wolloTitaImg,
    heroImage: wolloTitaImg,
    heroTitle: "WOU CAMPUS",
    category:  "Science Campus",
    title:     "National Herbarium",
    description:
      "The National Herbarium is rich with large collections of mummified plants and wild animals, including those that are endemic to Ethiopia.",
    galleryUrl: "#",
  },
  {
    id: 3,
    image:     kiotImg,
    heroImage: kiotImg,
    heroTitle: "STUDENT LIFE",
    category:  "Sidist Kilo Campus",
    title:     "Clubs & Societies",
    description:
      "From debate and drama to tech and volunteering clubs, students find community and build skills outside the classroom.",
    galleryUrl: "#",
  },
  {
    id: 4,
    image:     wolloTitaImg,
    heroImage: wolloTitaImg,
    heroTitle: "KIOT Students Life",
    category:  "Sidist Kilo Campus",
    title:     "Clubs & Societies",
    description:
      "From debate and drama to tech and volunteering clubs, students find community and build skills outside the classroom.",
    galleryUrl: "#",
  },
];

export default function CampusLife() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leftOpen,     setLeftOpen]     = useState(true);
  const [rightOpen,    setRightOpen]    = useState(true);
  const [paused,       setPaused]       = useState(false);

  const total      = items.length;
  const leftIndex  = (currentIndex - 1 + total) % total;
  const rightIndex = (currentIndex + 1) % total;
  const current    = items[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  /* ── Auto-scroll every 3 s, pauses on hover ── */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(goNext, 3000);
    return () => clearInterval(id);
  }, [paused, goNext]);

  return (
    <section
      className="campus-life"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── SLIDING IMAGE STRIP ─────────────────────────────
          All hero images sit side-by-side in a flex row.
          The strip is translateX'd so the active slide fills
          the viewport. CSS transition handles the smooth slide.
          overflow:hidden on .campus-life clips the others.     */}
      <div
        className="campus-life__track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="campus-life__slide"
            style={{ backgroundImage: `url(${item.heroImage})` }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Overlay sits above the track */}
      <div className="campus-life__overlay" />

      <span className="campus-life__badge">EXPLORE LIFE AT WOU</span>

      <h2 className="campus-life__hero-title">{current.heroTitle}</h2>

      {/* LEFT SIDE CARD */}
      <div className="campus-life__side campus-life__side--left">
        {leftOpen ? (
          <CampusCard item={items[leftIndex]} onClose={() => setLeftOpen(false)} />
        ) : (
          <button
            type="button"
            className="campus-life__toggle"
            onClick={() => setLeftOpen(true)}
            aria-label="Show details"
          >
            +
          </button>
        )}
      </div>

      {/* RIGHT SIDE CARD */}
      <div className="campus-life__side campus-life__side--right">
        {rightOpen ? (
          <CampusCard item={items[rightIndex]} onClose={() => setRightOpen(false)} />
        ) : (
          <button
            type="button"
            className="campus-life__toggle"
            onClick={() => setRightOpen(true)}
            aria-label="Show details"
          >
            +
          </button>
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="campus-life__nav">
        <button
          type="button"
          className="campus-life__arrow"
          onClick={goPrev}
          aria-label="Previous"
        >
          ←
        </button>

        <div className="campus-life__dots">
          {items.map((item, index) => (
            <span
              key={item.id}
              className={
                "campus-life__dot" +
                (index === currentIndex ? " campus-life__dot--active" : "")
              }
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="campus-life__arrow"
          onClick={goNext}
          aria-label="Next"
        >
          →
        </button>
      </div>
    </section>
  );
}

function CampusCard({ item, onClose }) {
  return (
    <div className="campus-card">
      <button
        type="button"
        className="campus-card__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      <div
        className="campus-card__image"
        style={{ backgroundImage: `url(${item.image})` }}
      />

      <div className="campus-card__body">
        <span className="campus-card__category">{item.category}</span>
        <h3 className="campus-card__title">{item.title}</h3>
        <p className="campus-card__description">{item.description}</p>
        <a href={item.galleryUrl} className="campus-card__link">
          View Gallery <span className="campus-card__link-arrow">↗</span>
        </a>
      </div>
    </div>
  );
}
