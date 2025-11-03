import { AddTransactionToGoalForm } from "@/domain/goal/components/AddTransactionToGoalForm";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import { describe, it, expect, vi } from "vitest";

const mockMutate = vi.fn();

vi.mock("@/hooks/useUpdateGoal", () => ({
	useUpdateGoal: () => ({
		mutate: mockMutate,
	}),
}));

describe("AddTransactionToGoalForm", () => {
	it("should call mutate with the correct data on form submission", async () => {
		const goal = {
			id: "1",
			name: "Test Goal",
			targetAmount: 1000,
			currentAmount: 500,
			userId: "1",
		};
		render(<AddTransactionToGoalForm goal={goal} />);
		const amountInput = screen.getByLabelText("Amount");
		const addButton = screen.getByText("Add Transaction");
		fireEvent.change(amountInput, { target: { value: "100" } });
		fireEvent.click(addButton);
		await waitFor(() =>
			expect(mockMutate).toHaveBeenCalledWith({
				...goal,
				currentAmount: 600,
			}),
		);
	});
});
