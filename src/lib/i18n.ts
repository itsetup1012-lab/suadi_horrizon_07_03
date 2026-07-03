'use client';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ar: { translation: ar },
        },
        fallbackLng: "en",
        supportedLngs: ["en", "ar"],
        defaultNS: "translation",
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage', 'cookie'],
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

// Set HTML attributes on change for SSR/hydration consistency
i18n.on('languageChanged', (lng) => {
    if (typeof document !== 'undefined') {
        document.dir = i18n.dir(lng);
        document.documentElement.lang = lng;
    }
});

export default i18n;