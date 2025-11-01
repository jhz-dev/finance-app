import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FinancialGoal } from "@/domain/goal/goal";

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
		</Card>
	);
}
