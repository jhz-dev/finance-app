import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FinancialGoal } from "@/domain/goal/goal";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";

export function useCreateGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (
			goal: Omit<FinancialGoal, "id" | "currentAmount" | "userId">,
		) => {
			return apiGoalRepository.create(goal);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
