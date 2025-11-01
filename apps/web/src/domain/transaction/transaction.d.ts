import { Transaction as PrismaTransaction, Category } from "@prisma/client";

export type Transaction = PrismaTransaction & {
	category?: Category | null;
};
