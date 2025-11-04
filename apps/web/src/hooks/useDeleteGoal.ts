import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";

export function useDeleteGoal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => {
			return apiGoalRepository.delete(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] });
		},
	});
}
