import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@/infrastructure/ApiAuthRepository";
import { toast } from "sonner";
import { useRef } from "react";
import type { RegisterData } from "@/domain/auth";

export function useRegister() {
    const toastId = useRef<string | number | undefined>(undefined);

    return useMutation({
        mutationFn: (data: RegisterData) => {
            toastId.current = toast.loading("Creating account...");
            return authRepository.register(data);
        },
        onSuccess: () => {
            toast.success("Registration successful! Please sign in.", {
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
