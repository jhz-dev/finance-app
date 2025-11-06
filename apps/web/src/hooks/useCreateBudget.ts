import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRef } from "react";

interface CreateBudgetPayload {
    name: string;
}

export function useCreateBudget() {
    const queryClient = useQueryClient();
    const toastId = useRef<string | number | undefined>(undefined);

    return useMutation({
        mutationFn: (data: CreateBudgetPayload) => {
            toastId.current = toast.loading("Creating budget...");
            return api.post("/budgets", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            toast.success("Budget created successfully", {
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
