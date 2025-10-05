import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';
import translationGU from './locales/gu/translation.json';

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  gu: { translation: translationGU },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;