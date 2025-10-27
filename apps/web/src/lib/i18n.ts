import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "Dashboard": "Dashboard",
          "No Budgets Yet": "No Budgets Yet",
          "Click the \"Add New Budget\" button to get started.": "Click the \"Add New Budget\" button to get started.",
          "Previous": "Previous",
          "Next": "Next",
          "Page": "Page",
          "Profile": "Profile",
          "Logout": "Logout",
          "Add New Budget": "Add New Budget",
        }
      }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
