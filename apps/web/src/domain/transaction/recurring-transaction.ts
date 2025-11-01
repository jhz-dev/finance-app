export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  frequency: RecurringFrequency;
  startDate: string;
  endDate: string | null;
  budgetId: string;
  userId: string;
}
