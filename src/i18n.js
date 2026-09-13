import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./Components/locales/en.json";
import kmTranslations from "./Components/locales/km.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      km: { translation: kmTranslations } // កែពី kh/khTranslations មក km/kmTranslations
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;