import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/domain/language/language.store";
import { LabeledSelect } from "./ui/LabeledSelect";

export function LanguageSelector() {
	const { i18n } = useTranslation();
	const { language, setLanguage } = useLanguageStore();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		setLanguage(lng);
	};

	const languageOptions = [
		{ value: "en", label: "English" },
		{ value: "es", label: "Spanish" },
	];

	return (
		<LabeledSelect
			value={language}
			onValueChange={changeLanguage}
			options={languageOptions}
			placeholder="Language"			className="w-[100%]"
		/>
	);
}
