import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FinancialGoal } from "@/domain/goal/goal";
import { AddTransactionToGoalDialog } from "./AddTransactionToGoalDialog";
import { DeleteGoalDialog } from "./DeleteGoalDialog";
import { EditGoalDialog } from "./EditGoalDialog";
import { Button } from "./ui/button";

interface GoalCardProps {
	goal: FinancialGoal;
}

export function GoalCard({ goal }: GoalCardProps) {
	const { t } = useTranslation();
	const formattedCurrentAmount = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(goal.currentAmount);

	const formattedTargetAmount = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(goal.targetAmount);

	const progress = (goal.currentAmount / goal.targetAmount) * 100;

	return (
		<Card className="bg-white rounded-3xl shadow-2xl p-6">
			<CardHeader>
				<CardTitle className="text-slate-500">{goal.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-4xl font-extrabold text-slate-900">
					{formattedCurrentAmount}
				</div>
				<p className="text-xs text-slate-500">
					{t("Target")}: {formattedTargetAmount}
				</p>
				<Progress value={progress} className="mt-4" />
			</CardContent>
			<CardFooter className="flex justify-end gap-2">
				<DeleteGoalDialog goalId={goal.id} />
				<EditGoalDialog goal={goal}>
					<Button variant="outline" size="icon">
						<Pencil className="h-4 w-4" />
					</Button>
				</EditGoalDialog>
				<AddTransactionToGoalDialog goal={goal}>
					<Button variant="outline">{t("Add transaction")}</Button>
				</AddTransactionToGoalDialog>
			</CardFooter>
		</Card>
	);
}
