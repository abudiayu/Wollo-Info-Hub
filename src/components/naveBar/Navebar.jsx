import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import './NaveBar.css';
import Logo from '../../assets/wolloLogo.png';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { useAuth } from '../../context/AuthContext';

/* ── Inline SVG icons ── */
const ChevronDown = () => (
  <svg className="ab-chevron-icon" viewBox="0 0 12 12" width="13" height="13"
    fill="none" aria-hidden="true">
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" width="19" height="19" fill="none" aria-hidden="true"
    stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8.5" cy="8.5" r="5.5"/>
    <line x1="13" y1="13" x2="18" y2="18"/>
  </svg>
);

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
  { key: 'Home',        icon: true,  tKey: 'nav.Home',        menu: null        },
  { key: 'Health',      icon: false, tKey: 'nav.Medicine',    menu: 'Health'    },
  { key: 'informatics', icon: false, tKey: 'nav.Informatics', menu: 'informatics' },
  { key: 'engineering', icon: false, tKey: 'nav.Engineering', menu: 'engineering' },
  { key: 'Social',      icon: false, tKey: 'nav.Social',      menu: 'Social'    },
];

function Navebar() {
  const { t }             = useTranslation();
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();

  const [openMenu,       setOpenMenu]       = useState(null);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const searchInputRef = useRef(null);
  const closeTimer     = useRef(null);
  const navRef         = useRef(null);

  /* ── Desktop hover helpers ── */
  const openWithHover  = (key) => { clearTimeout(closeTimer.current); setOpenMenu(key); };
  const closeWithDelay = ()    => { closeTimer.current = setTimeout(() => setOpenMenu(null), 150); };
  const toggleOnClick  = (key) => { clearTimeout(closeTimer.current); setOpenMenu(p => p === key ? null : key); };

  /* ── If user is not logged in, intercept nav link clicks → /auth ── */
  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  /* ── Close on outside click ── */
  useEffect(() => {
    function handle(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* ── Auto-focus search input when panel opens ── */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  /* ── Lock body scroll when mobile drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="ab-navbar-container" ref={navRef}>

      <nav className="ab-navbar" aria-label="Primary">

        {/* LEFT — logo + two-line title block */}
        <Link className="ab-navbar-brand" to="/">
          <img src={Logo} alt="Wollo University Logo" className="ab-navbar-logo" />
          <div className="ab-navbar-title-block">
            <span className="ab-navbar-title">Wollo-Info</span>
            <span className="ab-navbar-subtitle">{t('nav.subtitle')}</span>
          </div>
        </Link>

        {/* CENTER / RIGHT — desktop nav links */}
        <div className="ab-navbar-links">

          {/* Home icon */}
          <Link to="/" className="ab-navlink-home" aria-label={t('nav.Home')}>
            <HomeTwoToneIcon className="ab-home-icon" />
          </Link>

          {NAV_ITEMS.filter(i => i.key !== 'Home').map((item) =>
            item.menu ? (
              <div
                key={item.key}
                className="ab-navbar-item-with-menu"
                onMouseEnter={() => openWithHover(item.menu)}
                onMouseLeave={closeWithDelay}
              >
                {/* Trigger — clicks redirect to /auth if not logged in */}
                <a
                  href="/"
                  className={`ab-navlink ${openMenu === item.menu ? 'ab-navlink-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!user) { navigate('/auth'); return; }
                    toggleOnClick(item.menu);
                  }}
                  aria-expanded={openMenu === item.menu}
                  aria-haspopup="true"
                >
                  {t(item.tKey)}
                  <ChevronDown />
                </a>

                {/* Dropdown panel */}
                {(() => {
                  const data = MEGA_MENU_DATA[item.menu];
                  if (!data) return null;
                  return (
                    <div className={`ab-dropdown ${openMenu === item.menu ? 'ab-dropdown-open' : ''}`}>
                      <div className="ab-dropdown-inner">
                        {data.columns.map((col) => (
                          <div className="ab-dropdown-column" key={col.heading}>
                            <h4 className="ab-dropdown-heading">{col.heading}</h4>
                            <ul>
                              {col.links.map((link) => (
                                <li key={link}>
                                  <a href="/" onClick={handleProtectedClick}>{link}</a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <a key={item.key} href="/" className="ab-navlink" onClick={handleProtectedClick}>
                {t(item.tKey)}
              </a>
            )
          )}

          {/* Divider + Search */}
          <span className="ab-nav-divider" aria-hidden="true" />
          <button
            className={`ab-nav-search ${searchOpen ? 'ab-nav-search--active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(v => !v)}
          >
            <SearchIcon />
          </button>
        </div>

        {/* RIGHT — auth controls + language + hamburger */}
        <div className="ab-navbar-right">

          {user ? (
            /* ── Logged in: show name + logout ── */
            <>
              <span className="ab-navbar-username" title={user.email}>
                {user.full_name?.split(' ')[0] || user.email}
              </span>
              <button className="ab-navbar-logout" onClick={handleLogout}>
                {t('nav.logout') || 'Logout'}
              </button>
            </>
          ) : (
            /* ── Logged out: show login button ── */
            <Link className="ab-navbar-cta" to="/auth">{t('nav.login')}</Link>
          )}

          <LanguageSwitcher />

          {/* Mobile-only search icon */}
          <button
            className={`ab-nav-search ab-nav-search--mobile ${searchOpen ? 'ab-nav-search--active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(v => !v)}
          >
            <SearchIcon />
          </button>

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

      {/* ── Search dropdown ── */}
      <div
        className={`ab-search-dropdown ${searchOpen ? 'ab-search-dropdown--open' : ''}`}
        role="search"
        aria-hidden={!searchOpen}
      >
        <div className="ab-search-field">
          <span className="ab-search-field-icon" aria-hidden="true"><SearchIcon /></span>
          <input
            ref={searchInputRef}
            type="search"
            className="ab-search-input"
            placeholder="Search here...."
            aria-label="Search"
            tabIndex={searchOpen ? 0 : -1}
          />
          <button
            className="ab-search-close"
            aria-label="Close search"
            tabIndex={searchOpen ? 0 : -1}
            onClick={() => setSearchOpen(false)}
          >
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13"/>
              <line x1="13" y1="1" x2="1" y2="13"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`ab-mobile-drawer ${mobileOpen ? 'ab-mobile-drawer--open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <ul className="ab-mobile-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.key} className="ab-mobile-nav-item">
              {item.menu ? (
                <>
                  <button
                    className="ab-mobile-nav-btn"
                    onClick={() => {
                      if (!user) { navigate('/auth'); setMobileOpen(false); return; }
                      setMobileExpanded(p => p === item.menu ? null : item.menu);
                    }}
                    aria-expanded={mobileExpanded === item.menu}
                  >
                    {t(item.tKey)}
                    <svg
                      className={`ab-mobile-chevron ${mobileExpanded === item.menu ? 'ab-mobile-chevron--open' : ''}`}
                      viewBox="0 0 12 12" width="13" height="13" fill="none" aria-hidden="true"
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <div className={`ab-mobile-sub ${mobileExpanded === item.menu ? 'ab-mobile-sub--open' : ''}`}>
                    <div style={{ overflow: 'hidden' }}>
                      {MEGA_MENU_DATA[item.menu].columns[0].links.map((link) => (
                        <a
                          key={link}
                          href="/"
                          className="ab-mobile-sub-link"
                          onClick={handleProtectedClick}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link to="/" className="ab-mobile-nav-link" aria-label={t(item.tKey)}>
                  {item.icon
                    ? <span className="ab-mobile-home-icon">
                        <HomeTwoToneIcon style={{ fontSize: 18 }} />{t(item.tKey)}
                      </span>
                    : t(item.tKey)
                  }
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile drawer footer — login or logout */}
        <div className="ab-mobile-footer">
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 14, color: '#374151', padding: '0 4px' }}>
                👤 {user.full_name || user.email}
              </span>
              <button
                className="ab-navbar-cta"
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer', border: 'none' }}
              >
                {t('nav.logout') || 'Logout'}
              </button>
            </div>
          ) : (
            <Link
              className="ab-navbar-cta"
              to="/auth"
              style={{ display: 'inline-block', textAlign: 'center' }}
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}

export default Navebar;
