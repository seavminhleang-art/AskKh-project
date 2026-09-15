import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en.json";
import khTranslations from "./locales/kh.json";
import enCommunityTranslations from "./Components/locales/en.json";
import kmCommunityTranslations from "./Components/locales/km.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      // The home pages use root-level keys while the Q&A pages use `nav.*`,
      // `sidebar.*`, and other nested keys. Expose both in one namespace.
      en: { translation: { ...enTranslations, ...enCommunityTranslations } },
      km: { translation: { ...khTranslations, ...kmCommunityTranslations } }
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
