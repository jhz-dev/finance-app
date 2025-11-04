import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CreateGoalForm } from "@/domain/goal/components/CreateGoalForm";

export function AddGoalDialog({ children }: { children: React.ReactNode }) {
	const { t } = useTranslation();
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("Add New Goal")}</DialogTitle>
				</DialogHeader>
				<CreateGoalForm />
			</DialogContent>
		</Dialog>
	);
}
