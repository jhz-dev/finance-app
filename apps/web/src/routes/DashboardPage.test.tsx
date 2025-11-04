import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import i18n from "../lib/i18n";
import DashboardPage from "./DashboardPage";

const rootRoute = createRootRoute();
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" });
const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({
	routeTree,
	history: createMemoryHistory(),
});

vi.mock("@/infrastructure/ApiBudgetRepository");
vi.mock("@/components/BudgetCard", () => ({
	BudgetCard: ({ budget }) => (
		<div data-testid="budget-card">{budget.name}</div>
	),
}));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

const renderComponent = () => {
	return render(
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				<RouterProvider router={router}>
					<DashboardPage />
				</RouterProvider>
			</I18nextProvider>
		</QueryClientProvider>,
	);
};

describe.skip("DashboardPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		queryClient.clear();
	});

	afterEach(() => {
		cleanup();
	});

	it("shows a loading message while fetching budgets", () => {
		vi.mocked(budgetRepository.getAll).mockReturnValue(new Promise(() => {})); // Never resolves
		renderComponent();
		expect(screen.getByText("Loading budgets...")).toBeInTheDocument();
	});

	it("shows an error message if fetching budgets fails", async () => {
		vi.mocked(budgetRepository.getAll).mockRejectedValue(
			new Error("Failed to fetch"),
		);
		renderComponent();
		expect(
			await screen.findByText("Error fetching budgets: Failed to fetch"),
		).toBeInTheDocument();
	});

	it(
		"displays budgets and pagination when fetch is successful",
		async () => {
			const mockData = {
				budgets: [
					{ id: "1", name: "Vacation Fund", balance: 500, ownerId: "user1" },
				],
				totalBudgets: 1,
			};
			vi.mocked(budgetRepository.getAll).mockResolvedValue(mockData);
			renderComponent();

			expect(await screen.findByText("Vacation Fund")).toBeInTheDocument();
			expect(screen.getByText("Page 1")).toBeInTheDocument();
		},
	);

	it("displays a message when there are no budgets", async () => {
		const mockData = {
			budgets: [],
			totalBudgets: 0,
		};
		vi.mocked(budgetRepository.getAll).mockResolvedValue(mockData);
		renderComponent();
		expect(await screen.findByText("No Budgets Yet")).toBeInTheDocument();
	});

	it("pagination buttons work correctly", async () => {
		const user = userEvent.setup();
		const mockDataPage1 = {
			budgets: [{ id: "1", name: "Budget 1", balance: 100, ownerId: "user1" }],
			totalBudgets: 10, // More than one page
		};
		const mockDataPage2 = {
			budgets: [{ id: "2", name: "Budget 2", balance: 200, ownerId: "user1" }],
			totalBudgets: 10,
		};

		vi.mocked(budgetRepository.getAll).mockResolvedValue(mockDataPage1);
		renderComponent();

		expect(await screen.findByText("Budget 1")).toBeInTheDocument();

		// Go to next page
		vi.mocked(budgetRepository.getAll).mockResolvedValue(mockDataPage2);
		await user.click(screen.getByRole("button", { name: "Next" }));

		expect(await screen.findByText("Budget 2")).toBeInTheDocument();
		expect(screen.getByText("Page 2")).toBeInTheDocument();
	});
});
