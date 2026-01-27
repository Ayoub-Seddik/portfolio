import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// EN
import enCommon from "./locales/en/common.json";
import enPublic from "./locales/en/public.json";
import enAdmin from "./locales/en/admin.json";

// FR
import frCommon from "./locales/fr/common.json";
import frPublic from "./locales/fr/public.json";
import frAdmin from "./locales/fr/admin.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        ...enCommon,
        ...enPublic,
        ...enAdmin
      }
    },
    fr: {
      translation: {
        ...frCommon,
        ...frPublic,
        ...frAdmin
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
