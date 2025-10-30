// This is the core data structure for a Transaction.
export interface Transaction {
	id: string;
	description: string;
	amount: number; // Prisma Decimal is serialized as number or string, handle appropriately
	type: "INCOME" | "EXPENSE" | "TAX" | "LOAN";
	date: string; // ISO date string
}
