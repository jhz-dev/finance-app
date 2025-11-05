import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      translation: {
        "Target": "Target",
        "Add transaction": "Add transaction",
        "Are you sure?": "Are you sure?",
        "This action cannot be undone.": "This action cannot be undone.",
        "Cancel": "Cancel",
        "Delete": "Delete"
      },
    },
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
