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

/*
 * Each mega-menu link has:
 *   label   — display text
 *   to      — React Router path  (null = not yet a real page, falls back to /departments)
 */
const MEGA_MENU_DATA = {
  Health: {
    columns: [
      {
        heading: 'Departments',
        links: [
          { label: 'Medicine',            to: '/department/medicine/md' },
          { label: 'Pharmacy',            to: '/department/medicine/pharmacy' },
          { label: 'Nursing',             to: '/department/medicine/nursing' },
          { label: 'Midwifery',           to: '/department/medicine/midwifery' },
          { label: 'Veterinary Medicine', to: '/department/medicine/veterinary' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Course Catalog',          to: '/departments' },
          { label: 'Admission Requirements',  to: '/departments' },
          { label: 'Lab Facilities',          to: '/departments' },
          { label: 'Research Groups',         to: '/departments' },
          { label: 'Student Projects',        to: '/opportunities' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Faculty Directory',       to: '/departments' },
          { label: 'Academic Calendar',       to: '/departments' },
          { label: 'Internship Opportunities',to: '/opportunities' },
          { label: 'Alumni Network',          to: '/alumni' },
          { label: 'Statistics & Rankings',   to: '/statistics' },
        ],
      },
    ],
  },
  informatics: {
    columns: [
      {
        heading: 'Departments',
        links: [
          { label: 'Computer Science',    to: '/department/computer-science/cs' },
          { label: 'Information Technology', to: '/department/computer-science/it' },
          { label: 'Information Systems', to: '/department/computer-science/information-systems' },
          { label: 'Software Engineering',to: '/department/computer-science/software-engineering' },
          { label: 'Data Science',        to: '/department/computer-science/cs' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Course Catalog',          to: '/departments' },
          { label: 'Admission Requirements',  to: '/departments' },
          { label: 'Lab Facilities',          to: '/departments' },
          { label: 'Research Groups',         to: '/departments' },
          { label: 'Student Projects',        to: '/opportunities' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Faculty Directory',       to: '/departments' },
          { label: 'Academic Calendar',       to: '/departments' },
          { label: 'Internship Opportunities',to: '/opportunities' },
          { label: 'Alumni Network',          to: '/alumni' },
          { label: 'Statistics & Rankings',   to: '/statistics' },
        ],
      },
    ],
  },
  engineering: {
    columns: [
      {
        heading: 'Departments',
        links: [
          { label: 'Civil Engineering',      to: '/department/engineering/civil' },
          { label: 'Electrical Engineering', to: '/department/engineering/electrical' },
          { label: 'Mechanical Engineering', to: '/department/engineering/mechanical' },
          { label: 'Chemical Engineering',   to: '/department/engineering/chemical' },
          { label: 'Water Resources Engineering', to: '/department/engineering/water-resources' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Course Catalog',        to: '/departments' },
          { label: 'Admission Requirements',to: '/departments' },
          { label: 'Engineering Labs',      to: '/departments' },
          { label: 'Research Projects',     to: '/departments' },
          { label: 'Industrial Attachment', to: '/opportunities' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Faculty Directory',     to: '/departments' },
          { label: 'Academic Calendar',     to: '/departments' },
          { label: 'Scholarships',          to: '/opportunities' },
          { label: 'Alumni Network',        to: '/alumni' },
          { label: 'Statistics & Rankings', to: '/statistics' },
        ],
      },
    ],
  },
  Social: {
    columns: [
      {
        heading: 'Departments',
        links: [
          { label: 'Law',              to: '/department/social-science/law' },
          { label: 'Accounting',       to: '/department/social-science/accounting' },
          { label: 'Management',       to: '/department/social-science/management' },
          { label: 'Journalism',       to: '/department/social-science/journalism' },
          { label: 'Economics',        to: '/department/social-science/economics' },
          { label: 'Sociology',        to: '/department/social-science/sociology' },
          { label: 'Psychology',       to: '/department/social-science/psychology' },
          { label: 'Sports Science',   to: '/department/sport/sports-science' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Course Catalog',        to: '/departments' },
          { label: 'Admission Requirements',to: '/departments' },
          { label: 'Research Projects',     to: '/departments' },
          { label: 'Student Projects',      to: '/opportunities' },
          { label: 'Industrial Attachment', to: '/opportunities' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Faculty Directory',     to: '/departments' },
          { label: 'Academic Calendar',     to: '/departments' },
          { label: 'Scholarships',          to: '/opportunities' },
          { label: 'Alumni Network',        to: '/alumni' },
          { label: 'Statistics & Rankings', to: '/statistics' },
        ],
      },
    ],
  },
};

const NAV_ITEMS = [
  { key: 'Home',        icon: true,  tKey: 'nav.Home',        menu: null          },
  { key: 'Health',      icon: false, tKey: 'nav.Medicine',    menu: 'Health'      },
  { key: 'informatics', icon: false, tKey: 'nav.Informatics', menu: 'informatics' },
  { key: 'engineering', icon: false, tKey: 'nav.Engineering', menu: 'engineering' },
  { key: 'Social',      icon: false, tKey: 'nav.Social',      menu: 'Social'      },
];

/* Must match the CSS breakpoint where the hamburger appears */
const MOBILE_BREAKPOINT = 860;

function Navebar() {
  const { t }            = useTranslation();
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [openMenu,       setOpenMenu]       = useState(null);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const searchInputRef = useRef(null);
  const closeTimer     = useRef(null);
  const navRef         = useRef(null);

  /* ── Mobile drawer helpers ── */
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  const toggleMobile = () => {
    setSearchOpen(false);          // never show search + drawer together
    setOpenMenu(null);
    if (mobileOpen) closeMobile();
    else setMobileOpen(true);
  };

  const toggleSearch = () => {
    closeMobile();                 // never show search + drawer together
    setSearchOpen(v => !v);
  };

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
        setMobileExpanded(null);
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* ── Close on Escape + close drawer when resized to desktop ── */
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
        setMobileExpanded(null);
        setSearchOpen(false);
      }
    }
    function onResize() {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setMobileOpen(false);
        setMobileExpanded(null);
      }
    }
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
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

  /* ── Search submit: go to /departments or /opportunities depending on query ── */
  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    // Navigate to the search results page — for now route to departments with ?q= param
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
  }

  /* ── Navigate to a mega-menu link ── */
  function handleMegaLinkClick(e, to) {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setOpenMenu(null);
    navigate(to);
  }

  return (
    <div className="ab-navbar-container" ref={navRef}>

      <nav className="ab-navbar" aria-label="Primary">

        {/* LEFT — logo + two-line title block */}
        <Link className="ab-navbar-brand" to="/" onClick={closeMobile}>
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
                <button
                  className={`ab-navlink ab-navlink--btn ${openMenu === item.menu ? 'ab-navlink-active' : ''}`}
                  onClick={() => {
                    if (!user) { navigate('/auth'); return; }
                    toggleOnClick(item.menu);
                  }}
                  aria-expanded={openMenu === item.menu}
                  aria-haspopup="true"
                >
                  {t(item.tKey)}
                  <ChevronDown />
                </button>

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
                                <li key={link.label}>
                                  <a
                                    href={link.to}
                                    onClick={(e) => handleMegaLinkClick(e, link.to)}
                                  >
                                    {link.label}
                                  </a>
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
              <Link key={item.key} to="/" className="ab-navlink">
                {t(item.tKey)}
              </Link>
            )
          )}

          {/* Divider + Search */}
          <span className="ab-nav-divider" aria-hidden="true" />
          <button
            className={`ab-nav-search ${searchOpen ? 'ab-nav-search--active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            <SearchIcon />
          </button>
        </div>

        {/* RIGHT — auth controls + language + hamburger */}
        <div className="ab-navbar-right">

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link className="ab-navlink ab-navbar-admin" to="/admin" style={{ fontWeight: 600, color: '#6366f1' }}>
                  Admin
                </Link>
              )}
              <span className="ab-navbar-username" title={user.email}>
                {user.full_name?.split(' ')[0] || user.email}
              </span>
              <button className="ab-navbar-logout" onClick={handleLogout}>
                {t('nav.logout') || 'Logout'}
              </button>
            </>
          ) : (
            <Link className="ab-navbar-cta" to="/auth">{t('nav.login')}</Link>
          )}

          <LanguageSwitcher />

          {/* Mobile-only search icon */}
          <button
            className={`ab-nav-search ab-nav-search--mobile ${searchOpen ? 'ab-nav-search--active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            className={`ab-hamburger ${mobileOpen ? 'ab-hamburger--open' : ''}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="ab-mobile-drawer"
            onClick={toggleMobile}
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
        <form className="ab-search-field" onSubmit={handleSearchSubmit}>
          <span className="ab-search-field-icon" aria-hidden="true"><SearchIcon /></span>
          <input
            ref={searchInputRef}
            type="search"
            className="ab-search-input"
            placeholder="Search departments, motivation, opportunities…"
            aria-label="Search"
            tabIndex={searchOpen ? 0 : -1}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="submit"
              className="ab-search-go"
              tabIndex={searchOpen ? 0 : -1}
              aria-label="Search"
            >
              Go
            </button>
          )}
          <button
            type="button"
            className="ab-search-close"
            aria-label="Close search"
            tabIndex={searchOpen ? 0 : -1}
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          >
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13"/>
              <line x1="13" y1="1" x2="1" y2="13"/>
            </svg>
          </button>
        </form>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        id="ab-mobile-drawer"
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
                      if (!user) { navigate('/auth'); closeMobile(); return; }
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
                        <Link
                          key={link.label}
                          to={link.to}
                          className="ab-mobile-sub-link"
                          onClick={closeMobile}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/"
                  className="ab-mobile-nav-link"
                  aria-label={t(item.tKey)}
                  onClick={closeMobile}
                >
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

        {/* Mobile drawer footer */}
        <div className="ab-mobile-footer">
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 14, color: '#374151', padding: '0 4px' }}>
                👤 {user.full_name || user.email}
              </span>
              {user.role === 'admin' && (
                <Link
                  className="ab-navbar-cta"
                  to="/admin"
                  style={{ display: 'inline-block', textAlign: 'center' }}
                  onClick={closeMobile}
                >
                  Admin
                </Link>
              )}
              <button
                className="ab-navbar-cta"
                onClick={() => { handleLogout(); closeMobile(); }}
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
              onClick={closeMobile}
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