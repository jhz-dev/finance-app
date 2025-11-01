import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import {
	createBudget,
	getBudgetsForUser,
	getBudgetById,
	updateBudget,
	deleteBudget,
} from "./budgetService";
import prisma from "../../../infrastructure/database/prisma";

jest.mock("../../../infrastructure/database/prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
	mockReset(prismaMock);
});

describe("createBudget", () => {
	it("should create a budget", async () => {
		const budget = {
			id: "1",
			name: "Test Budget",
			ownerId: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		prismaMock.budget.create.mockResolvedValue(budget);

		const result = await createBudget("Test Budget", "1");

		expect(result).toEqual(budget);
		expect(prismaMock.budget.create).toHaveBeenCalledWith({
			data: {
				name: "Test Budget",
				ownerId: "1",
			},
		});
	});
});

describe("getBudgetsForUser", () => {
	it("should return budgets for a user", async () => {
		const budgets = [
			{
				id: "1",
				name: "Test Budget",
				ownerId: "1",
				createdAt: new Date(),
				updatedAt: new Date(),
				transactions: [],
			},
		];
		// @ts-expect-error: This is a mock
		prismaMock.budget.findMany.mockResolvedValue(budgets);
		prismaMock.budget.count.mockResolvedValue(1);

		const result = await getBudgetsForUser("1", 1, 10);

		expect(result.budgets).toHaveLength(1);
		expect(result.totalBudgets).toBe(1);
	});
});

describe("getBudgetById", () => {
	it("should return a budget by id", async () => {
		const budget = {
			id: "1",
			name: "Test Budget",
			ownerId: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
			transactions: [],
			members: [],
		};
		// @ts-expect-error: This is a mock
		prismaMock.budget.findFirst.mockResolvedValue(budget);

		const result = await getBudgetById("1", "1");

		expect(result).toEqual({ ...budget, balance: 0 });
	});

	it("should return null if budget not found", async () => {
		prismaMock.budget.findFirst.mockResolvedValue(null);

		const result = await getBudgetById("1", "1");

		expect(result).toBeNull();
	});
});

describe("updateBudget", () => {
	it("should update a budget", async () => {
		const budget = {
			count: 1,
		};
		// @ts-expect-error: This is a mock
		prismaMock.budget.updateMany.mockResolvedValue(budget);

		const result = await updateBudget("1", "Updated Budget", "1");

		expect(result).toEqual(budget);
	});

	it("should throw an error if user is not a member", async () => {
		prismaMock.budgetMember.findFirst.mockResolvedValue(null);
		prismaMock.budget.findFirst.mockResolvedValue(null);

		await expect(updateBudget("1", "Updated Budget", "1")).rejects.toThrow(
			"You are not a member of this budget",
		);
	});

	it("should throw an error if user does not have permission", async () => {
		const member = {
			id: "1",
			budgetId: "1",
			userId: "1",
			role: "VIEWER",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		// @ts-expect-error: This is a mock
		prismaMock.budgetMember.findFirst.mockResolvedValue(member);

		await expect(updateBudget("1", "Updated Budget", "1")).rejects.toThrow(
			"You do not have permission to update this budget",
		);
	});
});

describe("deleteBudget", () => {
	it("should delete a budget", async () => {
		const budget = {
			count: 1,
		};
		// @ts-expect-error: This is a mock
		prismaMock.budget.deleteMany.mockResolvedValue(budget);

		const result = await deleteBudget("1", "1");

		expect(result).toEqual(budget);
	});
});
