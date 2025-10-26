import { useQuery } from '@tanstack/react-query';
import { BudgetCard } from '@/components/BudgetCard';
import { AddBudgetDialog } from '@/components/AddBudgetDialog';
import type { Budget } from '@/domain/budget';
import { budgetRepository } from '@/infrastructure/ApiBudgetRepository';

function DashboardPage() {
  const { isPending, isError, isSuccess, data, error } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: () => budgetRepository.getAll(),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <AddBudgetDialog />
      </div>
      <div className="mt-4">
        {isPending && <p className="text-white/70">Loading budgets...</p>}
        {isError && (
          <p className="text-red-500">Error fetching budgets: {error.message}</p>
        )}
        {isSuccess &&
          (data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          ) : (
            <div className="text-center mt-20">
              <h2 className="text-2xl font-semibold text-white">No Budgets Yet</h2>
              <p className="text-white/70 mt-2">
                Click the "Add New Budget" button to get started.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default DashboardPage;