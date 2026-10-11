import React, { useMemo, useState } from 'react';
import "./Library.css";

/*
  IMAGES: download real library photos and save them in
  public/images/libraries/ with the file names used below.
  If a file is missing, the card shows a purple fallback automatically.
*/
const CAMPUSES = [
  {
    id: 'kiot',
    name: 'KIoT Campus',
    short: 'KIoT',
    label: 'Kombolcha Institute of Technology',
    headline: 'Engineering Knowledge Lives Here',
    blurb: 'Three libraries for first-year students, engineers and computing students.',
    libraries: [
      {
        id: 'kiot-fresh',
        name: 'Fresh Library',
        description: 'Study space and textbooks for first-year (freshman) students.',
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
        services: ['Reading hall', 'Freshman textbooks', 'Group study tables', 'Wi-Fi'],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzJgXg9WfJuTMH8JWdD-k1sNU3YgiXGYp7JNjvPXM2VNWm6bmZeNiXcNw&s=10',
      },
      {
        id: 'kiot-engineering',
        name: 'Engineering Library',
        description: 'Civil, mechanical, electrical and chemical engineering books and journals.',
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
        services: ['Engineering textbooks', 'Journals and standards', 'Reference desk', 'Wi-Fi'],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4eNXwM53fPZEuwmV3dAYJi4BocUvhba8pHkEtR7nDEv-M551beDi96yY&s=10',
      },
      {
        id: 'kiot-informatics',
        name: 'Informatics Library',
        description: 'Computer science, software engineering and IT resources with computer access.',
        hours: 'Mon–Sat, 8:00 AM – 10:00 PM',
        services: ['Computer lab access', 'Programming books', 'E-library', 'Wi-Fi'],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDz-jaJybJvHXfL6nPFjnHc6EjtPoeywvir9gj3u20U1iJ1Nh8jISeIzE&s=10',
      },
    ],
  },
  {
    id: 'health',
    name: 'Health Campus',
    short: 'Health',
    label: 'College of Medicine and Health Sciences',
    headline: 'Medical Learning Happens Here',
    blurb: 'Two libraries supporting medicine, nursing and public health.',
    libraries: [
      {
        id: 'health-medicine',
        name: 'Medicine Library',
        description: 'Medical textbooks, anatomy atlases and clinical references.', // rename to your real library
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
        services: ['Medical textbooks', 'Anatomy atlases', 'Quiet study rooms', 'Wi-Fi'],
        image: '/images/libraries/health-medicine.jpg',
      },
      {
        id: 'health-public',
        name: 'Public Health Library',
        description: 'Nursing, midwifery, public health and laboratory sciences.', // rename to your real library
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
        services: ['Nursing and midwifery books', 'Public health journals', 'Group study tables', 'Wi-Fi'],
        image: '/images/libraries/health-public.jpg',
      },
    ],
  },
  {
    id: 'social',
    name: 'Social Science Campus',
    short: 'Social Science',
    label: 'College of Social Science and Humanities',
    headline: 'Ideas Take Shape Here',
    blurb: 'Two libraries for social science, language and humanities students.',
    libraries: [
      {
        id: 'social-main',
        name: 'Social Science Library',
        description: 'Law, economics, sociology and political science collections.', // rename to your real library
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
        services: ['Law and economics books', 'Reading hall', 'Reference desk', 'Wi-Fi'],
        image: '/images/libraries/social-main.jpg',
      },
      {
        id: 'social-humanities',
        name: 'Humanities Library',
        description: 'Language, literature, history and journalism resources.', // rename to your real library
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
        services: ['Language and literature books', 'Archive shelves', 'Quiet reading area', 'Wi-Fi'],
        image: '/images/libraries/social-humanities.jpg',
      },
    ],
  },
];

