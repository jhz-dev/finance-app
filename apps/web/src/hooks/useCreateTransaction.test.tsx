import { renderHook, waitFor } from '@testing-library/react';
import { useCreateTransaction } from './useCreateTransaction';
import { transactionRepository } from '@/infrastructure/ApiTransactionRepository';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/infrastructure/ApiTransactionRepository');
vi.mock('sonner');

const mockedTransactionRepository = vi.mocked(transactionRepository);
const mockedToast = vi.mocked(toast);

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCreateTransaction', () => {
  const budgetId = 'budget-1';

  it('should call the api with the correct data and handle success', async () => {
    const invalidateQueries = vi.fn();
    vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(invalidateQueries);

    mockedTransactionRepository.create.mockResolvedValue({
      id: '1',
      description: 'New Transaction',
      amount: 100,
      type: 'EXPENSE',
      date: new Date().toISOString(),
      budgetId: budgetId,
    });

    const { result } = renderHook(() => useCreateTransaction(budgetId), { wrapper });

    const newTransaction = {
      description: 'New Transaction',
      amount: 100,
      type: 'EXPENSE' as const,
      date: new Date().toISOString(),
    };

    await result.current.mutateAsync(newTransaction);

    expect(mockedTransactionRepository.create).toHaveBeenCalledWith(budgetId, newTransaction);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['budgets', budgetId] });
    expect(mockedToast.loading).toHaveBeenCalledWith('Creating transaction...');
    await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
            'Transaction created successfully',
            {
                id: undefined,
            }
        );
    });
  });

  it('should handle error', async () => {
    const error = new Error('Failed to create transaction');
    mockedTransactionRepository.create.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateTransaction(budgetId), { wrapper });

    const newTransaction = {
        description: 'New Transaction',
        amount: 100,
        type: 'EXPENSE' as const,
        date: new Date().toISOString(),
      };

    try {
      await result.current.mutateAsync(newTransaction);
    } catch (e) {
      // ignore
    }

    expect(mockedToast.error).toHaveBeenCalledWith('Failed to create transaction', {
      id: undefined,
    });
  });
});
