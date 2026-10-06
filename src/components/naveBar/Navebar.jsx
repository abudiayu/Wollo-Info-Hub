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
          { label: 'Faculty Directory',        to: '/departments' },
          { label: 'Academic Calendar',        to: '/departments' },
          { label: 'Internship Opportunities', to: '/opportunities' },
          { label: 'Alumni Network',           to: '/alumni' },
          { label: 'Statistics & Rankings',    to: '/statistics' },
        ],
      },
    ],
  },
  informatics: {
    columns: [
      {
        heading: 'Departments',
        links: [
          { label: 'Computer Science',       to: '/department/computer-science/cs' },
          { label: 'Information Technology', to: '/department/computer-science/it' },
          { label: 'Information Systems',    to: '/department/computer-science/information-systems' },
          { label: 'Software Engineering',   to: '/department/computer-science/software-engineering' },
          { label: 'Data Science',           to: '/department/computer-science/cs' },
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
          { label: 'Faculty Directory',        to: '/departments' },
          { label: 'Academic Calendar',        to: '/departments' },
          { label: 'Internship Opportunities', to: '/opportunities' },
          { label: 'Alumni Network',           to: '/alumni' },
          { label: 'Statistics & Rankings',    to: '/statistics' },
        ],
      },
    ],
  },
  engineering: {
    columns: [
      {
        heading: 'Departments',
        links: [
          { label: 'Civil Engineering',           to: '/department/engineering/civil' },
          { label: 'Electrical Engineering',      to: '/department/engineering/electrical' },
          { label: 'Mechanical Engineering',      to: '/department/engineering/mechanical' },
          { label: 'Chemical Engineering',        to: '/department/engineering/chemical' },
          { label: 'Water Resources Engineering', to: '/department/engineering/water-resources' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Course Catalog',         to: '/departments' },
          { label: 'Admission Requirements', to: '/departments' },
          { label: 'Engineering Labs',       to: '/departments' },
          { label: 'Research Projects',      to: '/departments' },
          { label: 'Industrial Attachment',  to: '/opportunities' },
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
          { label: 'Course Catalog',         to: '/departments' },
          { label: 'Admission Requirements', to: '/departments' },
          { label: 'Research Projects',      to: '/departments' },
          { label: 'Student Projects',       to: '/opportunities' },
          { label: 'Industrial Attachment',  to: '/opportunities' },
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
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* ── Auto-focus search input ── */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  /* ── Lock body scroll when mobile drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
  }

  function handleMegaLinkClick(e, to) {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setOpenMenu(null);
    navigate(to);
  }

  const firstName = user?.full_name?.split(' ')[0] || user?.email || '';

  return (
    <div className="ab-navbar-container" ref={navRef}>

      {/* ════════════════════════════════════════
          MAIN NAV BAR
          Mobile layout: [Logo/Title] ··· [Search] [Hamburger]
          Desktop layout: [Logo] [Nav links] [CTA/User] [Lang]
      ════════════════════════════════════════ */}
      <nav className="ab-navbar" aria-label="Primary navigation">

        {/* Brand */}
        <Link className="ab-navbar-brand" to="/">
          <img src={Logo} alt="Wollo University" className="ab-navbar-logo" />
          <div className="ab-navbar-title-block">
            <span className="ab-navbar-title">Wollo-Info</span>
            <span className="ab-navbar-subtitle">{t('nav.subtitle')}</span>
          </div>
        </Link>

        {/* Desktop nav links — hidden on mobile via CSS */}
        <div className="ab-navbar-links" aria-hidden="false">
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
                                  <a href={link.to} onClick={(e) => handleMegaLinkClick(e, link.to)}>
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

        {/* Right section */}
        <div className="ab-navbar-right">

          {/* ── Desktop-only: username, logout / login, admin, language ── */}
          {user ? (
            <>
              {/* ab-navbar-admin class → hidden on mobile via CSS */}
              {user.role === 'admin' && (
                <Link className="ab-navlink ab-navbar-admin" to="/admin">
                  Admin
                </Link>
              )}
              {/* ab-navbar-username → hidden on mobile via CSS */}
              <span className="ab-navbar-username" title={user.email}>
                {firstName}
              </span>
              {/* ab-navbar-logout → hidden on mobile via CSS */}
              <button className="ab-navbar-logout" onClick={handleLogout}>
                {t('nav.logout') || 'Logout'}
              </button>
            </>
          ) : (
            /* ab-navbar-cta → hidden on mobile via CSS */
            <Link className="ab-navbar-cta" to="/auth">{t('nav.login')}</Link>
          )}

          {/* Language switcher — ls-root hidden on mobile via CSS */}
          <LanguageSwitcher />

          {/* ── Mobile-only: search icon ── */}
          <button
            className={`ab-nav-search ab-nav-search--mobile ${searchOpen ? 'ab-nav-search--active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(v => !v)}
          >
            <SearchIcon />
          </button>

          {/* ── Hamburger — only visible on mobile via CSS ── */}
          <button
            className={`ab-hamburger ${mobileOpen ? 'ab-hamburger--open' : ''}`}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="ab-mobile-drawer"
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
        aria-label="Site search"
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
            <button type="submit" className="ab-search-go" tabIndex={searchOpen ? 0 : -1} aria-label="Search">
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

      {/* ════════════════════════════════════════
          MOBILE DRAWER
          Slides down from the navbar on hamburger tap.
          Contains: nav links, user info, logout / login.
      ════════════════════════════════════════ */}
      <div
        id="ab-mobile-drawer"
        className={`ab-mobile-drawer ${mobileOpen ? 'ab-mobile-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        {/* Nav links */}
        <ul className="ab-mobile-nav" role="list">
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
                        <Link
                          key={link.label}
                          to={link.to}
                          className="ab-mobile-sub-link"
                          onClick={() => setMobileOpen(false)}
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
                  onClick={() => setMobileOpen(false)}
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

        {/* Drawer footer — user info + auth actions */}
        <div className="ab-mobile-footer">
          {user ? (
            <div className="ab-mobile-user">
              {/* User avatar initial + name */}
              <div className="ab-mobile-user-info">
                <span className="ab-mobile-avatar" aria-hidden="true">
                  {(user.full_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                </span>
                <div>
                  <p className="ab-mobile-user-name">{user.full_name || user.email}</p>
                  <p className="ab-mobile-user-role">{user.role || 'Student'}</p>
                </div>
              </div>

              {/* Admin link — only for admins */}
              {user.role === 'admin' && (
                <Link
                  className="ab-mobile-admin-link"
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                >
                  ⚙ Admin Panel
                </Link>
              )}

              {/* Logout */}
              <button className="ab-mobile-logout-btn" onClick={handleLogout}>
                {t('nav.logout') || 'Logout'}
              </button>
            </div>
          ) : (
            <div className="ab-mobile-auth">
              <Link
                className="ab-mobile-login-btn"
                to="/auth"
                onClick={() => setMobileOpen(false)}
              >
                {t('nav.login') || 'Login'}
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Navebar;
