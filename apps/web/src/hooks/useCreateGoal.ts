import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FinancialGoal as Goal} from "@/domain/goal/goal";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

export function useCreateGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (goal: Omit<Goal, "id" | "userId">) => {
			return goalRepository.create(goal);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
