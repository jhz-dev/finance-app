import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import {
	inviteUserToBudget,
	updateMemberRole,
	removeMemberFromBudget,
} from "./sharingService";
import prisma from "../../../infrastructure/database/prisma";

jest.mock("../../../infrastructure/database/prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

jest.mock("nodemailer", () => ({
	createTransport: () => ({
		sendMail: () => Promise.resolve(),
	}),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
	mockReset(prismaMock);
});

describe("inviteUserToBudget", () => {
	it("should invite a user to a budget", async () => {
		const user = {
			id: "1",
			email: "test@example.com",
			name: "Test User",
		};
		const budget = {
			id: "1",
			name: "Test Budget",
		};
		const budgetMember = {
			id: "1",
			budgetId: "1",
			userId: "1",
			role: "ADMIN",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		// @ts-expect-error: This is a mock
		prismaMock.user.findUnique.mockResolvedValue(user);
		// @ts-expect-error: This is a mock
		prismaMock.budget.findUnique.mockResolvedValue(budget);
		// @ts-expect-error: This is a mock
		prismaMock.budgetMember.create.mockResolvedValue(budgetMember);

		const result = await inviteUserToBudget(
			"1",
			"test@example.com",
			"ADMIN",
			"1",
		);

		expect(result).toEqual(budgetMember);
	});
});

describe("updateMemberRole", () => {
	it("should update a member role", async () => {
		const member = {
			count: 1,
		};
		// @ts-expect-error: This is a mock
		prismaMock.budgetMember.updateMany.mockResolvedValue(member);

		const result = await updateMemberRole("1", "1", "EDITOR", "1");

		expect(result).toEqual(member);
	});
});

describe("removeMemberFromBudget", () => {
	it("should remove a member from a budget", async () => {
		const member = {
			count: 1,
		};
		// @ts-expect-error: This is a mock
		prismaMock.budgetMember.deleteMany.mockResolvedValue(member);

		const result = await removeMemberFromBudget("1", "1", "1");

		expect(result).toEqual(member);
	});
});
