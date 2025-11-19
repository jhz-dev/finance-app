import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpdateGoalForm } from "./UpdateGoalForm";
import { useUpdateGoal } from "@/hooks/useUpdateGoal";
import type { FinancialGoal } from "@/domain/goal/goal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

vi.mock("@/hooks/useUpdateGoal");

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockMutate = vi.fn();
(useUpdateGoal as vi.Mock).mockReturnValue({
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

describe("UpdateGoalForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with the initial goal data", () => {
    render(<UpdateGoalForm goal={goal} onDone={() => {}} />, {
      wrapper,
    });
    expect(screen.getByLabelText("Name")).toHaveValue(goal.name);
    expect(screen.getByLabelText("Target Amount")).toHaveValue(
      goal.targetAmount
    );
    expect(screen.getByLabelText("Current Amount")).toHaveValue(
      goal.currentAmount
    );
    expect(
      screen.getByRole("button", { name: "Update Goal" })
    ).toBeInTheDocument();
  });

  it("should call the mutate function with the updated data on valid submission", async () => {
    const onDone = vi.fn();
    mockMutate.mockImplementation((_, { onSuccess }) => onSuccess());
    render(<UpdateGoalForm goal={goal} onDone={onDone} />, {
      wrapper,
    });

    const nameInput = screen.getByLabelText("Name");
    const targetAmountInput = screen.getByLabelText("Target Amount");
    const submitButton = screen.getByRole("button", { name: "Update Goal" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Car");
    await userEvent.clear(targetAmountInput);
    await userEvent.type(targetAmountInput, "25000");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: goal.id,
          name: "Updated Car",
          targetAmount: 25000,
          currentAmount: goal.currentAmount,
          userId: goal.userId,
        },
        { onSuccess: onDone }
      );
      expect(onDone).toHaveBeenCalled();
    });
  });
});
