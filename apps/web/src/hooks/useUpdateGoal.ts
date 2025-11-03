import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Goal } from "@/domain/goal/goal";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

export function useUpdateGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (goal: Goal) => {
			return goalRepository.update(goal.id, goal);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
