import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";

export function useAddTransactionToGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, amount }: { id: string; amount: number }) => {
			return apiGoalRepository.addTransaction(id, amount);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
