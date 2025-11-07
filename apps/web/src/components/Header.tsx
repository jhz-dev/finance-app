import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSidebarStore } from "@/domain/sidebar/sidebar.store";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export function Header() {
	const { t } = useTranslation();
	const { toggle } = useSidebarStore();

	return (
		<header className="flex items-center justify-between p-4 border-b">
			<Button
				onClick={toggle}
				variant="outline"
				size="icon"
				className="text-slate-700 rounded-full p-2"
			>
				<Menu className="h-6 w-6" />
			</Button>
			<h1 className="text-2xl font-bold">{t("Dashboard")}</h1>
			<div className="flex items-center gap-4">
				<ThemeToggle />
				<LanguageSelector />
			</div>
		</header>
	);
}
