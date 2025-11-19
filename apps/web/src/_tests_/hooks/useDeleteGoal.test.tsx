import { renderHook, waitFor } from "@testing-library/react";
import { useDeleteGoal } from "@/hooks/useDeleteGoal";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

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

describe("useDeleteGoal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const goalId = "1";

  it("should call the delete mutation and show a success toast", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useDeleteGoal(), { wrapper });
    const mockDelete = vi.spyOn(apiGoalRepository, "delete").mockResolvedValue();

    result.current.mutate(goalId);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(goalId);
      expect(toast.loading).toHaveBeenCalledWith("Deleting goal...");
      expect(toast.success).toHaveBeenCalledWith("Goal deleted successfully", {
        id: 1,
      });
    });
  });

  it("should show an error toast if the delete mutation fails", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useDeleteGoal(), { wrapper });
    const mockDelete = vi
      .spyOn(apiGoalRepository, "delete")
      .mockRejectedValue(new Error("Failed to delete"));

    result.current.mutate(goalId);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(goalId);
      expect(toast.loading).toHaveBeenCalledWith("Deleting goal...");
      expect(toast.error).toHaveBeenCalledWith("Failed to delete", {
        id: 1,
      });
    });
  });
});
