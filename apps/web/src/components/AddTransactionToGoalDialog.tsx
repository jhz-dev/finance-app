import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AddTransactionToGoalForm } from "@/domain/goal/components/AddTransactionToGoalForm";
import type { FinancialGoal } from "@/domain/goal/goal";
import { useTranslation } from "react-i18next";

export function AddTransactionToGoalDialog({
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
					<DialogTitle>{t("Add Transaction to Goal")}</DialogTitle>
				</DialogHeader>
				<AddTransactionToGoalForm goal={goal} />
			</DialogContent>
		</Dialog>
	);
}
