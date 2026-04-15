import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enJSON from './locales/en.json';
import frJSON from './locales/fr.json';
import esJSON from './locales/es.json';
import arJSON from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      fr: { translation: frJSON },
      es: { translation: esJSON },
      ar: { translation: arJSON }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage'], // Only detect from localStorage, ignore browser language
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;
