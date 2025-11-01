import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { GoalCard } from "@/components/GoalCard";
import { TestWrapper } from "./TestWrapper";

const goal = {
  id: "1",
  name: "Test Goal",
  currentAmount: 50,
  targetAmount: 100,
  userId: "1",
  goalTransactions: [],
};

describe.skip("GoalCard", () => {
  afterEach(() => {
    cleanup();
  });

  const renderComponent = () => {
    render(
      <TestWrapper>
        <GoalCard goal={goal} />
      </TestWrapper>,
    );
  };

  it("should render the goal name", () => {
    renderComponent();
    expect(screen.getByText("Test Goal")).toBeInTheDocument();
  });

  it("should render the formatted current and target amounts", () => {
    renderComponent();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("Target: $100.00")).toBeInTheDocument();
  });

  it("should render the progress bar with the correct value", () => {
    renderComponent();
    const progressIndicator = screen.getByRole("progressbar");
    expect(progressIndicator).toBeInTheDocument();
    expect(progressIndicator).toHaveAttribute("aria-valuenow", "50");
  });
});
