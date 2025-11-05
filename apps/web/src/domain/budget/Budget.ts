import { BudgetMember } from "./BudgetMember";
import { Transaction } from "../transaction/Transaction";

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
