import { useTranslation } from 'react-i18next';
import './NexeusFooter.css';
import Logo from '../../assets/wolloLogo.png';

/* ── Social SVG icons (inline — no extra dependency) ──────── */

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.731-8.835L2.049 2.25H8.1l4.265 5.636L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/>
    </svg>
  );
}

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0Zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635Z"/>
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09Z"/>
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
    </svg>
  );
}

export default function NexeusFooter() {
  const { t } = useTranslation();

  return (
    <footer className="nx-footer">
      <div className="nx-footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="nx-footer-wave-svg">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,30 L1440,80 L0,80 Z" className="nx-footer-wave-path" />
        </svg>
      </div>

      <div className="nx-finner">
        <div className="nx-footer-top">

          {/* Brand column */}
          <div className="nx-brandcol">
            <div className="nx-brandrow">
              <a className="ab-navbar-brand" href="/">
                  <img src={Logo} alt="Wollo-Info Logo" className="ab-navbar-logo" />
                  <span className="ab-navbar-word">Wollo-Info</span>
                </a>
            </div>
            <p className="nx-tagline">{t('footer.tagline')}</p>
          </div>

          {/* Nav columns */}
          <nav className="nx-nav" aria-label="Footer navigation">
            <div className="nx-col">
              <h3>{t('footer.solutions.heading')}</h3>
              <ul>
                <li><a href="/">{t('footer.solutions.revenue')}</a></li>
                <li><a href="/">{t('footer.solutions.search')}</a></li>
                <li><a href="/">{t('footer.solutions.conversion')}</a></li>
                <li><a href="/">{t('footer.solutions.customer')}</a></li>
              </ul>
            </div>
            <div className="nx-col">
              <h3>{t('footer.capabilities.heading')}</h3>
              <ul>
                <li><a href="/">{t('footer.capabilities.web')}</a></li>
                <li><a href="/">{t('footer.capabilities.brand')}</a></li>
                <li><a href="/">{t('footer.capabilities.growth')}</a></li>
                <li><a href="/">{t('footer.capabilities.ecommerce')}</a></li>
              </ul>
            </div>
            <div className="nx-col">
              <h3>{t('footer.resources.heading')}</h3>
              <ul>
                <li><a href="/">{t('footer.resources.case')}</a></li>
                <li><a href="/">{t('footer.resources.insights')}</a></li>
                <li><a href="/">{t('footer.resources.playbooks')}</a></li>
                <li><a href="/">{t('footer.resources.reports')}</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <hr className="nx-rule" />

        <div className="nx-footrow">
          <p className="nx-legal">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" style={{display:'inline-block', verticalAlign:'middle', marginRight:'4px', marginBottom:'1px'}}>
              <circle cx="6.5" cy="6.5" r="5.75" stroke="currentColor" strokeWidth="1.1"/>
              <path d="M8.3 4.8A2.3 2.3 0 1 0 8.3 8.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
            2025 Abdulqadir MD all rights reserved.
          </p>
          <div className="nx-socials">
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="nx-social-link"><IconX /></a>
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"     className="nx-social-link"><IconYouTube /></a>
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"    className="nx-social-link"><IconFacebook /></a>
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"    className="nx-social-link"><IconLinkedIn /></a>
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Telegram"    className="nx-social-link"><IconTelegram /></a>
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="TikTok"      className="nx-social-link"><IconTikTok /></a>
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"   className="nx-social-link"><IconInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
