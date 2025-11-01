import type { User, IUserRepository } from "@/domain/user";
import api from "@/lib/api";

class ApiUserRepository implements IUserRepository {
  async getMe(): Promise<User | null> {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (_error) {
      return null;
    }
  }

  async updateProfile(data: { name: string; email: string }): Promise<void> {
    await api.put("/auth/me", data);
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await api.put("/auth/change-password", data);
  }

  async requestVerificationEmail(): Promise<void> {
    await api.post("/auth/request-verification-email");
  }
}

export const userRepository = new ApiUserRepository();
