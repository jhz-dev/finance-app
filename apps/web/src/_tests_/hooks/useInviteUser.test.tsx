import { renderHook, waitFor } from "@testing-library/react";
import { useInviteUser } from "@/hooks/useInviteUser";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BudgetRole } from "@/domain/budget";

vi.mock("@/infrastructure/ApiBudgetRepository");
vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useInviteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const budgetId = "1";
  const invitePayload = {
    email: "test@example.com",
    role: "Admin" as BudgetRole,
  };

  it("should call the inviteMember mutation and show a success toast", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useInviteUser(budgetId), { wrapper });
    const mockInviteMember = vi
      .spyOn(budgetRepository, "inviteMember")
      .mockResolvedValue();

    result.current.mutate(invitePayload);

    await waitFor(() => {
      expect(mockInviteMember).toHaveBeenCalledWith(
        budgetId,
        invitePayload.email,
        invitePayload.role
      );
      expect(toast.loading).toHaveBeenCalledWith("Sending invitation...");
      expect(toast.success).toHaveBeenCalledWith(
        "Invitation sent successfully",
        {
          id: 1,
        }
      );
    });
  });

  it("should show an error toast if the inviteMember mutation fails", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useInviteUser(budgetId), { wrapper });
    const mockInviteMember = vi
      .spyOn(budgetRepository, "inviteMember")
      .mockRejectedValue(new Error("Failed to send invitation"));

    result.current.mutate(invitePayload);

    await waitFor(() => {
      expect(mockInviteMember).toHaveBeenCalledWith(
        budgetId,
        invitePayload.email,
        invitePayload.role
      );
      expect(toast.loading).toHaveBeenCalledWith("Sending invitation...");
      expect(toast.error).toHaveBeenCalledWith("Failed to send invitation", {
        id: 1,
      });
    });
  });
});
