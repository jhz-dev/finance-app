import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateGoalForm } from "@/domain/goal/components/UpdateGoalForm";
import type { FinancialGoal } from "@/domain/goal/goal";
import { useTranslation } from "react-i18next";

export function EditGoalDialog({
	goal,
	children,
}: {
	goal: FinancialGoal;
	children: React.ReactNode;
}) {
	const { t } = useTranslation();
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-white rounded-xl border shadow-sm">
				<DialogHeader>
					<DialogTitle>{t("Edit Goal")}</DialogTitle>
				</DialogHeader>
				<UpdateGoalForm goal={goal} />
			</DialogContent>
		</Dialog>
	);
}
