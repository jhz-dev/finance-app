import type { Transaction } from "../transaction/Transaction";
import type { BudgetMember } from "./BudgetMember";

export type BudgetRole = "ADMIN" | "EDITOR" | "VIEWER";

export interface Budget {
  id: string;
  name: string;
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  members: BudgetMember[];
  transactions: Transaction[];
}
