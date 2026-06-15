import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import en from './locales/en.json';

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

export type AppLanguage = keyof typeof resources;

// Default to the device language when supported, otherwise English.
const deviceLanguage = getLocales()[0]?.languageCode;
const initialLanguage: AppLanguage = deviceLanguage === 'ar' ? 'ar' : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
