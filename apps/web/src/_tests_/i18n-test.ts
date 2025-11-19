import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
	.use(initReactI18next)
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		lng: "en",
		fallbackLng: "en",
		ns: ["translations"],
		defaultNS: "translations",
		debug: false,
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		resources: { en: { translations: {} } }, // provide empty translations
	});

export default i18n;