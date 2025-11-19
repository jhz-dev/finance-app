import { renderHook, waitFor } from "@testing-library/react";
import { useAddTransactionToGoal } from "@/hooks/useAddTransactionToGoal";
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

describe("useAddTransactionToGoal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const transactionData = { id: "1", amount: 100 };

  it("should call the addTransaction mutation and show a success toast", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useAddTransactionToGoal(), { wrapper });
    const mockAddTransaction = vi
      .spyOn(apiGoalRepository, "addTransaction")
      .mockResolvedValue();

    result.current.mutate(transactionData);

    await waitFor(() => {
      expect(mockAddTransaction).toHaveBeenCalledWith(
        transactionData.id,
        transactionData.amount
      );
      expect(toast.loading).toHaveBeenCalledWith("Adding transaction...");
      expect(toast.success).toHaveBeenCalledWith(
        "Transaction added successfully",
        {
          id: 1,
        }
      );
    });
  });

  it("should show an error toast if the addTransaction mutation fails", async () => {
    (toast.loading as vi.Mock).mockReturnValue(1);
    const { result } = renderHook(() => useAddTransactionToGoal(), { wrapper });
    const mockAddTransaction = vi
      .spyOn(apiGoalRepository, "addTransaction")
      .mockRejectedValue(new Error("Failed to add transaction"));

    result.current.mutate(transactionData);

    await waitFor(() => {
      expect(mockAddTransaction).toHaveBeenCalledWith(
        transactionData.id,
        transactionData.amount
      );
      expect(toast.loading).toHaveBeenCalledWith("Adding transaction...");
      expect(toast.error).toHaveBeenCalledWith("Failed to add transaction", {
        id: 1,
      });
    });
  });
});
