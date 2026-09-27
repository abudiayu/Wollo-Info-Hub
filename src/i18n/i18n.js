import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import am from './locales/am.json';
import om from './locales/om.json';

i18n
  // Detect language from localStorage, then navigator, then fallback
  .use(LanguageDetector)
  // Wire into React
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      om: { translation: om },
    },

    // Fallback when a key is missing in the active locale
    fallbackLng: 'en',

    // Only support the three languages we have
    supportedLngs: ['en', 'am', 'om'],

    // Don't try to load en-US separately; strip region codes
    load: 'languageOnly',

    interpolation: {
      // React already escapes output
      escapeValue: false,
    },

    // Allow t() to return arrays and objects (needed for programs lists)
    returnObjects: true,

    detection: {
      // Where to look for the stored preference
      order: ['localStorage', 'navigator'],
      // localStorage key name
      lookupLocalStorage: 'wollo-lang',
      // Persist the choice back to localStorage
      caches: ['localStorage'],
    },
  });

export default i18n;
