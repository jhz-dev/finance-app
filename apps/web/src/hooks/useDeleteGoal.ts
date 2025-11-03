import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";

export function useDeleteGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => {
			return goalRepository.delete(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
