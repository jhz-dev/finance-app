import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FinancialGoal } from "@/domain/goal/goal";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";

export function useUpdateGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (goal: FinancialGoal) => {
			return apiGoalRepository.update(goal.id, goal);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
