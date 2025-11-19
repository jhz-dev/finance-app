import { render, screen } from '@tests/test-utils';
import { describe, it, expect } from 'vitest';
import { BudgetList } from '../../components/BudgetList';
import type { Budget } from '../../domain/budget/Budget';

const budgets: Budget[] = [
	{
		id: "1",
		name: "Budget 1",
		balance: 1000,
		ownerId: "1",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "2",
		name: "Budget 2",
		balance: 2000,
		ownerId: "1",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

describe("BudgetList", () => {
	it("should render a list of budget cards", async () => {
		await render({ component: () => <BudgetList budgets={budgets} /> });
		expect(screen.getByText("Budget 1")).toBeInTheDocument();
		expect(screen.getByText("Budget 2")).toBeInTheDocument();
		expect(screen.getAllByRole("link").length).toBe(budgets.length);
	});
});
