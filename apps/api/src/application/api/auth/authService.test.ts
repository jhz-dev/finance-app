import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import { registerUser, loginUser } from "./authService";
import prisma from "../../../infrastructure/database/prisma";

jest.mock("../../../infrastructure/database/prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

jest.mock("bcrypt", () => ({
	hash: () => Promise.resolve("hashed-password"),
	compare: () => Promise.resolve(true),
}));

jest.mock("jsonwebtoken", () => ({
	sign: () => "test-token",
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
	mockReset(prismaMock);
});

describe("registerUser", () => {
	it("should register a new user", async () => {
		const user = {
			id: "1",
			name: "Test User",
			email: "test@example.com",
			password: "hashed-password",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		prismaMock.user.create.mockResolvedValue(user);

		const result = await registerUser({
			name: "Test User",
			email: "test@example.com",
			password: "password",
		});

		expect(result).toEqual(user);
	});
});

describe("loginUser", () => {
	it("should login a user", async () => {
		const user = {
			id: "1",
			name: "Test User",
			email: "test@example.com",
			password: "hashed-password",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		// @ts-expect-error: This is a mock
		prismaMock.user.findUnique.mockResolvedValue(user);

		const result = await loginUser({
			email: "test@example.com",
			password: "password",
		});

		expect(result.user).toEqual(user);
		expect(result.token).toBe("test-token");
	});
});
