import { describe, expect, it, vi } from "vitest";
import { CreateGoalForm } from "@/domain/goal/components/CreateGoalForm";
import { fireEvent, render, screen, waitFor } from "@/test-utils";

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
