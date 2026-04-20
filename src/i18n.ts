import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ['en', 'de', 'uk'],
        fallbackLng: 'en',
        debug: false,
        interpolation: { escapeValue: false },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
        detection: {
            order: ['localStorage', 'cookie', 'navigator'],
            caches: ['localStorage', 'cookie'],
        }
    })
    .then(() => {
        console.log('i18n initialized successfully');
    })
    .catch((err) => console.error('i18n loading error:', err));

