import { CreateGoalForm } from "@/domain/goal/components/CreateGoalForm";
import { render, screen, fireEvent, waitFor } from "@/test-utils";
import { describe, it, expect, vi } from "vitest";

const mockMutate = vi.fn();

vi.mock("@/hooks/useCreateGoal", () => ({
	useCreateGoal: () => ({
		mutate: mockMutate,
	}),
}));

describe("CreateGoalForm", () => {
	it("should call mutate with the correct data on form submission", async () => {
		render(<CreateGoalForm />);
		const nameInput = screen.getByLabelText("Name");
		const targetAmountInput = screen.getByLabelText("Target Amount");
		const addButton = screen.getByText("Add Goal");
		fireEvent.change(nameInput, { target: { value: "Test Goal" } });
		fireEvent.change(targetAmountInput, { target: { value: "1000" } });
		fireEvent.click(addButton);
		await waitFor(() =>
			expect(mockMutate).toHaveBeenCalledWith({
				name: "Test Goal",
				targetAmount: 1000,
			}),
		);
	});
});
