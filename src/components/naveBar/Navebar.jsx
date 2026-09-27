import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './NaveBar.css';
import Logo from '../../assets/wolloLogo.png';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const MEGA_MENU_DATA = {
  Health: {
    columns: [
      {
        heading: 'Departments',
        links: ['Medicine', 'Pharmacy', 'Nurses', 'Midwifery', 'Veternary Medicine'],
      },
      {
        heading: 'Quick Links',
        links: ['Course Catalog', 'Admission Requirements', 'Lab Facilities', 'Research Groups', 'Student Projects'],
      },
      {
        heading: 'Resources',
        links: ['Faculty Directory', 'Academic Calendar', 'Internship Opportunities', 'Alumni Network', 'Career Services'],
      },
    ],
  },
  informatics: {
    columns: [
      {
        heading: 'Departments',
        links: ['Computer Science', 'Information Technology', 'Information Systems', 'Software Engineering', 'Data Science'],
      },
      {
        heading: 'Quick Links',
        links: ['Course Catalog', 'Admission Requirements', 'Lab Facilities', 'Research Groups', 'Student Projects'],
      },
      {
        heading: 'Resources',
        links: ['Faculty Directory', 'Academic Calendar', 'Internship Opportunities', 'Alumni Network', 'Career Services'],
      },
    ],
  },
  engineering: {
    columns: [
      {
        heading: 'Departments',
        links: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Water Resources Engineering'],
      },
      {
        heading: 'Quick Links',
        links: ['Course Catalog', 'Admission Requirements', 'Engineering Labs', 'Research Projects', 'Industrial Attachment'],
      },
      {
        heading: 'Resources',
        links: ['Faculty Directory', 'Academic Calendar', 'Scholarships', 'Alumni Network', 'Career Services'],
      },
    ],
  },
  Social: {
    columns: [
      {
        heading: 'Departments',
        links: ['Low Income', 'Accounting', 'Management', 'Journalism', 'Arts and Culture', 'Political Science', 'Economics', 'Sociology', 'Psychology',"sports"],
      },
      {
        heading: 'Quick Links',
        links: ['Course Catalog', 'Admission Requirements', 'Engineering Labs', 'Research Projects', 'Industrial Attachment'],
      },
      {
        heading: 'Resources',
        links: ['Faculty Directory', 'Academic Calendar', 'Scholarships', 'Alumni Network', 'Career Services'],
      },
    ],
  },
};

function Navebar() {
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState(null);
  const closeTimer = useRef(null);
  const navRef = useRef(null);

  const openWithHover = (key) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };

  const closeWithDelay = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const toggleOnClick = (key) => {
    clearTimeout(closeTimer.current);
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    function handleOutsideClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
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

        {/* Nav links */}
        <div className="ab-navbar-links">
          <a href="#">{t('nav.Home')}</a>

          {/* Health */}
          <div
            className="ab-navbar-item-with-menu"
            onMouseEnter={() => openWithHover('Health')}
            onMouseLeave={closeWithDelay}
          >
            <a
              href="#"
              className={openMenu === 'Health' ? 'ab-navlink-active' : ''}
              onClick={(e) => { e.preventDefault(); toggleOnClick('Health'); }}
              aria-expanded={openMenu === 'Health'}
              aria-haspopup="true"
            >
              {t('nav.Medicine')}
            </a>
          </div>

          {/* Informatics */}
          <div
            className="ab-navbar-item-with-menu"
            onMouseEnter={() => openWithHover('informatics')}
            onMouseLeave={closeWithDelay}
          >
            <a
              href="#"
              className={openMenu === 'informatics' ? 'ab-navlink-active' : ''}
              onClick={(e) => { e.preventDefault(); toggleOnClick('informatics'); }}
              aria-expanded={openMenu === 'informatics'}
              aria-haspopup="true"
            >
              {t('nav.Informatics')}
            </a>
          </div>

          {/* Engineering */}
          <div
            className="ab-navbar-item-with-menu"
            onMouseEnter={() => openWithHover('engineering')}
            onMouseLeave={closeWithDelay}
          >
            <a
              href="#"
              className={openMenu === 'engineering' ? 'ab-navlink-active' : ''}
              onClick={(e) => { e.preventDefault(); toggleOnClick('engineering'); }}
              aria-expanded={openMenu === 'engineering'}
              aria-haspopup="true"
            >
              {t('nav.Engineering')}
            </a>
          </div>
          
          {/* Social Science */}
          <div
            className="ab-navbar-item-with-menu"
            onMouseEnter={() => openWithHover('Social')}
            onMouseLeave={closeWithDelay}
          >
            <a
              href="#"
              className={openMenu === 'Social' ? 'ab-navlink-active' : ''}
              onClick={(e) => { e.preventDefault(); toggleOnClick('Social'); }}
              aria-expanded={openMenu === 'Social'}
              aria-haspopup="true"
            >
              {t('nav.Social')}
            </a>
          </div>
        </div>

        {/* Right side: Login CTA + Language Switcher */}
        <div className="ab-navbar-right">
          <a className="ab-navbar-cta" href="#">{t('nav.login')}</a>
          <LanguageSwitcher />
        </div>

      </nav>

      {renderMegaMenu('Health')}
      {renderMegaMenu('informatics')}
      {renderMegaMenu('engineering')}
      {renderMegaMenu('Social')}
    </div>
  );
}

export default Navebar;
