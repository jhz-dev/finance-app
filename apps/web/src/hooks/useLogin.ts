import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@/infrastructure/ApiAuthRepository";
import { toast } from "sonner";
import { useRef } from "react";
import { useAuthStore } from "@/domain/auth/auth.store";
import { useNavigate } from "@tanstack/react-router";
import type { LoginCredentials, LoginResponse } from "@/domain/auth";

export function useLogin() {
    const toastId = useRef<string | number | undefined>(undefined);
    const { setToken, setUser } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => {
            toastId.current = toast.loading("Signing in...");
            return authRepository.login(credentials);
        },
        onSuccess: (data: LoginResponse) => {
            setToken(data.token);
            setUser(data.user);
            navigate({ to: "/" });
            toast.success("Signed in successfully", {
                id: toastId.current,
            });
        },
        onError: (error) => {
          console.log(error);
            toast.error(error.message, {
                id: toastId.current,
            });
        },
    });
}
