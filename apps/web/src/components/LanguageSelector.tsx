import { useTranslation } from "react-i18next";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLanguageStore } from "@/domain/language/language.store";

export function LanguageSelector() {
	const { i18n, t } = useTranslation();
	const { language, setLanguage } = useLanguageStore();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		setLanguage(lng);
	};

	return (
		<Select onValueChange={changeLanguage} defaultValue={language}>
			<SelectTrigger className="w-[100%]">
				<SelectValue placeholder={t("Language")} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="en">{t("English")}</SelectItem>
				<SelectItem value="es">{t("Spanish")}</SelectItem>
			</SelectContent>
		</Select>
	);
}
