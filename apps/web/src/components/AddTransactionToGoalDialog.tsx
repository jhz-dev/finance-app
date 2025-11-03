import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AddTransactionToGoalForm } from "@/domain/goal/components/AddTransactionToGoalForm";
import type { Goal } from "@/domain/goal/goal";

export function AddTransactionToGoalDialog({
	goal,
	children,
}: {
	goal: Goal;
	children: React.ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Transaction to Goal</DialogTitle>
				</DialogHeader>
				<AddTransactionToGoalForm goal={goal} />
			</DialogContent>
		</Dialog>
	);
}
