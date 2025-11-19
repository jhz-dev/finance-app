import { authRepository } from "@/infrastructure/ApiAuthRepository";
import api from "@/lib/api";
import { vi } from "vitest";
import type {
  LoginCredentials,
  RegisterData,
} from "@/domain/auth/auth.repository";
import type { User } from "@/domain/auth/auth.store";

vi.mock("@/lib/api");

describe("ApiAuthRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should call api.post with the correct credentials and return the response", async () => {
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password",
      };
      const expectedResponse = {
        user: { id: "1", email: "test@example.com", name: "Test User" },
        token: "fake-token",
      };
      (api.post as vi.Mock).mockResolvedValue({ data: expectedResponse });

      const response = await authRepository.login(credentials);

      expect(api.post).toHaveBeenCalledWith("/auth/login", credentials);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe("register", () => {
    it("should call api.post with the correct data and return the new user", async () => {
      const registerData: RegisterData = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
      };
      const expectedUser: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };
      (api.post as vi.Mock).mockResolvedValue({ data: expectedUser });

      const user = await authRepository.register(registerData);

      expect(api.post).toHaveBeenCalledWith("/auth/register", registerData);
      expect(user).toEqual(expectedUser);
    });
  });

  describe("getMe", () => {
    it("should call api.get and return the user on success", async () => {
      const expectedUser: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };
      (api.get as vi.Mock).mockResolvedValue({ data: { user: expectedUser } });

      const user = await authRepository.getMe();

      expect(api.get).toHaveBeenCalledWith("/auth/me");
      expect(user).toEqual(expectedUser);
    });

    it("should return null if api.get throws an error", async () => {
      (api.get as vi.Mock).mockRejectedValue(new Error("Unauthorized"));

      const user = await authRepository.getMe();

      expect(api.get).toHaveBeenCalledWith("/auth/me");
      expect(user).toBeNull();
    });
  });
});
