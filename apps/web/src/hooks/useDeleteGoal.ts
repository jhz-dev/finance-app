import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";
import { toast } from "sonner";
import { useRef } from "react";

export function useDeleteGoal() {
	const queryClient = useQueryClient();
	const toastId = useRef<string | number | undefined>(undefined);

	return useMutation({
		mutationFn: (id: string) => {
			toastId.current = toast.loading("Deleting goal...");
			return apiGoalRepository.delete(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Goal deleted successfully", {
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
