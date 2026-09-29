import { useEffect, useRef } from 'react';
import NexeusHero   from '../../components/hero/NexeusHero';
import './HomePage.css';
import NexeusFeatures from '../../components/body/NexeusFeatures';
import OpportunitiesPage from '../opportunitiesPage/OpportunitiesPage';
import MotivationPage from '../motivationPage/MotivationPage.jsx';
import CampusLife from '../../components/CampusLife/Campuslife.jsx';

/* ── Web Animations easings ────────────────────────────────── */
const EXPO   = [0.16, 1, 0.3, 1];
const SOFT   = [0.22, 0.65, 0.28, 1];
const SETTLE = [0.33, 1, 0.68, 1];

function easing(pts) {
  return `cubic-bezier(${pts.join(',')})`;
}

export default function HomePage() {
  const viewportRef = useRef(null);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    /* ── Entrance animation ─────────────────────────────────── */
    const html = document.documentElement;
    if (!html.classList.contains('js-enter')) return;
    if (vp.dataset.entered) return;
    vp.dataset.entered = '1';

    /* Detect narrow phone for scaled-down travel/tempo */
    const narrow = window.matchMedia('(max-width: 648px)').matches;
    const d = narrow ? 0.62 : 1;   // travel multiplier
    const t = narrow ? 0.85 : 1;   // tempo multiplier

    const fill = 'both';
    const anims = [];

    function run(el, keyframes, duration, delay, easePoints) {
      if (!el) return;
      const a = el.animate(keyframes, {
        duration: duration * t,
        delay:    delay    * t,
        easing:   easing(easePoints),
        fill,
      });
      anims.push(a);
      return a;
    }

    /* eyebrow */
    run(
      vp.querySelector('.nx-eyebrow'),
      [{ opacity: 0, transform: `translateY(${12 * d}px)` }, { opacity: 1, transform: 'none' }],
      560, 60, SOFT
    );

    /* headline: clip-path reveal + translateY */
    const mask = vp.querySelector('.nx-headline-mask');
    const hl   = vp.querySelector('.nx-headline');
    if (mask && hl) {
      const mAnim = mask.animate(
        [{ clipPath: 'inset(-45% -8% -6px -3%)' }, { clipPath: 'inset(-45% -8% -6px -3%)' }],
        { duration: 950 * t, delay: 170 * t, fill }
      );
      anims.push(mAnim);
      run(
        hl,
        [{ transform: `translateY(${118 * d}%)` }, { transform: 'none' }],
        950, 170, EXPO
      );
    }

    /* lede */
    run(
      vp.querySelector('.nx-lede'),
      [{ opacity: 0, transform: `translateY(${14 * d}px)` }, { opacity: 1, transform: 'none' }],
      660, 430, SOFT
    );

    /* cta */
    run(
      vp.querySelector('.nx-cta'),
      [
        { opacity: 0, transform: `translateY(${12 * d}px) scale(0.985)` },
        { opacity: 1, transform: 'none' },
      ],
      580, 620, SETTLE
    );

    /* mark + wordmark together */
    run(
      vp.querySelector('.nx-brandrow'),
      [{ opacity: 0, transform: `translateY(${10 * d}px)` }, { opacity: 1, transform: 'none' }],
      540, 600, SOFT
    );

    /* tagline */
    run(
      vp.querySelector('.nx-tagline'),
      [{ opacity: 0, transform: `translateY(${10 * d}px)` }, { opacity: 1, transform: 'none' }],
      540, 670, SOFT
    );

    /* each footer column */
    vp.querySelectorAll('.nx-col').forEach((col, i) => {
      run(
        col,
        [{ opacity: 0, transform: `translateY(${14 * d}px)` }, { opacity: 1, transform: 'none' }],
        580, 720 + i * 70, SOFT
      );
    });

    /* rule */
    run(
      vp.querySelector('.nx-rule'),
      [{ transform: 'scaleX(0)' }, { transform: 'none' }],
      720, 980, EXPO
    );

    /* legal */
    run(
      vp.querySelector('.nx-legal'),
      [{ opacity: 0, transform: `translateY(${8 * d}px)` }, { opacity: 1, transform: 'none' }],
      500, 1120, SOFT
    );

    /* social icons */
    vp.querySelectorAll('.nx-social-link').forEach((a, i) => {
      run(
        a,
        [{ opacity: 0, transform: `translateY(${8 * d}px)` }, { opacity: 1, transform: 'none' }],
        500, 1170 + i * 60, SOFT
      );
    });

    /* clean up after longest animation finishes */
    const longest = anims[anims.length - 1];
    if (longest) {
      longest.finished
        .then(() => {
          anims.forEach(a => a.cancel());
          html.classList.remove('js-enter');
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="nx-viewport" ref={viewportRef}>
      <div className="nx-stage">
        <NexeusHero />
        <NexeusFeatures/>
        <CampusLife/>
        <MotivationPage/>
        <OpportunitiesPage/>
      </div>
    </div>
  );
}
