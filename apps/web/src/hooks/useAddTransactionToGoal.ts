import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

export function useAddTransactionToGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, amount }: { id: string; amount: number }) => {
			return goalRepository.addTransaction(id, amount);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
