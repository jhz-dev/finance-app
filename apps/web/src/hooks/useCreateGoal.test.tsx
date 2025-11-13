import { renderHook, waitFor } from '@testing-library/react';
import { useCreateGoal } from './useCreateGoal';
import { apiGoalRepository } from '@/infrastructure/ApiGoalRepository';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/infrastructure/ApiGoalRepository');
vi.mock('sonner');

const mockedApiGoalRepository = vi.mocked(apiGoalRepository);
const mockedToast = vi.mocked(toast);

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCreateGoal', () => {
  it('should call the api with the correct data and handle success', async () => {
    const invalidateQueries = vi.fn();
    vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(invalidateQueries);

    mockedApiGoalRepository.create.mockResolvedValue({
      id: '1',
      name: 'New Goal',
      targetAmount: 1000,
      targetDate: new Date(),
      currentAmount: 0,
      userId: '1',
    });

    const { result } = renderHook(() => useCreateGoal(), { wrapper });

    await result.current.mutateAsync({
      name: 'New Goal',
      targetAmount: 1000,
      targetDate: new Date(),
    });

    expect(mockedApiGoalRepository.create).toHaveBeenCalledWith({
      name: 'New Goal',
      targetAmount: 1000,
      targetDate: expect.any(Date),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['goals'] });
    expect(mockedToast.loading).toHaveBeenCalledWith('Creating goal...');
    await waitFor(() => {
        expect(mockedToast.success).toHaveBeenCalledWith(
            'Goal created successfully',
            {
                id: undefined,
            }
        );
    });
  });

  it('should handle error', async () => {
    const error = new Error('Failed to create goal');
    mockedApiGoalRepository.create.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateGoal(), { wrapper });

    try {
      await result.current.mutateAsync({
        name: 'New Goal',
        targetAmount: 1000,
        targetDate: new Date(),
      });
    } catch (e) {
      // ignore
    }

    expect(mockedToast.error).toHaveBeenCalledWith('Failed to create goal', {
      id: undefined,
    });
  });
});
