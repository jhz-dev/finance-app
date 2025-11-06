import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { toast } from "sonner";
import { useRef } from "react";

export function useRemoveBudgetMember(budgetId: string) {
    const queryClient = useQueryClient();
    const toastId = useRef<string | number | undefined>(undefined);

    return useMutation({
        mutationFn: (memberId: string) => {
            toastId.current = toast.loading("Removing member...");
            return budgetRepository.removeMember(budgetId, memberId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
            toast.success("Member removed successfully", {
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