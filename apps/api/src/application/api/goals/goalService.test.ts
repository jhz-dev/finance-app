import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import {
	createGoal,
	getGoalsForUser,
	updateGoal,
	deleteGoal,
} from "./goalService";
import prisma from "../../../infrastructure/database/prisma";

jest.mock("../../../infrastructure/database/prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
	mockReset(prismaMock);
});

describe("createGoal", () => {
	it("should create a goal", async () => {
		const goal = {
			id: "1",
			name: "Test Goal",
			targetAmount: 1000,
			currentAmount: 0,
			userId: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		prismaMock.financialGoal.create.mockResolvedValue(goal);

		const result = await createGoal(
			{ name: "Test Goal", targetAmount: 1000 },
			"1",
		);

		expect(result).toEqual(goal);
	});
});

describe("getGoalsForUser", () => {
	it("should return goals for a user", async () => {
		const goals = [
			{
				id: "1",
				name: "Test Goal",
				targetAmount: 1000,
				currentAmount: 0,
				userId: "1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		// @ts-expect-error: This is a mock
		prismaMock.financialGoal.findMany.mockResolvedValue(goals);

		const result = await getGoalsForUser("1");

		expect(result).toEqual(goals);
	});
});

describe("updateGoal", () => {
	it("should update a goal", async () => {
		const goal = {
			count: 1,
		};
		// @ts-expect-error: This is a mock
		prismaMock.financialGoal.updateMany.mockResolvedValue(goal);

		const result = await updateGoal("1", { currentAmount: 100 }, "1");

		expect(result).toEqual(goal);
	});
});

describe("deleteGoal", () => {
	it("should delete a goal", async () => {
		const goal = {
			count: 1,
		};
		// @ts-expect-error: This is a mock
		prismaMock.financialGoal.deleteMany.mockResolvedValue(goal);

		const result = await deleteGoal("1", "1");

		expect(result).toEqual(goal);
	});
});
