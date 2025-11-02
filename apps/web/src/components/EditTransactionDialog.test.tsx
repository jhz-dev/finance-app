import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, test, vi } from 'vitest';

import { EditTransactionDialog } from './EditTransactionDialog';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/lib/test-utils';
import type { Transaction } from '@/domain/transaction/transaction';

describe('EditTransactionDialog', () => {
  test('renders a form with fields for transaction details and a save button', () => {
    const transaction: Transaction = {
      id: '1',
      description: 'Test Transaction',
      amount: 123.45,
      type: 'EXPENSE',
      date: new Date().toDateString()
    };

    renderWithProviders(
      <EditTransactionDialog
        transaction={transaction}
        budgetId="1"
        open={true}
        onOpenChange={vi.fn()}
      />,
      { authStoreState: { isAuthenticated: true } },
    );
    expect(screen.getByLabelText('Description')).toHaveValue('Test Transaction');
    expect(screen.getByLabelText('Amount')).toHaveValue(123.45);
  });

  test('successfully updates a transaction', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const transaction: Transaction = {
      id: '1',
      description: 'Test Transaction',
      amount: 123.45,
      type: 'EXPENSE',
      date: new Date().toDateString()
    };

    renderWithProviders(
      <EditTransactionDialog
        transaction={transaction}
        budgetId="1"
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    const descriptionInput = screen.getByLabelText('Description');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated Transaction');

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  test('shows an error message if the API call fails', async () => {
    const transaction: Transaction = {
      id: '1',
      description: 'Test Transaction',
      amount: 123.45,
      type: 'EXPENSE',
      date: new Date().toDateString()
    };

    server.use(
      http.put('/api/transactions/1', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const user = userEvent.setup();

    renderWithProviders(
      <EditTransactionDialog
        transaction={transaction}
        budgetId="1"
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update transaction.')).toBeInTheDocument();
    });
  });
});
