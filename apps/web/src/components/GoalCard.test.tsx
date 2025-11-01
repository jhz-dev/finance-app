import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { GoalCard } from "@/components/GoalCard";

const goal = {
  id: "1",
  name: "Test Goal",
  currentAmount: 50,
  targetAmount: 100,
  userId: "1",
};

describe("GoalCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render the goal name", () => {
    render(<GoalCard goal={goal} />);
    expect(screen.getByText("Test Goal")).toBeInTheDocument();
  });

  it("should render the formatted current and target amounts", () => {
    render(<GoalCard goal={goal} />);
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("Target: $100.00")).toBeInTheDocument();
  });

  it("should render the progress bar with the correct value", () => {
    render(<GoalCard goal={goal} />);
    const progressIndicator = screen.getByRole("progressbar");
    expect(progressIndicator).toBeInTheDocument();
    expect(progressIndicator).toHaveAttribute("aria-valuenow", "50");
  });
});
