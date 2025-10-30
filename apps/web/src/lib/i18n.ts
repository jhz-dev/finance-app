import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
	.use(HttpApi)
	.use(initReactI18next)
	.init({
		lng: "es",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},
	});

export default i18n;
