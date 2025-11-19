import { render, screen } from '@tests/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { TransactionsTable } from '../../components/TransactionsTable';
import { useDeleteTransaction } from '../../hooks/useDeleteTransaction';
import type { Transaction } from '../../domain/transaction';

vi.mock('@/hooks/useDeleteTransaction');
vi.mock('../../components/TransactionItem', () => ({
  TransactionItem: ({ transaction }: { transaction: Transaction }) => (
    <div data-testid="transaction-item">{transaction.description}</div>
  ),
  }));

const mockedUseDeleteTransaction = vi.mocked(useDeleteTransaction);

describe('TransactionsTable', () => {
  const budgetId = 'budget-1';
  const transactions: Transaction[] = [
    { id: '1', description: 'Groceries', amount: 100, type: 'EXPENSE', date: '2023-01-01', budgetId: budgetId },
    { id: '2', description: 'Salary', amount: 2000, type: 'INCOME', date: '2023-01-02', budgetId: budgetId },
  ];

  it('should render a list of transactions', async () => {
    mockedUseDeleteTransaction.mockReturnValue({
      isError: false,
      isSuccess: false,
    } as any);

    await render({ component: () => <TransactionsTable transactions={transactions} budgetId={budgetId} /> });

    const transactionItems = screen.getAllByTestId('transaction-item');
    expect(transactionItems).toHaveLength(2);
    expect(transactionItems[0]).toHaveTextContent('Groceries');
    expect(transactionItems[1]).toHaveTextContent('Salary');
  });

  it('should render an empty state message', async () => {
    mockedUseDeleteTransaction.mockReturnValue({
        isError: false,
        isSuccess: false,
      } as any);

    await render({ component: () => <TransactionsTable transactions={[]} budgetId={budgetId} /> });

    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
  });

  it('should display a success message', async () => {
    mockedUseDeleteTransaction.mockReturnValue({
      isError: false,
      isSuccess: true,
    } as any);

    await render({ component: () => <TransactionsTable transactions={[]} budgetId={budgetId} /> });

    expect(screen.getByText('Transaction deleted successfully!')).toBeInTheDocument();
  });

  it('should display an error message', async () => {
    mockedUseDeleteTransaction.mockReturnValue({
      isError: true,
      isSuccess: false,
    } as any);

    await render({ component: () => <TransactionsTable transactions={[]} budgetId={budgetId} /> });

    expect(screen.getByText('Failed to delete transaction.')).toBeInTheDocument();
  });
});
