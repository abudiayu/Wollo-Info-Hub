import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Apply from '../Apply/Apply.jsx'; // adjust the path to where your hero file lives
import './NexeusHero.css';

export default function NexeusHero() {
  const { t } = useTranslation();
  const [showApply, setShowApply] = useState(false);

  return (
    <>
      <section className="nx-hero">
        {/* Background video */}
        <div className="nx-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/693205bf-8048-456a-879e-4e0a1b85a098.webp"
            aria-label="Painted alpine panorama: a lone hiker with a pink backpack faces a snow-capped peak above a sea of clouds"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_123836_11a3c5e0-713f-4bef-a8e9-7dd93bdea3b0.mp4"
              type="video/mp4"
            />
          </video>
          <div className="nx-scrim" aria-hidden="true" />
        </div>

        {/* Eyebrow badge */}
        <div className="nx-eyebrow-container">
          <span className="nx-eyebrow">{t('hero.eyebrow')}</span>
        </div>

        {/* Main Headline */}
        <div className="nx-headline-mask">
          <h1 className="nx-headline">
            Knowledge, <span className="nx-headline-gold">Innovation</span>, Excellence
          </h1>
        </div>

        {/* Subtitle / Lede */}
        <p className="nx-lede">{t('hero.lede')}</p>

        {/* Action Buttons */}
        <div className="nx-cta-group">
          <Link className="nx-cta nx-cta-primary" to="/departments">
            {t('hero.cta')}
          </Link>
          <button
            type="button"
            className="nx-cta nx-cta-ghost"
            onClick={() => setShowApply(true)}
          >
            <span>Apply today &rarr;</span>
          </button>
        </div>

        {/* Bottom Stats Footer Bar */}
        <div className="nx-stats-bar">
          <span>25K+ Students</span>
          <span className="nx-stat-dot">•</span>
          <span>80+ Programs</span>
          <span className="nx-stat-dot">•</span>
          <span>40 Years</span>
        </div>

        {/* Wave divider */}
        <div className="nx-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="nx-hero-wave-svg">
            <path
              d="M0,50 C240,10 480,90 720,50 C960,20 1200,90 1440,40 L1440,120 L0,120 Z"
              className="nx-hero-wave-path"
            />
          </svg>
        </div>
      </section>

      {/* Apply popup */}
      <Apply isOpen={showApply} onClose={() => setShowApply(false)} />
    </>
  );
}