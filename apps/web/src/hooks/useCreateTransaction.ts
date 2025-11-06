import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionRepository } from "@/infrastructure/ApiTransactionRepository";
import { toast } from "sonner";
import { useRef } from "react";
import type { CreateTransaction } from "@/domain/transaction";

export function useCreateTransaction(budgetId: string) {
	const queryClient = useQueryClient();
	const toastId = useRef<string | number | undefined>(undefined);

	return useMutation({
		mutationFn: (transaction: CreateTransaction) => {
			toastId.current = toast.loading("Creating transaction...");
			return transactionRepository.create(budgetId, transaction);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
			toast.success("Transaction created successfully", {
				id: toastId.current,
			});
		},
		onError: (error) => {
			toast.error(error.message, {
				id: toastId.current,
			});
		},
	});
}
