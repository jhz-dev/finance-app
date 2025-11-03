import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateGoalForm } from "@/domain/goal/components/UpdateGoalForm";
import type { Goal } from "@/domain/goal/goal";

export function EditGoalDialog({
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
					<DialogTitle>Edit Goal</DialogTitle>
				</DialogHeader>
				<UpdateGoalForm goal={goal} />
			</DialogContent>
		</Dialog>
	);
}
