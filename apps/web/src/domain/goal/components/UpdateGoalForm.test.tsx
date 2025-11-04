import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { apiGoalRepository } from "@/infrastructure/ApiGoalRepository";
import type { FinancialGoal } from "../goal";
import { UpdateGoalForm } from "./UpdateGoalForm";

vi.mock("@/infrastructure/ApiGoalRepository");

const queryClient = new QueryClient();

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

describe("UpdateGoalForm", () => {
	it("should call the update mutation on form submit", async () => {
		(apiGoalRepository.update as any).mockResolvedValue(undefined);
		const onDone = vi.fn();
		render(<UpdateGoalForm goal={goal} onDone={onDone} />, { wrapper });

		fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
			target: { value: "Updated Goal" },
		});
		fireEvent.click(screen.getByText("Update Goal"));

		await screen.findByText("Update Goal");

		expect(apiGoalRepository.update).toHaveBeenCalledWith("1", {
			name: "Updated Goal",
			targetAmount: 1000,
			currentAmount: 500,
		});
	});
});
