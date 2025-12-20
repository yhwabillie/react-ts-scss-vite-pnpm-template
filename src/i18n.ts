// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      hello: '안녕하세요',
    },
  },
  en: {
    translation: {
      hello: 'Hello',
    },
  },
  ja: {
    translation: {
      hello: 'こんにちは',
    },
  },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next) // react-i18next 바인딩
  .init({
    resources,
    lng: 'ko', // 기본 언어
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // 리액트는 기본적으로 xss 방지를 함
    },
  });

export default i18n;
