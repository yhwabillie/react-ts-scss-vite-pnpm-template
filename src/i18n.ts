// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const backend = {
  type: 'backend' as const,
  read(language: string, namespace: string, callback: (err: Error | null, data: object | false) => void) {
    import(`./locales/${language}/${namespace}.json`)
      .then(module => callback(null, module.default))
      .catch(err => callback(err as Error, false));
  },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(backend) // 필요한 언어/네임스페이스만 지연 로드
  .use(initReactI18next) // react-i18next 바인딩
  .init({
    ns: ['common'],
    defaultNS: 'common',
    lng: 'ko', // 기본 언어
    fallbackLng: 'en',
    supportedLngs: ['ko', 'en', 'ja'],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false, // 리액트는 기본적으로 xss 방지를 함
    },
  });

export default i18n;
