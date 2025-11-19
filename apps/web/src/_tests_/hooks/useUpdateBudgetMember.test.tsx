import { renderHook, waitFor } from "@testing-library/react";
import { useUpdateBudgetMember } from "@/hooks/useUpdateBudgetMember";
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

describe("useUpdateBudgetMember", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const budgetId = "1";
  const updatePayload = {
    memberId: "2",
    role: "Editor" as BudgetRole,
  };

  it("should call the updateMemberRole mutation and show a success toast", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useUpdateBudgetMember(budgetId), {
      wrapper,
    });
    const mockUpdateMemberRole = vi
      .spyOn(budgetRepository, "updateMemberRole")
      .mockResolvedValue();

    result.current.mutate(updatePayload);

    await waitFor(() => {
      expect(mockUpdateMemberRole).toHaveBeenCalledWith(
        budgetId,
        updatePayload.memberId,
        updatePayload.role
      );
      expect(toast.loading).toHaveBeenCalledWith("Updating member role...");
      expect(toast.success).toHaveBeenCalledWith(
        "Member role updated successfully",
        {
          id: 1,
        }
      );
    });
  });

  it("should show an error toast if the updateMemberRole mutation fails", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useUpdateBudgetMember(budgetId), {
      wrapper,
    });
    const mockUpdateMemberRole = vi
      .spyOn(budgetRepository, "updateMemberRole")
      .mockRejectedValue(new Error("Failed to update member role"));

    result.current.mutate(updatePayload);

    await waitFor(() => {
      expect(mockUpdateMemberRole).toHaveBeenCalledWith(
        budgetId,
        updatePayload.memberId,
        updatePayload.role
      );
      expect(toast.loading).toHaveBeenCalledWith("Updating member role...");
      expect(toast.error).toHaveBeenCalledWith("Failed to update member role", {
        id: 1,
      });
    });
  });
});
