import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { toast } from "sonner";
import { useRef } from "react";

export function useAddTransactionToGoal() {
	const queryClient = useQueryClient();
	const toastId = useRef<string | number | undefined>(undefined);

	return useMutation({
		mutationFn: ({ id, amount }: { id: string; amount: number }) => {
			toastId.current = toast.loading("Adding transaction...");
			return goalRepository.addTransaction(id, amount);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Transaction added successfully", {
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
