
import type { Budget } from "@/domain/budget";
import { BudgetCard } from "./BudgetCard";

type BudgetListProps = {
  budgets: Budget[];
};

export function BudgetList({ budgets }: BudgetListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
}
