import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { budgetRepository } from '@/infrastructure/ApiBudgetRepository';
import { TransactionsTable } from '@/components/TransactionsTable';
import { MetricCard } from '@/components/MetricCard';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TransactionChart } from '@/components/TransactionChart';

import { AddTransactionDialog } from '@/components/AddTransactionDialog';

export function BudgetDetailPage() {
  const { budgetId } = useParams({ from: '/budgets/$budgetId' });
  const [timePeriod, setTimePeriod] = React.useState('monthly');

  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['budgets', budgetId],
    queryFn: () => budgetRepository.getById(budgetId),
    enabled: !!budgetId, // Only run the query if budgetId is available
  });

  const filteredTransactions = React.useMemo(() => {
    if (!data?.transactions) return [];
    const now = new Date();
    if (timePeriod === 'yearly') {
      return data.transactions.filter(
        (t) => new Date(t.date).getFullYear() === now.getFullYear()
      );
    }
    // Default to monthly
    return data.transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getFullYear() === now.getFullYear() &&
        transactionDate.getMonth() === now.getMonth()
      );
    });
  }, [data, timePeriod]);

  const balance = React.useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === 'INCOME') {
        return acc + Number(t.amount);
      }
      if (t.type === 'EXPENSE') {
        return acc - Number(t.amount);
      }
      return acc;
    }, 0);
  }, [filteredTransactions]);

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <div>
      {isPending && <h1 className="text-3xl font-bold text-white">Loading...</h1>}
      {isError && (
        <h1 className="text-3xl font-bold text-red-500">
          Error: {error.message}
        </h1>
      )}
      {isSuccess && data && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">{data.name}</h1>
            <AddTransactionDialog budgetId={budgetId} />
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mb-8">
            <MetricCard title="Current Balance" value={formattedBalance} />
            <div className="lg:col-span-2 glass-effect p-4">
              <TransactionChart data={filteredTransactions} />
            </div>
          </div>

          <Tabs value={timePeriod} onValueChange={setTimePeriod}>
            <TabsList className="mb-4 bg-black/20 border-white/20 border">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <TransactionsTable data={filteredTransactions} budgetId={budgetId} />
            </TabsContent>
            <TabsContent value="yearly">
              <TransactionsTable data={filteredTransactions} budgetId={budgetId} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
