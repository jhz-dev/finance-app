import { renderHook, waitFor } from "@testing-library/react";
import { useRemoveBudgetMember } from "@/hooks/useRemoveBudgetMember";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

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

describe("useRemoveBudgetMember", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const budgetId = "1";
  const memberId = "2";

  it("should call the removeMember mutation and show a success toast", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useRemoveBudgetMember(budgetId), {
      wrapper,
    });
    const mockRemoveMember = vi
      .spyOn(budgetRepository, "removeMember")
      .mockResolvedValue();

    result.current.mutate(memberId);

    await waitFor(() => {
      expect(mockRemoveMember).toHaveBeenCalledWith(budgetId, memberId);
      expect(toast.loading).toHaveBeenCalledWith("Removing member...");
      expect(toast.success).toHaveBeenCalledWith(
        "Member removed successfully",
        {
          id: 1,
        }
      );
    });
  });

  it("should show an error toast if the removeMember mutation fails", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useRemoveBudgetMember(budgetId), {
      wrapper,
    });
    const mockRemoveMember = vi
      .spyOn(budgetRepository, "removeMember")
      .mockRejectedValue(new Error("Failed to remove member"));

    result.current.mutate(memberId);

    await waitFor(() => {
      expect(mockRemoveMember).toHaveBeenCalledWith(budgetId, memberId);
      expect(toast.loading).toHaveBeenCalledWith("Removing member...");
      expect(toast.error).toHaveBeenCalledWith("Failed to remove member", {
        id: 1,
      });
    });
  });
});
