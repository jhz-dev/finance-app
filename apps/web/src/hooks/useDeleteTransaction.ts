import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionRepository } from "@/infrastructure/ApiTransactionRepository";

export function useDeleteTransaction(budgetId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (transactionId: string) =>
			transactionRepository.delete(transactionId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
		},
	});
}
