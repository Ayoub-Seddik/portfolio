import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// EN
import enCommon from "./locales/en/common.json";
import enPublic from "./locales/en/public.json";
import enAdmin from "./locales/en/admin.json";

// FR
import frCommon from "./locales/fr/common.json";
import frPublic from "./locales/fr/public.json";
import frAdmin from "./locales/fr/admin.json";

i18n
  .use(LanguageDetector) // ✅ detect + persist language
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          ...enCommon,
          ...enPublic,
          ...enAdmin,
        },
      },
      fr: {
        translation: {
          ...frCommon,
          ...frPublic,
          ...frAdmin,
        },
      },
    },

    fallbackLng: "en",

    detection: {
      // 1) use saved language if available
      // 2) else use browser language
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],

      // optional: only allow these
      supportedLngs: ["en", "fr"],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
