import type { Transaction } from './transaction';

// This is the core data structure for a Budget.
// It lives in the domain because it represents a core business concept.
export interface Budget {
  id: string;
  name: string;
  balance: number;
  transactions: Transaction[];
  // In the future, this might include calculated properties like balance.
}

export interface PaginatedBudgets {
  budgets: Budget[];
  totalBudgets: number;
}

// This is a "Port" in Hexagonal Architecture.
// It defines a contract for data access without specifying the implementation.
// The application core will depend on this interface, not on a concrete implementation.
export interface IBudgetRepository {
  getAll(page: number, limit: number): Promise<PaginatedBudgets>;
  getById(id: string): Promise<Budget | null>;
  // In the future, we would add methods like:
  // create(name: string): Promise<Budget>;
}
