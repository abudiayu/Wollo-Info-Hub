import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './DepartmentDetailPage.css';

/* ── Icons ── */
const Icon = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
      <path d="M9 3h6M10 3v7L7 17a2 2 0 0 0 1.8 2.9h6.4A2 2 0 0 0 17 17l-3-7V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevL: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevR: (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
      <path d="M2 9l10-5 10 5-10 5L2 9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const STAR_PATH = 'M12 2l3 7h7l-5.5 4.5L18.5 21 12 17l-6.5 4 2-7.5L2 9h7z';

/* ── Helpers ── */
const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

function Stars({ value = 0, size = 18 }) {
  return (
    <div className="ddp-stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" width={size} height={size} className={n <= Math.round(value) ? 'is-on' : ''}>
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, photo, className = '' }) {
  return photo ? (
    <img src={photo} alt={name} className={`ddp-avatar ${className}`} />
  ) : (
    <span className={`ddp-avatar ddp-avatar--fallback ${className}`} aria-label={name}>
      {initials(name)}
    </span>
  );
}

const REVIEWER_TYPES = ['Student', 'Graduate', 'Visitor'];

export default function DepartmentDetailPage({
  accent = '#2563eb',
  accentDark = '#1e3a8a',
  collegeLabel,
  name,
  tagline,
  overview,
  image,
  imageAlt,
  duration,
  degree,
  parentRoute = '/departments',
  parentLabel = 'Departments',

  highlights = [],

  /* Section 2 – Duration */
  freshmanCourses,
  majorCourses,
  majorYearsLabel,
  curriculum = [],           // legacy fallback

  /* Section 3 – Prerequisites */
  requirements = [],

  /* Section 4 – Graduates */
  graduates = [],            // [{ name, photo, year, role, workplace, location, link }]
  graduatesCount,

  /* Section 5 – Ratings */
  reviews = [],              // [{ name, photo, role, rating, comment, date }]
  onSubmitReview,            // async (review) => void   (optional – save to your API)
}) {
  const reviewsRef = useRef(null);

  /* ── Reviews state (so new reviews appear instantly) ── */
  const [reviewList, setReviewList] = useState(reviews);
  useEffect(() => { setReviewList(reviews); }, [reviews]);

  /* ── Rating form state ── */
  const [form, setForm] = useState({ name: '', role: 'Student', rating: 0, comment: '' });
  const [hoverStar, setHoverStar] = useState(0);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const freshman = freshmanCourses ?? (curriculum[0] ? curriculum[0].subjects : []);
  const major = majorCourses ?? curriculum.slice(1).flatMap((y) => y.subjects || []);
  const majorLabel =
    majorYearsLabel ?? (curriculum.length > 1 ? `Years 2 – ${curriculum.length}` : 'Departmental Courses');

  /* ── Rating stats ── */
  const total = reviewList.length;
  const avgRating = total
    ? reviewList.reduce((s, r) => s + (Number(r.rating) || 0), 0) / total
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewList.filter((r) => Math.round(Number(r.rating)) === star).length;
    return { star, count, pct: total ? (count / total) * 100 : 0 };
  });

  const scrollReviews = (dir) => {
    const el = reviewsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(360, el.clientWidth * 0.85), behavior: 'smooth' });
  };

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFormError('');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError('Please enter your name.');
    if (!form.rating) return setFormError('Please choose a star rating.');
    if (form.comment.trim().length < 10) return setFormError('Please write at least 10 characters.');

    const review = {
      name: form.name.trim(),
      role: form.role,
      rating: form.rating,
      comment: form.comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    try {
      setSubmitting(true);
      if (onSubmitReview) await onSubmitReview(review);
      setReviewList((list) => [review, ...list]);
      setForm({ name: '', role: 'Student', rating: 0, comment: '' });
      setHoverStar(0);
      setSubmitted(true);
      requestAnimationFrame(() => reviewsRef.current?.scrollTo({ left: 0, behavior: 'smooth' }));
    } catch (err) {
      setFormError('Could not send your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const heroCards = highlights.slice(0, 2);
  const shownStar = hoverStar || form.rating;

  return (
    <div className="ddp-page" style={{ '--ddp-accent': accent, '--ddp-accent-dark': accentDark }}>
      {/* ═════════ 1. HERO ═════════ */}
      <header className="ddp-hero">
        <div className="ddp-container ddp-hero-grid">
          <div className="ddp-hero-copy">
            <nav className="ddp-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">›</span>
              <Link to="/departments">Departments</Link>
              {parentRoute !== '/departments' && (
                <>
                  <span aria-hidden="true">›</span>
                  <Link to={parentRoute}>{parentLabel}</Link>
                </>
              )}
              <span aria-hidden="true">›</span>
              <span aria-current="page">{name}</span>
            </nav>

            {collegeLabel && <p className="ddp-eyebrow">{collegeLabel}</p>}
            <h1 className="ddp-name">{name}</h1>
            {(tagline || overview) && <p className="ddp-lead">{overview || tagline}</p>}

            <div className="ddp-hero-actions">
              <a href="#ddp-duration" className="ddp-btn ddp-btn--primary">
                Explore Courses {Icon.arrow}
              </a>
              <Link to="/opportunities" className="ddp-btn ddp-btn--outline">
                <span className="ddp-play" aria-hidden="true" />
                View Opportunities
              </Link>
            </div>

            {graduates.length > 0 && (
              <div className="ddp-proof">
                <div className="ddp-proof-avatars">
                  {graduates.slice(0, 4).map((g, i) => (
                    <Avatar key={i} name={g.name} photo={g.photo} />
                  ))}
                </div>
                <span className="ddp-proof-text">
                  {graduatesCount ? `${graduatesCount}+` : `${graduates.length}+`} Graduates
                </span>
              </div>
            )}

            <div className="ddp-hero-badges">
              {duration && <span className="ddp-chip">{Icon.clock} {duration}</span>}
              {degree && <span className="ddp-chip">{Icon.book} {degree}</span>}
            </div>

            {heroCards.length > 0 && (
              <div className="ddp-mini-cards">
                {heroCards.map((h, i) => (
                  <div key={i} className="ddp-mini-card">
                    <p className="ddp-mini-title">{h.title}</p>
                    <div className="ddp-mini-foot">
                      <p className="ddp-mini-desc">{h.desc}</p>
                      <span className="ddp-mini-arrow">{Icon.arrowUp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ddp-hero-visual" aria-hidden={!image}>
            <span className="ddp-burst" aria-hidden="true" />
            {image && <img src={image} alt={imageAlt || name} className="ddp-hero-img" />}
          </div>
        </div>
      </header>

      <main className="ddp-main">
        {/* ═════════ 2. YEARS OF DURATION ═════════ */}
        <section className="ddp-section" id="ddp-duration">
          <div className="ddp-container">
            <div className="ddp-section-head">
              <span className="ddp-pill">Program Duration</span>
              <h2 className="ddp-section-title">
                {duration ? `${duration} of ` : ''}{name}
              </h2>
              <p className="ddp-section-sub">
                Your journey starts with a shared foundation, then moves into specialised departmental training.
              </p>
            </div>

            <div className="ddp-duration-grid">
              <article className="ddp-card ddp-card--duration">
                <div className="ddp-card-top">
                  <span className="ddp-card-icon">{Icon.globe}</span>
                  <span className="ddp-card-tag">Year 1</span>
                </div>
                <h3 className="ddp-card-title">Freshman Common Courses</h3>
                <p className="ddp-card-text">Foundation courses shared by every first-year student at the university.</p>
                <ul className="ddp-course-list">
                  {freshman.length ? (
                    freshman.map((c, i) => (
                      <li key={i}><span className="ddp-tick">{Icon.check}</span>{c}</li>
                    ))
                  ) : (
                    <li className="ddp-empty">Courses will be announced soon.</li>
                  )}
                </ul>
              </article>

              <article className="ddp-card ddp-card--duration ddp-card--featured">
                <div className="ddp-card-top">
                  <span className="ddp-card-icon">{Icon.lab}</span>
                  <span className="ddp-card-tag">{majorLabel}</span>
                </div>
                <h3 className="ddp-card-title">{name} Courses</h3>
                <p className="ddp-card-text">Core departmental and professional training for your chosen field.</p>
                <ul className="ddp-course-list">
                  {major.length ? (
                    major.map((c, i) => (
                      <li key={i}><span className="ddp-tick">{Icon.check}</span>{c}</li>
                    ))
                  ) : (
                    <li className="ddp-empty">Courses will be announced soon.</li>
                  )}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ═════════ 3. PREREQUISITES ═════════ */}
        {requirements.length > 0 && (
          <section className="ddp-section ddp-section--tint">
            <div className="ddp-container">
              <div className="ddp-section-head">
                <span className="ddp-pill">Admission</span>
                <h2 className="ddp-section-title">Prerequisites to Join {name}</h2>
                <p className="ddp-section-sub">Make sure you meet these requirements before you apply.</p>
              </div>

              <ol className="ddp-req-grid">
                {requirements.map((r, i) => (
                  <li key={i} className="ddp-req-card">
                    <span className="ddp-req-num">{String(i + 1).padStart(2, '0')}</span>
                    <p>{r}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ═════════ 4. GRADUATES (profile cards) ═════════ */}
        {graduates.length > 0 && (
          // <section className="ddp-section" id="ddp-graduates">
          //   <div className="ddp-container">
          //     <div className="ddp-section-head">
          //       <span className="ddp-pill">Alumni</span>
          //       <h2 className="ddp-section-title">Who Graduated from Wollo University — {name}</h2>
          //       <p className="ddp-section-sub">
          //         Meet the students who started here and are now making an impact
          //         {graduatesCount ? ` — ${graduatesCount}+ graduates and counting.` : '.'}
          //       </p>
          //     </div>

          //     <div className="ddp-grad-grid">
          //       {graduates.map((g, i) => {
          //         const Wrapper = g.link ? 'a' : 'div';
          //         const wrapperProps = g.link
          //           ? { href: g.link, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `View ${g.name}'s profile` }
          //           : {};
          //         return (
          //           <article key={i} className="ddp-grad-card">
          //             <div className="ddp-grad-cover" aria-hidden="true" />
          //             <div className="ddp-grad-body">
          //               <Avatar name={g.name} photo={g.photo} className="ddp-avatar--xl ddp-grad-avatar" />
          //               <h3 className="ddp-grad-name">{g.name}</h3>
          //               {g.role && <p className="ddp-grad-role">{g.role}</p>}
          //               {g.workplace && <p className="ddp-grad-work">{g.workplace}</p>}
          //               {g.location && <p className="ddp-grad-loc">{Icon.pin} {g.location}</p>}

          //               <div className="ddp-grad-foot">
          //                 {g.year && <span className="ddp-grad-year">{Icon.cap} Class of {g.year}</span>}
          //                 <Wrapper className={`ddp-grad-go${g.link ? ' is-link' : ''}`} {...wrapperProps}>
          //                   {Icon.arrowUp}
          //                 </Wrapper>
          //               </div>
          //             </div>
          //           </article>
          //         );
          //       })}
          //     </div>
          //   </div>
          // </section>
          <DepartmentGraduates
            graduates={graduates}
            graduatesCount={graduatesCount}
            accent={accent}
            accentDark={accentDark}
            universityName="Wollo University"
            departmentName={name}
          />
        )}

        {/* ═════════ 5. RATINGS & REVIEWS ═════════ */}
        <section className="ddp-section ddp-section--tint" id="ddp-ratings">
          <div className="ddp-container">
            <div className="ddp-section-head">
              <span className="ddp-pill">Ratings &amp; Reviews</span>
              <h2 className="ddp-section-title">What Students &amp; Visitors Say About {name}</h2>
              <p className="ddp-section-sub">Real feedback from the people who study, graduate from and visit this department.</p>
            </div>

            <div className="ddp-rating-layout">
              {/* Summary */}
              <aside className="ddp-summary">
                <p className="ddp-summary-score">{total ? avgRating.toFixed(1) : '–'}</p>
                <Stars value={avgRating} size={22} />
                <p className="ddp-summary-count">
                  {total ? `Based on ${total} review${total === 1 ? '' : 's'}` : 'No reviews yet — be the first!'}
                </p>

                <ul className="ddp-bars">
                  {distribution.map((d) => (
                    <li key={d.star}>
                      <span className="ddp-bar-label">{d.star}★</span>
                      <span className="ddp-bar-track">
                        <span className="ddp-bar-fill" style={{ width: `${d.pct}%` }} />
                      </span>
                      <span className="ddp-bar-num">{d.count}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Horizontal reviews */}
              <div className="ddp-reviews-wrap">
                <div className="ddp-reviews-bar">
                  <span className="ddp-reviews-title">Latest reviews</span>
                  <div className="ddp-scroll-btns">
                    <button type="button" onClick={() => scrollReviews(-1)} aria-label="Previous reviews">{Icon.chevL}</button>
                    <button type="button" onClick={() => scrollReviews(1)} aria-label="Next reviews">{Icon.chevR}</button>
                  </div>
                </div>

                {total > 0 ? (
                  <div className="ddp-reviews" ref={reviewsRef} tabIndex={0} aria-label="Department reviews">
                    {reviewList.map((r, i) => (
                      <article key={i} className="ddp-review-card">
                        <div className="ddp-review-top">
                          <Stars value={r.rating} />
                          {r.role && (
                            <span className={`ddp-role ddp-role--${String(r.role).toLowerCase()}`}>{r.role}</span>
                          )}
                        </div>
                        <p className="ddp-review-text">“{r.comment}”</p>
                        <div className="ddp-review-user">
                          <Avatar name={r.name} photo={r.photo} />
                          <div>
                            <p className="ddp-review-name">{r.name}</p>
                            {r.date && <p className="ddp-review-meta">{r.date}</p>}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="ddp-reviews-empty" ref={reviewsRef}>Nobody has reviewed {name} yet.</div>
                )}
              </div>
            </div>

            {/* Rate form */}
            <form className="ddp-rate-form" onSubmit={handleSubmit} noValidate>
              <div className="ddp-rate-head">
                <h3>Rate {name}</h3>
                <p>Studied here or thinking of joining? Share your experience.</p>
              </div>

              <div className="ddp-star-picker" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHoverStar(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={form.rating === n}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    className={n <= shownStar ? 'is-on' : ''}
                    onMouseEnter={() => setHoverStar(n)}
                    onClick={() => { setForm((f) => ({ ...f, rating: n })); setFormError(''); setSubmitted(false); }}
                  >
                    <svg viewBox="0 0 24 24" width="34" height="34"><path d={STAR_PATH} /></svg>
                  </button>
                ))}
                <span className="ddp-star-hint">{shownStar ? ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'][shownStar - 1] : 'Tap a star'}</span>
              </div>

              <div className="ddp-form-row">
                <label className="ddp-field">
                  <span>Your name</span>
                  <input type="text" value={form.name} onChange={setField('name')} placeholder="e.g. Selam Tadesse" maxLength={60} />
                </label>
                <label className="ddp-field">
                  <span>I am a</span>
                  <select value={form.role} onChange={setField('role')}>
                    {REVIEWER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              </div>

              <label className="ddp-field">
                <span>Your comment</span>
                <textarea rows={4} value={form.comment} onChange={setField('comment')} placeholder="What did you like? What could be better?" maxLength={500} />
                <small>{form.comment.length}/500</small>
              </label>

              {formError && <p className="ddp-form-msg ddp-form-msg--error" role="alert">{formError}</p>}
              {submitted && <p className="ddp-form-msg ddp-form-msg--ok" role="status">Thank you! Your review has been added.</p>}

              <button type="submit" className="ddp-btn ddp-btn--primary ddp-submit" disabled={submitting}>
                {submitting ? 'Sending…' : <>Submit Review {Icon.send}</>}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}