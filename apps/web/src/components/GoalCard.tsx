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
import { Button } from "./ui/button";
import { EditGoalDialog } from "./EditGoalDialog";
import { PencilIcon, Trash2 } from "lucide-react";
import { AddTransactionToGoalDialog } from "./AddTransactionToGoalDialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteGoal } from "@/hooks/useDeleteGoal";

interface GoalCardProps {
	goal: FinancialGoal;
}

export function GoalCard({ goal }: GoalCardProps) {
	const { t } = useTranslation();
	const { mutate } = useDeleteGoal();
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
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline" size="icon">
							<Trash2 className="h-4 w-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
							<AlertDialogDescription>
								{t("This action cannot be undone.")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
							<AlertDialogAction onClick={() => mutate(goal.id)}>
								{t("Delete")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<EditGoalDialog goal={goal}>
					<Button variant="outline" size="icon">
						<PencilIcon className="h-4 w-4" />
					</Button>
				</EditGoalDialog>
				<AddTransactionToGoalDialog goal={goal}>
					<Button>{t("Add transaction")}</Button>
				</AddTransactionToGoalDialog>
			</CardFooter>
		</Card>
	);
}
