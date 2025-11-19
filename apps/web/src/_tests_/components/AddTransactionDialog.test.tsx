import { render, screen, fireEvent, waitFor } from '@tests/test-utils';
import { vi, describe, it, expect } from 'vitest';
import { AddTransactionDialog } from '../../components/AddTransactionDialog';
import { useCreateTransaction } from '../../hooks/useCreateTransaction';

vi.mock('@/hooks/useCreateTransaction');

const mockedUseCreateTransaction = vi.mocked(useCreateTransaction);

describe('AddTransactionDialog', () => {
  const budgetId = 'budget-1';

  it('should call the create transaction mutation with the correct data and close the dialog on success', async () => {
    const mutate = vi.fn((_variables, options) => {
      options.onSuccess();
    });
    mockedUseCreateTransaction.mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useCreateTransaction>);

    await render({ component: () => <AddTransactionDialog budgetId={budgetId} /> });

    fireEvent.click(screen.getByText('Add Transaction'));

    await waitFor(() => {
        expect(screen.getByText('Save Transaction')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Groceries' },
    });
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '150' },
    });
    
    // The select is not a native select, so we need to click the trigger and then the option.
    // However, for this test, we can assume the default is 'EXPENSE' and not change it.
    // A more robust test could handle the Radix select.

    fireEvent.click(screen.getByText('Save Transaction'));

    await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith(
            {
                description: 'Groceries',
                amount: 150,
                type: 'EXPENSE',
                date: expect.any(String),
            },
            {
                onSuccess: expect.any(Function),
            }
        );
    });

    await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Add Transaction' })).not.toBeInTheDocument();
    });
  });
});
