import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";
import type { FinancialGoal } from "../goal";
import { UpdateGoalForm } from "./UpdateGoalForm";

export const GoalItem = ({ goal }: { goal: FinancialGoal }) => {
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);

	const { mutate: deleteGoal } = useMutation({
		mutationFn: (id: string) => apiGoalRepository.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});

	return (
		<div>
			{isEditing ? (
				<UpdateGoalForm goal={goal} onDone={() => setIsEditing(false)} />
			) : (
				<div>
					<h2>{goal.name}</h2>
					<p>
						{goal.currentAmount} / {goal.targetAmount}
					</p>
					<button onClick={() => setIsEditing(true)}>Edit</button>
					<button onClick={() => deleteGoal(goal.id)}>Delete</button>
				</div>
			)}
		</div>
	);
};
