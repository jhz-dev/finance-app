import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoalItem } from "./GoalItem";
import { FinancialGoal } from "../goal";
import { goalRepository } from "@/infrastructure/ApiGoalRepository";
import { vi, describe, it, expect, afterEach } from "vitest";

vi.mock("@/infrastructure/ApiGoalRepository");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const goal: FinancialGoal = {
  id: "1",
  name: "Goal 1",
  targetAmount: 1000,
  currentAmount: 500,
  userId: "1",
};

describe("GoalItem", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should render the goal", () => {
    render(<GoalItem goal={goal} />, { wrapper });
    expect(screen.getByText("Goal 1")).toBeInTheDocument();
    expect(screen.getByText("500 / 1000")).toBeInTheDocument();
  });

  it("should switch to edit mode when edit button is clicked", () => {
    render(<GoalItem goal={goal} />, { wrapper });
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(screen.getByText("Update Goal")).toBeInTheDocument();
  });

  it("should call the delete mutation when delete button is clicked", async () => {
    (goalRepository.delete as any).mockResolvedValue(undefined);
    render(<GoalItem goal={goal} />, { wrapper });
    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(goalRepository.delete).toHaveBeenCalledWith("1");
    });
  });
});
