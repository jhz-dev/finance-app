import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';

import { AddBudgetDialog } from './AddBudgetDialog';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/lib/test-utils';

describe('AddBudgetDialog', () => {
  test('renders a form with fields for budget details and an add button', async() => {
    const user = userEvent.setup();
    renderWithProviders(<AddBudgetDialog />, { authStoreState: { isAuthenticated: true } });

    const button = await screen.findByRole('button', { name: /Add New Budget/i });
    await user.click(button);

    expect(await screen.findByText('Create New Budget')).toBeInTheDocument();
  });

  test('shows an error message if the name is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddBudgetDialog />);

    const button = await screen.findByRole('button', { name: /Add New Budget/i });
    await user.click(button);

    const saveButton = await screen.findByRole('button', { name: /Save budget/i });
    await user.click(saveButton);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  test('successfully creates a budget', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddBudgetDialog />);

    const button = await screen.findByRole('button', { name: /Add New Budget/i });
    await user.click(button);

    const nameInput = await screen.findByLabelText('Name');
    await user.type(nameInput, 'Test Budget');

    const saveButton = await screen.findByRole('button', { name: /Save budget/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });

  test('shows an error message if the API call fails', async () => {
    server.use(
      http.post('/api/budgets', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<AddBudgetDialog />);

    const button = await screen.findByRole('button', { name: /Add New Budget/i });
    await user.click(button);

    const nameInput = await screen.findByLabelText('Name');
    await user.type(nameInput, 'Test Budget');

    const saveButton = await screen.findByRole('button', { name: /Save budget/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create budget.')).toBeInTheDocument();
    });
  });
});
