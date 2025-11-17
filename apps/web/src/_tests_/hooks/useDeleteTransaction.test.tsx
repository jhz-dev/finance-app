import { renderHook, waitFor } from '@testing-library/react';
import { useDeleteTransaction } from '../../hooks/useDeleteTransaction';
import { transactionRepository } from '../../infrastructure/ApiTransactionRepository';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../infrastructure/ApiTransactionRepository');

const mockedTransactionRepository = vi.mocked(transactionRepository);

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useDeleteTransaction', () => {
  const budgetId = 'budget-1';
  const transactionId = 'transaction-1';

  it('should call the api with the correct data and handle success', async () => {
    const invalidateQueries = vi.fn();
    vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(invalidateQueries);

    mockedTransactionRepository.delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteTransaction(budgetId), { wrapper });

    await result.current.mutateAsync(transactionId);

    expect(mockedTransactionRepository.delete).toHaveBeenCalledWith(transactionId);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['budgets', budgetId] });
  });

  it('should handle error', async () => {
    const error = new Error('Failed to delete transaction');
    mockedTransactionRepository.delete.mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteTransaction(budgetId), { wrapper });

    try {
      await result.current.mutateAsync(transactionId);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});
