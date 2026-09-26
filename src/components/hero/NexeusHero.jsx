import './NexeusHero.css';

export default function NexeusHero() {
  return (
    <section className="nx-hero">
      {/* Background video — contained inside .nx-hero */}
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

      {/* Hero copy */}
      <p className="nx-eyebrow">Ready when you are</p>

      <div className="nx-headline-mask">
        <h1 className="nx-headline">Build your future now</h1>
      </div>

      <p className="nx-lede">
        From branding and websites to marketing and growth systems, everything
        you need to move forward starts right here.
      </p>

      <a className="nx-cta" href="#">
        <span>Take Control</span>
      </a>

      {/* Wave divider — bridges hero into the body section below */}
      <div className="nx-hero-wave" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="nx-hero-wave-svg"
        >
          <path
            d="M0,50 C240,10 480,90 720,50 C960,20 1200,90 1440,40 L1440,120 L0,120 Z"
            className="nx-hero-wave-path"
          />
        </svg>
      </div>
    </section>
  );
}