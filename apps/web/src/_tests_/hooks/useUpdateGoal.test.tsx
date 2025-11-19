import { renderHook, waitFor } from "@testing-library/react";
import { useUpdateGoal } from "@/hooks/useUpdateGoal";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import type { FinancialGoal } from "@/domain/goal/goal";

vi.mock("@/infrastructure/ApiGoalRepository");
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

describe("useUpdateGoal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const goal: FinancialGoal = {
    id: "1",
    name: "New Car",
    targetAmount: 20000,
    currentAmount: 10000,
    userId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should call the update mutation with the correct data and show a success toast", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useUpdateGoal(), { wrapper });
    const mockUpdate = vi
      .spyOn(apiGoalRepository, "update")
      .mockResolvedValue(goal);

    result.current.mutate(goal);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(goal.id, goal);
      expect(toast.loading).toHaveBeenCalledWith("Updating goal...");
      expect(toast.success).toHaveBeenCalledWith("Goal updated successfully", {
        id: 1,
      });
    });
  });

  it("should show an error toast if the update mutation fails", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useUpdateGoal(), { wrapper });
    const mockUpdate = vi
      .spyOn(apiGoalRepository, "update")
      .mockRejectedValue(new Error("Failed to update"));

    result.current.mutate(goal);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(goal.id, goal);
      expect(toast.loading).toHaveBeenCalledWith("Updating goal...");
      expect(toast.error).toHaveBeenCalledWith("Failed to update", {
        id: 1,
      });
    });
  });
});
