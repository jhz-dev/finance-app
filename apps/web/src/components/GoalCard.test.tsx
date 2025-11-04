import { beforeAll, describe, expect, it, vi } from "vitest";
import { GoalCard } from "@/components/GoalCard";
import { render, screen } from "@/test-utils";

const goal = {
	id: "1",
	name: "Test Goal",
	currentAmount: 50,
	targetAmount: 100,
	userId: "1",
};

describe("GoalCard", () => {
	beforeAll(() => {
		vi.spyOn(Intl, "NumberFormat").mockImplementation((() => ({
			format: (value: number) => `$${value}.00`,
		})) as any);
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
