import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FinancialGoal } from "@/domain/goal/goal";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { toast } from "sonner";
import { useRef } from "react";

export function useUpdateGoal() {
	const queryClient = useQueryClient();
	const toastId = useRef<string | number | undefined>(undefined);

	return useMutation({
		mutationFn: (goal: FinancialGoal) => {
			toastId.current = toast.loading("Updating goal...");
			return goalRepository.update(goal.id, goal);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Goal updated successfully", {
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
