import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionRepository } from "@/infrastructure/ApiTransactionRepository";
import { toast } from "sonner";
import { useRef } from "react";
import type { UpdateTransactionPayload } from "@/domain/transaction";

export function useUpdateTransaction(budgetId: string) {
    const queryClient = useQueryClient();
    const toastId = useRef<string | number | undefined>(undefined);

    return useMutation({
        mutationFn: ({ transactionId, transaction }: UpdateTransactionPayload) => {
            toastId.current = toast.loading("Updating transaction...");
            return transactionRepository.update(transactionId, transaction);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
            toast.success("Transaction updated successfully", {
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
