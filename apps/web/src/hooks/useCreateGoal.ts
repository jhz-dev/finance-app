import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FinancialGoal } from "@/domain/goal/goal";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";
import { toast } from "sonner";
import { useRef } from "react";

export function useCreateGoal() {
	const queryClient = useQueryClient();
	const toastId = useRef<string | number | undefined>(undefined);

	return useMutation({
		mutationFn: (
			goal: Omit<FinancialGoal, "id" | "currentAmount" | "userId">,
		) => {
			toastId.current = toast.loading("Creating goal...");
			return apiGoalRepository.create(goal);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Goal created successfully", {
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
