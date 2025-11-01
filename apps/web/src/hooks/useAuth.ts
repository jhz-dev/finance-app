import { useQuery } from "@tanstack/react-query";
import { userRepository } from "@/infrastructure/ApiUserRepository";

export function useAuth() {
  const { data: user, ...rest } = useQuery({
    queryKey: ["me"],
    queryFn: userRepository.getMe,
  });

  return { user, ...rest };
}
