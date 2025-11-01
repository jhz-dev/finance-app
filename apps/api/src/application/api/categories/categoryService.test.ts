import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import {
	createCategory,
	getCategories,
	updateCategory,
	deleteCategory,
} from "./categoryService";
import prisma from "../../../infrastructure/database/prisma";

jest.mock("../../../infrastructure/database/prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
	mockReset(prismaMock);
});

describe("createCategory", () => {
	it("should create a category", async () => {
		const category = {
			id: "1",
			name: "Test Category",
			createdAt: new Date(),
			updatedAt: new Date(),
			transactions: [],
			recurringTransactions: [],
		};
		prismaMock.category.create.mockResolvedValue(category);

		const result = await createCategory("Test Category");

		expect(result).toEqual(category);
	});
});

describe("getCategories", () => {
	it("should return categories", async () => {
		const categories = [
			{
				id: "1",
				name: "Test Category",
				createdAt: new Date(),
				updatedAt: new Date(),
				transactions: [],
				recurringTransactions: [],
			},
		];
		// @ts-expect-error: This is a mock
		prismaMock.category.findMany.mockResolvedValue(categories);

		const result = await getCategories();

		expect(result).toEqual(categories);
	});
});

describe("updateCategory", () => {
	it("should update a category", async () => {
		const category = {
			id: "1",
			name: "Updated Category",
			createdAt: new Date(),
			updatedAt: new Date(),
			transactions: [],
			recurringTransactions: [],
		};
		prismaMock.category.update.mockResolvedValue(category);

		const result = await updateCategory("1", "Updated Category");

		expect(result).toEqual(category);
	});
});

describe("deleteCategory", () => {
	it("should delete a category", async () => {
		const category = {
			id: "1",
			name: "Test Category",
			createdAt: new Date(),
			updatedAt: new Date(),
			transactions: [],
			recurringTransactions: [],
		};
		prismaMock.category.delete.mockResolvedValue(category);

		const result = await deleteCategory("1");

		expect(result).toEqual(category);
	});
});
