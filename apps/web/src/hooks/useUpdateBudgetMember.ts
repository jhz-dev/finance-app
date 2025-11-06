import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { toast } from "sonner";
import { useRef } from "react";
import type { UpdateBudgetMemberPayload } from "@/domain/budget";

export function useUpdateBudgetMember(budgetId: string) {
    const queryClient = useQueryClient();
    const toastId = useRef<string | number | undefined>(undefined);

    return useMutation({
        mutationFn: ({ memberId, role }: UpdateBudgetMemberPayload) => {
            toastId.current = toast.loading("Updating member role...");
            return budgetRepository.updateMemberRole(budgetId, memberId, role);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
            toast.success("Member role updated successfully", {
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