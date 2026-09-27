import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LANGUAGES = [
  { code: 'en', badge: 'EN', label: 'English',       native: 'English'       },
  { code: 'am', badge: 'AM', label: 'Amharic',       native: 'አማርኛ'          },
  { code: 'om', badge: 'OM', label: 'Afaan Oromo',   native: 'Afaan Oromoo'  },
];

/* Globe icon */
function GlobeIcon() {
  return (
    <svg
      className="ls-globe"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="10" cy="10" rx="3.5" ry="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4"  y1="6"  x2="16" y2="6"  stroke="currentColor" strokeWidth="1.2" />
      <line x1="4"  y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* Chevron icon */
function ChevronIcon({ open }) {
  return (
    <svg
      className={`ls-chevron${open ? ' ls-chevron--open' : ''}`}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Checkmark icon */
function CheckIcon() {
  return (
    <svg
      className="ls-check"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 7L5.5 10.5L12 3.5" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Resolve the active language — strip region suffix (e.g. "en-US" → "en")
  const rawLang = i18n.resolvedLanguage || i18n.language || 'en';
  const activeLang = LANGUAGES.find(l => l.code === rawLang.split('-')[0]) || LANGUAGES[0];

  /* ── Sync document.documentElement.lang on mount + change ── */
  useEffect(() => {
    document.documentElement.lang = activeLang.code;
  }, [activeLang.code]);

  /* ── Close on outside click ─────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  /* ── Close on Escape ────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        containerRef.current?.querySelector('.ls-trigger')?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  /* ── Keyboard navigation inside dropdown ────────────────── */
  const handleDropdownKey = useCallback((e) => {
    const items = containerRef.current?.querySelectorAll('.ls-option');
    if (!items || items.length === 0) return;
    const focused = document.activeElement;
    const idx = Array.from(items).indexOf(focused);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[idx < items.length - 1 ? idx + 1 : 0]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[idx > 0 ? idx - 1 : items.length - 1]?.focus();
    }
  }, []);

  function selectLanguage(code) {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
    setOpen(false);
    containerRef.current?.querySelector('.ls-trigger')?.focus();
  }

  return (
    <div className="ls-root" ref={containerRef}>
      {/* ── Trigger button ─────────────────────────────────── */}
      <button
        className="ls-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${activeLang.label}. Click to change.`}
        onClick={() => setOpen(v => !v)}
      >
        <GlobeIcon />
        <span className="ls-trigger-code">{activeLang.badge}</span>
        <ChevronIcon open={open} />
      </button>

      {/* ── Dropdown panel ─────────────────────────────────── */}
      <div
        className={`ls-dropdown${open ? ' ls-dropdown--open' : ''}`}
        role="listbox"
        aria-label="Select language"
        onKeyDown={handleDropdownKey}
      >
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === activeLang.code;
          return (
            <button
              key={lang.code}
              className={`ls-option${isActive ? ' ls-option--active' : ''}`}
              role="option"
              aria-selected={isActive}
              tabIndex={open ? 0 : -1}
              onClick={() => selectLanguage(lang.code)}
            >
              <span className="ls-badge">{lang.badge}</span>
              <span className="ls-label-wrap">
                <span className="ls-label-main">{lang.label}</span>
                <span className="ls-label-native">{lang.native}</span>
              </span>
              {isActive && <CheckIcon />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
