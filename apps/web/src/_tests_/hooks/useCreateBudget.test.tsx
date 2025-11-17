import { renderHook } from '@testing-library/react';
import { useCreateBudget } from '../../hooks/useCreateBudget';
import api from '../../lib/api';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../lib/api');
vi.mock('sonner');

const mockedApi = vi.mocked(api);
const mockedToast = vi.mocked(toast);

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCreateBudget', () => {
  it('should call the api with the correct data and handle success', async () => {
    const invalidateQueries = vi.fn();
    vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(invalidateQueries);

    mockedApi.post.mockResolvedValue({
      id: '1',
      name: 'New Budget',
      balance: 0,
    });

    const { result } = renderHook(() => useCreateBudget(), { wrapper });

    await result.current.mutateAsync({
      name: 'New Budget',
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/budgets', {
      name: 'New Budget',
    });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['budgets'] });
    expect(mockedToast.loading).toHaveBeenCalledWith('Creating budget...');
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Budget created successfully',
      {
        id: undefined,
      }
    );
  });

  it('should handle error', async () => {
    const error = new Error('Failed to create budget');
    mockedApi.post.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateBudget(), { wrapper });

    try {
      await result.current.mutateAsync({
        name: 'New Budget',
      });
    } catch (e) {
      // ignore
    }

    expect(mockedToast.error).toHaveBeenCalledWith('Failed to create budget', {
      id: undefined,
    });
  });
});
