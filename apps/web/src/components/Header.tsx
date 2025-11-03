import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSidebarStore } from "@/domain/sidebar/sidebar.store";
import { AddBudgetDialog } from "./AddBudgetDialog";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "./ui/button";
import { useTour } from "@/hooks/useTour";
import { tourSteps } from "@/lib/tour";

export function Header() {
	const { t } = useTranslation();
	const { toggle } = useSidebarStore();
  const { startTour } = useTour();

  const handleRestartTour = () => {
    localStorage.removeItem("tour_seen");
    startTour(tourSteps);
  };

	return (
		<header className="flex items-center justify-between p-4 bg-slate-200">
			<Button
				onClick={toggle}
				variant="outline"
				size="icon"
				className="bg-slate-200 text-slate-700 rounded-full p-2"
			>
				<Menu className="h-6 w-6" />
			</Button>
			<h1 className="text-2xl font-bold text-slate-900">{t("Dashboard")}</h1>
			<div className="flex items-center gap-4">
				<LanguageSelector />
				<AddBudgetDialog />
        <Button onClick={handleRestartTour}>Replay Tour</Button>
			</div>
		</header>
	);
}
