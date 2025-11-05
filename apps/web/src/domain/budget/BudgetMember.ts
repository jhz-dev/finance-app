import { BudgetRole } from "./Budget";

export interface BudgetMember {
  id: string;
  budgetId: string;
  userId: string;
  role: BudgetRole;
  createdAt: string;
  updatedAt: string;
}
