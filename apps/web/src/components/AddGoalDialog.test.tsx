import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it, vi } from "vitest";
import i18n from "../lib/i18n";
import { AddGoalDialog } from "./AddGoalDialog";

vi.mock("@/infrastructure/ApiGoalRepository", () => ({
	goalRepository: {
		create: () => Promise.resolve(),
	},
}));

describe.skip("AddGoalDialog", () => {
	it("renders and opens the dialog", async () => {
		const user = userEvent.setup();
		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<I18nextProvider i18n={i18n}>
					<AddGoalDialog
						trigger={<button type="button">Add New Goal</button>}
					/>
				</I18nextProvider>
			</QueryClientProvider>,
		);

		const button = await screen.findByRole("button", { name: /Add New Goal/i });
		await user.click(button);

		expect(await screen.findByText("Add a new goal")).toBeInTheDocument();
	});
});
