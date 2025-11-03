import { BudgetRole } from "./Budget";

export type BudgetMember = {
  id: string;
  budgetId: string;
  userId: string;
  role: BudgetRole;
  createdAt: string;
  updatedAt: string;
};
