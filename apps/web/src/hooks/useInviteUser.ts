import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { toast } from "sonner";
import { useRef } from "react";
import type { BudgetRole } from "@/domain/budget";

interface InviteUserPayload {
    email: string;
    role: BudgetRole;
}

export function useInviteUser(budgetId: string) {
    const queryClient = useQueryClient();
    const toastId = useRef<string | number | undefined>(undefined);

    return useMutation({
        mutationFn: ({ email, role }: InviteUserPayload) => {
            toastId.current = toast.loading("Sending invitation...");
            return budgetRepository.inviteMember(budgetId, email, role);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
            toast.success("Invitation sent successfully", {
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