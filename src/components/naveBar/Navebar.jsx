import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './NaveBar.css';
import Logo from '../../assets/wolloLogo.png';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const MEGA_MENU_DATA = {
  Health: {
    columns: [
      { heading: 'Departments', links: ['Medicine', 'Pharmacy', 'Nurses', 'Midwifery', 'Veternary Medicine'] },
      { heading: 'Quick Links', links: ['Course Catalog', 'Admission Requirements', 'Lab Facilities', 'Research Groups', 'Student Projects'] },
      { heading: 'Resources',   links: ['Faculty Directory', 'Academic Calendar', 'Internship Opportunities', 'Alumni Network', 'Career Services'] },
    ],
  },
  informatics: {
    columns: [
      { heading: 'Departments', links: ['Computer Science', 'Information Technology', 'Information Systems', 'Software Engineering', 'Data Science'] },
      { heading: 'Quick Links', links: ['Course Catalog', 'Admission Requirements', 'Lab Facilities', 'Research Groups', 'Student Projects'] },
      { heading: 'Resources',   links: ['Faculty Directory', 'Academic Calendar', 'Internship Opportunities', 'Alumni Network', 'Career Services'] },
    ],
  },
  engineering: {
    columns: [
      { heading: 'Departments', links: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Water Resources Engineering'] },
      { heading: 'Quick Links', links: ['Course Catalog', 'Admission Requirements', 'Engineering Labs', 'Research Projects', 'Industrial Attachment'] },
      { heading: 'Resources',   links: ['Faculty Directory', 'Academic Calendar', 'Scholarships', 'Alumni Network', 'Career Services'] },
    ],
  },
  Social: {
    columns: [
      { heading: 'Departments', links: ['Low Income', 'Accounting', 'Management', 'Journalism', 'Arts and Culture', 'Political Science', 'Economics', 'Sociology', 'Psychology', 'Sports'] },
      { heading: 'Quick Links', links: ['Course Catalog', 'Admission Requirements', 'Engineering Labs', 'Research Projects', 'Industrial Attachment'] },
      { heading: 'Resources',   links: ['Faculty Directory', 'Academic Calendar', 'Scholarships', 'Alumni Network', 'Career Services'] },
    ],
  },
};

const NAV_ITEMS = [
  { key: 'Home',        tKey: 'nav.Home',        menu: null        },
  { key: 'Health',      tKey: 'nav.Medicine',    menu: 'Health'    },
  { key: 'informatics', tKey: 'nav.Informatics', menu: 'informatics' },
  { key: 'engineering', tKey: 'nav.Engineering', menu: 'engineering' },
  { key: 'Social',      tKey: 'nav.Social',      menu: 'Social'    },
];

function Navebar() {
  const { t } = useTranslation();
  const [openMenu,   setOpenMenu]   = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const closeTimer = useRef(null);
  const navRef     = useRef(null);

  /* ── Desktop hover helpers ── */
  const openWithHover  = (key) => { clearTimeout(closeTimer.current); setOpenMenu(key); };
  const closeWithDelay = ()    => { closeTimer.current = setTimeout(() => setOpenMenu(null), 150); };
  const toggleOnClick  = (key) => { clearTimeout(closeTimer.current); setOpenMenu(p => p === key ? null : key); };

  /* ── Close on outside click ── */
  useEffect(() => {
    function handle(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* ── Lock body scroll when drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* ── Desktop mega menu renderer ── */
  const renderMegaMenu = (key) => {
    const data = MEGA_MENU_DATA[key];
    if (!data) return null;
    return (
      <div
        className={`ab-mega-menu ${openMenu === key ? 'ab-mega-menu-open' : ''}`}
        onMouseEnter={() => openWithHover(key)}
        onMouseLeave={closeWithDelay}
      >
        <div className="ab-mega-menu-inner">
          {data.columns.map((col) => (
            <div className="ab-mega-menu-column" key={col.heading}>
              <h4 className="ab-mega-menu-heading">{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="ab-navbar-container" ref={navRef}>
      <nav className="ab-navbar" aria-label="Primary">

        {/* Brand */}
        <a className="ab-navbar-brand" href="#">
          <img src={Logo} alt="Wollo-Info Logo" className="ab-navbar-logo" />
          <span className="ab-navbar-word">Wollo-Info</span>
        </a>

        {/* Desktop nav links */}
        <div className="ab-navbar-links">
          {NAV_ITEMS.map((item) =>
            item.menu ? (
              <div
                key={item.key}
                className="ab-navbar-item-with-menu"
                onMouseEnter={() => openWithHover(item.menu)}
                onMouseLeave={closeWithDelay}
              >
                <a
                  href="#"
                  className={openMenu === item.menu ? 'ab-navlink-active' : ''}
                  onClick={(e) => { e.preventDefault(); toggleOnClick(item.menu); }}
                  aria-expanded={openMenu === item.menu}
                  aria-haspopup="true"
                >
                  {t(item.tKey)}
                </a>
              </div>
            ) : (
              <a key={item.key} href="#">{t(item.tKey)}</a>
            )
          )}
        </div>

        {/* Right: Login + Language + Hamburger */}
        <div className="ab-navbar-right">
          <a className="ab-navbar-cta" href="#">{t('nav.login')}</a>
          <LanguageSwitcher />

          {/* Hamburger — mobile only */}
          <button
            className={`ab-hamburger ${mobileOpen ? 'ab-hamburger--open' : ''}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <span className="ab-hamburger-bar" />
            <span className="ab-hamburger-bar" />
            <span className="ab-hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* Desktop mega menus */}
      {NAV_ITEMS.filter(i => i.menu).map(i => (
        <React.Fragment key={i.key}>{renderMegaMenu(i.menu)}</React.Fragment>
      ))}

      {/* ── Mobile drawer ── */}
      <div className={`ab-mobile-drawer ${mobileOpen ? 'ab-mobile-drawer--open' : ''}`} aria-hidden={!mobileOpen}>
        <ul className="ab-mobile-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.key} className="ab-mobile-nav-item">
              {item.menu ? (
                <>
                  <button
                    className="ab-mobile-nav-btn"
                    onClick={() => setMobileExpanded(p => p === item.menu ? null : item.menu)}
                    aria-expanded={mobileExpanded === item.menu}
                  >
                    {t(item.tKey)}
                    <svg
                      className={`ab-mobile-chevron ${mobileExpanded === item.menu ? 'ab-mobile-chevron--open' : ''}`}
                      viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true"
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Accordion sub-links */}
                  <div className={`ab-mobile-sub ${mobileExpanded === item.menu ? 'ab-mobile-sub--open' : ''}`}>
                    <div style={{ overflow: 'hidden' }}>
                      {MEGA_MENU_DATA[item.menu].columns[0].links.map((link) => (
                        <a key={link} href="#" className="ab-mobile-sub-link">{link}</a>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <a href="#" className="ab-mobile-nav-link">{t(item.tKey)}</a>
              )}
            </li>
          ))}
        </ul>

        <div className="ab-mobile-footer">
          <a className="ab-navbar-cta" href="#" style={{ display: 'inline-block', textAlign: 'center' }}>
            {t('nav.login')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navebar;
