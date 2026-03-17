import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';

import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

i18n.use(RNLanguageDetector).use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en',
  supportedLngs: ['en', 'es'],
  interpolation: { escapeValue: false },
});

export default i18n;
