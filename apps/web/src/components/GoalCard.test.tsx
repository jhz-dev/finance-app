import { render, screen } from "@/test-utils";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { GoalCard } from "@/components/GoalCard";

const goal = {
  id: "1",
  name: "Test Goal",
  currentAmount: 50,
  targetAmount: 100,
  userId: "1",
};

describe("GoalCard", () => {
  beforeAll(() => {
    vi.spyOn(Intl, "NumberFormat").mockImplementation(function () {
      return {
        format: (value: number) => `$${value}.00`,
      };
    } as any);
  });

  it("should render the goal name", () => {
    render(<GoalCard goal={goal} />);
    expect(screen.getByText("Test Goal")).toBeInTheDocument();
  });

  it("should render the formatted current and target amounts", () => {
    render(<GoalCard goal={goal} />);
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText(/Target:\s*\$100\.00/)).toBeInTheDocument();
  });

  it("should render the progress bar with the correct value", () => {
    render(<GoalCard goal={goal} />);
    const progressIndicator = screen.getByRole("progressbar");
    expect(progressIndicator).toBeInTheDocument();
    expect(progressIndicator).toHaveAttribute("aria-valuenow", "50");
  });
});
