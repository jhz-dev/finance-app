import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTransactionToGoalForm } from "./AddTransactionToGoalForm";
import { useAddTransactionToGoal } from "@/hooks/useAddTransactionToGoal";
import type { FinancialGoal } from "@/domain/goal/goal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

vi.mock("@/hooks/useAddTransactionToGoal");

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockMutate = vi.fn();
(useAddTransactionToGoal as vi.Mock).mockReturnValue({
  mutate: mockMutate,
});

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const goal: FinancialGoal = {
  id: "1",
  name: "New Car",
  targetAmount: 20000,
  currentAmount: 15000,
  userId: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("AddTransactionToGoalForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with an amount input and a submit button", () => {
    render(<AddTransactionToGoalForm goal={goal} onDone={() => {}} />, {
      wrapper,
    });
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Transaction" })
    ).toBeInTheDocument();
  });

  it("should call the mutate function with the correct data on valid submission", async () => {
    const onDone = vi.fn();
    mockMutate.mockImplementation((_, { onSuccess }) => onSuccess());
    render(<AddTransactionToGoalForm goal={goal} onDone={onDone} />, {
      wrapper,
    });

    const amountInput = screen.getByLabelText("Amount");
    const submitButton = screen.getByRole("button", { name: "Add Transaction" });

    await userEvent.type(amountInput, "1000");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { id: goal.id, amount: 1000 },
        { onSuccess: onDone }
      );
      expect(onDone).toHaveBeenCalled();
    });
  });
});