function LibraryImage({ src, name }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className="lib-img lib-img--fallback" aria-hidden="true">{name.charAt(0)}</div>;
  }
  return (
    <img
      className="lib-img"
      src={src}
      alt={`${name} building`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

const NUMBER_WORDS = { 2: 'Two', 3: 'Three' };

function Library() {
  const [activeId, setActiveId] = useState('kiot');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const campus = CAMPUSES.find((c) => c.id === activeId);
  const term = query.trim().toLowerCase();

  // With no search text: show the selected campus. With search text: search all campuses.
  const results = useMemo(() => {
    if (!term) {
      return campus.libraries.map((lib) => ({ ...lib, campusId: campus.id, campusName: campus.name }));
    }
    return CAMPUSES.flatMap((c) =>
      c.libraries
        .filter((lib) =>
          [lib.name, lib.description, c.name, c.label].join(' ').toLowerCase().includes(term)
        )
        .map((lib) => ({ ...lib, campusId: c.id, campusName: c.name }))
    );
  }, [term, campus]);

  // The library the student clicked (if any) controls the hero image and text
  const selected = CAMPUSES.flatMap((c) =>
    c.libraries.map((lib) => ({ ...lib, campusId: c.id, campusName: c.name, campusLabel: c.label }))
  ).find((lib) => lib.id === selectedId);

  const heroImage = selected ? selected.image : campus.libraries[0].image;

  // A different library of the same campus for the small feature card
  const featureLib =
    campus.libraries.find((lib) => lib.image !== heroImage) || campus.libraries[0];

  const countWord = NUMBER_WORDS[campus.libraries.length] || campus.libraries.length;

  const openLibrary = (lib) => {
    setActiveId(lib.campusId); // switch campus tab if opened from search results
    setSelectedId(lib.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="library-page">
      {/* ---------- Hero ---------- */}
      <section className="lib-hero">
        <div
          className="lib-hero-photo"
          key={heroImage}
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        <nav className="lib-tabs" aria-label="Choose a campus">
          {CAMPUSES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`lib-tab ${c.id === activeId ? 'is-active' : ''}`}
              aria-pressed={c.id === activeId}
              onClick={() => {
                setActiveId(c.id);
                setSelectedId(null);
                setQuery('');
              }}
            >
              {c.short}
            </button>
          ))}
        </nav>

        <form className="lib-search" role="search" onSubmit={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search libraries, e.g. engineering"
            aria-label="Search libraries"
          />
          {query && (
            <button type="button" className="lib-search-clear" onClick={() => setQuery('')}>
              Clear
            </button>
          )}
        </form>

        <div className="lib-hero-title" key={selected ? selected.id : campus.id}>
          <h1>{selected ? selected.name : campus.name}</h1>
        </div>

        {/* Libraries panel: right section of the main image */}
        <aside className="lib-panel" aria-live="polite">
          <div className="lib-panel-head">
            <h2>
              {term
                ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
                : `Libraries at ${campus.name}`}
            </h2>
            {selected && (
              <button type="button" className="lib-panel-back" onClick={() => setSelectedId(null)}>
                Back to {campus.short}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <p className="lib-empty">
              No library matches that search. Try “engineering”, “health” or “fresh”.
            </p>
          ) : (
            <div className="lib-panel-list">
              {results.map((lib) => (
                <article
                  className={`lib-item ${lib.id === selectedId ? 'is-selected' : ''}`}
                  key={lib.id}
                >
                  <LibraryImage src={lib.image} name={lib.name} />
                  <div className="lib-item-body">
                    <h3>{lib.name}</h3>
                    <p className="lib-item-campus">{lib.campusName}</p>
                    <p className="lib-item-desc">{lib.description}</p>
                    <p className="lib-item-hours">{lib.hours}</p>
                    <button type="button" className="lib-item-link" onClick={() => openLibrary(lib)}>
                      {lib.id === selectedId ? 'Viewing' : 'View library'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </section>

      {/* ---------- Intro (statement, feature card, info) ---------- */}
      <section className="lib-intro">
        <span className="lib-intro-label">{selected ? campus.short : 'Wollo University'}</span>

        <div className="lib-intro-main">
          <h2 className="lib-statement">
            {selected
              ? `${selected.name} at ${selected.campusName}, open ${selected.hours}.`
              : `${countWord} libraries, built around the way ${campus.short} students study and learn.`}
          </h2>

          <div className="lib-intro-row">
            <figure className="lib-feature">
              <LibraryImage src={featureLib.image} name={featureLib.name} />
              <figcaption>
                <strong>{featureLib.name}.</strong> {featureLib.description}
              </figcaption>
            </figure>
            <button
              type="button"
              className="lib-text-link"
              onClick={() => openLibrary({ ...featureLib, campusId: campus.id })}
            >
              View {featureLib.name}
            </button>
          </div>

          <dl className="lib-info">
            <div>
              <dt>Campus</dt>
              <dd>{selected ? selected.campusLabel : campus.label}</dd>
            </div>
            {selected ? (
              <>
                <div>
                  <dt>Opening hours</dt>
                  <dd>{selected.hours}</dd>
                </div>
                <div>
                  <dt>Services</dt>
                  <dd>
                    <ul className="lib-services">
                      {selected.services.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </>
            ) : (
              <div>
                <dt>Libraries</dt>
                <dd>{campus.libraries.map((lib) => lib.name).join(', ')}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>
    </div>
  );
}

export default Library;