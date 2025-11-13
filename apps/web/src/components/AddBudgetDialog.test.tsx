import { render, screen, fireEvent } from '@/test-utils';
import { vi, describe, it, expect } from 'vitest';
import { AddBudgetDialog } from './AddBudgetDialog';
import { useCreateBudget } from '@/hooks/useCreateBudget';

vi.mock('@/hooks/useCreateBudget');

const mockedUseCreateBudget = vi.mocked(useCreateBudget);

describe('AddBudgetDialog', () => {
  it('should call the create budget mutation with the correct data and close the dialog on success', async () => {
    const mutate = vi.fn((variables, options) => {
      options.onSuccess();
    });
    mockedUseCreateBudget.mockReturnValue({
      mutate,
      isPending: false,
    } as any);

    await render(<AddBudgetDialog />);

    fireEvent.click(screen.getByText('Add New Budget'));
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New Budget' },
    });
    fireEvent.click(screen.getByText('Save budget'));

    expect(mutate).toHaveBeenCalledWith(
      {
        name: 'New Budget',
      },
      {
        onSuccess: expect.any(Function),
      }
    );

    expect(screen.queryByText('Create New Budget')).not.toBeInTheDocument();
  });
});
